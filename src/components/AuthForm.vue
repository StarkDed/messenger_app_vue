<template>
  <div class="authWindow">
    <div class="authForm">
      <div class="form-group">
        <label for="login">Login</label>
        <input type="text" id="login" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" />
      </div>
      <div v-if="isReg" class="form-group">
        <label for="repeatPassword">Confirm password</label>
        <input type="password" id="repeatPassword" />
      </div>
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

const textButton = ref("Login");
const textToggleButton = ref("Registration");
const isReg = ref(false);

const handleLoginRegButton = () => {};

const handleToggleButton = () => {
  [textButton.value, textToggleButton.value] = [
    textToggleButton.value,
    textButton.value,
  ];
  isReg.value = !isReg.value;
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

button:active {
  opacity: 0.8;
}
</style>