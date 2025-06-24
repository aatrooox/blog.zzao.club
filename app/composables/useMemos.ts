import type { ApiResponse } from '~~/types/fetch'
import type { BlogMemosWithUser, BlogMemoWithUser } from '~~/types/memo'

export default function useMemos() {
  const { $api } = useNuxtApp()
  const userStore = useUserStore()
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

  async function createMemo({ content, tags = [] }: { content: string, tags?: any[] }) {
    if (!userStore.isLogin) {
      toast.warn('登录后才能发送！')
      return
    }

    if (!userStore.isSuperAdmin) {
      toast.warn('当前仅博主可发表～')
      return
    }

    if (content) {
      const { error } = await $api.post<ApiResponse<BlogMemoWithUser>>('/api/v1/memo/create', {
        content,
        tags,
        user_id: userStore.user?.id,
      })

      if (error) {
        // disposeError(error)
        toast.error('出错了，再试一下')
        return
      }

      // memos.value.unshift(data)
      getMemos()
      toast.success('已发送一条Memo')

      // toast.add({ severity: 'success', summary: '已发送一条Memo', life: 3000 })
    }
  }

  async function updateMemo(id: string, { content, tags = [] }: { content: string, tags?: any[] }) {
    if (!userStore.isLogin) {
      toast.warn('登录后才能编辑！')
      return
    }

    if (!userStore.isSuperAdmin) {
      toast.warn('当前仅博主可编辑～')
      return
    }

    if (content) {
      const { error } = await $api.post<ApiResponse<BlogMemoWithUser>>('/api/v1/memo/update', {
        id,
        content,
        tags,
      })

      if (error) {
        toast.error('更新失败，再试一下')
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
