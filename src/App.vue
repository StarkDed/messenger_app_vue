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
    text: "Куда? Куда? Куда?",
    id: 1,
    style: "mine",
  },
  {
    text: "Зачем",
    id: 234,
    style: "others",
  },
  {
    text: "Ага",
    id: 2,
    style: "others",
  },
  {
    text: "Понял вас, выдвигаюсь",
    id: 3,
    style: "others",
  },
  {
    text: "Ничего не понятно , но очень интересно",
    id: 4,
    style: "mine",
  },
  {
    text: "СЮДА!!!!!!!!!!!!!!!!!!!!!!",
    id: 5,
    style: "others",
  },
  {
    text: "Message",
    id: 6,
    style: "mine",
  },
  {
    text: "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    id: 7,
    style: "others",
  },
  {
    text: "ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага ага",
    id: 8,
    style: "mine",
  },
  {
    text: "Кни́га — один из видов печатной и рукописной ранее продукции: непериодическое издание, состоящее из сброшюрованных или отдельных бумажных листов (страниц) или тетрадей, на которых нанесена типографским или рукописным способом текстовая и графическая (иллюстрации) информация, имеющее, как правило, твёрдый переплёт[1].",
    id: 9,
    style: "mine",
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