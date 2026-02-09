import type { ApiResponse } from '~~/types/fetch'

interface MemoStats {
  count: number
}
export default function useMemos() {
  const config = useRuntimeConfig()
  const memoStats = useState<MemoStats>('memos-stats', () => ({ count: 0 }))

  const { data, refresh } = useFetch<ApiResponse<number>>(
    '/api/v1/memo/stats/count',
    {
      baseURL: import.meta.server ? (config.public.apiBase as string) : '',
    },
  )

  // Sync state from fetched data
  watch(data, (val) => {
    memoStats.value.count = val?.data ?? 0
  }, { immediate: true })

  async function getMemoStats() {
    await refresh()
    memoStats.value.count = data.value?.data ?? 0
  }

  return {
    memoStats,
    getMemoStats,
  }
}
