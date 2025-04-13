import { WebSocketServer } from 'ws';

// Создаем WebSocket сервер
const wss = new WebSocketServer({ port: 8080 });

// Хранилище для всех подключенных клиентов
const clients = new Map(); // Теперь храним клиентов с их пользователями

// Хранилище для сообщений
const messageHistory = [];

// Функция для отправки сообщения всем клиентам
const broadcastMessage = (message, sender) => {
    clients.forEach((user, client) => {
        if (client !== sender && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                ...message,
                isMine: false
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
                // Аутентификация пользователя
                clients.set(ws, {
                    id: data.userId,
                    username: data.username
                });

                // Отправляем историю сообщений новому клиенту
                ws.send(JSON.stringify({
                    type: 'history',
                    messages: messageHistory.map(msg => ({
                        ...msg,
                        isMine: msg.userId === data.userId
                    }))
                }));

                // Отправляем системное сообщение о входе
                const systemMessage = {
                    type: 'system',
                    message: `${data.username} присоединился к чату`
                };
                messageHistory.push(systemMessage);
                broadcastMessage(systemMessage, ws);
                ws.send(JSON.stringify({
                    ...systemMessage,
                    isMine: true
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

                // Отправляем сообщение всем клиентам
                broadcastMessage(messageObj, ws);
                ws.send(JSON.stringify({
                    ...messageObj,
                    isMine: true
                }));
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
            clients.delete(ws);
            
            // Отправляем системное сообщение об отключении
            const systemMessage = {
                type: 'system',
                message: `${user.username} покинул чат`
            };
            messageHistory.push(systemMessage);
            broadcastMessage(systemMessage, null);
        }
    });

    // Обработка ошибок
    ws.on('error', (error) => {
        console.error('WebSocket ошибка:', error);
        clients.delete(ws);
    });
});

console.log('WebSocket сервер запущен на порту 8080'); 