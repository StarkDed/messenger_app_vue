import { defineStore } from "pinia";

export const useEditMessageStore = defineStore("editMessageStore", {
  state: () => {
    const isEditMessage = false;
    const editedMessage = null;

    return {
      isEditMessage,
      editedMessage,
    };
  },
  actions: {
    cancelEdit() {
      this.isEditMessage = false;
    },
  },
});
