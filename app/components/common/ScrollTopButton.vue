<script lang="ts" setup>
const showScrollTopBtn = ref(false)
const scrollProgress = ref(0)
const circleCircumference = 2 * Math.PI * 18
const circleDashoffset = ref(circleCircumference)

function onScroll() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0

  circleDashoffset.value = circleCircumference - (scrollProgress.value / 100) * circleCircumference

  showScrollTopBtn.value = scrollTop > 200
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <!-- Scroll to Top Button with Circular Progress (outside content area) -->
  <div
    v-if="showScrollTopBtn"
    class="fixed bottom-20 md:bottom-8 z-40"
    style="right: max(1rem, calc((100vw - 672px) / 2 - 56px))"
  >
    <div class="scroll-top-with-progress">
      <svg class="scroll-top-progress-ring" viewBox="0 0 40 40">
        <circle
          class="scroll-top-progress-circle"
          cx="20"
          cy="20"
          r="18"
          :stroke-dasharray="circleCircumference"
          :stroke-dashoffset="circleDashoffset"
        />
      </svg>
      <button
        class="scroll-top-button bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all"
        @click="scrollToTop"
      >
        <Icon name="pixelarticons:arrow-up" class="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
      </button>
    </div>
  </div>
</template>
