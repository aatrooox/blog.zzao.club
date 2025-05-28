import type { Visitor } from "~~/types/blog";
import { Prisma, type User } from '@prisma/client';
export async function createVistorID(visitor: Visitor) {
  const { $api } = useNuxtApp();
  const clientjs = useClientjs()
  const userStore = useUserStore();
  const tokenStore = useTokenStore()

  const res = await $api.post<{ user: User, token: string }>('/api/v1/user/visitor/regist', { visitorId: clientjs.getVisitorId(), visitorName: visitor.name, visitorEmail: visitor.email, visitorWebsite: visitor.website });

  userStore.setUser(res.data.user)
  tokenStore.setToken(res.data.token)
}