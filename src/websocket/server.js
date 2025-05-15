import { WebSocketServer } from 'ws';
import { User, Message, syncDatabase } from '../database/index.js';
import bcrypt from 'bcrypt';
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';

dotenv.config();

// Создаем WebSocket сервер
const wss = new WebSocketServer({ port: 8080 });

// Хранилище для всех подключенных клиентов
const clients = new Map();

// Хранилище для сообщений
let messageHistory = [];

syncDatabase();

// Функция для отправки сообщения всем клиентам
const broadcastMessage = (message, sender, isMine = false) => {
    clients.forEach((sessions, username) => {
        sessions.forEach(clientWS => {
            if (clientWS !== sender && clientWS.readyState === WebSocket.OPEN) {
                clientWS.send(JSON.stringify({
                    ...message,
                    isMine: isMine && username === message.username
                }));
            }
        });
    });
};

// Функция для регистрации нового пользователя
const registerUser = async (username, password) => {
    try {
        // Проверяем, существует ли пользователь
        const existingUser = await User.findOne({ where: { username }});
        if (existingUser) {
            return { success: false, message: 'Пользователь с таким именем уже существует'};
        }

        // Хешируем пароль
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Создаем нового пользователя
        const user = await User.create({
            username: username,
            password_hash: passwordHash
        });

        console.log(`Пользователь ${user.username} зарегистрирован`);

        const payload = {
            id: user.id,
            username: user.username
        }
        const token = jwt.sign(payload, process.env.VUE_APP_VERY_SECRET_KEY, { expiresIn: '1h' });
        
        return { success: true, user: { username: user.username }, token: token};
    } catch (error) {
        console.error('Ошибка при регистрации пользователя:', error);
        return { success: false, message: 'Ошибка при регистрации пользователя'};
    }
}

// Функция для авторизации пользователя
const loginUser = async (username, password) => {
    try {
        // Проверяем, существует ли пользователь
        const user = await User.findOne({ where: { username }});
        if (!user) {
            return { success: false, message: 'Пользователь с таким именем не найден' };
        }

        // Проверяем пароль
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return { success: false, message: 'Неверный пароль' };
        }

        console.log(`Пользователь ${user.username} авторизован`);

        const payload = {
            id: user.id,
            username: user.username
        }
        const token = jwt.sign(payload, process.env.VUE_APP_VERY_SECRET_KEY, { expiresIn: '1h' });

        return { success: true, user: { username: user.username }, token: token};
    } catch (error) {
        console.error('Ошибка при авторизации пользователя:', error);
        return { success: false, message: 'Ошибка при авторизации пользователя'};
    }
}

// Функция для загрузки истории сообщений
const loadMessageHistory = async () => {
    try {
        // Загружаем все сообщения из базы данных
        const messages = await Message.findAll({
            include: [{
                model: User,
                attributes: ['username']
            }],
            order: [['date_and_time', 'ASC']]
        });

        // Преобразуем сообщения в формат для отправки клиенту
        return messages.map(msg => ({
            type: 'message',
            content: msg.text,
            timestamp: msg.date_and_time.toISOString(),
            username: msg.User.username
        }));
    } catch (error) {
        console.error('Ошибка при загрузке истории сообщений:', error);
        return [];
    }
}

wss.on('connection', (ws) => {
    // Обработка входящих сообщений
    ws.on('message', async (message) => {
        try {
            let data = JSON.parse(message);

            if (data.type === 'register' || data.type === 'login') {
                const result = data.type === 'register' 
                    ? await registerUser(data.username, data.password)
                    : await loginUser(data.username, data.password);
                if (result.success) {
                    // Очищаем и загружаем историю сообщений из базы данных
                    messageHistory = [];
                    const dbMessageHistory = await loadMessageHistory();
                    messageHistory.push(...dbMessageHistory);

                    // Проверяем, есть ли уже активные сессии для этого пользователя
                    const existingSessions = clients.get(result.user.username) || new Set();

                    // Если это первая сессия пользователя, отправляем системное сообщение
                    if (existingSessions.size === 0) {
                        const systemMessage = {
                            type: 'system',
                            message: `${result.user.username} присоединился к чату`
                        };
                        messageHistory.push(systemMessage);
                        broadcastMessage(systemMessage, ws);
                    }

                    // Добавляем новое соединение к сессиям пользователя
                    existingSessions.add(ws);
                    clients.set(result.user.username, existingSessions);

                    // Отправляем историю сообщений новому клиенту
                    ws.send(JSON.stringify({
                        type: 'history',
                        messages: messageHistory.map(msg => ({
                            ...msg,
                            isMine: msg.username === result.user.username
                        }))
                    }));
                }

                ws.send(JSON.stringify({
                    type: data.type === 'register' ? 'register_response' : 'login_response',
                    success: result.success,
                    token: result.token
                }));
                return;
            } 
            else {
                try {
                    const decodedToken = jwt.verify(data.token, process.env.VUE_APP_VERY_SECRET_KEY) 
                    
                    data = {
                        ...data,
                        ...decodedToken
                    }
                } catch(error) {
                    console.error("Ошибка при декодировании токена:", error)
                    ws.send(JSON.stringify({
                        type: 'jwt_error',
                        message: error
                    }));
                    return;
                }
            }


            if (data.type === 'get_history') {                    
                // Заменяем старое соединение на новое для корректной отправки сообщений всем пользователям
                const userSessions = clients.get(data.username) || new Set();
                userSessions.forEach(clientWS => {
                    if (clientWS.readyState === WebSocket.CLOSED) {
                        userSessions.delete(clientWS);
                    }
                });
                userSessions.add(ws);

                // Отправляем историю сообщений новому клиенту
                const dbMessageHistory = await loadMessageHistory();
                ws.send(JSON.stringify({
                    type: 'history',
                    messages: dbMessageHistory.map(msg => ({
                        ...msg,
                        isMine: msg.username === data.username
                    }))
                }));
            }
            else if (data.type === 'message') {
                const userWS = clients.get(data.username);
                if (userWS) {
                    const timestamp = new Date().toISOString();
                    
                    // Создаем объект сообщения с информацией о пользователе
                    const messageObj = {
                        type: 'message',
                        content: data.content,
                        timestamp: timestamp,
                        username: data.username
                    };
                    
                    // Отправляем сообщение отправителю
                    ws.send(JSON.stringify({
                        ...messageObj,
                        isMine: true
                    }));

                    try {
                        await Message.create({
                            user_id: data.id,
                            text: data.content,
                            date_and_time: timestamp
                        });

                        // Отправляем сообщение всем остальным клиентам
                        broadcastMessage(messageObj, ws, true);
                    } catch (error) {
                        console.error("Не удалось сохранить сообщение в базу данных:", error);
                        ws.send(JSON.stringify({
                            type: 'error',
                            message: 'Сообщение не отправлено'
                        }));
                    }
                }
            }
        } catch (error) {
            console.error('Ошибка:', error);
            ws.send(JSON.stringify({
                type: 'error',
                message: error
            }));
        }
    });

    // Обработка отключения клиента
    ws.on('close', () => {
        const username = Array.from(clients.entries()).find(([_, sessions]) => sessions.has(ws))?.[0];
        
        if (username) {
            console.log(`Пользователь ${username} отключился`);
            
            // Удаляем соединение из активных сессий пользователя
            const userSessions = clients.get(username);

            if (userSessions) {
                userSessions.delete(ws);

                if (userSessions.size === 0) {
                    // Если это была последняя сессия пользователя
                    const systemMessage = {
                        type: 'system',
                        message: `${username} покинул чат`
                    };
                    broadcastMessage(systemMessage, null);
                    clients.delete(username);
                }
            }
        }
    });

    // Обработка ошибок
    ws.on('error', (error) => {
        console.error('WebSocket ошибка:', error);
        const username = Array.from(clients.entries()).find(([_, sessions]) => sessions.has(ws))?.[0];


        if (username) {
            const userSessions = clients.get(username);
            if (userSessions) {
                userSessions.delete(ws);
                if (userSessions.size === 0) {
                    clients.delete(username);
                }
            }
        }
    });
});

console.log('WebSocket сервер запущен на порту 8080'); 