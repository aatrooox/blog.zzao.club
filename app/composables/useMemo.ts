import type { ApiResponse } from '~~/types/fetch'
import type { BlogMemoWithUser } from '~~/types/memo'

export default function useMemo(id: string) {
  const { $api } = useNuxtApp()
  const userStore = useUser()
  const toast = useGlobalToast()
  const memo = ref<BlogMemoWithUser | null>(null)

  const { data, status, refresh } = useFetch<ApiResponse<BlogMemoWithUser>>(
    `/api/v1/memo/${id}`,
    {
      server: false,
      lazy: true,
    },
  )

  async function getMemo() {
    if (status.value === 'pending')
      return
    await refresh()
    memo.value = (data.value as ApiResponse<BlogMemoWithUser>)?.data ?? null
  }

  async function deleteMemo() {
    if (!userStore.isLogin) {
      toast.warn('登录后才能删除！')
      return
    }

    if (!userStore.isSuperAdmin) {
      toast.warn('当前仅博主可删除～')
      return
    }

    const { error } = await $api.post<ApiResponse>('/api/v1/memo/del', {
      id,
    })

    if (error) {
      toast.error('删除失败，再试一下')
      return false
    }

    toast.success('Memo 已删除')
    return true
  }

  return {
    memo,
    status,
    getMemo,
    deleteMemo,
  }
}
