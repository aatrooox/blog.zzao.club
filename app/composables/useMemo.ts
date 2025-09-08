import type { ApiResponse } from '~~/types/fetch'
import type { BlogMemoWithUser } from '~~/types/memo'

export default function useMemo(id: string) {
  const { $api } = useNuxtApp()
  const userStore = useUser()
  const toast = useGlobalToast()
  const memo = ref<BlogMemoWithUser | null>(null)
  const isLoading = ref(false)

  // 移除 useFetch，改用直接的 API 调用以获得更好的控制
  async function getMemo() {
    if (isLoading.value || !id)
      return

    isLoading.value = true
    try {
      const { data, error } = await $api.get<ApiResponse<BlogMemoWithUser>>(`/api/v1/memo/${id}`)

      if (!error && data) {
        memo.value = data
      }
      else {
        memo.value = null
        console.warn('Failed to fetch memo:', error)
      }
    }
    catch (err) {
      console.error('Error fetching memo:', err)
      memo.value = null
    }
    finally {
      isLoading.value = false
    }
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

    if (error)
      return false

    toast.success('Memo 已删除')
  }

  return {
    memo,
    isLoading,
    getMemo,
    deleteMemo,
  }
}
