<template>
  <div class="app">
    <Header></Header>
    <ChatContainer :messages="messages" @send="addMessage"></ChatContainer>
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
import ChatContainer from "@/components/ChatContainer.vue";
import { reactive } from "vue";

const messages = reactive([
  {
    text: "Message",
    id: 1,
  },
  {
    text: "Message",
    id: 2,
  },
  {
    text: "Message",
    id: 2,
  },
  {
    text: "Message",
    id: 3,
  },
  {
    text: "Message",
    id: 4,
  },
  {
    text: "Message",
    id: 5,
  },
  {
    text: "Message",
    id: 6,
  },
  {
    text: "Message",
    id: 7,
  },
  {
    text: "Message",
    id: 8,
  },
  {
    text: "Message",
    id: 9,
  },
]);

const addMessage = (textMessage) => {
  messages.push({
    text: textMessage,
    id: Date.now(),
  });
};
</script>

<style >
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
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