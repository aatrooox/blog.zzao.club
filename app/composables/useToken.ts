import { skipHydrate } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useTokenStore = defineStore('token', () => {
  const token = useStorage<string>('blog/token', '');

  const setToken = (newToken: string) => {
    token.value = newToken;
  }

  return {
    token: skipHydrate(token),
    setToken
  }
})