<template>
  <div class="messageInput">
    <textarea
      ref="textarea"
      placeholder="Message..."
      class="messageTextArea"
      @input="autoResize"
      :value="textInput"
      @keyup.enter="handleEnter"
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
const textarea = ref(null);

const autoResize = (event) => {
  const textarea = event.target;
  textarea.style.height = "auto";
  const maxHeight = 157;

  if (textarea.scrollHeight > maxHeight) {
    textarea.style.overflowY = "auto";
    textarea.style.height = `${maxHeight}px`;
  } else {
    textarea.style.overflowY = "hidden";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  textInput.value = textarea.value;
};

const emit = defineEmits(["send"]);

const sendMessage = () => {
  if (textInput.value.trim()) {
    emit("send", textInput.value);
    textInput.value = "";

    textarea.value.style.height = "auto";
  }
};

const handleEnter = (event) => {
  if (event.shiftKey) {
    return;
  } else {
    sendMessage();
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

@media (max-width: 800px) {
  .messageInput {
    bottom: 0;
    border-radius: 3px;
  }
}
</style>