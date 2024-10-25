<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { innerEmotions, middleEmotions, outerEmotions } from '../emotionData'

// Define the Emotion interface
interface Emotion {
  name: string
  color: string
  text: string
  scripture?: {
    scriptureSource: string
    summary: string
    ideas: string
    quotes: {
      quote: string
      author: string
    }[]
  }[]
  parent?: string
}

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

function rotateWheel(angle: number) {
  if (isExpanded.value) return
  
  // Add smoothing to the rotation
  gsap.to([outerGroupRef.value, middleGroupRef.value, innerGroupRef.value], {
    rotation: "+=" + angle,
    duration: 0.3, // Increased duration for smoother rotation
    ease: "power2.out",
    svgOrigin: "0 0"
  })
}

function expandSegment(emotion: Emotion, angle: number) {
  if (isExpanded.value) return
  isExpanded.value = true
  expandedEmotion.value = emotion

  let rotationAngle = -angle
  rotationAngle = ((rotationAngle % 360) + 360) % 360
  if (rotationAngle > 180) rotationAngle -= 360

  let rotationDuration = 1.5

  const isUncomfortable = emotion.parent === "Uncomfortable Emotions" || 
                          ["Sad", "Scared", "Angry", "Embarrassed"].includes(emotion.parent)
  const isPlayful = emotion.name === "Playful" || emotion.parent === "Playful"

  if (isUncomfortable) {
    rotationDuration = 2
  } else if (isPlayful) {
    rotationAngle -= 360
    rotationDuration = 2.5
  }

  gsap.to([outerGroupRef.value, middleGroupRef.value, innerGroupRef.value], {
    rotation: rotationAngle,
    duration: rotationDuration,
    ease: "power2.inOut",
    svgOrigin: "0 0",
    onComplete: () => {
      currentRotation.value = rotationAngle % 360
      
      // Show the close button immediately when the overlay starts expanding
      gsap.to('.close-button', {
        opacity: 1,
        duration: 0.3,
        display: 'flex'
      })

      // Animate the overlay expansion after rotation
      gsap.to(overlayRef.value, {
        width: '300vmax',
        height: '300vmax',
        opacity: 0.9,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
          // Fade in the text and scripture data
          gsap.to(['.emotion-details', '.scripture-container'], {
            opacity: 1,
            duration: 0.5,
            delay: 0.2
          })
        }
      })
    }
  })
}

function contractSegment() {
  if (!isExpanded.value) return

  // Fade out the text, scripture data, and close button first
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

          // Rotate the wheel back to its original position
          gsap.to([outerGroupRef.value, middleGroupRef.value, innerGroupRef.value], {
            rotation: 0,
            duration: 1.5,
            ease: "power2.inOut",
            svgOrigin: "0 0"
          })
        }
      })
    }
  })
}

function createSegments(emotions: any[], innerRadius: number, outerRadius: number, group: SVGGElement) {
  const angleStep = 360 / emotions.length
  
  // Create single defs element at the start
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs")
  
  // Add paper texture filter
  const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter")
  filter.setAttribute("id", "paper-texture")
  filter.innerHTML = `
    <feTurbulence 
      type="turbulence" 
      baseFrequency="0.5" 
      numOctaves="2" 
      seed="1" 
      stitchTiles="stitch" 
      result="noise"
    />
    <feDiffuseLighting in="noise" lighting-color="#ffffff" surfaceScale="0.3" result="diffLight">
      <feDistantLight azimuth="45" elevation="65"/>
    </feDiffuseLighting>
    <feComposite operator="arithmetic" k1="1.1" k2="0.2" k3="0.1" k4="0" 
                 in="SourceGraphic" in2="diffLight" result="textured"/>
    <feGaussianBlur in="textured" stdDeviation="0.4" result="blurred"/>
    <feBlend mode="soft-light" in="SourceGraphic" in2="blurred" result="withTexture"/>
    <feColorMatrix type="matrix" in="withTexture"
      values="0.95 0   0   0   0.02
              0   0.95 0   0   0.02
              0   0   0.95 0   0.02
              0   0   0   0.95 0"/>
  `
  defs.appendChild(filter)
  
  // Create gradients for inner emotions
  if (innerRadius === 50) {
    // Gradient for Uncomfortable Emotions
    const gradientUncomfortable = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient")
    gradientUncomfortable.setAttribute("id", "gradientUncomfortable")
    gradientUncomfortable.innerHTML = `
      <stop offset="0%" stop-color="#9370DB" />
      <stop offset="33%" stop-color="#6495ED" />
      <stop offset="66%" stop-color="#87CEEB" />
      <stop offset="100%" stop-color="#B0E0E6" />
    `
    defs.appendChild(gradientUncomfortable)
    
    // Gradient for Comfortable Emotions
    const gradientComfortable = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient")
    gradientComfortable.setAttribute("id", "gradientComfortable")
    gradientComfortable.innerHTML = `
      <stop offset="0%" stop-color="#FFE4B5" />
      <stop offset="33%" stop-color="#FFDAB9" />
      <stop offset="66%" stop-color="#FFA07A" />
      <stop offset="100%" stop-color="#E9967A" />
    `
    defs.appendChild(gradientComfortable)
  }
  
  // Add defs to group
  group.appendChild(defs)
  
  emotions.forEach((emotion, index) => {
    const startAngle = index * angleStep
    const endAngle = (index + 1) * angleStep
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
    path.setAttribute("d", createSegmentPath(0, 0, outerRadius, startAngle, endAngle))
    
    // Apply gradient to inner emotions
    if (innerRadius === 50) {
      path.setAttribute("fill", `url(#gradient${emotion.name.split('\n')[0]})`)
    } else {
      path.setAttribute("fill", emotion.color)
    }
    
    path.setAttribute("stroke", "white")
    path.setAttribute("class", "cursor-pointer transition-transform duration-200 hover:scale-102")
    
    // Apply a lighter paper texture
    path.setAttribute("style", "filter: url(#paper-texture) saturate(0.95)")
    
    path.addEventListener('click', (e) => {
      e.stopPropagation()
      const segmentAngle = startAngle + (angleStep / 2)
      expandSegment(emotion, segmentAngle)
    })
    
    group.appendChild(path)

    // Modified text sizing logic
    const textRadius = (innerRadius + outerRadius) / 2
    const textAngle = startAngle + (angleStep / 2)
    const textPos = polarToCartesian(0, 0, textRadius, textAngle)
    
    const textGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
    
    if (innerRadius === 50) {
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
      const textSizeClass = outerRadius > 200 ? 
        "text-base md:text-sm font-bold fill-current text-gray-800" : 
        "text-lg md:text-base font-bold fill-current text-gray-800"
      text.setAttribute("class", textSizeClass)
      text.setAttribute("text-anchor", "middle")
      text.setAttribute("dominant-baseline", "middle")
      text.textContent = emotion.name
      
      textGroup.appendChild(text)
    }
    
    group.appendChild(textGroup)
  })
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

function handleWheel(event: WheelEvent) {
  event.preventDefault()
  const scrollAmount = event.deltaY
  const rotationAmount = scrollAmount * 0.5
  rotateWheel(rotationAmount)
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
}

function handleTouchMove(event: TouchEvent) {
  if (!isTouching.value || isExpanded.value) return
  event.preventDefault() // Prevent scrolling
  const touch = event.touches[0]
  const deltaX = touch.clientX - touchStartX.value
  const deltaY = touch.clientY - touchStartY.value
  
  // Calculate the angle between current touch position and center of wheel
  const wheelRect = wheelRef.value?.getBoundingClientRect()
  if (!wheelRect) return
  
  const wheelCenterX = wheelRect.left + wheelRect.width / 2
  const wheelCenterY = wheelRect.top + wheelRect.height / 2
  
  const currentAngle = Math.atan2(touch.clientY - wheelCenterY, touch.clientX - wheelCenterX)
  const startAngle = Math.atan2(touchStartY.value - wheelCenterY, touchStartX.value - wheelCenterX)
  
  // Calculate angle difference and apply dampening
  const angleDiff = (currentAngle - startAngle) * (180 / Math.PI) * 0.5 // Reduced sensitivity
  
  // Update reference points for next move
  touchStartX.value = touch.clientX
  touchStartY.value = touch.clientY
  
  rotateWheel(angleDiff)
}

function handleTouchEnd() {
  if (!isTouching.value || isExpanded.value) return
  isTouching.value = false
  const touchDuration = Date.now() - touchStartTime.value
  
  if (touchDuration < 300) {
    // Reduced momentum effect
    const momentum = (lastTouchMoveAngle.value - touchStartTime.value) / touchDuration
    const maxMomentum = 30 // Limit maximum momentum
    const limitedMomentum = Math.min(Math.abs(momentum), maxMomentum) * Math.sign(momentum)
    
    gsap.to([outerGroupRef.value, middleGroupRef.value, innerGroupRef.value], {
      rotation: "+=" + (limitedMomentum * 2), // Reduced multiplication factor
      duration: 0.8, // Longer duration for smoother deceleration
      ease: "power2.out",
      svgOrigin: "0 0"
    })
  }
}

onMounted(() => {
  initializeWheel()
  window.addEventListener('wheel', handleWheel, { passive: false })
  window.addEventListener('keydown', handleKeyDown)
  wheelRef.value?.addEventListener('touchstart', handleTouchStart, { passive: false })
  wheelRef.value?.addEventListener('touchmove', handleTouchMove, { passive: false })
  wheelRef.value?.addEventListener('touchend', handleTouchEnd)
})

onUnmounted(() => {
  window.removeEventListener('wheel', handleWheel)
  window.removeEventListener('keydown', handleKeyDown)
  wheelRef.value?.removeEventListener('touchstart', handleTouchStart)
  wheelRef.value?.removeEventListener('touchmove', handleTouchMove)
  wheelRef.value?.removeEventListener('touchend', handleTouchEnd)
})
</script>

<template>
  <div class="wheel-container w-screen h-screen flex justify-center items-center overflow-hidden relative">
    <svg ref="wheelRef" class="w-[95%] h-[95%] md:w-4/5 md:h-4/5 max-w-[95vmin] md:max-w-[80vmin] max-h-[95vmin] md:max-h-[80vmin]" viewBox="-300 -300 600 600">
      <circle cx="0" cy="0" r="290" fill="#f5f5f5" stroke="#e0e0e0"/>
    </svg>
    <div ref="overlayRef"
         class="absolute top-1/2 left-1/2 w-0 h-0 rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
         :style="{ 
           backgroundColor: expandedEmotion ? expandedEmotion.color : 'transparent', 
           opacity: 0
         }">
    </div>
    <div class="emotion-details fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white opacity-0 pointer-events-none w-[90vw] max-w-md">
      <h2 class="text-2xl md:text-4xl font-bold mb-3 md:mb-4">{{ expandedEmotion?.name }}</h2>
      <p class="text-base md:text-xl mb-4 md:mb-6">{{ expandedEmotion?.text }}</p>
      <div v-if="expandedEmotion?.scripture" class="scripture-container text-left">
        <div v-for="(scripture, index) in expandedEmotion.scripture" :key="index" class="mb-4 md:mb-6">
          <h3 class="text-lg md:text-2xl font-semibold mb-2">{{ scripture.scriptureSource }}</h3>
          <p class="text-sm md:text-base mb-2">{{ scripture.summary }}</p>
          <p class="text-sm md:text-base mb-2"><strong>Ideas:</strong> {{ scripture.ideas }}</p>
          <div v-for="(quote, qIndex) in scripture.quotes" :key="qIndex" class="mb-3 md:mb-4">
            <blockquote class="text-sm md:text-base italic border-l-4 border-white pl-3 md:pl-4 py-1 md:py-2">
              {{ quote.quote }}
            </blockquote>
            <p class="text-sm md:text-base text-right">- {{ quote.author }}</p>
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
  padding-top: 0;
  margin-top: 0; /* Remove the negative margin */
  min-height: 100vh; /* Ensure full viewport height */
  background-color: #f5f5f5; /* Match the wheel's background color */
}

/* Remove the media query for margin-top since we don't need it anymore */

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
    stroke-width: 4px; /* Thicker stroke on mobile for better visibility */
  }
}

/* Simplify the hover effect */
path {
  transition: all 0.3s ease;
}

path:hover {
  filter: url(#paper-texture) brightness(1.1);
}
</style>
