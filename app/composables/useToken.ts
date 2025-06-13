import { useStorage } from '@vueuse/core'
import { skipHydrate } from 'pinia'

export const useTokenStore = defineStore('token', () => {
  const token = useStorage<string>('blog/token', '')

  const setToken = (newToken: string) => {
    token.value = newToken
  }

  return {
    token: skipHydrate(token),
    setToken,
  }
})
