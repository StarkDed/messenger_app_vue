<template>
  <header>
    <h1>We chat lite</h1>
    <div class="menu-container" v-if="authStore.isAuthenticated">
      <button class="menu-button" @click="toggleMenu">
        <span>&#x2630;</span>
      </button>
      <div class="dropdown-menu" v-if="isMenuOpen">
        <span class="username">{{ authStore.currentUser.username }}</span>
        <button class="button-exit" @click="authStore.logout">Выйти</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/store/authenticationStore.js";

const authStore = useAuthStore();
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

defineOptions({
  name: "Header",
});
</script>

<style scoped>
header {
  height: 7vh;
  /* flex-shrink: 0; */
  background-color: #414b65;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
header h1 {
  font-size: 1.6rem;
  font-weight: 600;
  margin: 0 auto;
  transform: translateX(13%);
}
.menu-container {
  position: relative;
}
.menu-button {
  background: transparent;
  border: none;
  color: white;
  margin-bottom: 2px;
  cursor: pointer;
  outline: none;
  margin-right: 10px;
}

.menu-button:hover {
  opacity: 0.8;
}

.menu-button span {
  font-size: 25px;
}

.dropdown-menu {
  position: absolute;
  right: 25%;
  top: 100%;
  background-color: #1f232f;
  z-index: 1000;
  min-width: 150px;
  border-radius: 10px;
  height: 70px;
  padding: 5px;
  border: 2px solid #3d444d;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.user-info {
  font-weight: 700;
}
.button-exit {
  background-color: #212830;
  color: #fb5f56;
  border: 1px solid #fb5f56;
  padding: 3px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 8px;
  font-weight: 600;
}
.button-exit:hover {
  background-color: #b62324;
  border-color: #bd393a;
  color: white;
}
</style>