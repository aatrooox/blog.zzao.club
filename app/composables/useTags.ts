import type { ApiResponse } from '~~/types/fetch'

export interface BlogTag {
  id: string
  tagName: string
  userId: string
  createTs: string
  updatedTs: string
  _count?: {
    memos: number
  }
}

export default function useTags() {
  const { $api } = useNuxtApp()
  const userStore = useUser()
  const toast = useGlobalToast()
  const tags = useState<BlogTag[]>('tags', () => [])

  const { data, status, refresh } = useFetch<ApiResponse<BlogTag[]>>(
    '/api/v1/tag/list',
    {
      immediate: false,
      lazy: true,
    },
  )

  async function getTags() {
    if (status.value === 'pending')
      return
    await refresh()
    tags.value = data.value?.data ?? []
  }

  async function createTag({ tagName, memo_id }: { tagName: string, memo_id?: string }) {
    if (!userStore.isLogin) {
      toast.warn('登录后才能创建标签！')
      return
    }

    if (!userStore.isSuperAdmin) {
      toast.warn('当前仅博主可创建标签～')
      return
    }

    if (tagName) {
      const { error } = await $api.post<ApiResponse<BlogTag>>('/api/v1/tag/create', {
        tag_name: tagName,
        memo_id,
      })

      if (error) {
        toast.error('创建标签失败，再试一下')
        return
      }

      getTags()
      toast.success('标签创建成功')
    }
  }

  async function updateTag(id: string, { tagName, memo_ids }: { tagName: string, memo_ids?: string[] }) {
    if (!userStore.isLogin) {
      toast.warn('登录后才能编辑标签！')
      return
    }

    if (!userStore.isSuperAdmin) {
      toast.warn('当前仅博主可编辑标签～')
      return
    }

    if (tagName) {
      const { error } = await $api.post<ApiResponse<BlogTag>>('/api/v1/tag/update', {
        id,
        tag_name: tagName,
        memo_ids,
      })

      if (error) {
        toast.error('更新标签失败，再试一下')
        return
      }

      getTags()
      toast.success('标签已更新')
    }
  }

  async function deleteTag(id: string) {
    if (!userStore.isLogin) {
      toast.warn('登录后才能删除标签！')
      return
    }

    if (!userStore.isSuperAdmin) {
      toast.warn('当前仅博主可删除标签～')
      return
    }

    const { error } = await $api.post<ApiResponse<BlogTag>>('/api/v1/tag/delete', {
      id,
    })

    if (error) {
      toast.error('删除标签失败，再试一下')
      return
    }

    getTags()
    toast.success('标签已删除')
  }

  return {
    tags,
    status,
    getTags,
    createTag,
    updateTag,
    deleteTag,
  }
}
