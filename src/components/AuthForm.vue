<template>
  <div class="authWindow">
    <div class="authForm">
      <div class="form-group">
        <label for="login">Login</label>
        <input type="text" id="login" v-model="username" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" />
      </div>
      <div v-if="isReg" class="form-group">
        <label for="repeatPassword">Confirm password</label>
        <input type="password" id="repeatPassword" v-model="repeatPassword" />
      </div>
      <div v-if="error" class="error-message">{{ error }}</div>
      <button @click="handleLoginRegButton" class="loginRegButton">
        {{ textButton }}
      </button>
      <button @click="handleToggleButton" class="toggleButton">
        {{ textToggleButton }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/store/authenticationStore.js";
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const username = ref("");
const password = ref("");
const repeatPassword = ref("");
const error = ref("");
const textButton = ref("Login");
const textToggleButton = ref("Registration");
const isReg = ref(false);

const handleLoginRegButton = async () => {
  error.value = "";
  
  if (isReg.value) {
    // Регистрация
    if (password.value !== repeatPassword.value) {
      error.value = "Пароли не совпадают";
      return;
    }
    if (authStore.users.some(u => u.username === username.value)) {
      error.value = "Пользователь с таким именем уже существует";
      return;
    }
    const newUser = {
      id: Date.now(),
      username: username.value,
      password: password.value
    };
    authStore.users.push(newUser);
    // Сохраняем обновленный список пользователей в localStorage
    localStorage.setItem('users', JSON.stringify(authStore.users));
    // Логиним нового пользователя
    authStore.login(username.value, password.value);
  } else {
    // Вход
    if (!authStore.login(username.value, password.value)) {
      error.value = "Неверное имя пользователя или пароль";
    }
  }
};

const handleToggleButton = () => {
  [textButton.value, textToggleButton.value] = [
    textToggleButton.value,
    textButton.value,
  ];
  isReg.value = !isReg.value;
  error.value = "";
};
</script>

<style scoped>
.authWindow {
  background: #292f3f;
  flex: 1;
}
.authForm {
  display: flex;
  flex-direction: column;
  color: white;
  align-items: center;
  max-width: 300px;
  width: 100%;
  margin: 40px auto;
}

label {
  margin-bottom: 2px;
  font-family: "Roboto", sans-serif;
  font-weight: 300;
  align-self: flex-start;
}

.authForm input {
  border-radius: 7px;
  background: transparent;
  outline: none;
  color: white;
  border: 1px solid #808082;
  padding: 5px 10px;
  width: 100%;
}

.form-group {
  margin-bottom: 12px;
  width: 100%;
}

button {
  border: none;
  cursor: pointer;
  outline: none;
}

.loginRegButton {
  background: #42566c;
  width: 100%;
  border-radius: 10px;
  color: white;
  padding: 7px 0;
  margin-top: 5px;
  font-family: "Roboto", sans-serif;
}

.toggleButton {
  margin-top: 10px;
  background: transparent;
  color: #808082;
}

.error-message {
  color: #ff6b6b;
  margin-bottom: 10px;
  text-align: center;
}

button:active {
  opacity: 0.8;
}
</style>