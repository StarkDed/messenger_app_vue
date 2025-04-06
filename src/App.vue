<template>
  <div class="app">
    <Header></Header>
    <ChatContainer></ChatContainer>
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
import ChatContainer from "@/components/ChatContainer.vue";
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