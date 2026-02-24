<!-- Jinx 专栏：indigo 点缀色，强调双作者身份 -->
<script setup lang="ts">
import type { Page } from '~/components/common/PagePanel.vue'

defineProps<{
  articles: Page[]
}>()

const { formatDate } = useDayjs()
</script>

<template>
  <div>
    <!-- 栏目标题：Jinx 专属 indigo 色 -->
    <div class="flex items-center gap-3 mb-5">
      <div class="flex items-center gap-1.5 shrink-0">
        <span class="w-2 h-2 rounded-full bg-indigo-400 dark:bg-indigo-500" />
        <span class="text-[10px] font-bold tracking-widest uppercase text-indigo-500 dark:text-indigo-400">Jinx</span>
      </div>
      <div class="flex-1 h-px bg-indigo-100 dark:bg-indigo-900/40" />
    </div>

    <!-- 无内容 -->
    <div v-if="!articles.length" class="text-zinc-400 text-sm py-3 text-center">
      Jinx 还没有发布内容
    </div>

    <div v-else class="space-y-1">
      <NuxtLink
        v-for="article in articles"
        :key="article.path"
        :to="article.path"
        class="group flex items-start justify-between gap-2 py-2.5 border-b border-indigo-50 dark:border-indigo-900/30 last:border-0 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors"
      >
        <span class="text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors leading-snug line-clamp-2 flex-1">
          {{ article.title }}
        </span>
        <span class="text-xs text-zinc-400 shrink-0 mt-0.5">
          {{ formatDate(article.date ?? '') }}
        </span>
      </NuxtLink>
    </div>
  </div>
</template>
