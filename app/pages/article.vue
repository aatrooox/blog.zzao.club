<script lang="ts" setup>
// import type { Page } from '~/components/common/PagePanel.vue'

useHead({
  title: '文章｜早早集市',
  meta: [
    {
      name: 'description',
      content: '全部文章入口，包含Nuxt/NuxtContent最新教程,HonoJS实战教程，Vue3教程',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://zzao.club/article',
    },
  ],
})

const route = useRoute()
const queryTag = computed(() => route.query.tag)

const filter_tags = computed(() => {
  if (queryTag.value) {
    return queryTag.value as string
  }
  else {
    return null
  }
})

const { data } = await usePages({ filter_tags: filter_tags.value })

const monthCN = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

const groupedArticles = computed(() => {
  if (!data.value)
    return []

  const groups: Record<string, { year: number, month: number, articles: any[] }> = {}

  data.value.forEach((article: any) => {
    const date = new Date(article.date)
    // 处理无效日期
    if (Number.isNaN(date.getTime()))
      return

    const year = date.getFullYear()
    const month = date.getMonth()
    const key = `${year}-${month}`

    if (!groups[key]) {
      groups[key] = { year, month, articles: [] }
    }
    groups[key].articles.push(article)
  })

  // 排序：年份倒序，月份倒序
  const sortedKeys = Object.keys(groups).sort((a, b) => {
    const [y1, m1] = a.split('-').map(Number)
    const [y2, m2] = b.split('-').map(Number)
    if (y1 !== y2)
      return y2 - y1
    return m2 - m1
  })

  return sortedKeys.map((key, index) => {
    const group = groups[key]
    const prevGroup = index > 0 ? groups[sortedKeys[index - 1]] : null

    // 组内文章按日期倒序
    group.articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return {
      ...group,
      monthLabel: monthCN[group.month],
      isFirst: index === 0,
      showYear: index > 0 && (!prevGroup || prevGroup.year !== group.year),
    }
  })
})

// 简单的进入动画
function onEnter(el: any) {
  if (typeof animate !== 'undefined') {
    animate(el, {
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 300,
      easing: 'easeOutQuad',
    })
  }
  else {
    el.style.opacity = '1'
    el.style.transform = 'translateY(0)'
  }
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-zinc-950">
    <div class="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <div v-if="groupedArticles.length > 0" class="space-y-8">
        <div v-for="group in groupedArticles" :key="`${group.year}-${group.month}`">
          <!-- 最新月份的大标题 -->
          <div v-if="group.isFirst" class="flex items-baseline gap-3 mb-8 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <span class="text-5xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{{ group.year }}</span>
            <span class="text-2xl font-medium text-zinc-600 dark:text-zinc-400">{{ group.monthLabel }}</span>
            <span class="text-sm text-zinc-400 font-mono">{{ group.articles.length }}篇</span>
          </div>

          <!-- 后续年份的大标题 -->
          <div v-else-if="group.showYear" class="mt-16 mb-8 pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <span class="text-4xl font-bold text-zinc-300 dark:text-zinc-700">{{ group.year }}</span>
          </div>

          <!-- 普通月份标题 (非最新月) -->
          <div v-if="!group.isFirst" class="flex items-center gap-3 mb-6 mt-8">
            <span class="text-lg font-bold text-primary">{{ group.monthLabel }}</span>
            <span class="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
          </div>

          <!-- 文章列表 -->
          <transition-group tag="div" class="space-y-3" appear @enter="onEnter">
            <template v-for="article in group.articles" :key="article.path">
              <NuxtLink :to="article.path" class="block group">
                <div class="py-3 px-4 -mx-4 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors duration-200">
                  <div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 md:gap-4">
                    <!-- 标题 -->
                    <h3 class="text-base md:text-lg font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-primary transition-colors leading-snug">
                      {{ article.title }}
                    </h3>

                    <!-- 信息栏 -->
                    <div class="flex items-center gap-3 shrink-0 text-xs md:text-sm">
                      <!-- Tags -->
                      <div v-if="article.tags && article.tags.length" class="flex gap-2">
                        <span v-for="tag in article.tags.slice(0, 3)" :key="tag" class="text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-500">
                          #{{ tag }}
                        </span>
                      </div>
                      <!-- 时间 -->
                      <span class="text-zinc-300 dark:text-zinc-600 font-mono">
                        <NuxtTime :datetime="article.date" month="numeric" day="numeric" />
                      </span>
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </template>
          </transition-group>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="py-20 text-center text-zinc-400">
        暂无文章
      </div>
    </div>
  </div>
</template>
