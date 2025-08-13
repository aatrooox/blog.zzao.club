import type { Visitor } from '~~/types/blog'
import type { ApiResponse } from '~~/types/fetch'
import type { User } from '~~/types/memo'

export async function createVistorID(visitor: Visitor) {
  const { $api } = useNuxtApp()
  const clientjs = useClientjs()
  const userStore = useUser()

  const res = await $api.post<ApiResponse<{ user: User, token: string }>>('/api/v1/user/visitor/regist', { visitorId: clientjs.getVisitorId(), visitorName: visitor.name, visitorEmail: visitor.email, visitorWebsite: visitor.website })

  userStore.setUser(res.data.user)
  userStore.setToken(res.data.token)
}

/**
 * 将数字转为 k 为单位，如 100 转为 100，1000 转为 1k，1234 转为 1k+
 */
export function formatNumberForView(num: number): string {
  if (num < 1000) {
    return String(num)
  }

  const thousands = Math.floor(num / 1000)
  return `${thousands}k${num % 1000 !== 0 ? '+' : ''}`
}
