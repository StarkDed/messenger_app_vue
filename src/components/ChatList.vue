<template>
  <div class="chatWindow">
    <Message
      v-for="message in messages"
      :key="message.id"
      :message="message"
      :class="{
        message_mine: message.style === 'mine',
        message_others: message.style === 'others',
      }"
    ></Message>
  </div>
</template>

<script setup>
import Message from "@/components/Message.vue";

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
  display: flex;
  flex-direction: column;
}
.chatWindow h1 {
  font-size: 16px;
}
</style>