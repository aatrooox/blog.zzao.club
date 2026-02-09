import type { ApiResponse, PaginatedData } from '~~/types/fetch'
import type { BlogMemosWithUser, BlogMemoWithUser } from '~~/types/memo'

export default function useMemos(options?: { size?: number }) {
  const { $api } = useNuxtApp()
  const userStore = useUser()
  const toast = useGlobalToast()
  const config = useRuntimeConfig()
  const memos = useState<BlogMemosWithUser>('memos', () => [])

  const pageSize = options?.size ?? 15
  const currentPage = ref(1)
  const totalPages = ref(1)
  const total = ref(0)

  const { data, status, refresh } = useFetch<ApiResponse<PaginatedData<BlogMemoWithUser>>>(
    '/api/v1/memo/list',
    {
      baseURL: import.meta.server ? (config.public.apiBase as string) : '',
      query: computed(() => ({
        page: currentPage.value,
        size: pageSize,
      })),
      watch: false,
    },
  )

  // Sync memos state from fetched data
  watch(data, (val) => {
    if (val?.data) {
      if (currentPage.value === 1) {
        memos.value = val.data.list ?? []
      }
      totalPages.value = val.data.totalPages ?? 1
      total.value = val.data.total ?? 0
    }
  }, { immediate: true })

  async function getMemos() {
    currentPage.value = 1
    await refresh()
    if (data.value?.data) {
      memos.value = data.value.data.list ?? []
      totalPages.value = data.value.data.totalPages ?? 1
      total.value = data.value.data.total ?? 0
    }
  }

  const hasMore = computed(() => currentPage.value < totalPages.value)

  async function loadMore() {
    if (!hasMore.value)
      return
    currentPage.value++
    await refresh()
    if (data.value?.data) {
      memos.value = [...memos.value, ...(data.value.data.list ?? [])]
      totalPages.value = data.value.data.totalPages ?? 1
      total.value = data.value.data.total ?? 0
    }
  }

  async function createMemo({ content, tags = [], photos = [] }: { content: string, tags?: any[], photos?: string[] }) {
    if (!userStore.isLogin) {
      toast.warn('登录后才能发送！')
      return false
    }
    if (!userStore.isSuperAdmin) {
      toast.warn('当前仅博主可发表～')
      return false
    }
    if (tags && tags.length > 3) {
      toast.warn('最多只能添加3个标签')
      return false
    }
    if (content) {
      const { error } = await $api.post<ApiResponse<BlogMemoWithUser>>('/api/v1/memo/create', {
        content,
        tags,
        photos,
        user_id: userStore.user.value?.id,
      })
      if (error) {
        // toast.error('出错了，再试一下')
        return false
      }
      getMemos()
      toast.success('已发送一条Memo')
      return true
    }
    return false
  }

  async function updateMemo(id: string, { content, tags = [], photos = [] }: { content: string, tags?: any[], photos?: string[] }) {
    if (!userStore.isLogin) {
      toast.warn('登录后才能编辑！')
      return
    }

    if (!userStore.isSuperAdmin) {
      toast.warn('当前仅博主可编辑～')
      return
    }

    // 检查标签数量限制
    if (tags && tags.length > 3) {
      toast.warn('最多只能添加3个标签')
      return
    }

    if (content) {
      const { error } = await $api.post<ApiResponse<BlogMemoWithUser>>('/api/v1/memo/update', {
        id,
        content,
        tags,
        photos,
      })

      if (error) {
        // toast.error('更新失败，再试一下')
        return
      }

      toast.success('Memo 已更新')
    }
  }
  return {
    memos,
    status,
    getMemos,
    createMemo,
    updateMemo,
    loadMore,
    hasMore,
    total,
  }
}
