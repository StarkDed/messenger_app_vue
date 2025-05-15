class WebSocketClient {
    constructor() {
        this.ws = null;
        this.messageHandlers = new Set();
        this.connectionHandlers = new Set();
        this.errorHandlers = new Set();
        const storedToken = localStorage.getItem('currentUser');
        this.token = storedToken ? storedToken : null;
        this.messageBuffer = [];

        // Автоматически подключаемся, если есть сохраненный пользователь
        if (this.token) {
            this.connect(null);
        }
    }

    connect(authData) {
        // Подключаемся к серверу по URL
        this.ws = new WebSocket(`ws://${window.location.hostname}:8080`);     

        // Обрабатываем открытие соединения
        this.ws.onopen = () => {
            console.log('Подключено к WebSocket серверу');

            if (this.token) {
                this.getMessageHistory();
            }
            else {
                // Отправляем данные аутентификации
                this.ws.send(JSON.stringify({
                    type: authData.isRegistration ? 'register' : 'login',
                    username: authData.username,
                    password: authData.password
                }));
            }

            // Обрабатываем ответ от сервера
            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'login_response' || data.type === 'register_response') {
                        if (data.success) {
                            this.token = data.token;
                            localStorage.setItem('currentUser', data.token);

                            this.connectionHandlers.forEach(handler => handler(true));
                        }
                        else {
                            this.errorHandlers.forEach(handler => handler(data.message));
                        }
                    }
                    else if (data.type === 'system') {
                        this.messageBuffer.push(data);
                        this.messageHandlers.forEach(handler => handler(data));
                    }
                    else if (data.type === 'message') {
                        this.ws.send(JSON.stringify({
                            token: this.token
                        }));

                        this.messageBuffer.push(data);
                        this.messageHandlers.forEach(handler => handler(data));
                    }
                    else if (data.type === 'history') {
                        this.messageBuffer.push(data);
                        this.messageHandlers.forEach(handler => handler(data));
                    }
                    else if (data.type === 'jwt_error') {
                        // выходить из аккаунта
                        this.errorHandlers.forEach(handler => handler(data.message));
                        this.connectionHandlers.forEach(handler => handler(false));
                        this.logout();
                    }
                    else if (data.type === 'error') {
                        this.errorHandlers.forEach(handler => handler(data.message));
                    }
                } catch (error) {
                    this.errorHandlers.forEach(handler => handler(error));
                }
            }

            // Обрабатываем ошибки
            this.ws.onerror = (error) => {
                this.errorHandlers.forEach(handler => handler(error));
            }
            
            this.ws.onclose = () => {
                console.log('WebSocket соединение закрыто');
                this.connectionHandlers.forEach(handler => handler(false));
            };
        }
    }

    getMessageHistory() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: 'get_history',
                token: this.token
            }));
        }
    }

    logout() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.connectionHandlers.forEach(handler => handler(false));
            this.disconnect();
        }
    }

    sendMessage(content) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            try {
                this.ws.send(JSON.stringify({ 
                    type: 'message',
                    content: content,
                    token: this.token
                }));
            } catch (error) {
                console.error('Ошибка при отправке сообщения:', error);
                this.errorHandlers.forEach(handler => handler(error));
            }
        }
    }

    onMessage(handler) {
        this.messageHandlers.add(handler);
        
        // Отправляем все сообщения из буфера
        this.messageBuffer.forEach(data => handler(data));
        // Очищаем буфер
        this.messageBuffer = [];
    }

    onConnection(handler) {
        this.connectionHandlers.add(handler);
    }

    onError(handler) {
        this.errorHandlers.add(handler);
    }

    disconnect() {
        if (this.ws) {
            if (this.ws.readyState === WebSocket.OPEN) {
                this.ws.close();
            }
            this.ws = null;
            
            this.messageHandlers.clear();
            this.connectionHandlers.clear();
            this.errorHandlers.clear();
            this.token = null;
            this.messageBuffer = [];
        }
    }
}

export default new WebSocketClient(); 