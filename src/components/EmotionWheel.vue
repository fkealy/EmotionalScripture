<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { gsap } from 'gsap'
import { innerEmotions, middleEmotions, outerEmotions } from '../data/wheelStructure'
import { loadEmotionData } from '../data/emotionLoader'
import { useSettingsStore } from '../stores/settings'
import type { Emotion, Quote, ReligionData } from '../types/emotions'
import { Religion } from '../types/emotions'

const { selectedReligions } = useSettingsStore()

// Wheel configuration
const WHEEL_CONFIG = {
  innerRadius: 50,
  middleRadius: 100,
  outerRadius: 190,
  maxRadius: 290,
  strokeWidth: 0.5,
  longWordThreshold: 10,
  bubblePadding: 15
} as const

// Animation configuration
type Duration = 0.2 | 0.3 | 0.5 | 0.7 | 1.0 | 1.5 | 2.0 | 2.5

const ANIMATION_CONFIG = {
  rotation: {
    duration: 0.2 as Duration,
    ease: "power1.out"
  },
  expansion: {
    duration: {
      default: 1.5 as Duration,
      uncomfortable: 2.0 as Duration,
      playful: 2.5 as Duration
    },
    ease: "power2.inOut"
  },
  overlay: {
    duration: {
      desktop: 1.0 as Duration,
      mobile: 1.5 as Duration
    },
    ease: "power2.inOut"
  },
  momentum: {
    threshold: 100,
    maxValue: 120,
    baseFactor: 2,
    physics: {
      velocityMultiplier: 12.0,
      maxRotations: 6,
      minDuration: 2.0,
      maxDuration: 8.0,
      phases: {
        initial: {
          portion: 0.3,
          timePortion: 0.15
        },
        middle: {
          portion: 0.4,
          timePortion: 0.35
        },
        final: {
          portion: 0.3,
          timePortion: 0.5
        }
      }
    }
  },
  touch: {
    sensitivity: 1.8,
    velocitySmoothing: 0.6,
    minMovement: 2,
    maxSensitivity: 3.0
  },
  segment: {
    hover: {
      scale: 1.02,
      opacity: 0.8,
      duration: 0.3
    },
    click: {
      bubbleDuration: 0.4,
      bubbleScale: 1.05,
      bubbleEase: "elastic.out(1, 0.3)"
    }
  }
} as const

// Mobile detection
const isMobileDevice = ref(false)

const currentRotation = ref(0)
const isExpanded = ref(false)
const expandedEmotion = ref<Emotion | null>(null)
const selectedScripture = ref<any>(null)

const wheelRef = ref<SVGElement | null>(null)
const outerGroupRef = ref<SVGGElement | null>(null)
const middleGroupRef = ref<SVGGElement | null>(null)
const innerGroupRef = ref<SVGGElement | null>(null)

const touchStartX = ref(0)
const touchStartY = ref(0)
const isTouching = ref(false)
const touchStartTime = ref(0)
const lastTouchMoveTime = ref(0)
const lastTouchMoveAngle = ref(0)
const touchMoved = ref(false)
const tapTimeout = ref<number | null>(null)
const TOUCH_CONFIG = {
  tapThreshold: 10, // pixels
  tapTimeout: 200 // milliseconds
} as const

// Add timeline ref at the top with other refs
const activeSpinTimeline = ref<gsap.core.Timeline | null>(null)

// Add a ref to track momentum timeline
const momentumTimeline = ref<gsap.core.Timeline | null>(null)

const selectedEmotion = ref<Emotion | null>(null)
const isMobile = ref(window.innerWidth < 768)

const props = defineProps<{
  emotions: Emotion[]
}>()

const emit = defineEmits<{
  'select-emotion': [emotion: Emotion]
  'close': []
}>()

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  }
}

function createArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise = false) {
  const start = polarToCartesian(x, y, radius, anticlockwise ? endAngle : startAngle)
  const end = polarToCartesian(x, y, radius, anticlockwise ? startAngle : endAngle)
  const largeArcFlag = Math.abs(endAngle - startAngle) <= 180 ? "0" : "1"
  const sweepFlag = anticlockwise ? "0" : "1"
  
  return [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, sweepFlag, end.x, end.y
  ].join(" ")
}

function createSegmentPath(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, startAngle)
  const end = polarToCartesian(x, y, radius, endAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
  
  return [
    "M", x, y,
    "L", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y,
    "Z"
  ].join(" ")
}

function createBubbledSegmentPath(x: number, y: number, radius: number, startAngle: number, endAngle: number, bubbleAmount: number = 0) {
  const start = polarToCartesian(x, y, radius * (1 + bubbleAmount), startAngle)
  const end = polarToCartesian(x, y, radius * (1 + bubbleAmount), endAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
  
  // Calculate control points for the inner curve (from center)
  const startControl = polarToCartesian(x, y, radius * 0.2, (startAngle + endAngle) / 2)
  
  return [
    "M", x, y,
    "Q", startControl.x, startControl.y, start.x, start.y,
    "A", radius * (1 + bubbleAmount), radius * (1 + bubbleAmount), 0, largeArcFlag, 1, end.x, end.y,
    "Q", startControl.x, startControl.y, x, y,
    "Z"
  ].join(" ")
}

function rotateWheel(angle: number) {
  if (isExpanded.value) return
  
  // Kill any existing spin animation
  if (activeSpinTimeline.value) {
    activeSpinTimeline.value.kill()
    activeSpinTimeline.value = null
  }
  
  // We only need to rotate the main wheel group
  if (!outerGroupRef.value) return
  
  const currentRotation = gsap.getProperty(outerGroupRef.value, "rotation") as number || 0
  const newRotation = currentRotation + angle
  
  // Apply rotation to the main wheel group only and ensure no translation occurs
  gsap.to(outerGroupRef.value, {
    rotation: newRotation,
    duration: 0.2,
    ease: "none",
    transformOrigin: "center center",
    x: 0,
    y: 0,
    overwrite: true
  });
}

const expandSegment = (emotion: Emotion) => {
  selectedEmotion.value = emotion
  emit('select-emotion', emotion)
  
  // Animate the wheel
  if (wheelRef.value) {
    gsap.to(wheelRef.value, {
      opacity: 0.3,
      scale: 0.95,
      duration: 0.3,
      ease: 'power2.out'
    })
  }
}

const collapseSegment = () => {
  if (wheelRef.value) {
    gsap.to(wheelRef.value, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    })
  }
  selectedEmotion.value = null
  emit('close')
}

function createSegments(emotions: any[], innerRadius: number, outerRadius: number, group: SVGGElement) {
  const angleStep = 360 / emotions.length
  const startOffset = -90 // Start at -90 degrees (left side) for Uncomfortable Emotions
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs")
  
  // Create base gradients for inner emotions only
  if (innerRadius === WHEEL_CONFIG.innerRadius) {
    const gradientUncomfortable = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient")
    gradientUncomfortable.setAttribute("id", "gradientUncomfortable")
    gradientUncomfortable.setAttribute("gradientUnits", "userSpaceOnUse")
    gradientUncomfortable.innerHTML = `
      <stop offset="0%" stop-color="#9370DB" />
      <stop offset="100%" stop-color="#6495ED" />
    `
    defs.appendChild(gradientUncomfortable)
    
    const gradientComfortable = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient")
    gradientComfortable.setAttribute("id", "gradientComfortable")
    gradientComfortable.setAttribute("gradientUnits", "userSpaceOnUse")
    gradientComfortable.innerHTML = `
      <stop offset="0%" stop-color="#FFE4B5" />
      <stop offset="100%" stop-color="#FFA07A" />
    `
    defs.appendChild(gradientComfortable)
  }
  
  group.appendChild(defs)
  
  emotions.forEach((emotion, index) => {
    const startAngle = startOffset + (index * angleStep)
    const endAngle = startOffset + ((index + 1) * angleStep)
    
    // Create a segment group to contain both path and text
    const segmentGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
    segmentGroup.setAttribute("class", "segment-group")
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
    const normalPath = createSegmentPath(0, 0, outerRadius, startAngle, endAngle)
    const bubbledPath = createBubbledSegmentPath(0, 0, outerRadius, startAngle, endAngle)
    
    path.setAttribute("d", normalPath)
    path.setAttribute("data-normal-path", normalPath)
    path.setAttribute("data-bubbled-path", bubbledPath)
    
    if (innerRadius === WHEEL_CONFIG.innerRadius) {
      path.setAttribute("fill", `url(#gradient${emotion.name.split('\n')[0]})`)
    } else {
      path.setAttribute("fill", emotion.color)
    }
    
    path.setAttribute("stroke", "white")
    path.setAttribute("stroke-width", WHEEL_CONFIG.strokeWidth.toString())
    path.setAttribute("class", "cursor-pointer segment-path")
    
    // Add hover animation
    path.addEventListener('mouseenter', () => {
      if (!isExpanded.value) {
        gsap.to(path, {
          scale: ANIMATION_CONFIG.segment.hover.scale,
          opacity: ANIMATION_CONFIG.segment.hover.opacity,
          duration: ANIMATION_CONFIG.segment.hover.duration,
          ease: "power2.out",
          transformOrigin: "center center"
        })
      }
    })
    
    path.addEventListener('mouseleave', () => {
      if (!isExpanded.value) {
        gsap.to(path, {
          scale: 1,
          opacity: 1,
          duration: ANIMATION_CONFIG.segment.hover.duration,
          ease: "power2.inOut",
          transformOrigin: "center center"
        })
      }
    })
    
    path.addEventListener('click', (e) => {
      e.stopPropagation()
      if (!isExpanded.value) {
        // Reset any other segments first
        const otherSegments = document.querySelectorAll('.segment-path')
        otherSegments.forEach(segment => {
          if (segment !== path) {
            const normalPath = segment.getAttribute('data-normal-path')
            if (normalPath) {
              gsap.set(segment, {
                d: normalPath,
                scale: 1,
                opacity: 1,
                transformOrigin: "center center"
              })
            }
          }
        })

        // Bubble animation
        const timeline = gsap.timeline({
          onComplete: () => {
            expandSegment(emotion)
          }
        })

        timeline.to(path, {
          d: bubbledPath,
          scale: ANIMATION_CONFIG.segment.click.bubbleScale,
          duration: ANIMATION_CONFIG.segment.click.bubbleDuration,
          ease: ANIMATION_CONFIG.segment.click.bubbleEase,
          transformOrigin: "center center"
        })
      }
    })
    
    segmentGroup.appendChild(path)
    
    // Text sizing logic
    const textRadius = (innerRadius + outerRadius) / 2
    const textAngle = startAngle + (angleStep / 2)
    const textPos = polarToCartesian(0, 0, textRadius, textAngle)
    const textGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
    const isLongWord = emotion.name.length > WHEEL_CONFIG.longWordThreshold
    
    if (innerRadius === WHEEL_CONFIG.innerRadius) {
      // For inner emotions, curved text
      const textPathRadius = (innerRadius + outerRadius) / 2
      const textArcStart = startAngle + 5
      const textArcEnd = endAngle - 5
      const textPathD = createArc(0, 0, textPathRadius, textArcStart, textArcEnd, false)

      const textPath = document.createElementNS("http://www.w3.org/2000/svg", "path")
      textPath.setAttribute("d", textPathD)
      textPath.setAttribute("id", `textPath-${index}-${innerRadius}`)
      textPath.setAttribute("fill", "none")
      segmentGroup.appendChild(textPath)

      const text = document.createElementNS("http://www.w3.org/2000/svg", "text")
      text.setAttribute("class", "text-lg md:text-base font-bold fill-current text-gray-800")
      
      const textPathElement = document.createElementNS("http://www.w3.org/2000/svg", "textPath")
      textPathElement.setAttribute("href", `#textPath-${index}-${innerRadius}`)
      textPathElement.setAttribute("startOffset", "50%")
      textPathElement.setAttribute("text-anchor", "middle")
      textPathElement.setAttribute("dominant-baseline", "middle")
      textPathElement.textContent = emotion.name.replace("\n", " ")
      
      text.appendChild(textPathElement)
      textGroup.appendChild(text)
    } else {
      // For middle and outer emotions
      textGroup.setAttribute("transform", `translate(${textPos.x}, ${textPos.y}) rotate(${textAngle + (outerRadius > 200 ? 90 : 0)})`)
      
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text")
      let baseClass = outerRadius > 200 ? 
        "text-base md:text-sm font-bold fill-current text-gray-800" : 
        "text-lg md:text-base font-bold fill-current text-gray-800"
        
      text.setAttribute("class", baseClass)
      
      // Only apply size reduction for long words
      if (isLongWord) {
        const segmentWidth = Math.abs(2 * Math.sin(angleStep * Math.PI / 360) * textRadius)
        const fontSize = Math.max(12, segmentWidth / (emotion.name.length * 0.7))
        text.style.fontSize = `${fontSize}px`
      }
      
      text.setAttribute("text-anchor", "middle")
      text.setAttribute("dominant-baseline", "middle")
      text.textContent = emotion.name
      
      textGroup.appendChild(text)
    }
    
    segmentGroup.appendChild(textGroup)
    group.appendChild(segmentGroup)
  })
}

// Helper function to adjust colors
function adjustColor(color: string, amount: number): string {
  // Remove the '#' if present
  color = color.replace('#', '')
  
  // Convert to RGB
  const r = parseInt(color.substring(0, 2), 16)
  const g = parseInt(color.substring(2, 4), 16)
  const b = parseInt(color.substring(4, 6), 16)
  
  // Adjust each channel
  const newR = Math.max(0, Math.min(255, r + amount))
  const newG = Math.max(0, Math.min(255, g + amount))
  const newB = Math.max(0, Math.min(255, b + amount))
  
  // Convert to hex with zero padding
  const toHex = (n: number): string => ('0' + n.toString(16)).slice(-2)
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`
}

function initializeWheel() {
  console.log('Initializing wheel...')
  if (!wheelRef.value) {
    console.error('Wheel ref is null')
    return
  }

  // Create a fixed center group that will never move
  const fixedCenterGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
  fixedCenterGroup.setAttribute("class", "fixed-center-group")
  
  // Create the center circle in the fixed group
  const centerCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
  centerCircle.setAttribute("cx", "0")
  centerCircle.setAttribute("cy", "0")
  centerCircle.setAttribute("r", WHEEL_CONFIG.innerRadius.toString())
  centerCircle.setAttribute("fill", "white")
  centerCircle.setAttribute("stroke", "#eee")
  centerCircle.setAttribute("stroke-width", "1")
  fixedCenterGroup.appendChild(centerCircle)
  
  // Create a single main wheel group that all segments will be added to
  const mainWheelGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
  mainWheelGroup.setAttribute("class", "main-wheel-group")
  
  // Store the main wheel group in a ref for rotation
  outerGroupRef.value = mainWheelGroup
  
  // Create groups for each ring
  const outerRingGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
  const middleRingGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
  const innerRingGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
  
  outerRingGroup.setAttribute("class", "outer-ring-group")
  middleRingGroup.setAttribute("class", "middle-ring-group")
  innerRingGroup.setAttribute("class", "inner-ring-group")
  
  // Create segments for each ring
  createSegments(outerEmotions, 190, 290, outerRingGroup)
  createSegments(middleEmotions, 100, 190, middleRingGroup)
  createSegments(innerEmotions, 50, 100, innerRingGroup)
  
  // Add all rings to the main wheel group
  mainWheelGroup.appendChild(outerRingGroup)
  mainWheelGroup.appendChild(middleRingGroup)
  mainWheelGroup.appendChild(innerRingGroup)
  
  // First add the main wheel group, then the fixed center on top
  wheelRef.value.appendChild(mainWheelGroup)
  wheelRef.value.appendChild(fixedCenterGroup)
  
  // Set transform origin explicitly for the main wheel group
  gsap.set(mainWheelGroup, {
    transformOrigin: "center center",
    rotation: 0,
    x: 0,
    y: 0
  })

  console.log('Wheel initialization complete')
}

// Utility functions
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timeoutId: ReturnType<typeof setTimeout>
  return function(this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  } as T
}

// Event handlers with performance optimizations
function handleWheel(event: WheelEvent) {
  event.preventDefault();
  if (!isExpanded.value) {
    const scrollAmount = event.deltaY;
    const rotationAmount = scrollAmount * 2.5; // Dramatically increased for faster rotation
    rotateWheel(rotationAmount);
  }
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isExpanded.value) {
    collapseSegment()
  }
}

function handleTouchStart(event: TouchEvent) {
  if (isExpanded.value) return
  const touch = event.touches[0]
  touchStartX.value = touch.clientX
  touchStartY.value = touch.clientY
  isTouching.value = true
  touchStartTime.value = Date.now()
  lastTouchMoveTime.value = touchStartTime.value
  touchMoved.value = false
}

function handleTouchMove(event: TouchEvent) {
  if (!isTouching.value || isExpanded.value) return
  
  const touch = event.touches[0]
  const deltaX = touch.clientX - touchStartX.value
  const deltaY = touch.clientY - touchStartY.value
  
  // Exit early if movement is too small - reduce threshold for more sensitivity
  const moveDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  if (moveDistance < 3) return // Reduced from 5 for more sensitivity

  event.preventDefault()
  touchMoved.value = true
  
  // Kill any momentum timeline
  if (momentumTimeline.value) {
    momentumTimeline.value.kill()
    momentumTimeline.value = null
  }
  
  const now = Date.now()
  if (now - lastTouchMoveTime.value < 16) return  // Limit to ~60fps
  
  const wheelRect = wheelRef.value?.getBoundingClientRect()
  if (!wheelRect) return
  
  const wheelCenterX = wheelRect.left + wheelRect.width / 2
  const wheelCenterY = wheelRect.top + wheelRect.height / 2
  
  const startAngle = Math.atan2(
    touchStartY.value - wheelCenterY,
    touchStartX.value - wheelCenterX
  )
  
  const currentAngle = Math.atan2(
    touch.clientY - wheelCenterY,
    touch.clientX - wheelCenterX
  )
  
  let angleDiff = (currentAngle - startAngle) * (180 / Math.PI)
  if (angleDiff > 180) angleDiff -= 360
  if (angleDiff < -180) angleDiff += 360
  
  // Extreme sensitivity for mobile
  const isMobile = window.innerWidth <= 768
  const rotationAmount = angleDiff * (isMobile ? 8.0 : 3.5) // Massively increased for mobile
  
  // Track velocity for momentum
  const timeDelta = Math.max(now - lastTouchMoveTime.value, 1)
  const velocity = rotationAmount / timeDelta * 100
  lastTouchMoveAngle.value = velocity
  
  lastTouchMoveTime.value = now
  touchStartX.value = touch.clientX
  touchStartY.value = touch.clientY
  
  // Apply the rotation directly
  rotateWheel(rotationAmount)
}

function handleTouchEnd(event: TouchEvent) {
  if (!isTouching.value) return
  isTouching.value = false
  
  const timeSinceStart = Date.now() - touchStartTime.value
  
  // Ignore if it was a tap (not a drag)
  if (!touchMoved.value || timeSinceStart < 150) {
    return
  }
  
  const timeSinceLastMove = Date.now() - lastTouchMoveTime.value
  if (timeSinceLastMove < 150 && lastTouchMoveAngle.value !== 0) {
    // Clean up any existing momentum animation
    if (momentumTimeline.value) {
      momentumTimeline.value.kill()
      momentumTimeline.value = null
    }

    const isMobile = window.innerWidth <= 768
    
    // Calculate velocity and determine if this was a "fling" (very fast swipe)
    const velocity = lastTouchMoveAngle.value
    const isFling = Math.abs(velocity) > 300
    
    // Super-charge momentum even more for mobile
    const baseMultiplier = isMobile ? 40 : 30
    const maxMomentum = isMobile ? 10000 : 7200
    
    // Apply extra multiplier for flings to create dramatic spins
    const flingMultiplier = isFling ? 1.5 : 1.0
    
    const momentum = Math.min(Math.abs(velocity) * baseMultiplier * flingMultiplier, maxMomentum) * Math.sign(velocity)
    
    // Longer durations for mobile for more fun
    const baseDuration = isMobile ? 3 : 2
    const maxDuration = isMobile ? 16 : 12
    const momentumDuration = Math.min(maxDuration, baseDuration + Math.abs(momentum) / 800)
    
    // Only apply momentum to the main wheel group
    if (!outerGroupRef.value) return
    
    const currentRotation = gsap.getProperty(outerGroupRef.value, "rotation") as number || 0
    const targetRotation = currentRotation + momentum
    
    momentumTimeline.value = gsap.timeline({
      onComplete: () => { momentumTimeline.value = null },
      onInterrupt: () => { momentumTimeline.value = null }
    })
    
    if (isFling && isMobile) {
      // For flings on mobile, add a fun elastic bounce at the end
      momentumTimeline.value.to(outerGroupRef.value, {
        rotation: targetRotation * 1.05, // Slightly overshoot
        duration: momentumDuration * 0.8,
        ease: "power1.out",
        transformOrigin: "center center",
        x: 0,
        y: 0,
        overwrite: true
      })
      .to(outerGroupRef.value, {
        rotation: targetRotation,
        duration: momentumDuration * 0.2,
        ease: "elastic.out(1, 0.3)",
        transformOrigin: "center center"
      })
    } else {
      // Standard momentum for non-fling interactions
      momentumTimeline.value.to(outerGroupRef.value, {
        rotation: targetRotation,
        duration: momentumDuration,
        ease: "power1.out",
        transformOrigin: "center center",
        x: 0,
        y: 0,
        overwrite: true
      }, 0)
    }
  }

  // Reset velocity tracking
  lastTouchMoveAngle.value = 0
  touchMoved.value = false
}

function handleScriptureSelect(scripture: any) {
  selectedScripture.value = scripture
}

const debouncedHandleResize = debounce(() => {
  isMobileDevice.value = window.innerWidth <= 768
}, 250)

// Lifecycle hooks with cleanup
onMounted(() => {
  console.log('Component mounted')
  initializeWheel()
  window.addEventListener('wheel', handleWheel, { passive: false })
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('resize', debouncedHandleResize)
  wheelRef.value?.addEventListener('touchstart', handleTouchStart, { passive: false })
  wheelRef.value?.addEventListener('touchmove', handleTouchMove, { passive: false })
  wheelRef.value?.addEventListener('touchend', handleTouchEnd)
})

onUnmounted(() => {
  if (activeSpinTimeline.value) {
    activeSpinTimeline.value.kill()
    activeSpinTimeline.value = null
  }
  if (momentumTimeline.value) {
    momentumTimeline.value.kill()
    momentumTimeline.value = null
  }
  window.removeEventListener('wheel', handleWheel)
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('resize', debouncedHandleResize)
  wheelRef.value?.removeEventListener('touchstart', handleTouchStart)
  wheelRef.value?.removeEventListener('touchmove', handleTouchMove)
  wheelRef.value?.removeEventListener('touchend', handleTouchEnd)
})
</script>

<template>
  <div class="emotion-wheel">
    <svg ref="wheelRef" 
         class="wheel-svg" 
         preserveAspectRatio="xMidYMid meet"
         viewBox="-320 -320 640 640">
      <!-- All wheel segments will be added here by JavaScript -->
    </svg>
  </div>
</template>

<style scoped>
.emotion-wheel {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.wheel-svg {
  width: 80vmin;
  height: 80vmin;
  display: block;
  padding: 0;
  margin: 0;
}

/* Optimize for smaller screens */
@media (max-width: 768px) {
  .wheel-svg {
    width: 95vmin;
    height: 95vmin;
  }
}
</style>

