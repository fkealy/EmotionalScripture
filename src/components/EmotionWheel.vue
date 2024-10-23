<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { innerEmotions, middleEmotions, outerEmotions } from '../emotionData'

const currentRotation = ref(0)
const isExpanded = ref(false)
const expandedEmotion = ref(null)

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
  gsap.to([outerGroupRef.value, middleGroupRef.value, innerGroupRef.value], {
    rotation: "+=" + angle,
    duration: 0.2,
    ease: "power2.out",
    svgOrigin: "0 0"
  })
}

function expandSegment(emotion: any, angle: number) {
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
  
  // Create gradients for inner emotions
  if (innerRadius === 50) {
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs")
    
    // Gradient for Uncomfortable Emotions
    const gradientUncomfortable = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient")
    gradientUncomfortable.setAttribute("id", "gradientUncomfortable")
    gradientUncomfortable.innerHTML = `
      <stop offset="0%" stop-color="#8A2BE2" />
      <stop offset="33%" stop-color="#4169E1" />
      <stop offset="66%" stop-color="#1E90FF" />
      <stop offset="100%" stop-color="#87CEEB" />
    `
    defs.appendChild(gradientUncomfortable)
    
    // Gradient for Comfortable Emotions
    const gradientComfortable = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient")
    gradientComfortable.setAttribute("id", "gradientComfortable")
    gradientComfortable.innerHTML = `
      <stop offset="0%" stop-color="#FFD700" />
      <stop offset="33%" stop-color="#FFA500" />
      <stop offset="66%" stop-color="#FF8C00" />
      <stop offset="100%" stop-color="#FF7F50" />
    `
    defs.appendChild(gradientComfortable)
    
    group.appendChild(defs)
  }
  
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
    
    path.addEventListener('click', (e) => {
      e.stopPropagation()
      const segmentAngle = startAngle + (angleStep / 2)
      expandSegment(emotion, segmentAngle)
    })
    
    group.appendChild(path)

    // Add text labels with background
    const textRadius = (innerRadius + outerRadius) / 2
    const textAngle = startAngle + (angleStep / 2)
    const textPos = polarToCartesian(0, 0, textRadius, textAngle)
    
    const textGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
    
    if (innerRadius === 50) {
      // For inner emotions, create curved text with background
      const textPathRadius = (innerRadius + outerRadius) / 2
      const textArcStart = startAngle + 5 // Add a small offset to avoid text at the edges
      const textArcEnd = endAngle - 5
      const textPathD = createArc(0, 0, textPathRadius, textArcStart, textArcEnd, false)

      const textPath = document.createElementNS("http://www.w3.org/2000/svg", "path")
      textPath.setAttribute("d", textPathD)
      textPath.setAttribute("id", `textPath-${index}`)
      textPath.setAttribute("fill", "none")
      group.appendChild(textPath)

      // Create text background
      const textBackground = document.createElementNS("http://www.w3.org/2000/svg", "path")
      textBackground.setAttribute("d", textPathD)
      textBackground.setAttribute("fill", "white")
      textBackground.setAttribute("fill-opacity", "0.7")
      textBackground.setAttribute("stroke", "none")
      group.appendChild(textBackground)

      const text = document.createElementNS("http://www.w3.org/2000/svg", "text")
      text.setAttribute("class", "text-xs font-bold fill-current text-gray-800")
      
      const textPathElement = document.createElementNS("http://www.w3.org/2000/svg", "textPath")
      textPathElement.setAttribute("href", `#textPath-${index}`)
      textPathElement.setAttribute("startOffset", "50%")
      textPathElement.setAttribute("text-anchor", "middle")
      textPathElement.setAttribute("dominant-baseline", "text-before-edge")
      textPathElement.textContent = emotion.name.replace("\n", " ")
      
      text.appendChild(textPathElement)
      textGroup.appendChild(text)
    } else {
      // For middle and outer emotions, keep the existing text logic
      textGroup.setAttribute("transform", `translate(${textPos.x}, ${textPos.y}) rotate(${textAngle + (outerRadius > 200 ? 90 : 0)})`)
      
      const textBackground = document.createElementNS("http://www.w3.org/2000/svg", "rect")
      textBackground.setAttribute("class", "text-background")
      textBackground.setAttribute("fill", "white")
      textBackground.setAttribute("fill-opacity", "0.7")
      
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text")
      text.setAttribute("class", "text-xs font-bold fill-current text-gray-800")
      text.setAttribute("text-anchor", "middle")
      text.setAttribute("dominant-baseline", "middle")
      text.textContent = emotion.name
      
      textGroup.appendChild(textBackground)
      textGroup.appendChild(text)

      // Adjust text and background size
      function adjustText() {
        const bbox = text.getBBox()
        const padding = 2
        const bgWidth = bbox.width + 2 * padding
        const bgHeight = bbox.height + 2 * padding
        
        textBackground.setAttribute("x", (-bgWidth / 2).toString())
        textBackground.setAttribute("y", (-bgHeight / 2).toString())
        textBackground.setAttribute("width", bgWidth.toString())
        textBackground.setAttribute("height", bgHeight.toString())
        
        text.setAttribute("x", "0")
        text.setAttribute("y", "0")
      }

      // Use a setTimeout to ensure the text has been rendered before measuring
      setTimeout(adjustText, 0)
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
  const touch = event.touches[0]
  const deltaX = touch.clientX - touchStartX.value
  const deltaY = touch.clientY - touchStartY.value
  const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
  
  const currentTime = Date.now()
  const timeDiff = currentTime - lastTouchMoveTime.value
  
  if (timeDiff > 16) { // Limit to ~60fps
    const angleDiff = angle - lastTouchMoveAngle.value
    rotateWheel(angleDiff)
    lastTouchMoveAngle.value = angle
    lastTouchMoveTime.value = currentTime
  }
}

function handleTouchEnd() {
  if (!isTouching.value || isExpanded.value) return
  isTouching.value = false
  const touchDuration = Date.now() - touchStartTime.value
  
  if (touchDuration < 300) {
    // If the touch duration is short, add some momentum
    const momentum = (lastTouchMoveAngle.value - touchStartTime.value) / touchDuration
    gsap.to([outerGroupRef.value, middleGroupRef.value, innerGroupRef.value], {
      rotation: "+=" + (momentum * 100),
      duration: 0.5,
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
  <div class="w-screen h-screen flex justify-center items-center overflow-hidden relative">
    <svg ref="wheelRef" class="w-4/5 h-4/5 max-w-[80vmin] max-h-[80vmin]" viewBox="-300 -300 600 600">
      <circle cx="0" cy="0" r="290" fill="#f5f5f5" stroke="#e0e0e0"/>
    </svg>
    <div ref="overlayRef"
         class="absolute top-1/2 left-1/2 w-0 h-0 rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
         :style="{ 
           backgroundColor: expandedEmotion ? expandedEmotion.color : 'transparent', 
           opacity: 0
         }">
    </div>
    <div class="emotion-details fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white text-2xl opacity-0 pointer-events-none max-w-md">
      <h2 class="text-4xl font-bold mb-4">{{ expandedEmotion?.name }}</h2>
      <p class="text-xl mb-6">{{ expandedEmotion?.text }}</p>
      <div v-if="expandedEmotion?.scripture" class="scripture-container text-left">
        <div v-for="(scripture, index) in expandedEmotion.scripture" :key="index" class="mb-6">
          <h3 class="text-2xl font-semibold mb-2">{{ scripture.scriptureSource }}</h3>
          <p class="mb-2">{{ scripture.summary }}</p>
          <p class="mb-2"><strong>Ideas:</strong> {{ scripture.ideas }}</p>
          <div v-for="(quote, qIndex) in scripture.quotes" :key="qIndex" class="mb-4">
            <blockquote class="italic border-l-4 border-white pl-4 py-2">
              {{ quote.quote }}
            </blockquote>
            <p class="text-right">- {{ quote.author }}</p>
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
/* Add any additional styles here if needed */
.emotion-details {
  max-height: 80vh;
  overflow-y: auto;
}

/* Add touch-action manipulation to allow custom touch handling */
svg {
  touch-action: none;
}
</style>
