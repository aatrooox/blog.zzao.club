<script lang="ts" setup>
import { useSearch } from '~/composables/useSearch'

const { showSearchDialog } = useSearch()
</script>

<template>
  <div class="min-h-screen bg-beauty-minimal flex flex-col font-sans text-zinc-900 dark:text-zinc-50">
    <!-- Decorative Elements -->
    <div class="decorative-top-line" />
    <div class="decorative-edge-glow decorative-edge-glow-left" />
    <div class="decorative-edge-glow decorative-edge-glow-right" />

    <!-- Top Navigation -->
    <AppTopNav max-width-class="max-w-7xl" />

    <!-- Main Content Area: 全宽，首页自己控制内部 max-w -->
    <main class="flex-1 w-full">
      <slot />
    </main>

    <!-- Scroll to Top Button -->
    <ScrollTopButton />

    <!-- Footer -->
    <AppFooter />

    <!-- Bottom Navigation (Mobile) -->
    <AppBottomNav />

    <!-- Global Search Dialog -->
    <ResourceSearchDialog v-model="showSearchDialog" />

    <!-- Background Decoration -->
    <div
      class="fixed inset-0 -z-10 pointer-events-none opacity-[0.03]"
      style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 24px 24px;"
    />
  </div>
</template>
