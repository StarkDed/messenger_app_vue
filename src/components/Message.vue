<template>
  <div class="message" @click.right.prevent="openMenuMessage">
    <span v-if="message.style !== 'system'" class="name">{{
      message.name
    }}</span>
    <p class="text">{{ message.text }}</p>
    <time v-if="message.style !== 'system'" class="date">{{
      formattedDate
    }}</time>
    <div class="menuMessage" v-if="isMenuMessageOpen" :style="menuPosition">
      <button @click="editMessage">Изменить</button>
      <button>Удалить</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, defineProps } from "vue";
import { useEditMessageStore } from "@/store/editStore.js";

const editMessageStore = useEditMessageStore();

const props = defineProps({
  message: [Object],
});

// работа с датой

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

// Открытие menuMessage
const isMenuMessageOpen = ref(false);
const menuPosition = ref({ top: "0", left: "0" });

const toggleMenuMessage = (event) => {
  if (props.message.style === "mine") {
    isMenuMessageOpen.value = !isMenuMessageOpen.value;
  }
};

const openMenuMessage = (event) => {
  if (!isMenuMessageOpen.value) {
    const messageElement = event.currentTarget;
    const rect = messageElement.getBoundingClientRect();

    const menuWidth = 100;

    let x = event.clientX - rect.left - menuWidth / 2;
    let y = event.clientY - rect.top;

    if (x < 0) x = 0;

    const maxX = rect.width - menuWidth;
    if (x > maxX) x = maxX;

    menuPosition.value = {
      top: `${y}px`,
      left: `${x}px`,
    };

    isMenuMessageOpen.value = true;
  } else {
    isMenuMessageOpen.value = false;
  }
};

// событие кнопки edit

const editMessage = () => {
  editMessageStore.isEditMessage = true;
  editMessageStore.editedMessage = { ...props.message };
  isMenuMessageOpen.value = false;
};
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
  position: relative;
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

.message_system {
  align-self: center;
  background: rgba(255, 255, 255, 0.1);
  max-width: 80%;
  text-align: center;
}
.menuMessage {
  background: #1f232f;
  width: 100px;
  position: absolute;
  /* top: 100%;
  left: 17%; */
  border-radius: 2px;
  z-index: 800;
}
.menuMessage button {
  color: white;
  width: 100%;
  border: none;
  padding: 10px 5px;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
}
.menuMessage button:hover {
  opacity: 0.5;
}
.menuMessage button:active {
  color: #1f232f;
  background: white;
  opacity: 1;
}
@media (max-width: 768px) {
  .message {
    max-width: 80%;
  }
}
</style>