import type { User } from '~~/types/memo'
import { useStorage } from '@vueuse/core'

export function useUser() {
  // 用户状态管理
  const user = useState<User | any>('user', () => {
    if (import.meta.client) {
      return useStorage('blog/user', {}).value
    }
    return {}
  })

  // Token状态管理
  const token = useState<string>('token', () => {
    if (import.meta.client) {
      return useStorage('blog/token', '').value
    }
    return ''
  })

  // 同步到localStorage的方法
  const syncToStorage = () => {
    if (import.meta.client) {
      const userStorage = useStorage('blog/user', {})
      const tokenStorage = useStorage('blog/token', '')
      userStorage.value = user.value
      tokenStorage.value = token.value
    }
  }

  const setUser = (userData: User) => {
    user.value = userData
    syncToStorage()
  }

  const setToken = (newToken: string) => {
    token.value = newToken
    syncToStorage()
  }

  const logout = () => {
    user.value = {}
    token.value = ''
    syncToStorage()
  }

  const isLogin = computed(() => {
    return !!(user.value as User).id
  })

  const isVisitor = computed(() => {
    return user.value.role === 'visitor'
  })

  const isSuperAdmin = computed(() => {
    return user.value.role === 'superAdmin'
  })

  return {
    user: readonly(user),
    token: readonly(token),
    setUser,
    setToken,
    isLogin,
    isVisitor,
    isSuperAdmin,
    logout,
  }
}
