<template>
  <div class="app">
    <Header></Header>
    <AuthForm v-if="!authStore.isAuthenticated"></AuthForm>
    <ChatContainer
      v-else
      :messages="messages"
      @send="addMessage"
    ></ChatContainer>
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
import ChatContainer from "@/components/ChatContainer.vue";
import AuthForm from "@/components/AuthForm.vue";
import { useAuthStore } from "@/store/authenticationStore.js";

import { reactive } from "vue";

const authStore = useAuthStore();

const messages = reactive([
  {
    text: "Куда? Куда? Куда?",
    id: 1,
    style: "mine",
    name: "Galo",
    date: Date.now(),
  },
  {
    text: "Зачем",
    id: 234,
    style: "others",
    name: "Galo",
    date: Date.now(),
  },
  {
    text: "Ага",
    id: 2,
    style: "others",
    name: "Galo",
    date: Date.now(),
  },
  {
    text: "Понял вас, выдвигаюсь",
    id: 3,
    style: "others",
    name: "Galo",
    date: Date.now(),
  },
  {
    text: "Ничего не понятно , но очень интересно",
    id: 4,
    style: "mine",
    name: "Galo",
    date: Date.now(),
  },
  {
    text: "СЮДА!!!!!!!!!!!!!!!!!!!!!!",
    id: 5,
    style: "others",
    name: "Galo",
    date: Date.now(),
  },
  {
    text: "Message",
    id: 6,
    style: "mine",
    name: "Galo",
    date: Date.now(),
  },
  {
    text: "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    id: 7,
    style: "others",
    name: "Galo",
    date: Date.now(),
  },
  {
    text: "ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага",
    id: 8,
    style: "mine",
    name: "Galo",
    date: Date.now(),
  },
  {
    text: "Кни́га — один из видов печатной и рукописной ранее продукции: непериодическое издание, состоящее из сброшюрованных или отдельных бумажных листов (страниц) или тетрадей, на которых нанесена типографским или рукописным способом текстовая и графическая (иллюстрации) информация, имеющее, как правило, твёрдый переплёт[1].",
    id: 9,
    style: "mine",
    name: "Galo",
    date: Date.now(),
  },
]);

const addMessage = (textMessage) => {
  messages.push({
    text: textMessage,
    id: Date.now(),
    style: "mine",
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