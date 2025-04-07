<template>
  <div class="message">{{ message.text }}</div>
</template>

<script setup>
defineProps({
  message: [Object],
});
</script>

<style scoped>
.message {
  padding: 8px 13px;
  border-radius: 15px;
  margin-bottom: 10px;
  font-family: "Roboto", sans-serif;
  font-weight: 300;
  max-width: 45%;
  overflow-wrap: break-word;
  white-space: pre-line;
}
.message_mine {
  align-self: flex-end;
  background: #262a35;
}
.message_others {
  align-self: flex-start;
  background: #373e4e;
}

@media (max-width: 768px) {
  .message {
    max-width: 80%;
  }
}
</style>