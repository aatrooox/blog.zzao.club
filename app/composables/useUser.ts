import { skipHydrate } from 'pinia'
import { useStorage } from '@vueuse/core'
import type { User } from '@prisma/client'

export const useUserStore = defineStore('user', () => {
  const user = useStorage<User | Record<any, any>>('blog/user', {});

  const setUser = (userData: User) => {
    user.value = userData;
  }
  const logout = () => {
    user.value = {};
  }

  const isLogin = computed(() => {
    return !!user.value.id;
  })

  return {
    user: skipHydrate(user),
    setUser,
    isLogin,
    logout
  }
})