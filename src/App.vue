<template>
  <div class="app">
    <template v-if="emotionStore.loading">
      <LoadingSpinner message="Loading emotions..." />
    </template>
    <template v-else-if="emotionStore.error">
      <ErrorState 
        :error="emotionStore.error"
        @retry="emotionStore.loadEmotions"
      />
    </template>
    <template v-else>
      <div class="wheel-container">
        <EmotionWheel 
          :emotions="emotionStore.emotions" 
          @select-emotion="handleEmotionSelect"
          @close="handleClose"
        />
      </div>
      <EmotionDetails 
        v-if="emotionStore.selectedEmotion" 
        :emotion="emotionStore.selectedEmotion"
        @close="handleClose"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import EmotionWheel from './components/EmotionWheel.vue'
import EmotionDetails from './components/EmotionDetails.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import ErrorState from './components/ErrorState.vue'
import { useEmotionStore } from './stores/emotions'
import type { Emotion } from './types/emotions'

const emotionStore = useEmotionStore()

onMounted(async () => {
  await emotionStore.loadEmotions()
})

const handleEmotionSelect = (emotion: Emotion) => {
  emotionStore.selectEmotion(emotion)
}

const handleClose = () => {
  emotionStore.selectEmotion(null)
  
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
  document.body.style.pointerEvents = ''
  document.body.style.touchAction = ''
}

watch(() => emotionStore.selectedEmotion, (newVal, oldVal) => {
  if (oldVal && !newVal) {
    setTimeout(() => {
      if (!emotionStore.selectedEmotion) {
        document.documentElement.style.overflow = ''
        document.body.style.overflow = ''
      }
    }, 500)
  }
})
</script>

<style>
.app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  overscroll-behavior: none;
  background-color: white;
}

.wheel-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  overscroll-behavior: none;
  transition: filter 0.3s ease;
}

/* Ensure proper stacking context */
:root {
  --z-index-base: 1;
  --z-index-overlay: 1000;
}
</style>
