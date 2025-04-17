import { defineStore } from "pinia";

export const useAuthStore = defineStore("autherification", {
  state: () => {
    // Проверяем наличие сохраненного пользователя
    const storedUser = localStorage.getItem('currentUser');
    const initialUser = storedUser ? JSON.parse(storedUser) : null;

    return {
      isAuthenticated: !!initialUser,
      currentUser: initialUser
    };
  },
  actions: {
    login(username, password) {
      // Получаем историю пользователей
      const usersHistory = JSON.parse(localStorage.getItem('usersHistory') || '{}');
      let user;
      
      // Проверяем, есть ли пользователь в истории
      if (usersHistory[username]) {
        // Если есть, используем сохраненный ID
        user = {
          id: usersHistory[username],
          username,
          password
        };
      } else {
        // Если нет, создаем новый ID и сохраняем в историю
        const newId = Date.now();
        user = {
          id: newId,
          username,
          password
        };
        usersHistory[username] = newId;
        localStorage.setItem('usersHistory', JSON.stringify(usersHistory));
      }
      
      this.isAuthenticated = true;
      this.currentUser = user;
      // Сохраняем данные текущего пользователя
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    },
    logout() {
      this.isAuthenticated = false;
      this.currentUser = null;
      // Удаляем только текущего пользователя, но сохраняем историю
      localStorage.removeItem('currentUser');
    }
  }
});
