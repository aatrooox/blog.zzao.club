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
  const username = useSessionStorage<User | null>('blog/user', null);

  const setUserName = (data: User) => {
    username.value = data;
  }

  const logout = () => {
    username.value = null;
  }

  const isLogin = computed(() => {
    return !!username.value;
  })

  return {
    username: skipHydrate(username),
    setUserName,
    isLogin,
    logout
  }
})