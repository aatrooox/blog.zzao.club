import type { Page } from '~/components/common/PagePanel.vue'

export async function usePages(options?: { filter_tags?: string | null, limit?: number }) {
  const filter_tags = options?.filter_tags
  const limit = options?.limit
  const key = `pages-${filter_tags ?? 'all'}-${limit ?? 'all'}`
  const { data, pending, refresh, error } = await useAsyncData(key, async () => {
    let query = queryCollection('content')
    if (filter_tags) {
      query = query.where('tags', 'LIKE', `%${filter_tags}%`)
    }
    query = query.order('date', 'DESC')
    if (limit) {
      query = query.limit(limit)
    }
    return await query.select('id', 'path', 'title', 'showTitle', 'date', 'tags', 'description', 'versions', 'lastmod', 'meta').all() as unknown as Page[]
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

// ========== 新增:获取所有文章(含分组字段) ==========
export async function usePagesWithGroup(options?: { limit?: number }) {
  const limit = options?.limit
  const key = `pages-with-group-${limit ?? 'all'}`

  const { data, pending, refresh, error } = await useAsyncData(key, async () => {
    let query = queryCollection('content')
    query = query.order('date', 'DESC')
    if (limit) {
      query = query.limit(limit)
    }
    return await query.select('id', 'path', 'title', 'date', 'tags', 'group', 'lastmod').all() as unknown as Page[]
  })

  return { data, pending, refresh, error }
}

// ========== 新增:仅获取分组文章 ==========
export async function useGroupedPages() {
  const key = 'pages-grouped-only'

  const { data, pending, refresh, error } = await useAsyncData(key, async () => {
    // Nuxt Content 不支持 IS NOT NULL,需获取全部后过滤
    const query = queryCollection('content').order('date', 'DESC')
    const allPages = await query.select('id', 'path', 'title', 'date', 'tags', 'group', 'lastmod').all() as unknown as Page[]

    return allPages.filter(page => page.group) // 仅保留有 group 的文章
  })

  return { data, pending, refresh, error }
}

// ========== 新增:按 group 获取文章列表 ==========
export async function usePagesByGroup(groupPath: string) {
  const key = `pages-by-group-${groupPath}`

  const { data, pending, refresh, error } = await useAsyncData(key, async () => {
    const query = queryCollection('content').order('date', 'DESC')
    const allPages = await query.select('id', 'path', 'title', 'date', 'tags', 'group', 'lastmod', 'body').all() as unknown as Page[]

    // 匹配完整路径或父级路径
    // 例如: groupPath="Nuxt系列:全栈开发" 应匹配 "Nuxt系列:全栈开发:配置篇"
    return allPages.filter(page =>
      page.group && (page.group === groupPath || page.group.startsWith(`${groupPath}:`)),
    )
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
