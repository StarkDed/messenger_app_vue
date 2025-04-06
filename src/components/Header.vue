<template>
  <header>
    <h1>We chat lite</h1>
  </header>
</template>

<script setup>
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
  justify-content: center;
  align-items: center;
}
header h1 {
  font-size: 1.6rem;
  font-weight: 600;
}
</style>