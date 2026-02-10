<script lang="ts" setup>
import { useSearch } from '~/composables/useSearch'

const { showSearchDialog } = useSearch()
const showScrollTopBtn = ref(false)

// function onScroll(state: UseScrollReturn) {
//   showScrollTopBtn.value = state.y.value > 200
// }

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="min-h-screen bg-zinc-50 flex flex-col font-sans text-zinc-900">
    <!-- Top Navigation (Desktop) -->
    <AppTopNav />

    <!-- Main Content Area -->
    <main class="flex-1 w-full max-w-3xl mx-auto px-4 py-6 md:py-10">
      <slot />
    </main>

    <!-- Footer -->
    <AppFooter />

    <!-- Bottom Navigation (Mobile) -->
    <AppBottomNav />

    <!-- Scroll to Top Button -->
    <div
      v-if="showScrollTopBtn"
      class="fixed right-6 bottom-24 md:bottom-10 z-40 bg-white border border-zinc-200 shadow-lg rounded-full p-3 cursor-pointer hover:bg-zinc-50 transition-all"
      @click="scrollToTop"
    >
      <Icon name="pixelarticons:arrow-up" class="w-6 h-6 text-zinc-600" />
    </div>

    <!-- Global Search Dialog -->
    <ResourceSearchDialog v-model="showSearchDialog" />

    <!-- Background Decoration (Optional, simplified) -->
    <div
      class="fixed inset-0 -z-10 pointer-events-none opacity-[0.03]"
      style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 24px 24px;"
    />
  </div>
</template>
