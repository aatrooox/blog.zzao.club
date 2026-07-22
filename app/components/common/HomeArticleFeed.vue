<script setup lang="ts">
/**
 * 首页单列文章流：简洁竖排列表
 */
import type { Page } from '~/components/common/PagePanel.vue'

const props = defineProps<{
  articles: Page[]
  /** 首条是否大标题展示 */
  featured?: boolean
}>()

const { formatDate } = useDayjs()

const featuredArticle = computed(() => {
  if (!props.featured || !props.articles.length)
    return null
  return props.articles[0]
})

const listArticles = computed(() => {
  if (featuredArticle.value)
    return props.articles.slice(1)
  return props.articles
})
</script>

<template>
  <section>
    <div class="font-sans flex items-center justify-between gap-3 mb-5">
      <h2 class="text-xs font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500">
        最新文章
      </h2>
      <NuxtLink
        to="/article"
        class="text-xs text-zinc-400 hover:text-primary transition-colors inline-flex items-center gap-1"
      >
        全部
        <Icon name="lucide:arrow-right" class="w-3 h-3" />
      </NuxtLink>
    </div>

    <div v-if="!articles.length" class="py-12 text-center text-sm text-zinc-400">
      暂无文章
    </div>

    <div v-else class="space-y-0">
      <!-- 头条（可选） -->
      <NuxtLink
        v-if="featuredArticle"
        :to="featuredArticle.path"
        class="group block pb-6 mb-2 border-b border-zinc-200 dark:border-zinc-800"
      >
        <div v-if="featuredArticle.tags?.length" class="font-sans flex flex-wrap gap-1.5 mb-2.5">
          <span
            v-for="tag in featuredArticle.tags.slice(0, 3)"
            :key="tag"
            class="text-[11px] px-2 py-0.5 rounded-full bg-primary/8 text-primary/90 font-medium"
          >
            {{ tag }}
          </span>
        </div>
        <h3 class="text-xl md:text-2xl font-bold text-[var(--article-text)] group-hover:text-primary transition-colors leading-snug tracking-tight">
          {{ featuredArticle.title }}
        </h3>
        <p
          v-if="featuredArticle.description"
          class="mt-2 text-sm text-[var(--article-muted)] leading-relaxed line-clamp-2"
        >
          {{ featuredArticle.description }}
        </p>
        <div class="font-sans mt-3 flex items-center gap-2 text-xs text-zinc-400">
          <time :datetime="featuredArticle.date">{{ formatDate(featuredArticle.date ?? '') }}</time>
          <span v-if="featuredArticle.author" class="text-zinc-300 dark:text-zinc-600">·</span>
          <span v-if="featuredArticle.author">{{ featuredArticle.author }}</span>
        </div>
      </NuxtLink>

      <!-- 列表 -->
      <ul class="divide-y divide-zinc-100 dark:divide-zinc-800/80">
        <li v-for="article in listArticles" :key="article.path">
          <NuxtLink
            :to="article.path"
            class="group flex items-baseline justify-between gap-4 py-3.5 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 -mx-2 px-2 rounded-md transition-colors"
          >
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 min-w-0">
                <span class="text-[15px] md:text-base font-medium text-[var(--article-text)] group-hover:text-primary transition-colors truncate leading-snug">
                  {{ article.title }}
                </span>
                <span
                  v-if="article.author === 'Jinx'"
                  class="font-sans shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                >
                  Jinx
                </span>
              </div>
              <p
                v-if="article.description"
                class="mt-0.5 text-xs text-[var(--article-muted)] line-clamp-1 hidden sm:block"
              >
                {{ article.description }}
              </p>
            </div>
            <time
              class="font-sans shrink-0 text-xs tabular-nums text-zinc-400 dark:text-zinc-500 pt-0.5"
              :datetime="article.date"
            >
              {{ formatDate(article.date ?? '') }}
            </time>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div class="font-sans mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800">
      <NuxtLink
        to="/article"
        class="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-primary transition-colors"
      >
        浏览全部文章
        <Icon name="lucide:arrow-right" class="w-4 h-4" />
      </NuxtLink>
    </div>
  </section>
</template>
