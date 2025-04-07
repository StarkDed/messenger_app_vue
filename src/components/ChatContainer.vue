<template>
  <div class="chatContainer">
    <ChatList></ChatList>
    <MessageInput></MessageInput>
  </div>
</template>

<script setup>
import MessageInput from "@/components/MessageInput.vue";
import ChatList from "@/components/ChatList.vue";
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