<script setup lang="ts">
import EmotionWheel from './components/EmotionWheel.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <EmotionWheel />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
