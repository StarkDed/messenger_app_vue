import { defineStore } from "pinia";
import { nextTick } from 'vue';
import wsClient from "@/websocket/client";
export const useAuthStore = defineStore("authentication", {
  state: () => {
    // Проверяем наличие сохраненного пользователя
    const storedUser = localStorage.getItem('username');
    const initialUser = storedUser ? storedUser : null;

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
