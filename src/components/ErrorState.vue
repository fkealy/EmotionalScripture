<template>
  <div class="error-state">
    <div class="error-content">
      <h3>{{ title || 'Something went wrong' }}</h3>
      <p class="error-message">{{ error?.message || 'An unexpected error occurred.' }}</p>
      <button @click="$emit('retry')" class="retry-button">
        Try Again
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error?: Error
  title?: string
}>()

defineEmits<{
  retry: []
}>()
</script>

<style scoped>
.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 200px;
  padding: 2rem;
}

.error-content {
  text-align: center;
  max-width: 400px;
}

h3 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.error-message {
  color: #666;
  margin-bottom: 1.5rem;
}

.retry-button {
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.retry-button:hover {
  background-color: #34495e;
}
</style> 