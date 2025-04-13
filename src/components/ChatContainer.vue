<template>
  <div class="chatContainer">
    <ChatList :messages="messages"></ChatList>
    <MessageInput @send="handleSendMessage"></MessageInput>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import MessageInput from "@/components/MessageInput.vue";
import ChatList from "@/components/ChatList.vue";
import wsClient from '@/websocket/client.js';
import { useAuthStore } from "@/store/authenticationStore.js";

const authStore = useAuthStore();
const messages = ref([]);

const handleSendMessage = (text) => {
  wsClient.sendMessage(text);
};

// Обработчик входящих сообщений
const handleIncomingMessage = (data) => {
  switch (data.type) {
    case 'history':
      // Загружаем историю сообщений
      messages.value = data.messages.map(msg => ({
        text: msg.content || msg.message,
        id: Date.now() + Math.random(),
        style: msg.isMine ? "mine" : (msg.type === 'system' ? "system" : "others"),
        name: msg.username,
        date: msg.timestamp
      }));
      break;
    case 'message':
      messages.value.push({
        text: data.content,
        id: Date.now(),
        style: data.isMine ? "mine" : "others",
        name: data.username,
        date: data.timestamp
      });
      break;
    case 'system':
      messages.value.push({
        text: data.message,
        id: Date.now(),
        style: "system"
      });
      break;
  }
};

onMounted(() => {
  // Подключаемся к WebSocket с данными текущего пользователя
  wsClient.connect(authStore.currentUser);
  wsClient.onMessage(handleIncomingMessage);
});

onUnmounted(() => {
  wsClient.disconnect();
});
</script>

<style scoped>
.chatContainer {
  flex: 1;
  background-color: #292f3f;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 20px;
  position: relative;
}
</style>