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
      // toast.add({ severity: 'warn', summary: '登录后即可发送', life: 3000 })
      return
    }

    if (!userStore.isSuperAdmin) {
      toast.warn('当前仅博主可发表～')
      return
    }

    if (content) {
      // const content = memoContent.value.replaceAll('`', '\\`')
      const { data, error } = await $api.post<ApiResponse<BlogMemoWithUser>>('/api/v1/memo/create', {
        content,
        tags,
        user_id: userStore.user?.id,
      })

      if (error) {
        // disposeError(error)
        toast.error('出错了，再试一下')
        return
      }

      memos.value.unshift(data)
      toast.success('已发送一条Memo')

      // toast.add({ severity: 'success', summary: '已发送一条Memo', life: 3000 })
    }
  }
  return {
    memos,
    status,
    getMemos,
    createMemo,
  }
}
