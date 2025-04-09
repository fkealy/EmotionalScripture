<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { innerEmotions, middleEmotions, outerEmotions } from '../emotionData'

// Define the Emotion interface
interface Emotion {
  name: string
  color: string
  text: string
  parent?: string
  children?: string[]
  Christianity?: {
    scriptureSource: string
    summary: string
    ideas: string
    similarTo: string[]
    quotes: {
      quote: string
      author: string
      sourceURL: string
    }[]
  }[]
}

// Wheel configuration
const WHEEL_CONFIG = {
  innerRadius: 50,
  middleRadius: 100,
  outerRadius: 190,
  maxRadius: 290,
  strokeWidth: 0.5,
  longWordThreshold: 10,
  bubblePadding: 15 // Slightly smaller padding just for the viewBox
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

const wheelRef = ref<SVGSVGElement | null>(null)
const outerGroupRef = ref<SVGGElement | null>(null)
const middleGroupRef = ref<SVGGElement | null>(null)
const innerGroupRef = ref<SVGGElement | null>(null)
const overlayRef = ref(null)

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
  
  const currentRotation = gsap.getProperty(outerGroupRef.value, "rotation") as number || 0
  
  gsap.to([outerGroupRef.value, middleGroupRef.value, innerGroupRef.value], {
    rotation: currentRotation + angle,
    duration: 0.1,
    ease: "none",
    transformOrigin: "50% 50%",
    overwrite: "auto"
  })
}

function expandSegment(emotion: Emotion, angle: number) {
  if (isExpanded.value) return
  
  // Reset any other segments that might be in a bubbled state
  const segments = document.querySelectorAll('.segment-path')
  segments.forEach(segment => {
    if (segment !== event?.target) {  // Don't reset the clicked segment
      const normalPath = segment.getAttribute('data-normal-path')
      if (normalPath) {
        gsap.set(segment, {
          d: normalPath,
          scale: 1,
          opacity: 1,
          svgOrigin: "0 0"
        })
      }
    }
  })

  isExpanded.value = true
  expandedEmotion.value = emotion

  // Determine if we're on a mobile device
  const isMobile = window.innerWidth <= 768

  // Show the overlay and content
  gsap.to('.close-button', {
    opacity: 1,
    duration: 0.3,
    display: 'flex'
  })

  gsap.to(overlayRef.value, {
    width: '300vmax',
    height: '300vmax',
    opacity: 0.9,
    duration: isMobile ? ANIMATION_CONFIG.overlay.duration.mobile : ANIMATION_CONFIG.overlay.duration.desktop,
    ease: ANIMATION_CONFIG.overlay.ease,
    onComplete: () => {
      gsap.to(['.emotion-details', '.scripture-container'], {
        opacity: 1,
        duration: isMobile ? 0.7 : 0.5,
        delay: 0.2
      })
    }
  })
}

function contractSegment() {
  if (!isExpanded.value) return
  
  // Reset all segments to their normal state first
  const segments = document.querySelectorAll('.segment-path')
  segments.forEach(segment => {
    const normalPath = segment.getAttribute('data-normal-path')
    if (normalPath) {
      gsap.to(segment, {
        d: normalPath,
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: "power2.inOut",
        svgOrigin: "0 0"
      })
    }
  })

  // Fade out the text and scripture data
  gsap.to(['.emotion-details', '.scripture-container', '.close-button'], {
    opacity: 0,
    duration: 0.3,
    onComplete: () => {
      gsap.set('.close-button', { display: 'none' })
      // Then animate the overlay contraction
      gsap.to(overlayRef.value, {
        width: 0,
        height: 0,
        opacity: 0,
        duration: 0.7,
        ease: "power2.inOut",
        onComplete: () => {
          isExpanded.value = false
          expandedEmotion.value = null
        }
      })
    }
  })
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
    
    // Add hover animation using GSAP
    path.addEventListener('mouseenter', () => {
      if (!isExpanded.value) {
        gsap.to(path, {
          scale: ANIMATION_CONFIG.segment.hover.scale,
          opacity: ANIMATION_CONFIG.segment.hover.opacity,
          duration: ANIMATION_CONFIG.segment.hover.duration,
          ease: "power2.out",
          svgOrigin: "0 0"
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
          svgOrigin: "0 0"
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
                svgOrigin: "0 0"
              })
            }
          }
        })

        // Bubble animation
        const timeline = gsap.timeline({
          onComplete: () => {
            const segmentAngle = startAngle + (angleStep / 2)
            expandSegment(emotion, segmentAngle)
          }
        })

        timeline.to(path, {
          d: bubbledPath,
          scale: ANIMATION_CONFIG.segment.click.bubbleScale,
          duration: ANIMATION_CONFIG.segment.click.bubbleDuration,
          ease: ANIMATION_CONFIG.segment.click.bubbleEase
        })
      }
    })
    
    group.appendChild(path)
    
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
      textPath.setAttribute("id", `textPath-${index}`)
      textPath.setAttribute("fill", "none")
      group.appendChild(textPath)

      const text = document.createElementNS("http://www.w3.org/2000/svg", "text")
      text.setAttribute("class", "text-lg md:text-base font-bold fill-current text-gray-800")
      
      const textPathElement = document.createElementNS("http://www.w3.org/2000/svg", "textPath")
      textPathElement.setAttribute("href", `#textPath-${index}`)
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
    
    group.appendChild(textGroup)
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
  if (!wheelRef.value) return

  outerGroupRef.value = document.createElementNS("http://www.w3.org/2000/svg", "g")
  middleGroupRef.value = document.createElementNS("http://www.w3.org/2000/svg", "g")
  innerGroupRef.value = document.createElementNS("http://www.w3.org/2000/svg", "g")

  createSegments(outerEmotions, 190, 290, outerGroupRef.value)
  createSegments(middleEmotions, 100, 190, middleGroupRef.value)
  createSegments(innerEmotions, 50, 100, innerGroupRef.value)

  wheelRef.value.appendChild(outerGroupRef.value)
  wheelRef.value.appendChild(middleGroupRef.value)
  wheelRef.value.appendChild(innerGroupRef.value)

  const centerCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
  centerCircle.setAttribute("cx", "0")
  centerCircle.setAttribute("cy", "0")
  centerCircle.setAttribute("r", "50")
  centerCircle.setAttribute("fill", "white")
  centerCircle.setAttribute("stroke", "#ccc")
  wheelRef.value.appendChild(centerCircle)
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
  event.preventDefault()
  if (!isExpanded.value) {
    const scrollAmount = event.deltaY
    const rotationAmount = scrollAmount * 0.5
    requestAnimationFrame(() => rotateWheel(rotationAmount))
  }
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isExpanded.value) {
    contractSegment()
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
  const moveDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

  if (moveDistance < ANIMATION_CONFIG.touch.minMovement) {
    return
  }

  if (momentumTimeline.value) {
    momentumTimeline.value.kill()
    momentumTimeline.value = null
  }

  touchMoved.value = true
  event.preventDefault()
  
  const now = Date.now()
  if (now - lastTouchMoveTime.value < 16) return
  
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
  
  const distanceFromCenter = Math.sqrt(
    Math.pow(touch.clientX - wheelCenterX, 2) + 
    Math.pow(touch.clientY - wheelCenterY, 2)
  )
  const maxDistance = Math.min(wheelRect.width, wheelRect.height) / 2
  
  const baseSensitivity = ANIMATION_CONFIG.touch.sensitivity
  const distanceFactor = Math.min(distanceFromCenter / maxDistance, 1)
  const sensitivity = Math.min(
    baseSensitivity + (distanceFactor * baseSensitivity),
    ANIMATION_CONFIG.touch.maxSensitivity
  )
  
  const rotationAmount = angleDiff * sensitivity
  
  const timeDelta = Math.max(now - lastTouchMoveTime.value, 1)
  const instantVelocity = (rotationAmount / timeDelta) * 100
  
  const smoothingFactor = ANIMATION_CONFIG.touch.velocitySmoothing
  lastTouchMoveAngle.value = instantVelocity * (1 - smoothingFactor) + 
                            (lastTouchMoveAngle.value || 0) * smoothingFactor
  
  lastTouchMoveTime.value = now
  touchStartX.value = touch.clientX
  touchStartY.value = touch.clientY
  
  // Get the current rotation
  const currentRotation = gsap.getProperty(outerGroupRef.value, "rotation") as number || 0
  
  // Update the rotation using the rotateWheel function
  requestAnimationFrame(() => rotateWheel(rotationAmount))
}

function handleTouchEnd(event: TouchEvent) {
  if (!isTouching.value) return
  isTouching.value = false
  
  const timeSinceStart = Date.now() - touchStartTime.value
  
  if (!touchMoved.value && timeSinceStart < TOUCH_CONFIG.tapTimeout) {
    return
  }
  
  const timeSinceLastMove = Date.now() - lastTouchMoveTime.value
  if (timeSinceLastMove < 150) {
    if (momentumTimeline.value) {
      momentumTimeline.value.kill()
      momentumTimeline.value = null
    }

    const velocity = lastTouchMoveAngle.value
    const velocityMagnitude = Math.abs(velocity)
    
    const momentumBase = velocityMagnitude * ANIMATION_CONFIG.momentum.physics.velocityMultiplier
    const maxMomentum = 360 * ANIMATION_CONFIG.momentum.physics.maxRotations
    const momentum = Math.min(momentumBase, maxMomentum) * Math.sign(velocity)
    
    const { minDuration, maxDuration } = ANIMATION_CONFIG.momentum.physics
    const momentumDuration = Math.min(maxDuration, 
      minDuration + (Math.abs(momentum) / maxMomentum) * (maxDuration - minDuration))
    
    const timeline = gsap.timeline({
      onComplete: () => {
        momentumTimeline.value = null
      },
      onInterrupt: () => {
        momentumTimeline.value = null
      }
    })
    
    momentumTimeline.value = timeline
    const wheelElements = [outerGroupRef.value, middleGroupRef.value, innerGroupRef.value]
    
    timeline.to(wheelElements, {
      rotation: "+=" + momentum,
      duration: momentumDuration,
      ease: "power2.out",
      transformOrigin: "50% 50%"
    })
  }

  lastTouchMoveAngle.value = 0
  touchMoved.value = false
}

const debouncedHandleResize = debounce(() => {
  isMobileDevice.value = window.innerWidth <= 768
}, 250)

// Lifecycle hooks with cleanup
onMounted(() => {
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
  <div class="wheel-container w-screen h-screen flex justify-center items-center overflow-hidden relative">
    <svg ref="wheelRef" 
         class="w-[95%] h-[95%] md:w-4/5 md:h-4/5 max-w-[95vmin] md:max-w-[80vmin] max-h-[95vmin] md:max-h-[80vmin]" 
         :viewBox="`-${WHEEL_CONFIG.maxRadius + WHEEL_CONFIG.bubblePadding} -${WHEEL_CONFIG.maxRadius + WHEEL_CONFIG.bubblePadding} ${(WHEEL_CONFIG.maxRadius + WHEEL_CONFIG.bubblePadding) * 2} ${(WHEEL_CONFIG.maxRadius + WHEEL_CONFIG.bubblePadding) * 2}`">
      <g class="wheel-segments">
        <!-- segments will be added here -->
      </g>
    </svg>
    <div ref="overlayRef"
         class="fixed top-1/2 left-1/2 w-0 h-0 rounded-full transform -translate-x-1/2 -translate-y-1/2"
         :style="{ 
           backgroundColor: expandedEmotion ? expandedEmotion.color : 'transparent', 
           opacity: isExpanded ? 0.9 : 0,
           zIndex: isExpanded ? 10 : -1,
           width: isExpanded ? '300vmax' : '0',
           height: isExpanded ? '300vmax' : '0',
           transition: 'opacity 0.3s ease'
         }">
    </div>
    <div class="emotion-details fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white w-[95vw] max-w-[1200px] max-h-[80vh] overflow-y-auto custom-scrollbar"
         :style="{ 
           zIndex: isExpanded ? 20 : -1,
           opacity: isExpanded ? 1 : 0,
           pointerEvents: isExpanded ? 'auto' : 'none',
           transition: 'opacity 0.3s ease'
         }">
      <h2 class="text-2xl md:text-3xl font-bold mb-4">{{ expandedEmotion?.name }}</h2>
      <p class="text-lg md:text-xl mb-6 font-light">{{ expandedEmotion?.text }}</p>
      
      <div v-if="expandedEmotion?.Christianity" class="scripture-container text-left">
        <div class="scripture-content">
          <div v-for="(scripture, index) in expandedEmotion.Christianity" 
               :key="index"
               class="scripture-section">
            <h3 class="text-xl font-light mb-3">{{ scripture.scriptureSource }}</h3>
            <p class="text-base mb-4">{{ scripture.summary }}</p>
            <p class="text-base mb-4"><strong>Key Ideas:</strong> {{ scripture.ideas }}</p>

            <blockquote class="text-lg font-light italic mb-2">
              {{ scripture.quotes[0].quote }}
            </blockquote>
            <p class="text-right text-base mb-8">- {{ scripture.quotes[0].author }}</p>
          </div>
        </div>
      </div>
    </div>
    <button @click="contractSegment" 
            class="close-button fixed top-5 right-5 bg-white rounded-full w-10 h-10 text-2xl cursor-pointer items-center justify-center shadow-md hover:bg-gray-100 transition-colors duration-200 opacity-0"
            style="display: none;">
      ×
    </button>
  </div>
</template>

<style scoped>
.wheel-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  z-index: 1;
  overflow: hidden;
}

/* Update segment styling */
.segment-path {
  transition: filter 0.3s ease;
  filter: brightness(1);
  transform-origin: center;
  will-change: transform, opacity, d;
}

.wheel-segments {
  transform-origin: center;
}

/* Enhance text visibility */
text {
  paint-order: stroke;
  stroke: white;
  stroke-width: 3px;
  stroke-linecap: round;
  stroke-linejoin: round;
}

@media (max-width: 640px) {
  text {
    stroke-width: 4px;
  }
}

/* Enhanced segment styling */
.segment-path:hover {
  filter: brightness(1.1) contrast(1.05);
}

/* Rest of your existing styles... */

.scripture-nav-btn {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.6);
  color: white;
  width: 60px;
  height: 80px;
  border-radius: 8px;
  font-size: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 30;
}

.scripture-nav-btn:not(:disabled):hover {
  background: rgba(255, 255, 255, 0.25);
}

.scripture-nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.scripture-nav-btn.left-0 {
  left: 1rem;
}

.scripture-nav-btn.right-0 {
  right: 1rem;
}

.scripture-content {
  position: relative;
  padding: 0 2rem;
  width: 100%;
  margin: 0 auto;
  line-height: 1.5;
}

.scripture-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.scripture-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

blockquote {
  border-left: 2px solid rgba(255, 255, 255, 0.4);
  padding-left: 1.2rem;
  margin: 1.5rem 0;
}

/* Remove scrollbar styles */

/* Responsive adjustments */
@media (max-width: 768px) {
  .scripture-content {
    padding: 0 1rem;
  }
  
  blockquote {
    font-size: 1rem;
    padding-left: 1rem;
  }
}

@keyframes fadeEffect {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Add transition for content visibility */
.scripture-slide {
  opacity: 1;
  transition: opacity 0.3s ease;
}

/* Ensure the close button stays on top */
.close-button {
  z-index: 60;
}

/* Add custom scrollbar styles */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.5) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
}

/* Prevent wheel event from affecting background when overlay is active */
.wheel-container {
  /* ... existing styles ... */
  overflow: hidden;
}

/* Add padding to ensure content isn't cut off at the bottom */
.emotion-details {
  padding: 2rem 1rem;
  margin: 2rem 0;
}

@media (max-width: 768px) {
  .emotion-details {
    padding: 1rem;
    margin: 1rem 0;
  }
}
</style>

