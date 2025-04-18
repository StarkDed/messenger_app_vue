<template>
  <div class="messageInput">
    <textarea
      ref="textarea"
      placeholder="Message..."
      class="messageTextArea"
      @input="autoResize"
      :value="textInput"
      @keydown.enter="handleEnter"
    ></textarea>
    <img
      src="@/assets/send-image.svg"
      class="buttonImage sendButton"
      alt="Send"
      @click="sendMessage"
      v-if="!editMessageStore.isEditMessage"
    />
    <svg v-else class="buttonImage confirmButton" viewBox="0 0 27 27">
      <path
        d="M13.5 0C6.05635 0 0 6.05635 0 13.5C0 20.9443 6.05635 27.0001 13.5 27.0001C20.9443 27.0001 27.0001 20.9443 27.0001 13.5C27 6.05635 20.9443 0 13.5 0ZM12.5461 17.1051L7.8814 12.4402L8.61558 11.7061L12.5461 15.6366L19.6243 8.55849L20.3584 9.29267L12.5461 17.1051Z"
        fill="#758ca3"
      />
    </svg>
    <div class="panelInfo" v-if="editMessageStore.isEditMessage">
      <span class="indicatorOperation">Редактирование</span>
      <svg
        viewBox="0 0 23 23"
        class="buttonImage closeButton"
        @click="cancelEdit"
      >
        <path
          d="M19.6933 3.35536C15.2084 -1.11845 7.84856 -1.11845 3.36367 3.35536C-1.12122 7.82918 -1.12122 15.1708 3.36367 19.6446C7.84856 24.1185 15.0934 24.1185 19.5783 19.6446C24.0632 15.1708 24.1782 7.82918 19.6933 3.35536ZM14.7484 16.318L11.5285 13.106L8.30855 16.318L6.69859 14.712L9.91851 11.5L6.69859 8.28803L8.30855 6.68205L11.5285 9.89401L14.7484 6.68205L16.3584 8.28803L13.1384 11.5L16.3584 14.712L14.7484 16.318Z"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import { useEditMessageStore } from "@/store/editStore.js";

const textInput = ref("");
const textarea = ref(null);

const editMessageStore = useEditMessageStore();

// настройка высоты input
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

// отправка сообщений
const emit = defineEmits(["send"]);

const sendMessage = () => {
  if (textInput.value.trim()) {
    emit("send", textInput.value);
    textInput.value = "";

    textarea.value.style.height = "auto";
  }
};

// настройка кнопки enter
const handleEnter = (event) => {
  if (event.shiftKey) {
    return;
  } else {
    event.preventDefault();
    sendMessage();
  }
};
// хук для изменений сообщений
watch(
  () => editMessageStore.editedMessage,
  (editedMessage) => {
    textInput.value = editedMessage.text;
    // autoResize({ target: textarea.value })
    nextTick(() => autoResize({ target: textarea.value }));
  }
);

const cancelEdit = () => {
  editMessageStore.cancelEdit();
  textInput.value = "";
  nextTick(() => autoResize({ target: textarea.value }));
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
  z-index: 1000;
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
  position: relative;
  z-index: 1000;
}

.buttonImage {
  position: absolute;
  cursor: pointer;
  transition: opacity 0.3s;
}

.buttonImage:hover {
  opacity: 0.8;
}

.buttonImage.sendButton {
  width: 24px;
  height: 24px;
  right: 12px;
  bottom: 12px;
}

.buttonImage.confirmButton {
  width: 27px;
  height: 27px;
  right: 17px;
  bottom: 12px;
}

.panelInfo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  background: #1f232f;
  top: -30px;
  left: 0;
  width: 100%;
  height: 45px;
  border-radius: 8px;
  z-index: 997;
}

.panelInfo .indicatorOperation {
  margin-left: 12px;
  color: #888888;
}

.buttonImage.closeButton {
  position: static;
  width: 23px;
  height: 23px;
  margin-right: 20px;
}

.buttonImage.closeButton path {
  fill: #4d4d4d;
}

.buttonImage.closeButton:hover path {
  fill: #758ca3;
  transition: fill 0.2s;
}

.buttonImage.closeButton:hover {
  opacity: 1;
}

@media (max-width: 800px) {
  .messageInput {
    bottom: 0;
    border-radius: 3px;
  }
}
</style>