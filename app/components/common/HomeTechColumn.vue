<!-- Aatrox 文章栏：单篇文章 + 分组卡片列表 -->
<script setup lang="ts">
import type { Page } from '~/components/common/PagePanel.vue'
import type { FlatGroup } from '~/composables/usePages'

defineProps<{
  items: Array<
    | { type: 'article', data: Page }
    | { type: 'group', data: FlatGroup }
  >
}>()

const { formatDate } = useDayjs()
</script>

<template>
  <div>
    <!-- 栏目标题：Aatrox 专属（与 Jinx 对称） -->
    <div class="flex items-center gap-3 mb-5">
      <div class="flex items-center gap-1.5 shrink-0">
        <span class="w-2 h-2 rounded-full bg-primary/70" />
        <span class="text-[10px] font-bold tracking-widest uppercase text-primary/80">Aatrox</span>
      </div>
      <div class="flex-1 h-px bg-primary/10 dark:bg-primary/20" />
    </div>

    <div v-if="!items.length" class="text-zinc-400 text-sm py-4 text-center">
      暂无内容
    </div>

    <div v-else class="space-y-1">
      <template v-for="item in items" :key="item.type === 'article' ? item.data.path : item.data.fullPath">
        <!-- 单篇文章行 -->
        <NuxtLink
          v-if="item.type === 'article'"
          :to="item.data.path"
          class="group flex items-start justify-between gap-2 py-2.5 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0 hover:border-primary/20 transition-colors"
        >
          <span class="text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-primary transition-colors leading-snug line-clamp-2 flex-1">
            {{ item.data.title }}
          </span>
          <span class="text-xs text-zinc-400 shrink-0 mt-0.5">
            {{ formatDate(item.data.date ?? '') }}
          </span>
        </NuxtLink>

        <!-- 分组卡片 -->
        <NuxtLink
          v-else-if="item.type === 'group'"
          :to="`/article?group=${item.data.fullPath}`"
          class="group flex items-center justify-between gap-2 py-2.5 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0 hover:border-primary/20 transition-colors"
        >
          <div class="flex items-center gap-2 min-w-0">
            <Icon name="pixelarticons:folder" class="text-primary/60 shrink-0 w-3.5 h-3.5" />
            <span class="text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-primary transition-colors truncate">
              {{ item.data.name }}
            </span>
            <span class="text-[11px] text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded shrink-0">
              {{ item.data.articles.length }}
            </span>
          </div>
          <span class="text-xs text-zinc-400 shrink-0">
            {{ formatDate(item.data.latestDate) }}
          </span>
        </NuxtLink>
      </template>
    </div>

    <!-- 查看全部 -->
    <NuxtLink
      to="/article"
      class="mt-4 flex items-center gap-1 text-xs text-zinc-400 hover:text-primary transition-colors"
    >
      全部文章
      <Icon name="lucide:arrow-right" class="w-3 h-3" />
    </NuxtLink>
  </div>
</template>
