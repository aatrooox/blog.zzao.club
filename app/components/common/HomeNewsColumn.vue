<!-- 头条区块：最新一篇大字排版 + 次新文章小列表 -->
<script setup lang="ts">
import type { Page } from '~/components/common/PagePanel.vue'

defineProps<{
  articles: Page[]
}>()

const { formatDate } = useDayjs()
</script>

<template>
  <div class="pb-6 xl:pb-0">
    <!-- 栏目标题 -->
    <div class="flex items-center gap-3 mb-5">
      <span class="text-[10px] font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500">Latest</span>
      <div class="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
    </div>

    <!-- 无内容占位 -->
    <div v-if="!articles.length" class="text-zinc-400 text-sm py-8 text-center">
      暂无文章
    </div>

    <template v-else>
      <!-- 头条：第一篇，大字排版 -->
      <NuxtLink :to="articles[0].path" class="group block mb-6">
        <div class="space-y-3">
          <!-- 标签 -->
          <div v-if="articles[0].tags?.length" class="flex items-center gap-1.5 flex-wrap">
            <span
              v-for="tag in articles[0].tags.slice(0, 3)"
              :key="tag"
              class="text-[11px] px-2 py-0.5 rounded bg-primary/10 text-primary font-medium"
            >
              {{ tag }}
            </span>
          </div>

          <!-- 大标题 -->
          <h2 class="text-xl xl:text-2xl font-bold text-zinc-800 dark:text-zinc-100 group-hover:text-primary transition-colors leading-tight">
            {{ articles[0].title }}
          </h2>

          <!-- 描述 -->
          <p v-if="articles[0].description" class="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed line-clamp-3">
            {{ articles[0].description }}
          </p>

          <!-- 底部信息 -->
          <div class="flex items-center gap-3">
            <span class="text-xs text-zinc-400">{{ formatDate(articles[0].date ?? '') }}</span>
            <span class="text-xs text-zinc-400 group-hover:text-primary transition-colors flex items-center gap-1">
              阅读全文
              <Icon name="lucide:arrow-right" class="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </NuxtLink>

      <!-- 次新文章列表（第2篇起） -->
      <div v-if="articles.length > 1" class="space-y-1 border-t border-zinc-100 dark:border-zinc-800 pt-4">
        <NuxtLink
          v-for="article in articles.slice(1)"
          :key="article.path"
          :to="article.path"
          class="group flex items-start justify-between gap-2 py-2.5 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0 hover:border-primary/20 transition-colors"
        >
          <span class="text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-primary transition-colors leading-snug line-clamp-2 flex-1">
            {{ article.title }}
          </span>
          <span class="text-xs text-zinc-400 shrink-0 mt-0.5">
            {{ formatDate(article.date ?? '') }}
          </span>
        </NuxtLink>
      </div>
    </template>
  </div>
</template>
