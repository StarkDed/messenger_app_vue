import { WebSocketServer } from 'ws';
import { User, Message, syncDatabase } from '../database/index.js';
import bcrypt from 'bcrypt';

// Создаем WebSocket сервер
const wss = new WebSocketServer({ port: 8080 });

// Хранилище для всех подключенных клиентов
const clients = new Map(); // Теперь храним клиентов с их пользователями

// Хранилище для активных сессий пользователей
const activeSessions = new Map(); // userId -> Set of WebSocket connections

// Хранилище для сообщений
const messageHistory = [];

syncDatabase();

// Функция для отправки сообщения всем клиентам
const broadcastMessage = (message, sender, isMine = false) => {
    clients.forEach((user, client) => {
        if (client !== sender && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                ...message,
                isMine: isMine && user.id === message.userId
            }));
        }
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

        return { success: true, user: { id: user.id, username: user.username }};
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

        return { success: true, user: { id: user.id, username: user.username}};
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
            content: msg.content,
            timestamp: msg.date_and_time.toISOString(),
            userId: msg.user_id,
            username: msg.User.username
        }));
    } catch (error) {
        console.error('Ошибка при загрузке истории сообщений:', error);
        return [];
    }
}

wss.on('connection', (ws) => {
    console.log('Новое подключение');

    // Обработка входящих сообщений
    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);

            if (data.type === 'register') {
                const result = await registerUser(data.username, data.password);
                ws.send(JSON.stringify({
                    type: 'register_response',
                    ...result
                }));
            }
            else if (data.type === 'login') {
                const result = await loginUser(data.username, data.password);

                if (result.success) {
                    // Проверяем, есть ли уже активные сессии для этого пользователя
                    const existingSessions = activeSessions.get(result.user.id) || new Set();

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
                    activeSessions.set(result.user.id, existingSessions);

                    // Загружаем историю сообщений из базы данных
                    const dbMessageHistory = await loadMessageHistory();
                    messageHistory.push(...dbMessageHistory);

                    // Отправляем историю сообщений новому клиенту
                    ws.send(JSON.stringify({
                        type: 'history',
                        messages: messageHistory.map(msg => ({
                            ...msg,
                            isMine: msg.userId === result.user.id
                        }))
                    }));
                }
                ws.send(JSON.stringify({
                    type: 'login_response',
                    ...result
                }));
            }
            else if (data.type === 'message') {
                const user = clients.get(ws);
                if (!user) return;

                // Создаем объект сообщения с информацией о пользователе
                const messageObj = {
                    type: 'message',
                    content: data.content,
                    timestamp: new Date().toISOString(),
                    userId: user.id,
                    username: user.username
                };

                // Сохраняем сообщение в историю
                messageHistory.push(messageObj);

                // Отправляем сообщение отправителю
                ws.send(JSON.stringify({
                    ...messageObj,
                    isMine: true
                }));

                // Отправляем сообщение всем остальным клиентам
                broadcastMessage(messageObj, ws, true);
            }

        } catch (error) {
            console.error('Ошибка обработки сообщения:', error);
        }
    });

    // Обработка отключения клиента
    ws.on('close', () => {
        const user = clients.get(ws);
        if (user) {
            console.log(`Пользователь ${user.username} отключился`);
            
            // Удаляем соединение из активных сессий пользователя
            const userSessions = activeSessions.get(user.id);
            if (userSessions) {
                userSessions.delete(ws);
                if (userSessions.size === 0) {
                    // Если это была последняя сессия пользователя
                    const systemMessage = {
                        type: 'system',
                        message: `${user.username} покинул чат`
                    };
                    messageHistory.push(systemMessage);
                    broadcastMessage(systemMessage, null);
                    activeSessions.delete(user.id);
                }
            }
            
            clients.delete(ws);
        }
    });

    // Обработка ошибок
    ws.on('error', (error) => {
        console.error('WebSocket ошибка:', error);
        const user = clients.get(ws);
        if (user) {
            const userSessions = activeSessions.get(user.id);
            if (userSessions) {
                userSessions.delete(ws);
                if (userSessions.size === 0) {
                    activeSessions.delete(user.id);
                }
            }
        }
        clients.delete(ws);
    });
});

console.log('WebSocket сервер запущен на порту 8080'); 