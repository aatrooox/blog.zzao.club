import type { ApiResponse } from '~~/types/fetch'

interface MemoStats {
  count: number
}
export default function useMemos() {
  const memoStats = useState<MemoStats>('memos-stats', () => ({ count: 0 }))

  const { data, status, refresh } = useFetch<ApiResponse<number>>(
    '/api/v1/memo/stats/count',
    {
      immediate: true,
      lazy: true,
    },
  )

  async function getMemoStats() {
    if (status.value === 'pending')
      return
    await refresh()
    console.log(`data.value`, data.value?.data)
    memoStats.value.count = data.value?.data ?? 0
  }

  return {
    memoStats,
    status,
    getMemoStats,
  }
}
