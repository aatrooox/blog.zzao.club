<script lang="ts" setup>
/**
 * 内容站统一布局：固定栏宽 + 装饰 + 底栏
 * 顶区 LOGO/导航由各页 SiteHeader 渲染，结构全站一致
 */
import { useSearch } from '~/composables/useSearch'

const { showSearchDialog } = useSearch()
</script>

<template>
  <div class="min-h-screen bg-[oklch(0.985_0.005_100)] dark:bg-zinc-950 flex flex-col font-sans text-zinc-900 dark:text-zinc-50">
    <div class="decorative-top-line" />
    <div class="decorative-edge-glow decorative-edge-glow-left" />
    <div class="decorative-edge-glow decorative-edge-glow-right" />

    <main class="flex-1 w-full">
      <div class="max-w-[var(--article-measure,40rem)] mx-auto px-4 py-8 md:py-12">
        <slot />
      </div>
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
