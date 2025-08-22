import type { ApiResponse } from '~~/types/fetch'
import type { BlogMemosWithUser, BlogMemoWithUser } from '~~/types/memo'

export default function useMemos() {
  const { $api } = useNuxtApp()
  const userStore = useUser()
  const toast = useGlobalToast()
  const memos = useState<BlogMemosWithUser>('memos', () => [])

  const { data, status, refresh } = useFetch<ApiResponse<BlogMemosWithUser>>(
    '/api/v1/memo/list',
    {
      immediate: false,
      lazy: true,
    },
  )

  async function getMemos() {
    if (status.value === 'pending')
      return
    await refresh()
    memos.value = data.value?.data ?? []
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
  }
}
