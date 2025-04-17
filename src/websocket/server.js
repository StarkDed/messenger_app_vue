import { WebSocketServer } from 'ws';

// Создаем WebSocket сервер
const wss = new WebSocketServer({ port: 8080 });

// Хранилище для всех подключенных клиентов
const clients = new Map(); // Теперь храним клиентов с их пользователями

// Хранилище для активных сессий пользователей
const activeSessions = new Map(); // userId -> Set of WebSocket connections

// Хранилище для логинов и их ID
const userLogins = new Map(); // username -> userId

// Хранилище для сообщений
const messageHistory = [];

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

wss.on('connection', (ws) => {
    console.log('Новое подключение');

    // Обработка входящих сообщений
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            if (data.type === 'auth') {
                const username = data.username;
                const userId = data.userId; // Используем ID с клиента

                // Сохраняем связь логина и ID
                userLogins.set(username, userId);

                // Проверяем, есть ли уже активные сессии для этого пользователя
                const existingSessions = activeSessions.get(userId) || new Set();
                
                // Если это первая сессия пользователя, отправляем системное сообщение
                if (existingSessions.size === 0) {
                    const systemMessage = {
                        type: 'system',
                        message: `${username} присоединился к чату`
                    };
                    messageHistory.push(systemMessage);
                    broadcastMessage(systemMessage, ws);
                }

                // Добавляем новое соединение к сессиям пользователя
                existingSessions.add(ws);
                activeSessions.set(userId, existingSessions);

                // Сохраняем информацию о пользователе
                clients.set(ws, {
                    id: userId,
                    username: username
                });

                // Отправляем историю сообщений новому клиенту
                ws.send(JSON.stringify({
                    type: 'history',
                    messages: messageHistory.map(msg => ({
                        ...msg,
                        isMine: msg.userId === userId
                    }))
                }));

            } else if (data.type === 'message') {
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