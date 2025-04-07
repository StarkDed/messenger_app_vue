<template>
  <div class="messageInput">
    <textarea
      placeholder="Message..."
      class="messageTextArea"
      @input="autoResize"
      :value="textInput"
    ></textarea>
    <img
      src="@/assets/send-image.svg"
      class="sendButton"
      alt="Send"
      @click="sendMessage"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";

const textInput = ref("");

const autoResize = (event) => {
  const textarea = event.target;
  textInput.value = textarea.value;
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
};

const emit = defineEmits(["send"]);

const sendMessage = () => {
  if (textInput.value.trim()) {
    emit("send", textInput.value);
    textInput.value = "";
  }
};
</script>

<style scoped>
.messageInput {
  max-width: 800px;
  width: 100%;
  background: #1f232f;
  margin: 0 auto;
  border-radius: 8px;
  padding: 12px;
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.messageTextArea {
  width: calc(100% - 40px);
  padding-right: 10px;
  border: none;
  background: transparent;
  resize: none;
  outline: none;
  color: white;
  font: inherit;
  font-size: 16px;
}

.sendButton {
  width: 24px;
  height: 24px;
  position: absolute;
  right: 12px;
  bottom: 12px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.sendButton:hover {
  opacity: 0.8;
}
</style>