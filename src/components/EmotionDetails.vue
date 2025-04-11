<template>
  <Transition name="fade" @after-leave="onTransitionComplete">
    <div 
      v-if="isVisible" 
      class="emotion-details-panel"
      :style="{ borderColor: emotion.color }"
      @wheel.stop
    >
      <div class="header">
        <h2>{{ emotion.name }}</h2>
        <button @click="handleClose" class="close-button">×</button>
      </div>

      <div class="religion-tabs-container">
        <button 
          v-if="showLeftChevron" 
          class="tabs-chevron tabs-chevron-left"
          @click="scrollTabs('left')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        
        <div ref="religionTabsRef" class="religion-tabs" @scroll="checkTabsOverflow">
          <button 
            v-for="religion in availableReligions" 
            :key="religion"
            :class="{ active: selectedReligion === religion }"
            @click="selectedReligion = religion"
          >
            {{ religion }}
          </button>
        </div>
        
        <button 
          v-if="showRightChevron" 
          class="tabs-chevron tabs-chevron-right"
          @click="scrollTabs('right')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <div 
        v-if="religionData" 
        class="scripture-section"
      >
        <div class="scripture-card">
          <!-- Add ideas section -->
          <div v-if="religionData.summary" class="ideas-section">
            <h4>Key Ideas:</h4>
            <p>{{ religionData.summary }}</p>
          </div>
          
          <!-- Add text section if it exists -->
          <div v-if="religionData.text" class="text-section">
            <p>{{ religionData.text }}</p>
          </div>

          <div v-if="religionData.quotes?.length" class="quotes-section">
            <div v-for="(quote, i) in religionData.quotes" :key="i" class="quote">
              <p>"{{ quote.quote }}"</p>
              <p class="reference">- {{ quote.author }}</p>
              <p v-if="quote.scriptureSource" class="scripture-source">{{ quote.scriptureSource }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no-content">
        No content available for {{ selectedReligion }}
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { Religion } from '../types/emotions'
import type { Emotion, ReligionData } from '../types/emotions'
import gsap from 'gsap'
import { useEmotionStore } from '../stores/emotions'

const props = defineProps<{
  emotion: Emotion
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const emotionStore = useEmotionStore()
const isVisible = ref(true)
const selectedReligion = ref<Religion>(Religion.Christianity)
const activeAnimations = ref<gsap.core.Tween[]>([])
const religionTabsRef = ref<HTMLElement | null>(null)
const showLeftChevron = ref(false)
const showRightChevron = ref(false)

const religionData = computed(() => {
  // Wait for the store to finish loading
  if (emotionStore.loading) {
    console.log('Store is still loading...')
    return null
  }

  // Find the emotion in the store to ensure we have the latest data
  const storeEmotion = emotionStore.emotions.find(e => e.name === props.emotion.name)
  if (!storeEmotion) {
    console.log('Emotion not found in store:', props.emotion.name)
    return null
  }

  // Try both cases when accessing religion data
  const data = storeEmotion[selectedReligion.value] || storeEmotion[selectedReligion.value.toLowerCase()]
  
  if (!data || (!data.summary && !data.ideas && !data.quotes?.length)) {
    console.log(`No data found for ${selectedReligion.value} in emotion:`, storeEmotion)
    return null
  }
  
  return data as ReligionData
})

const availableReligions = computed(() => {
  // Wait for the store to finish loading
  if (emotionStore.loading) return []

  // Find the emotion in the store
  const storeEmotion = emotionStore.emotions.find(e => e.name === props.emotion.name)
  if (!storeEmotion) return []

  return Object.values(Religion).filter(religion => {
    const data = storeEmotion[religion] || storeEmotion[religion.toLowerCase()]
    return data && (data.summary || data.ideas || data.quotes?.length > 0)
  })
})

const handleClose = () => {
  isVisible.value = false
  
  // Store animation reference for cleanup
  const animation = gsap.to('.emotion-details-panel', {
    y: 20,
    opacity: 0,
    duration: 0.3,
    ease: 'power2.in'
  })
  
  // Track animation for potential cleanup
  activeAnimations.value.push(animation)
}

const handleWheel = (event: Event) => {
  const wheelEvent = event as WheelEvent;
  wheelEvent.stopPropagation();
  
  // Check if on mobile (can be improved with more reliable detection if needed)
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    // Get the scrollable element
    const scriptureSection = document.querySelector('.scripture-section');
    if (scriptureSection) {
      // Increase sensitivity by multiplying the delta
      scriptureSection.scrollBy({
        top: wheelEvent.deltaY * 2,
        behavior: 'auto'
      });
    }
  }
}

const cleanupComponent = () => {
  // Central cleanup function to ensure all resources are released
  
  // Kill any active GSAP animations
  killActiveAnimations()
  
  // Remove event listeners
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('resize', handleResize)
  
  // Remove wheel event listener
  const panel = document.querySelector('.emotion-details-panel')
  if (panel) {
    panel.removeEventListener('wheel', handleWheel)
  }
  
  // Reset body styles
  resetBodyStyles()
  
  // Restore wheel opacity and scale - find it by class
  const wheelSvg = document.querySelector('.wheel-svg')
  if (wheelSvg) {
    gsap.to(wheelSvg, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    })
  }
}

const onTransitionComplete = () => {
  // Clean up everything when transition is complete
  cleanupComponent()
  
  // Notify parent component
  emit('close')
}

const resetBodyStyles = () => {
  // Reset all potential body styles that might have been modified
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
  document.body.style.pointerEvents = ''
  document.body.style.touchAction = ''
}

const killActiveAnimations = () => {
  // Kill any active GSAP animations to prevent memory leaks
  activeAnimations.value.forEach(animation => {
    if (animation && animation.kill) {
      animation.kill()
    }
  })
  activeAnimations.value = []
  
  // Also ensure any animations targeting our elements are killed
  gsap.killTweensOf('.emotion-details-panel')
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    handleClose()
  }
}

// Add function to check if tabs are overflowing
const checkTabsOverflow = () => {
  if (!religionTabsRef.value) return
  
  const container = religionTabsRef.value
  
  // Show left chevron if scrolled to the right
  showLeftChevron.value = container.scrollLeft > 0
  
  // Show right chevron if there's more content to scroll to
  showRightChevron.value = container.scrollLeft < (container.scrollWidth - container.clientWidth - 5) // 5px tolerance
}

// Function to scroll tabs left or right
const scrollTabs = (direction: 'left' | 'right') => {
  if (!religionTabsRef.value) return
  
  const container = religionTabsRef.value
  const scrollAmount = direction === 'left' ? -150 : 150
  
  container.scrollBy({
    left: scrollAmount,
    behavior: 'smooth'
  })
}

// Watch for changes in available religions to recheck overflow
watch(availableReligions, () => {
  nextTick(() => {
    checkTabsOverflow()
  })
})

// Watch for window resize to update chevron visibility
const handleResize = () => {
  checkTabsOverflow()
}

onMounted(() => {
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'
  
  // Store animation reference for potential cleanup
  const animation = gsap.from('.emotion-details-panel', {
    y: 50,
    opacity: 0,
    duration: 0.5
  })
  
  // Track animation for cleanup
  activeAnimations.value.push(animation)
  
  window.addEventListener('keydown', handleKeyDown)
  
  // Add wheel event listener to the panel
  const panel = document.querySelector('.emotion-details-panel')
  if (panel) {
    panel.addEventListener('wheel', handleWheel)
  }
  
  // Add resize listener
  window.addEventListener('resize', handleResize)
  
  // Initialize the tabs overflow check
  nextTick(() => {
    checkTabsOverflow()
  })
})

// Use onBeforeUnmount to ensure cleanup happens before component is destroyed
onBeforeUnmount(() => {
  // If component is unmounted without transition completing
  // (for example, if parent component is suddenly removed)
  cleanupComponent()
})

// Also use onUnmounted as a final safety measure
onUnmounted(() => {
  cleanupComponent()
})
</script>

<style scoped>
.emotion-details-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  background: white;
  border-radius: 15px;
  padding: 1.75rem 2rem 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25), 0 2px 8px rgba(0, 0, 0, 0.15);
  border: 4px solid;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: var(--z-index-overlay);
  will-change: opacity, transform;
  isolation: isolate;
  transform-style: flat;
  backface-visibility: hidden;
  -webkit-font-smoothing: subpixel-antialiased;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 2;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.header h2 {
  margin: 0;
  color: #2c3e50;
  font-weight: 600;
}

.close-button {
  /* Override any global button styles */
  all: unset;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  cursor: pointer;
  color: #333;
  transition: all 0.2s ease;
  line-height: 0;
  position: relative;
  top: -2px;
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.2);
  color: #000;
}

.religion-tabs-container {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 1.75rem;
}

.religion-tabs {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.75rem 0.75rem 0.75rem;
  flex-shrink: 0;
  position: sticky;
  top: 70px;
  background: white;
  z-index: 2;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  /* Hide scrollbar but maintain functionality */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  flex: 1;
}

.religion-tabs::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.religion-tabs button {
  /* Reset any global button styles */
  all: unset;
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: white;
  color: #555;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  font-size: 0.95rem;
}

.religion-tabs button:hover {
  background: #f8f8f8;
  border-color: #ccc;
  color: #333;
}

.religion-tabs button.active {
  background: #4a6fa5;
  color: white;
  border-color: #4a6fa5;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.tabs-chevron {
  /* Override any global button styles */
  all: unset;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #555;
  transition: all 0.2s ease;
  z-index: 3;
  flex-shrink: 0;
}

.tabs-chevron:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #333;
}

.tabs-chevron-left {
  margin-right: 0.5rem;
}

.tabs-chevron-right {
  margin-left: 0.5rem;
}

.scripture-section {
  flex: 1;
  overflow-y: auto;
  padding-right: 1rem;
  margin-top: 0.75rem;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 1rem;
}

.scripture-card {
  background: #f8f8f8;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.ideas-section,
.quotes-section {
  margin-top: 1.5rem;
}

.quote {
  margin: 1.25rem 0;
  padding-left: 1.25rem;
  border-left: 3px solid #ddd;
  background: white;
  padding: 1.25rem 1.5rem;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.reference {
  font-style: italic;
  color: #666;
  margin-top: 0.5rem;
  font-weight: 500;
}

.scripture-source {
  font-size: 0.9em;
  color: #666;
  margin-top: 0.25rem;
}

.no-content {
  text-align: center;
  padding: 2rem;
  color: #666;
  background: #f8f8f8;
  border-radius: 10px;
  margin: 1rem 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
  will-change: opacity, transform;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, calc(-50% + 30px)) scale(0.95);
}

@media (max-width: 768px) {
  .emotion-details-panel {
    width: 100%;
    max-width: 100%;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
    padding: 0.75rem 1rem;
    border: none;
    top: 0;
    left: 0;
    transform: none;
  }

  .header {
    padding-bottom: 0.25rem;
    margin-bottom: 0.5rem;
  }

  .religion-tabs-container {
    margin-bottom: 0.75rem;
  }

  .religion-tabs {
    padding: 0.25rem 0.5rem;
    margin-bottom: 0.5rem;
    top: 45px;
    gap: 0.5rem;
  }

  .religion-tabs button {
    padding: 0.3rem 0.6rem;
    font-size: 0.85rem;
  }

  .tabs-chevron {
    width: 24px;
    height: 24px;
    margin-right: 0.25rem;
    margin-left: 0.25rem;
  }
  
  .tabs-chevron svg {
    width: 12px;
    height: 12px;
  }

  .scripture-section {
    padding-right: 0.15rem;
    margin-top: 0.25rem;
    padding-bottom: 0.5rem;
  }

  .scripture-card {
    padding: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .quote {
    margin: 0.5rem 0;
    padding: 0.75rem;
    padding-left: 0.75rem;
    border-radius: 4px;
    border-left-width: 2px;
  }

  .reference {
    margin-top: 0.35rem;
  }

  .scripture-source {
    margin-top: 0.15rem;
  }

  /* Add touch-specific improvements */
  .scripture-section {
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
    overscroll-behavior-y: contain;
  }
}
</style>
