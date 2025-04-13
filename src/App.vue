<template>
  <div class="app">
    <Header></Header>
    <AuthForm v-if="!authStore.isAuthenticated"></AuthForm>
    <ChatContainer v-else></ChatContainer>
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
import ChatContainer from "@/components/ChatContainer.vue";
import AuthForm from "@/components/AuthForm.vue";
import { useAuthStore } from "@/store/authenticationStore.js";

const authStore = useAuthStore();
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
}

.app {
  background-color: #5a688b;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
  background: transparent !important;
}
</style>