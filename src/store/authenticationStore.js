import { defineStore } from "pinia";

export const useAuthStore = defineStore("autherification", {
  state: () => ({
    isAuthenticated: false,
  }),
});
