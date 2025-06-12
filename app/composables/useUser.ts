import { skipHydrate } from 'pinia'
import { useStorage } from '@vueuse/core'
import type { User } from '@prisma/client'

export const useUserStore = defineStore('user', () => {
  const user = useStorage<User | any>('blog/user', {});
  const token = useStorage<string>('blog/token', '');
  const setUser = (userData: User) => {
    user.value = userData;
  }

  const setToken = (newToken: string) => {
    token.value = newToken;
  }
  const logout = () => {
    user.value = {};
  }

  const isLogin = computed(() => {
    return !!(user.value as User).id;
  })

  const isVisitor = computed(() => {
    return user.value.role === 'visitor'
  })

  const isSuperAdmin = computed(() => {
    return user.value.role === 'superAdmin'
  })

  return {
    user: skipHydrate(user),
    token: skipHydrate(token),
    setUser,
    setToken,
    isLogin,
    isVisitor,
    isSuperAdmin,
    logout
  }
})