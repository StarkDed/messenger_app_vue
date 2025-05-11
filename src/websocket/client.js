class WebSocketClient {
    constructor() {
        this.ws = null;
        this.messageHandlers = new Set();
        this.connectionHandlers = new Set();
        this.errorHandlers = new Set();
        const storedUser = localStorage.getItem('currentUser');
        this.user = storedUser ? JSON.parse(storedUser) : null;
        this.messageBuffer = [];
        
        // Автоматически подключаемся, если есть сохраненный пользователь
        if (this.user) {
            this.connect({ username: this.user.username, password: '', isRegistration: false });
        }
    }

    connect(authData) {
        // Подключаемся к серверу по URL
        this.ws = new WebSocket(`ws://${window.location.hostname}:8080`);     

        // Обрабатываем открытие соединения
        this.ws.onopen = () => {
            console.log('Подключено к WebSocket серверу');
            
            if (this.user) {
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
                            this.user = data.user
                            this.connectionHandlers.forEach(handler => handler(this.user));
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
                        this.messageBuffer.push(data);
                        this.messageHandlers.forEach(handler => handler(data));
                    }
                    else if (data.type === 'history') {
                        this.messageBuffer.push(data);
                        this.messageHandlers.forEach(handler => handler(data));
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
                this.connectionHandlers.forEach(handler => handler(null));
            };
        }
    }

    getMessageHistory() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: 'get_history',
                userId: this.user.id,
                username: this.user.username
            }));
        }
    }

    logout() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: 'logout',
                username: this.user.username
            }));
        }

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'logout_response') {
                if (data.success) {
                    this.connectionHandlers.forEach(handler => handler(null));
                    this.disconnect();
                }
                else {
                    this.errorHandlers.forEach(handler => handler(data.message));
                }
            }
        }   
    }

    sendMessage(content) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            try {
                this.ws.send(JSON.stringify({ 
                    type: 'message',
                    content: content,
                    userId: this.user.id,
                    username: this.user.username
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
        // Если пользователь уже установлен, сразу вызываем обработчик
        if (this.user) {
            handler(this.user);
        }
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
            this.user = null;
            this.messageBuffer = [];
        }
    }
}

export default new WebSocketClient(); 