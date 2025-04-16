<template>
  <div class="chatWindow">
    <Message
      v-for="message in messages"
      :key="message.id"
      :message="message"
      :class="{
        message_mine: message.style === 'mine',
        message_others: message.style === 'others',
        message_system: message.style === 'system',
      }"
    ></Message>
    <div class="line" ref="bottom"></div>
  </div>
</template>

<script setup>
import Message from "@/components/Message.vue";
import { ref, onMounted, watch, nextTick } from "vue";

const bottom = ref(null);

const props = defineProps({
  messages: {
    type: Array,
    required: true,
  },
});

const scrollToBottom = async () => {
  await nextTick();
  if (bottom.value) {
    bottom.value.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }
};

watch(
  () => props.messages,
  () => scrollToBottom(),
  { immediate: true }
);

watch(
  () => [...props.messages],
  (newMessages, oldMessages) => {
    const addedMessages = newMessages.slice(oldMessages.length);
    const hasMyMessages = addedMessages.some((msg) => msg.style === "mine");

    if (hasMyMessages) scrollToBottom();
  }
);
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

.line {
  height: 1px;
  width: 100%;
}

.message_system {
  align-self: center;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 5px 10px;
  border-radius: 15px;
  margin: 5px 0;
  font-style: italic;
  color: #888;
}
</style>