<script lang="ts" setup>
import type { Page } from '~/components/common/PagePanel.vue'
import type { FlatGroup } from '~/composables/usePages'

const route = useRoute()
const router = useRouter()

const activeTags = computed<string[]>(() => {
  const raw = route.query.tag
  if (!raw)
    return []
  if (Array.isArray(raw))
    return raw.filter(Boolean) as string[]
  return [raw as string]
})

const hasTagFilter = computed(() => activeTags.value.length > 0)

useHead({
  title: computed(() => hasTagFilter.value
    ? `${activeTags.value.join(' + ')} 相关文章｜早早集市`
    : '文章｜早早集市'),
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

const { data } = await usePagesWithGroup({
  filter_tags: activeTags,
})

function removeTag(tag: string) {
  const remaining = activeTags.value.filter(t => t !== tag)
  if (remaining.length === 0) {
    router.push({ path: '/article' })
  }
  else {
    router.push({ path: '/article', query: { tag: remaining } })
  }
}

function clearAllTags() {
  router.push({ path: '/article' })
}

function toggleTag(tag: string) {
  const current = activeTags.value
  if (current.includes(tag)) {
    removeTag(tag)
  }
  else {
    router.push({ path: '/article', query: { tag: [...current, tag] } })
  }
}

const monthCN = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

interface GroupNode {
  name: string
  fullPath: string
  level: number
  articles: Page[]
  children: Map<string, GroupNode>
  latestDate: Date
}

function parseGroupHierarchy(pages: Page[]): GroupNode {
  const root: GroupNode = {
    name: 'root',
    fullPath: '',
    level: 0,
    articles: [],
    children: new Map(),
    latestDate: new Date(0),
  }

  pages.forEach((page) => {
    if (!page.group) {
      root.articles.push(page)
      const pageDate = new Date(page.date || 0)
      if (pageDate > root.latestDate) {
        root.latestDate = pageDate
      }
      return
    }

    const parts = page.group.split(':').filter(p => p.trim())
    let currentNode = root

    parts.forEach((part, index) => {
      if (!currentNode.children.has(part)) {
        currentNode.children.set(part, {
          name: part,
          fullPath: parts.slice(0, index + 1).join(':'),
          level: index + 1,
          articles: [],
          children: new Map(),
          latestDate: new Date(0),
        })
      }
      currentNode = currentNode.children.get(part)!
    })

    currentNode.articles.push(page)
    const pageDate = new Date(page.date || 0)
    if (pageDate > currentNode.latestDate) {
      currentNode.latestDate = pageDate
    }

    let ancestorNode = root
    parts.forEach((part) => {
      ancestorNode = ancestorNode.children.get(part)!
      if (pageDate > ancestorNode.latestDate) {
        ancestorNode.latestDate = pageDate
      }
    })
  })

  return root
}

function flattenGroups(root: GroupNode): FlatGroup[] {
  const result: FlatGroup[] = []

  for (const [_, node] of root.children) {
    const allArticles: Page[] = []

    function collectArticles(n: GroupNode) {
      allArticles.push(...n.articles)
      for (const [_, child] of n.children) {
        collectArticles(child)
      }
    }

    collectArticles(node)

    if (allArticles.length > 0) {
      result.push({
        name: node.name,
        fullPath: node.fullPath,
        articles: allArticles,
        latestDate: node.latestDate,
      })
    }
  }

  return result
}

const groupedArticles = computed(() => {
  if (!data.value)
    return []

  const hierarchy = parseGroupHierarchy(data.value)
  const flatGroups = flattenGroups(hierarchy)

  const groups: Record<string, {
    year: number
    month: number
    items: Array<Page | { type: 'group', data: FlatGroup }>
  }> = {}

  hierarchy.articles.forEach((article: Page) => {
    const date = new Date(article.date)
    if (Number.isNaN(date.getTime()))
      return

    const year = date.getFullYear()
    const month = date.getMonth()
    const key = `${year}-${month}`

    if (!groups[key]) {
      groups[key] = { year, month, items: [] }
    }
    groups[key].items.push(article)
  })

  flatGroups.forEach((group) => {
    const date = group.latestDate
    if (Number.isNaN(date.getTime()))
      return

    const year = date.getFullYear()
    const month = date.getMonth()
    const key = `${year}-${month}`

    if (!groups[key]) {
      groups[key] = { year, month, items: [] }
    }
    groups[key].items.push({ type: 'group', data: group })
  })

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

    group.items.sort((a, b) => {
      const dateA = 'type' in a ? a.data.latestDate : new Date(a.date || 0)
      const dateB = 'type' in b ? b.data.latestDate : new Date(b.date || 0)
      return dateB.getTime() - dateA.getTime()
    })

    return {
      ...group,
      monthLabel: monthCN[group.month],
      isFirst: index === 0,
      showYear: index > 0 && (!prevGroup || prevGroup.year !== group.year),
    }
  })
})

const totalCount = computed(() => {
  return groupedArticles.value.reduce((sum, group) => {
    return sum + group.items.reduce((s, item) => s + (isGroupItem(item) ? item.data.articles.length : 1), 0)
  }, 0)
})

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

function isGroupItem(item: any): item is { type: 'group', data: FlatGroup } {
  return item.type === 'group'
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-zinc-950">
    <div class="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <!-- Tag 过滤状态栏 -->
      <div v-if="hasTagFilter" class="mb-8 flex items-center gap-3 flex-wrap">
        <span class="text-sm text-zinc-400 dark:text-zinc-500 shrink-0">筛选</span>
        <div class="flex items-center gap-2 flex-wrap">
          <span
            v-for="tag in activeTags"
            :key="tag"
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
          >
            #{{ tag }}
            <button
              class="w-4 h-4 flex items-center justify-center rounded-full hover:bg-primary/20 transition-colors"
              @click="removeTag(tag)"
            >
              <Icon name="pixelarticons:close" class="w-3 h-3" />
            </button>
          </span>
        </div>
        <button
          class="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors underline underline-offset-2"
          @click="clearAllTags"
        >
          清除全部
        </button>
        <span class="text-xs text-zinc-300 dark:text-zinc-600 font-mono ml-auto">
          {{ totalCount }} 篇
        </span>
      </div>

      <div v-if="groupedArticles.length > 0" class="space-y-8">
        <div v-for="group in groupedArticles" :key="`${group.year}-${group.month}`">
          <!-- === Tag 过滤模式：Tag 名为主标题，年月退为辅助信息 === -->
          <template v-if="hasTagFilter">
            <div v-if="group.isFirst" class="flex items-baseline gap-3 mb-8 pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <span class="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                {{ activeTags.join(' + ') }}
              </span>
              <span class="text-sm text-zinc-400 dark:text-zinc-500 font-mono ml-auto">
                {{ group.year }}.{{ String(group.month + 1).padStart(2, '0') }}
              </span>
            </div>

            <div v-else-if="group.showYear" class="mt-12 mb-6 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <span class="text-2xl font-bold text-zinc-300 dark:text-zinc-700">{{ group.year }}</span>
            </div>

            <div v-if="!group.isFirst" class="flex items-center gap-3 mb-6 mt-8">
              <span class="text-base font-bold text-primary">{{ group.monthLabel }}</span>
              <span class="text-xs text-zinc-400 dark:text-zinc-500 font-mono">{{ group.year }}</span>
              <span class="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
            </div>
          </template>

          <!-- === 默认模式：年份为主标题 === -->
          <template v-else>
            <div v-if="group.isFirst" class="flex items-baseline gap-3 mb-8 pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <span class="text-5xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{{ group.year }}</span>
              <span class="text-2xl font-medium text-zinc-600 dark:text-zinc-400">{{ group.monthLabel }}</span>
              <span class="text-sm text-zinc-400 font-mono">
                {{ group.items.reduce((sum, item) => sum + (isGroupItem(item) ? item.data.articles.length : 1), 0) }}篇
              </span>
            </div>

            <div v-else-if="group.showYear" class="mt-16 mb-8 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <span class="text-4xl font-bold text-zinc-300 dark:text-zinc-700">{{ group.year }}</span>
            </div>

            <div v-if="!group.isFirst" class="flex items-center gap-3 mb-6 mt-8">
              <span class="text-lg font-bold text-primary">{{ group.monthLabel }}</span>
              <span class="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
            </div>
          </template>

          <!-- 文章列表 -->
          <transition-group tag="div" class="space-y-3" appear @enter="onEnter">
            <template v-for="item in group.items" :key="isGroupItem(item) ? `group-${item.data.fullPath}` : item.path">
              <GroupedArticlesCard v-if="isGroupItem(item)" :group="item.data" />

              <NuxtLink v-else :to="item.path" class="block group">
                <div class="py-3 px-4 -mx-4 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors duration-200">
                  <!-- 第一行：作者 badge + 标题 -->
                  <div class="flex items-center gap-2 min-w-0">
                    <span
                      v-if="item.author === 'Jinx'"
                      class="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-500 dark:text-indigo-400 leading-none"
                    >
                      Jinx
                    </span>
                    <span
                      v-else
                      class="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 leading-none"
                    >
                      Aatrox
                    </span>
                    <h3 class="text-base md:text-lg font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-primary transition-colors leading-snug truncate">
                      {{ item.title }}
                    </h3>
                  </div>
                  <!-- 第二行：标签 + 日期 -->
                  <div class="flex items-center gap-3 mt-1 text-xs">
                    <div v-if="item.tags && item.tags.length" class="flex gap-2">
                      <button
                        v-for="tag in item.tags.slice(0, 3)"
                        :key="tag"
                        class="text-zinc-400 dark:text-zinc-500 hover:text-primary transition-colors cursor-pointer"
                        @click.prevent.stop="toggleTag(tag)"
                      >
                        #{{ tag }}
                      </button>
                    </div>
                    <span class="text-zinc-300 dark:text-zinc-600 font-mono ml-auto">
                      <NuxtTime :datetime="item.date" month="numeric" day="numeric" />
                    </span>
                  </div>
                </div>
              </NuxtLink>
            </template>
          </transition-group>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="py-20 text-center">
        <div class="text-zinc-400">
          {{ hasTagFilter ? `没有找到包含 ${activeTags.map(t => `"${t}"`).join(' 和 ')} 标签的文章` : '暂无文章' }}
        </div>
        <button
          v-if="hasTagFilter"
          class="mt-4 text-sm text-primary hover:underline"
          @click="clearAllTags"
        >
          查看全部文章
        </button>
      </div>
    </div>
  </div>
</template>
