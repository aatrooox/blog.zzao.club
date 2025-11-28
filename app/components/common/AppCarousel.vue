<script setup lang="ts">
import { gsap } from 'gsap'

const props = defineProps({
  images: {
    type: Array as PropType<string[]>,
    required: true,
  },
  autoplay: {
    type: Boolean,
    default: true,
  },
  interval: {
    type: Number,
    default: 5000,
  },
})

const currentIndex = ref(0)
const direction = ref(1) // 1 for next, -1 for prev
const containerRef = ref(null)
const isAnimating = ref(false)

let timer: NodeJS.Timeout | null = null

function stopAutoplay() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function startAutoplay() {
  if (props.autoplay && props.images.length > 1) {
    stopAutoplay()
    timer = setInterval(() => {
      next()
    }, props.interval)
  }
}

function goTo(index: number) {
  if (isAnimating.value || index === currentIndex.value)
    return

  direction.value = index > currentIndex.value ? 1 : -1
  const prevIndex = currentIndex.value
  currentIndex.value = index

  animateTransition(prevIndex, index)
}

function next() {
  const nextIndex = (currentIndex.value + 1) % props.images.length
  // Force direction to 1 for next button
  direction.value = 1
  // If wrapping around, we might want to slide from right still

  if (isAnimating.value)
    return
  const prevIndex = currentIndex.value
  currentIndex.value = nextIndex
  animateTransition(prevIndex, nextIndex)
}

function prev() {
  const prevIndex = (currentIndex.value - 1 + props.images.length) % props.images.length
  // Force direction to -1 for prev button
  direction.value = -1

  if (isAnimating.value)
    return
  const current = currentIndex.value
  currentIndex.value = prevIndex
  animateTransition(current, prevIndex)
}

function animateTransition(from: number, to: number) {
  isAnimating.value = true
  const images = containerRef.value.querySelectorAll('.carousel-image')
  const fromImg = images[from]
  const toImg = images[to]

  // Initial state for entering image
  gsap.set(toImg, {
    xPercent: direction.value * 100,
    opacity: 1,
    zIndex: 2,
  })
  gsap.set(fromImg, { zIndex: 1 })

  const tl = gsap.timeline({
    onComplete: () => {
      isAnimating.value = false
      gsap.set(fromImg, { opacity: 0, xPercent: 0 })
      gsap.set(toImg, { zIndex: 1 })
    },
  })

  tl.to(fromImg, {
    xPercent: -direction.value * 20,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.inOut',
  }, 0)

  tl.to(toImg, {
    xPercent: 0,
    duration: 0.8,
    ease: 'power3.inOut',
  }, 0)
}

onMounted(() => {
  startAutoplay()
  // Initialize first image
  const images = containerRef.value?.querySelectorAll('.carousel-image')
  if (images && images[0]) {
    gsap.set(images[0], { opacity: 1, xPercent: 0 })
  }
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<template>
  <div
    ref="containerRef"
    class="relative w-full overflow-hidden rounded-2xl group aspect-video bg-muted/10 border border-white/10 shadow-2xl shadow-black/20"
    @mouseenter="stopAutoplay"
    @mouseleave="startAutoplay"
  >
    <!-- Images -->
    <div class="relative w-full h-full">
      <img
        v-for="(img) in images"
        :key="img"
        :src="img"
        class="carousel-image absolute inset-0 w-full h-full object-cover opacity-0"
        alt="Product Preview"
      >
      <!-- Overlay gradient -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
    </div>

    <!-- Controls -->
    <div v-if="images.length > 1" class="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
      <button
        class="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/50 transition-colors pointer-events-auto hover:scale-110 active:scale-95"
        @click="prev"
      >
        <Icon name="lucide:chevron-left" class="w-6 h-6" />
      </button>
      <button
        class="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/50 transition-colors pointer-events-auto hover:scale-110 active:scale-95"
        @click="next"
      >
        <Icon name="lucide:chevron-right" class="w-6 h-6" />
      </button>
    </div>

    <!-- Indicators -->
    <div v-if="images.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
      <button
        v-for="(_, index) in images"
        :key="index"
        class="h-1.5 rounded-full transition-all duration-300 backdrop-blur-sm"
        :class="currentIndex === index ? 'bg-white w-6' : 'bg-white/40 w-1.5 hover:bg-white/60'"
        @click="goTo(index)"
      />
    </div>
  </div>
</template>
