<script lang="ts" setup>
/**
 * 全部标签：虚线方块 chip 墙，可点 tag 进入文章筛选；无标签仅展示
 */
definePageMeta({ layout: 'content' })

const appConfig = useAppConfig()

const tagItems = computed(() =>
  ((appConfig as any).tagItems as Array<{ name: string, count: number }> | undefined) ?? [],
)
const untaggedCount = computed(() => Number((appConfig as any).untaggedCount ?? 0))

useHead({
  title: '全部标签｜早早集市',
  meta: [
    {
      name: 'description',
      content: '博客全部文章标签一览',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://zzao.club/tags',
    },
  ],
})
</script>

<template>
  <div class="site-content">
    <SiteHeader
      variant="page"
      title="全部标签"
      :description="`${tagItems.length} 个标签 · 无标签 ${untaggedCount} 篇`"
    />

    <div
      v-if="!tagItems.length && !untaggedCount"
      class="py-16 text-center text-sm text-zinc-400"
    >
      暂无标签
    </div>

    <div
      v-else
      class="font-sans flex flex-wrap gap-2.5"
    >
      <!-- 可点击：#Tag count -->
      <NuxtLink
        v-for="item in tagItems"
        :key="item.name"
        :to="`/article?tag=${encodeURIComponent(item.name)}`"
        class="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md border border-dashed border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-colors"
      >
        <span>#{{ item.name }}</span>
        <span class="tabular-nums text-zinc-400 dark:text-zinc-500 text-xs">{{ item.count }}</span>
      </NuxtLink>

      <!-- 无标签：仅展示，不可点 -->
      <span
        v-if="untaggedCount > 0"
        class="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md border border-dashed border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 cursor-default select-none"
        title="未填写 tags 的文章，仅统计展示"
      >
        <span>无标签</span>
        <span class="tabular-nums text-xs">{{ untaggedCount }}</span>
      </span>
    </div>
  </div>
</template>
