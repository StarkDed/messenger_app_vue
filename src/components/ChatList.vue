<template>
  <div class="chatWindow">
    <h1 v-for="message in messages" :key="message.id">{{ message.text }}</h1>
  </div>
</template>

<script setup>
defineProps({
  messages: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
.chatWindow {
  color: white;
  overflow-y: auto;
  /* flex: 1; */
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
  margin-bottom: 80px;
}
.chatWindow h1 {
  font-size: 16px;
}
</style>