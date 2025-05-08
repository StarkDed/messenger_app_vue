class WebSocketClient {
    constructor() {
        this.ws = null;
        this.messageHandlers = new Set();
        this.connectionHandlers = new Set();
        this.errorHandlers = new Set();
        this.user = null;
    }

    connect(authData) {
        // Подключаемся к серверу по URL
        this.ws = new WebSocket(`ws://${window.location.hostname}:8080`);     

        // Обрабатываем открытие соединения
        this.ws.onopen = () => {
            console.log('Подключено к WebSocket серверу');
            console.log("isRegistration", authData.isRegistration);
            // Отправляем данные аутентификации
            this.ws.send(JSON.stringify({
                type: authData.isRegistration ? 'register' : 'login',
                username: authData.username,
                password: authData.password
            }));

            console.log("data sent");
            // Обрабатываем ответ от сервера
            this.ws.onmessage = (event) => {
                console.log("data received");

                try {
                    const data = JSON.parse(event.data);
                    console.log("data parsed: ", data);
                    if (data.type === 'login_response' || data.type === 'register_response') {
                        if (data.success) {
                            this.user = data.user
                            this.connectionHandlers.forEach(handler => handler(true));
                        }
                        else {
                            this.errorHandlers.forEach(handler => handler(data.message));
                        }
                    }
                    // else if (data.type === 'message') {
                    //     this.messageHandlers.forEach(handler => handler(data));
                    // }
                    // else if (data.type === 'history') {
                    //     this.messageHandlers.forEach(handler => handler(data.messages));
                    // }
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

    // connect(user) {
    //     this.user = user;
    //     // Получаем IP адрес сервера из URL
    //     const serverUrl = `ws://${window.location.hostname}:8080`;
        
    //     this.ws = new WebSocket(serverUrl);

    //     this.ws.onopen = () => {
    //         console.log('Подключено к WebSocket серверу');
    //         // Отправляем данные аутентификации
    //         this.ws.send(JSON.stringify({
    //             type: 'auth',
    //             userId: user.id,
    //             username: user.username
    //         }));
    //         this.connectionHandlers.forEach(handler => handler(true));
    //     };

    //     this.ws.onmessage = (event) => {
    //         try {
    //             const data = JSON.parse(event.data);
    //             this.messageHandlers.forEach(handler => handler(data));
    //         } catch (error) {
    //             console.error('Ошибка обработки сообщения:', error);
    //         }
    //     };

    //     this.ws.onerror = (error) => {
    //         console.error('WebSocket ошибка:', error);
    //         this.errorHandlers.forEach(handler => handler(error));
    //     };

        // this.ws.onclose = () => {
        //     console.log('WebSocket соединение закрыто');
        //     this.connectionHandlers.forEach(handler => handler(false));
        // };
    // }

    sendMessage(content) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ 
                type: 'message',
                content 
            }));
        }
    }

    onMessage(handler) {
        this.messageHandlers.add(handler);
    }

    onConnection(handler) {
        this.connectionHandlers.add(handler);
    }

    onError(handler) {
        this.errorHandlers.add(handler);
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

export default new WebSocketClient(); 