<script setup lang="ts">
import EmotionWheel from './components/EmotionWheel.vue'
import EmotionDetails from './components/EmotionDetails.vue'
import { innerEmotions, middleEmotions, outerEmotions } from './emotionData';

</script>

<template>
  <div id="app">
    <EmotionWheel :emotions="innerEmotions" @select-emotion="showEmotionDetails" />
    <EmotionDetails v-if="selectedEmotion" :emotion="selectedEmotion" @close="closeEmotionDetails" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EmotionWheel from './components/EmotionWheel.vue';
import EmotionDetails from './components/EmotionDetails.vue';
import { innerEmotions, middleEmotions, outerEmotions } from './emotionData';

export default defineComponent({
  name: 'App',
  components: {
    EmotionWheel,
    EmotionDetails,
  },
  data() {
    return {
      innerEmotions,
      middleEmotions,
      outerEmotions,
      selectedEmotion: null,
    };
  },
  methods: {
    showEmotionDetails(emotion: any) {
      this.selectedEmotion = emotion;
    },
    closeEmotionDetails() {
      this.selectedEmotion = null;
    },
  },
});
</script>

<style>
#app {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

h1 {
  font-size: 2.5rem;
  font-weight: 300;
  letter-spacing: -0.5px;
  margin-bottom: 2rem;
}
</style>
