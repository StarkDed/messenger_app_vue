<template>
  <div class="message">
    <span class="name">{{ message.name }}</span>
    <p class="text">{{ message.text }}</p>
    <time class="date">{{ formattedDate }}</time>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  message: [Object],
});

function formatDate(date) {
  let hours = date.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Преобразование в 12-часовой формат
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Месяцы начинаются с 0
  const year = date.getFullYear();

  return `${hours}:${minutes} ${ampm} ${day}.${month}.${year}`;
}

const formattedDate = computed(() => {
  const date = new Date(props.message.date);
  return formatDate(date);
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.name {
  color: #757575;
}
.text {
  overflow-wrap: break-word;
  white-space: pre-line;
  word-break: break-word;
}
.date {
  color: #757575;
  align-self: flex-end;
  margin-top: 2px;
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