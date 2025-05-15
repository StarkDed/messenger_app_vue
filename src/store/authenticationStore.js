import { defineStore } from "pinia";

export const useAuthStore = defineStore("authentication", {
  state: () => {
    // Проверяем наличие сохраненного пользователя
    const storedUser = localStorage.getItem('username');
    const initialUser = storedUser ? storedUser : null;

    if (initialUser === null) {
      localStorage.removeItem('currentUser');
    }

    return {
      isAuthenticated: !!initialUser,
      currentUser: initialUser
    };
  },
  actions: {
    setUser(user) {
      this.isAuthenticated = true;
      this.currentUser = user;

      localStorage.setItem("username", user);
    },
    logout() {
      this.isAuthenticated = false;
      this.currentUser = null;

      localStorage.removeItem('currentUser');
      localStorage.removeItem('username');
    }
  }
});
