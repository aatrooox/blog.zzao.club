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
