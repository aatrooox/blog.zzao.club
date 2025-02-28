import { skipHydrate } from 'pinia'

interface User {
  id: string
  username: string
  password: string
  email: string
  role: string
  avatar_url: string
}

export const useUserStore = defineStore('user', () => {
  const username = useSessionStorage<string | null>('blog/user/name', null);
  const userId = useSessionStorage<string | null>('blog/user/id', null);
  const role = useSessionStorage<string | null>('blog/user/role', null);
  const setUserName = (data: string) => {
    username.value = data;
  }
  const setUserId = (data: string) => {
    userId.value = data;
  }
  const setUserRole = (data: string) => {
    role.value = data;
  }

  const logout = () => {
    username.value = null;
    userId.value = null;
  }

  const isLogin = computed(() => {
    return !!username.value;
  })

  return {
    username: skipHydrate(username),
    userId: skipHydrate(userId),
    role: skipHydrate(role),
    setUserName,
    setUserId,
    setUserRole,
    isLogin,
    logout
  }
})