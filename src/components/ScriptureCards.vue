<template>
  <div class="scripture-cards">
    <div v-for="scripture in filteredScriptures" 
         :key="scripture.religion"
         class="scripture-card"
         @click="selectScripture(scripture)">
      <div class="scripture-header">
        <h3>{{ scripture.religion }}</h3>
      </div>
      <div class="scripture-content">
        <p>{{ scripture.preview }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsStore } from '../stores/settings'
import { EmotionData } from '../data/emotionLoader'

interface ScriptureCard {
  religion: string
  preview: string
  data: any
}

const props = defineProps<{
  emotion: EmotionData | null
}>()

const emit = defineEmits<{
  (e: 'select', scripture: ScriptureCard): void
}>()

const { selectedReligions } = useSettingsStore()

const filteredScriptures = computed<ScriptureCard[]>(() => {
  if (!props.emotion) {
    console.warn('No emotion data provided to ScriptureCards')
    return []
  }
  
  const scriptures: ScriptureCard[] = []
  
  if (selectedReligions.value.includes('christianity') && props.emotion.christianity) {
    scriptures.push({
      religion: 'Christianity',
      preview: props.emotion.christianity.summary,
      data: props.emotion.christianity
    })
  }
  
  if (selectedReligions.value.includes('buddhism') && props.emotion.buddhism) {
    scriptures.push({
      religion: 'Buddhism',
      preview: props.emotion.buddhism.summary,
      data: props.emotion.buddhism
    })
  }
  
  if (selectedReligions.value.includes('hinduism') && props.emotion.hinduism) {
    scriptures.push({
      religion: 'Hinduism',
      preview: props.emotion.hinduism.summary,
      data: props.emotion.hinduism
    })
  }
  
  if (selectedReligions.value.includes('islam') && props.emotion.islam) {
    scriptures.push({
      religion: 'Islam',
      preview: props.emotion.islam.summary,
      data: props.emotion.islam
    })
  }
  
  if (selectedReligions.value.includes('sikhism') && props.emotion.sikhism) {
    scriptures.push({
      religion: 'Sikhism',
      preview: props.emotion.sikhism.summary,
      data: props.emotion.sikhism
    })
  }
  
  return scriptures
})

const selectScripture = (scripture: ScriptureCard) => {
  emit('select', scripture)
}
</script>

<style scoped>
.scripture-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.scripture-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.scripture-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.scripture-header {
  margin-bottom: 0.5rem;
}

.scripture-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.scripture-content p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}
</style> 