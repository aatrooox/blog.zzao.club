<script lang="ts" setup>
import type { Page } from '~/components/common/PagePanel.vue'
import type { FlatGroup } from '~/composables/usePages'
import { comparePagesByPinThenDate, isPinnedPage } from '~/composables/usePages'

definePageMeta({ layout: 'content' })

const route = useRoute()
const router = useRouter()
const appConfig = useAppConfig()

/** 筛选栏只展示高频 top5 */
const categoryTags = computed(() =>
  (appConfig.tags || []).filter((t: string) => t !== '全部').slice(0, 5),
)

const isUntaggedFilter = computed(() => {
  const u = route.query.untagged
  return u === '1' || u === 'true'
})

const activeTags = computed<string[]>(() => {
  if (isUntaggedFilter.value)
    return []
  const raw = route.query.tag
  if (!raw)
    return []
  if (Array.isArray(raw))
    return raw.filter(Boolean) as string[]
  return [raw as string]
})

const hasTagFilter = computed(() => activeTags.value.length > 0 || isUntaggedFilter.value)

useHead({
  title: computed(() => {
    if (isUntaggedFilter.value)
      return '无标签文章｜早早集市'
    if (activeTags.value.length)
      return `${activeTags.value.join(' + ')} 相关文章｜早早集市`
    return '文章｜早早集市'
  }),
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
  untagged: isUntaggedFilter,
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
  // 与无标签互斥
  if (isUntaggedFilter.value) {
    router.push({ path: '/article', query: { tag: [tag] } })
    return
  }
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

/** 置顶文章（sort 1–9）单独置顶展示，不进入年月分组 */
const pinnedArticles = computed(() => {
  if (!data.value)
    return []
  return data.value
    .filter(page => isPinnedPage(page) && !page.group)
    .sort(comparePagesByPinThenDate)
})

const pinnedPathSet = computed(() => new Set(pinnedArticles.value.map(p => p.path)))

const groupedArticles = computed(() => {
  if (!data.value)
    return []

  // 置顶单篇已单独展示，分组树中排除，避免重复
  const unpinnedPages = data.value.filter(page => !pinnedPathSet.value.has(page.path))
  const hierarchy = parseGroupHierarchy(unpinnedPages)
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
  const grouped = groupedArticles.value.reduce((sum, group) => {
    return sum + group.items.reduce((s, item) => s + (isGroupItem(item) ? item.data.articles.length : 1), 0)
  }, 0)
  return grouped + pinnedArticles.value.length
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
  <div class="site-content">
    <SiteHeader
      variant="article"
      :category-tags="categoryTags"
      :active-tags="activeTags"
      @toggle-tag="toggleTag"
    />

    <div
      v-if="hasTagFilter"
      class="font-sans mb-5 flex items-center justify-between gap-3 text-xs text-zinc-400"
    >
      <span>
        已选
        <span class="text-primary font-medium">
          {{ isUntaggedFilter ? '无标签' : `#${activeTags.join(' + #')}` }}
        </span>
        · {{ totalCount }} 篇
      </span>
      <button
        type="button"
        class="hover:text-primary transition-colors cursor-pointer underline underline-offset-2"
        @click="clearAllTags"
      >
        清除筛选
      </button>
    </div>

    <!-- 置顶区：sort 1–9 的文章固定在列表最上方 -->
    <div v-if="pinnedArticles.length > 0" class="mb-10 space-y-3">
      <div class="flex items-center gap-3 mb-4">
        <span class="font-sans text-xs font-bold tracking-widest uppercase text-amber-600 dark:text-amber-400">
          置顶
        </span>
        <span class="h-px flex-1 bg-amber-200/60 dark:bg-amber-900/40" />
      </div>
      <NuxtLink
        v-for="item in pinnedArticles"
        :key="item.path"
        :to="item.path"
        class="block group"
      >
        <div class="py-3 px-4 -mx-4 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors duration-200">
          <div class="flex items-center gap-2 min-w-0">
            <span
              class="font-sans shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 leading-none"
            >
              置顶
            </span>
            <span
              v-if="item.author === 'Jinx'"
              class="font-sans shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-500 dark:text-indigo-400 leading-none"
            >
              Jinx
            </span>
            <span
              v-else
              class="font-sans shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 leading-none"
            >
              Kairos
            </span>
            <h3 class="text-base md:text-lg font-bold text-[var(--article-text)] group-hover:text-primary transition-colors leading-snug truncate">
              {{ item.title }}
            </h3>
          </div>
          <div class="font-sans flex items-center gap-3 mt-1 text-xs">
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
            <span class="text-zinc-300 dark:text-zinc-600 tabular-nums ml-auto">
              <NuxtTime :datetime="item.date" month="numeric" day="numeric" />
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <div v-if="groupedArticles.length > 0" class="space-y-8">
      <div v-for="group in groupedArticles" :key="`${group.year}-${group.month}`">
        <!-- === Tag 过滤模式：Tag 名为主标题，年月退为辅助信息 === -->
        <template v-if="hasTagFilter">
          <div v-if="group.isFirst" class="flex items-baseline gap-3 mb-6 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <span class="text-2xl font-bold text-[var(--article-text)] tracking-tight">
              {{ isUntaggedFilter ? '无标签' : `#${activeTags.join(' + #')}` }}
            </span>
            <span class="font-sans text-sm text-zinc-400 dark:text-zinc-500 tabular-nums ml-auto">
              {{ totalCount }} 篇 · {{ group.year }}.{{ String(group.month + 1).padStart(2, '0') }}
            </span>
          </div>

          <div v-else-if="group.showYear" class="mt-12 mb-6 pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <span class="text-2xl font-bold text-zinc-300 dark:text-zinc-700">{{ group.year }}</span>
          </div>

          <div v-if="!group.isFirst" class="flex items-center gap-3 mb-6 mt-8">
            <span class="text-base font-bold text-primary">{{ group.monthLabel }}</span>
            <span class="font-sans text-xs text-zinc-400 dark:text-zinc-500 tabular-nums">{{ group.year }}</span>
            <span class="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
          </div>
        </template>

        <!-- === 默认模式：年份为主标题 === -->
        <template v-else>
          <div v-if="group.isFirst" class="flex items-baseline gap-3 mb-8 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <span class="text-5xl font-bold text-[var(--article-text)] tracking-tight">{{ group.year }}</span>
            <span class="text-2xl font-medium text-[var(--article-muted)]">{{ group.monthLabel }}</span>
            <span class="font-sans text-sm text-zinc-400 tabular-nums">
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
                    class="font-sans shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-500 dark:text-indigo-400 leading-none"
                  >
                    Jinx
                  </span>
                  <span
                    v-else
                    class="font-sans shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 leading-none"
                  >
                    Kairos
                  </span>
                  <h3 class="text-base md:text-lg font-bold text-[var(--article-text)] group-hover:text-primary transition-colors leading-snug truncate">
                    {{ item.title }}
                  </h3>
                </div>
                <!-- 第二行：标签 + 日期 -->
                <div class="font-sans flex items-center gap-3 mt-1 text-xs">
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
                  <span class="text-zinc-300 dark:text-zinc-600 tabular-nums ml-auto">
                    <NuxtTime :datetime="item.date" month="numeric" day="numeric" />
                  </span>
                </div>
              </div>
            </NuxtLink>
          </template>
        </transition-group>
      </div>
    </div>

    <!-- 空状态：无置顶且无分组列表时 -->
    <div v-else-if="pinnedArticles.length === 0" class="py-20 text-center">
      <div class="text-zinc-400">
        {{
          isUntaggedFilter
            ? '没有无标签的文章'
            : hasTagFilter
              ? `没有找到包含 ${activeTags.map(t => `"${t}"`).join(' 和 ')} 标签的文章`
              : '暂无文章'
        }}
      </div>
      <button
        v-if="hasTagFilter"
        type="button"
        class="mt-4 text-sm text-primary hover:underline cursor-pointer"
        @click="clearAllTags"
      >
        查看全部文章
      </button>
    </div>
  </div>
</template>
