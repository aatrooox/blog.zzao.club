<script setup lang="ts">
/**
 * 首页单列文章流：单篇 + 合集混合
 */
import type { Page } from '~/components/common/PagePanel.vue'
import type { HomeFeedItem } from '~/composables/usePages'
import { isPinnedPage } from '~/composables/usePages'

const props = defineProps<{
  items: HomeFeedItem[]
  /** 首条若是单篇，是否大标题展示 */
  featured?: boolean
}>()

const { formatDate } = useDayjs()

const featuredArticle = computed((): Page | null => {
  if (!props.featured || !props.items.length)
    return null
  const first = props.items[0]
  if (first?.type === 'article')
    return first.data
  return null
})

const listItems = computed(() => {
  if (featuredArticle.value)
    return props.items.slice(1)
  return props.items
})

function itemKey(item: HomeFeedItem) {
  return item.type === 'article' ? item.data.path : `group-${item.data.fullPath}`
}
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

    <div v-if="!items.length" class="py-12 text-center text-sm text-zinc-400">
      暂无文章
    </div>

    <div v-else class="space-y-0">
      <!-- 头条（仅首条为单篇时） -->
      <NuxtLink
        v-if="featuredArticle"
        :to="featuredArticle.path"
        class="group block pb-6 mb-2 border-b border-zinc-200 dark:border-zinc-800"
      >
        <div
          v-if="isPinnedPage(featuredArticle) || featuredArticle.tags?.length"
          class="font-sans flex flex-wrap items-center gap-1.5 mb-2.5"
        >
          <span
            v-if="isPinnedPage(featuredArticle)"
            class="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold"
          >
            置顶
          </span>
          <span
            v-for="tag in (featuredArticle.tags ?? []).slice(0, 3)"
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

      <!-- 列表：单篇 + 合集 -->
      <ul class="divide-y divide-zinc-100 dark:divide-zinc-800/80">
        <li v-for="item in listItems" :key="itemKey(item)">
          <!-- 合集：折叠展示，占一行 -->
          <details
            v-if="item.type === 'group'"
            class="group/details py-3.5 -mx-2 px-2 rounded-md open:bg-zinc-50/60 dark:open:bg-zinc-900/30"
          >
            <summary
              class="flex items-baseline justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden"
            >
              <div class="min-w-0 flex-1 flex items-center gap-2">
                <Icon name="lucide:folder" class="w-4 h-4 shrink-0 text-primary/70" />
                <span class="text-[15px] md:text-base font-medium text-[var(--article-text)] truncate leading-snug">
                  {{ item.data.name }}
                </span>
                <span class="font-sans shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary/80 leading-none">
                  合集
                </span>
                <span class="font-sans shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-400 leading-none tabular-nums">
                  {{ item.data.articles.length }} 篇
                </span>
                <Icon
                  name="lucide:chevron-down"
                  class="w-3.5 h-3.5 shrink-0 text-zinc-400 transition-transform group-open/details:rotate-180"
                />
              </div>
              <time
                class="font-sans shrink-0 text-xs tabular-nums text-zinc-400 dark:text-zinc-500 pt-0.5"
                :datetime="item.data.latestDate.toISOString()"
              >
                {{ formatDate(item.data.latestDate) }}
              </time>
            </summary>
            <ul class="mt-2 ml-6 space-y-0 border-l border-zinc-200 dark:border-zinc-800 pl-3">
              <li
                v-for="article in item.data.articles.slice(0, 12)"
                :key="article.path"
              >
                <NuxtLink
                  :to="article.path"
                  class="group flex items-baseline justify-between gap-3 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 -mx-1 px-1 rounded transition-colors"
                >
                  <span class="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-primary transition-colors truncate leading-snug">
                    {{ article.title }}
                  </span>
                  <time
                    class="font-sans shrink-0 text-[11px] tabular-nums text-zinc-400"
                    :datetime="article.date"
                  >
                    {{ formatDate(article.date ?? '') }}
                  </time>
                </NuxtLink>
              </li>
              <li v-if="item.data.articles.length > 12 && item.data.articles[0]?.path" class="pt-1">
                <NuxtLink
                  :to="item.data.articles[0].path"
                  class="text-xs text-zinc-400 hover:text-primary transition-colors"
                >
                  查看更多 {{ item.data.articles.length }} 篇 →
                </NuxtLink>
              </li>
            </ul>
          </details>

          <!-- 单篇 -->
          <NuxtLink
            v-else
            :to="item.data.path"
            class="group flex items-baseline justify-between gap-4 py-3.5 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 -mx-2 px-2 rounded-md transition-colors"
          >
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 min-w-0">
                <span
                  v-if="isPinnedPage(item.data)"
                  class="font-sans shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 leading-none"
                >
                  置顶
                </span>
                <span class="text-[15px] md:text-base font-medium text-[var(--article-text)] group-hover:text-primary transition-colors truncate leading-snug">
                  {{ item.data.title }}
                </span>
                <span
                  v-if="item.data.author === 'Jinx'"
                  class="font-sans shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                >
                  Jinx
                </span>
              </div>
              <p
                v-if="item.data.description"
                class="mt-0.5 text-xs text-[var(--article-muted)] line-clamp-1 hidden sm:block"
              >
                {{ item.data.description }}
              </p>
            </div>
            <time
              class="font-sans shrink-0 text-xs tabular-nums text-zinc-400 dark:text-zinc-500 pt-0.5"
              :datetime="item.data.date"
            >
              {{ formatDate(item.data.date ?? '') }}
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
