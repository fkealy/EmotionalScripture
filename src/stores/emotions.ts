import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Emotion } from '../types/emotions'
import { isEmotion } from '../types/emotions'
import { loadEmotionData } from '../data/emotionLoader'
import { innerEmotions, middleEmotions, outerEmotions } from '../data/wheelStructure'

export const useEmotionStore = defineStore('emotions', () => {
  const emotions = ref<Emotion[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const selectedEmotion = ref<Emotion | null>(null)

  async function loadEmotions() {
    loading.value = true
    error.value = null
    
    try {
      console.log('Loading emotions...')
      const allEmotions = [...innerEmotions, ...middleEmotions, ...outerEmotions]
      console.log('All emotions:', allEmotions)
      
      const emotionDataPromises = allEmotions.map(async (emotion) => {
        try {
          const data = await loadEmotionData(emotion.name)
          console.log(`Loaded data for ${emotion.name}:`, data)
          
          if (!isEmotion(data)) {
            console.error(`Invalid emotion data for ${emotion.name}:`, data)
            throw new Error(`Invalid emotion data for ${emotion.name}`)
          }
          
          return data
        } catch (err) {
          console.error(`Error loading data for emotion ${emotion.name}:`, err)
          // Return basic emotion data without religious content
          const fallbackEmotion = {
            name: emotion.name,
            color: emotion.color,
            text: emotion.text,
            parent: emotion.parent,
            children: emotion.children
          } as Emotion
          
          if (!isEmotion(fallbackEmotion)) {
            console.error(`Invalid fallback emotion for ${emotion.name}:`, fallbackEmotion)
            throw new Error(`Invalid fallback emotion for ${emotion.name}`)
          }
          
          return fallbackEmotion
        }
      })

      const loadedEmotions = await Promise.all(emotionDataPromises)
      console.log('All emotions loaded:', loadedEmotions)
      emotions.value = loadedEmotions
    } catch (err) {
      error.value = err as Error
      console.error('Error loading emotions:', err)
    } finally {
      loading.value = false
    }
  }

  function selectEmotion(emotion: Emotion | null) {
    if (emotion && !isEmotion(emotion)) {
      console.error('Invalid emotion selected:', emotion)
      return
    }
    selectedEmotion.value = emotion
  }

  return {
    emotions,
    loading,
    error,
    selectedEmotion,
    loadEmotions,
    selectEmotion
  }
}) 