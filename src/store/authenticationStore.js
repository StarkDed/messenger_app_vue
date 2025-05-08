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
    setUser(user) {
      this.isAuthenticated = true;
      this.currentUser = user;
      // Сохраняем данные текущего пользователя
      localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        username: user.username
      }));
    },
    logout() {
      this.isAuthenticated = false;
      this.currentUser = null;
      // Удаляем только текущего пользователя, но сохраняем историю
      localStorage.removeItem('currentUser');
    }
  }
});
