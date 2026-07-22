import type { Page } from '~/components/common/PagePanel.vue'

/** sort 为 1–9 时视为置顶 */
export function isPinnedPage(page: Pick<Page, 'sort'>): boolean {
  const s = page.sort
  return typeof s === 'number' && s >= 1 && s <= 9
}

/** 置顶优先（sort 升序），同档再按 date 降序 */
export function comparePagesByPinThenDate(a: Page, b: Page): number {
  const aPinned = isPinnedPage(a)
  const bPinned = isPinnedPage(b)

  if (aPinned !== bPinned)
    return aPinned ? -1 : 1

  if (aPinned && bPinned) {
    const sa = a.sort ?? 9
    const sb = b.sort ?? 9
    if (sa !== sb)
      return sa - sb
  }

  return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
}

function sortPages(pages: Page[]): Page[] {
  return [...pages].sort(comparePagesByPinThenDate)
}

const pageListFields = [
  'id',
  'path',
  'title',
  'showTitle',
  'date',
  'tags',
  'description',
  'versions',
  'lastmod',
  'meta',
  'author',
  'sort',
  'group',
] as const

export async function usePages(options?: { filter_tags?: string | null, limit?: number }) {
  const filter_tags = options?.filter_tags
  const limit = options?.limit
  const key = `pages-${filter_tags ?? 'all'}-${limit ?? 'all'}`
  const { data, pending, refresh, error } = await useAsyncData(key, async () => {
    let query = queryCollection('content')
    if (filter_tags) {
      query = query.where('tags', 'LIKE', `%${filter_tags}%`)
    }
    // 有 limit 时不能先在 DB 侧 limit：置顶可能被截掉，先全量再排序裁剪
    query = query.order('date', 'DESC')
    const pages = await query.select(...pageListFields).all() as unknown as Page[]
    const sorted = sortPages(pages)
    return limit ? sorted.slice(0, limit) : sorted
  })
  return { data, pending, refresh, error }
}

export async function usePageByPath(path: string) {
  console.log('path', path)
  const key = `page-${path}`
  const { data, pending, refresh, error } = await useAsyncData(key, async () => {
    const result = await queryCollection('content').path(decodeURI(path)).first()
    return result as Page | null
  })
  return { data, pending, refresh, error }
}

function isPageUntagged(page: Pick<Page, 'tags'>): boolean {
  return !page.tags || page.tags.length === 0
}

export async function usePagesWithGroup(options?: {
  filter_tags?: MaybeRef<string[] | null>
  /** 仅无标签文章 */
  untagged?: MaybeRef<boolean>
  limit?: number
}) {
  const filterTags = computed(() => toValue(options?.filter_tags) ?? null)
  const untaggedOnly = computed(() => Boolean(toValue(options?.untagged)))
  const limit = options?.limit
  const key = computed(() =>
    `pages-with-group-${untaggedOnly.value ? 'untagged' : (filterTags.value?.join(',') ?? 'all')}-${limit ?? 'all'}`,
  )

  const { data, pending, refresh, error } = await useAsyncData(key, async () => {
    let query = queryCollection('content')

    const tags = filterTags.value
    // 无标签筛选走全量再过滤（Content 难以表达 empty array）
    if (!untaggedOnly.value && tags && tags.length > 0) {
      for (const tag of tags) {
        query = query.where('tags', 'LIKE', `%${tag}%`)
      }
    }

    query = query.order('date', 'DESC')
    let pages = await query
      .select('id', 'path', 'title', 'date', 'tags', 'group', 'lastmod', 'author', 'sort')
      .all() as unknown as Page[]

    if (untaggedOnly.value)
      pages = pages.filter(isPageUntagged)

    const sorted = sortPages(pages)
    return limit ? sorted.slice(0, limit) : sorted
  }, { watch: [filterTags, untaggedOnly] })

  return { data, pending, refresh, error }
}

// ========== 新增:仅获取分组文章 ==========
export async function useGroupedPages() {
  const key = 'pages-grouped-only'

  const { data, pending, refresh, error } = await useAsyncData(key, async () => {
    // Nuxt Content 不支持 IS NOT NULL,需获取全部后过滤
    const query = queryCollection('content').order('date', 'DESC')
    const allPages = await query
      .select('id', 'path', 'title', 'date', 'tags', 'group', 'lastmod', 'author', 'sort')
      .all() as unknown as Page[]

    return sortPages(allPages.filter(page => page.group))
  })

  return { data, pending, refresh, error }
}

// ========== 新增:按 group 获取文章列表 ==========
export async function usePagesByGroup(groupPath: string) {
  const key = `pages-by-group-${groupPath}`

  const { data, pending, refresh, error } = await useAsyncData(key, async () => {
    const query = queryCollection('content').order('date', 'DESC')
    const allPages = await query
      .select('id', 'path', 'title', 'date', 'tags', 'group', 'lastmod', 'body', 'author', 'sort')
      .all() as unknown as Page[]

    // 匹配完整路径或父级路径
    // 例如: groupPath="Nuxt系列:全栈开发" 应匹配 "Nuxt系列:全栈开发:配置篇"
    return sortPages(allPages.filter(page =>
      page.group && (page.group === groupPath || page.group.startsWith(`${groupPath}:`)),
    ))
  })

  return { data, pending, refresh, error }
}

// ========== 新增:解析 group 层级结构 ==========
export interface GroupNode {
  name: string
  fullPath: string
  level: number
  articles: Page[]
  children: Map<string, GroupNode>
  latestDate: Date // 用于首页排序
}

export function parseGroupHierarchy(pages: Page[]): GroupNode {
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
      return
    }

    const parts = page.group.split(':')
    let current = root
    let path = ''

    parts.forEach((part, index) => {
      path = path ? `${path}:${part}` : part

      if (!current.children.has(part)) {
        current.children.set(part, {
          name: part,
          fullPath: path,
          level: index + 1,
          articles: [],
          children: new Map(),
          latestDate: new Date(0),
        })
      }

      current = current.children.get(part)!

      // 叶子节点才添加文章
      if (index === parts.length - 1) {
        current.articles.push(page)

        // 更新最新日期(用于首页排序)
        const pageDate = new Date(page.date || 0)
        if (pageDate > current.latestDate) {
          current.latestDate = pageDate
        }
      }
    })
  })

  return root
}

// ========== 新增:扁平化分组(用于首页展示) ==========
export interface FlatGroup {
  name: string
  fullPath: string
  articles: Page[]
  latestDate: Date
}

/** 首页信息流条目：单篇 or 合集 */
export type HomeFeedItem
  = | { type: 'article', data: Page }
    | { type: 'group', data: FlatGroup }

/**
 * 按时间线构建首页 feed：
 * 遇到带 group 的文章时，整组合并成一条合集；
 * 无 group 的文章保持单篇。顺序沿用 pages 已有排序（置顶 + 时间）。
 */
export function buildHomeFeedItems(pages: Page[], limit = 25): HomeFeedItem[] {
  // 预聚合：top-level group → 全部文章
  const groupMap = new Map<string, Page[]>()
  for (const page of pages) {
    if (!page.group)
      continue
    const top = page.group.split(':')[0]!
    const list = groupMap.get(top)
    if (list)
      list.push(page)
    else
      groupMap.set(top, [page])
  }
  for (const [key, list] of groupMap)
    groupMap.set(key, sortPages(list))

  const items: HomeFeedItem[] = []
  const seenGroups = new Set<string>()

  for (const page of pages) {
    if (items.length >= limit)
      break

    if (page.group) {
      const top = page.group.split(':')[0]!
      if (seenGroups.has(top))
        continue
      seenGroups.add(top)

      const articles = groupMap.get(top) ?? [page]
      let latestDate = new Date(0)
      for (const p of articles) {
        const d = new Date(p.date || 0)
        if (d > latestDate)
          latestDate = d
      }

      items.push({
        type: 'group',
        data: {
          name: top,
          fullPath: top,
          articles,
          latestDate,
        },
      })
    }
    else {
      items.push({ type: 'article', data: page })
    }
  }

  return items
}

export function flattenGroups(root: GroupNode): FlatGroup[] {
  const result: FlatGroup[] = []

  // 收集某个节点及其所有子孙节点的文章
  function collectAllArticles(node: GroupNode): Page[] {
    const articles = [...node.articles]
    node.children.forEach((child) => {
      articles.push(...collectAllArticles(child))
    })
    return articles
  }

  // 计算节点及其所有子孙节点的最新日期
  function getLatestDate(node: GroupNode): Date {
    let latest = node.latestDate
    node.children.forEach((child) => {
      const childLatest = getLatestDate(child)
      if (childLatest > latest) {
        latest = childLatest
      }
    })
    return latest
  }

  // 只遍历一级分组 (level === 1)
  root.children.forEach((firstLevelNode) => {
    const allArticles = collectAllArticles(firstLevelNode)
    const latestDate = getLatestDate(firstLevelNode)

    if (allArticles.length > 0) {
      result.push({
        name: firstLevelNode.name,
        fullPath: firstLevelNode.fullPath,
        articles: allArticles,
        latestDate,
      })
    }
  })

  return result
}

// ========== Jinx 专栏：按 author 字段过滤 ==========
export async function useJinxArticles(options?: { limit?: number }) {
  const limit = options?.limit ?? 10
  const key = `pages-jinx-${limit}`

  const { data, pending, refresh, error } = await useAsyncData(key, async () => {
    const query = queryCollection('content')
      .where('author', '=', 'Jinx')
      .order('date', 'DESC')
    const pages = await query
      .select('id', 'path', 'title', 'date', 'tags', 'author', 'description', 'sort')
      .all() as unknown as Page[]
    const sorted = sortPages(pages)
    return limit ? sorted.slice(0, limit) : sorted
  })

  return { data, pending, refresh, error }
}
