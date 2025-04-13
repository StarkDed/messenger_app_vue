import { defineStore } from "pinia";

export const useAuthStore = defineStore("autherification", {
  state: () => {
    // Загружаем пользователей из localStorage при инициализации
    const storedUsers = localStorage.getItem('users');
    const initialUsers = storedUsers ? JSON.parse(storedUsers) : [
      { id: 1, username: "user1", password: "123" },
      { id: 2, username: "user2", password: "123" }
    ];

    return {
      isAuthenticated: false,
      currentUser: null,
      users: initialUsers
    };
  },
  actions: {
    login(username, password) {
      const user = this.users.find(u => u.username === username && u.password === password);
      if (user) {
        this.isAuthenticated = true;
        this.currentUser = user;
        return true;
      }
      return false;
    },
    logout() {
      this.isAuthenticated = false;
      this.currentUser = null;
    },
    checkAuth() {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
        this.isAuthenticated = true;
      }
    }
  }
});
