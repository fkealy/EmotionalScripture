<template>
  <div class="emotion-details">
    <div class="emotion-details-content">
      <h2>{{ emotion.name }}</h2>
      <p class="emotion-text">{{ emotion.text }}</p>
      <div v-if="emotion.scripture" class="scripture-container">
        <div v-for="(scripture, index) in emotion.scripture" :key="index" class="scripture">
          <h3>{{ scripture.scriptureSource }}</h3>
          <p>{{ scripture.summary }}</p>
          <p><strong>Ideas:</strong> {{ scripture.ideas }}</p>
          <div v-for="(quote, qIndex) in scripture.quotes" :key="qIndex" class="quote">
            <blockquote>
              {{ quote.quote }}
            </blockquote>
            <p class="author">- {{ quote.author }}</p>
          </div>
        </div>
      </div>
      <button @click="$emit('close')" class="close-button">Close</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'EmotionDetails',
  props: {
    emotion: {
      type: Object as PropType<any>,
      required: true,
    },
  },
});
</script>

<style scoped>
.emotion-details {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.emotion-details-content {
  background-color: white;
  padding: 2rem;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

h2 {
  font-size: 2rem;
  font-weight: 300;
  margin-bottom: 1rem;
}

.emotion-text {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.scripture-container {
  text-align: left;
}

.scripture {
  margin-bottom: 2rem;
}

h3 {
  font-size: 1.3rem;
  font-weight: 400;
  margin-bottom: 0.5rem;
}

blockquote {
  font-style: italic;
  margin: 1rem 0;
  padding-left: 1rem;
  border-left: 3px solid #2c3e50;
}

.author {
  text-align: right;
  font-weight: 500;
}

.close-button {
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.close-button:hover {
  background-color: #34495e;
}
</style>
