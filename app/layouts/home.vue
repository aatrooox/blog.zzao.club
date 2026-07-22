<script lang="ts" setup>
import { useSearch } from '~/composables/useSearch'

const { showSearchDialog } = useSearch()
</script>

<template>
  <div class="min-h-screen bg-beauty-minimal flex flex-col font-sans text-zinc-900 dark:text-zinc-50">
    <div class="decorative-top-line" />
    <div class="decorative-edge-glow decorative-edge-glow-left" />
    <div class="decorative-edge-glow decorative-edge-glow-right" />

    <!-- 无独立顶栏：导航已并入页面 SiteHeader -->
    <main class="flex-1 w-full">
      <slot />
    </main>

    <ScrollTopButton />
    <AppFooter />
    <AppBottomNav />
    <ResourceSearchDialog v-model="showSearchDialog" />

    <div
      class="fixed inset-0 -z-10 pointer-events-none opacity-[0.025]"
      style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 24px 24px;"
    />
  </div>
</template>
