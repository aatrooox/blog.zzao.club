import type { User } from '~~/types/memo'
import { useStorage } from '@vueuse/core'

export function useUser() {
  // 持久化存储
  const userStorage = import.meta.client ? useStorage('blog/user', {}) : ref({})
  const tokenStorage = import.meta.client ? useStorage('blog/token', '') : ref('')

  // 用户状态管理
  const user = useState<User | any>('user', () => {
    if (import.meta.client) {
      // 客户端从 localStorage 读取
      const stored = localStorage.getItem('blog/user')
      return stored ? JSON.parse(stored) : {}
    }
    return {}
  })

  // Token状态管理
  const token = useState<string>('token', () => {
    if (import.meta.client) {
      // 客户端从 localStorage 读取
      return localStorage.getItem('blog/token') || ''
    }
    return ''
  })

  // 仅在客户端执行，用于从 localStorage 恢复状态
  if (import.meta.client) {
    // 页面加载时，如果 user state 为空，则尝试从 localStorage 恢复
    if (!user.value.id) {
      const storedUser = localStorage.getItem('blog/user')
      if (storedUser) {
        try {
          user.value = JSON.parse(storedUser)
        }
        catch (e) {
          console.error('Failed to parse user from localStorage', e)
        }
      }
    }
    // 页面加载时，如果 token state 为空，则尝试从 localStorage 恢复
    if (!token.value) {
      token.value = localStorage.getItem('blog/token') || ''
    }
  }

  // 监听状态变化并同步到localStorage
  if (import.meta.client) {
    watch(user, (newUser) => {
      userStorage.value = newUser
      localStorage.setItem('blog/user', JSON.stringify(newUser))
    }, { deep: true })

    watch(token, (newToken) => {
      tokenStorage.value = newToken
      localStorage.setItem('blog/token', newToken)
    })
  }

  const setUser = (userData: User) => {
    user.value = userData
  }

  const setToken = (newToken: string) => {
    token.value = newToken
  }

  const logout = () => {
    user.value = {}
    token.value = ''
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
