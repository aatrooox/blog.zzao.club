import type { User } from '~~/types/memo'
import { useStorage } from '@vueuse/core'

interface TokenInfo {
  accessToken: string
  refreshToken: string
  accessExpiresAt: string
  refreshExpiresAt: string
}

export function useUser() {
  // 持久化存储
  const userStorage = import.meta.client
    ? useStorage('blog/user', {})
    : ref({})
  const tokenStorage = import.meta.client
    ? useStorage('blog/tokenInfo', {
        accessToken: '',
        refreshToken: '',
        accessExpiresAt: '',
        refreshExpiresAt: '',
      })
    : ref({
        accessToken: '',
        refreshToken: '',
        accessExpiresAt: '',
        refreshExpiresAt: '',
      })

  // 用户状态管理
  const user = useState<User | any>('user', () => {
    if (import.meta.client) {
      const stored = localStorage.getItem('blog/user')
      return stored ? JSON.parse(stored) : {}
    }
    return {}
  })

  // Token信息状态管理
  const tokenInfo = useState<TokenInfo>('tokenInfo', () => {
    if (import.meta.client) {
      const stored = localStorage.getItem('blog/tokenInfo')
      return stored
        ? JSON.parse(stored)
        : {
            accessToken: '',
            refreshToken: '',
            accessExpiresAt: '',
            refreshExpiresAt: '',
          }
    }
    return {
      accessToken: '',
      refreshToken: '',
      accessExpiresAt: '',
      refreshExpiresAt: '',
    }
  })

  // 向后兼容的token getter
  const token = computed(() => tokenInfo.value.accessToken)

  // 检查access token是否过期
  const isAccessTokenExpired = computed(() => {
    if (!tokenInfo.value.accessExpiresAt) {
      return true
    }
    return new Date() >= new Date(tokenInfo.value.accessExpiresAt)
  })

  // 检查refresh token是否过期
  const isRefreshTokenExpired = computed(() => {
    if (!tokenInfo.value.refreshExpiresAt) {
      return true
    }
    return new Date() >= new Date(tokenInfo.value.refreshExpiresAt)
  })

  // 仅在客户端执行，从 localStorage 恢复状态
  if (import.meta.client) {
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

    if (!tokenInfo.value.accessToken) {
      const storedTokenInfo = localStorage.getItem('blog/tokenInfo')
      if (storedTokenInfo) {
        try {
          tokenInfo.value = JSON.parse(storedTokenInfo)
        }
        catch (e) {
          console.error('Failed to parse tokenInfo from localStorage', e)
        }
      }
    }
  }

  // 监听状态变化并同步到localStorage
  if (import.meta.client) {
    watch(user, (newUser) => {
      userStorage.value = newUser
      localStorage.setItem('blog/user', JSON.stringify(newUser))
    }, { deep: true })

    watch(tokenInfo, (newTokenInfo) => {
      tokenStorage.value = newTokenInfo
      localStorage.setItem('blog/tokenInfo', JSON.stringify(newTokenInfo))
    }, { deep: true })
  }

  const setUser = (userData: User) => {
    user.value = userData
  }

  const setTokenInfo = (newTokenInfo: Partial<TokenInfo>) => {
    tokenInfo.value = { ...tokenInfo.value, ...newTokenInfo }
  }

  // 向后兼容的setToken方法
  const setToken = (newToken: string) => {
    tokenInfo.value.accessToken = newToken
  }

  const logout = () => {
    user.value = {}
    tokenInfo.value = {
      accessToken: '',
      refreshToken: '',
      accessExpiresAt: '',
      refreshExpiresAt: '',
    }
  }

  const isLogin = computed(() => {
    return !!(user.value as User).id && !!tokenInfo.value.accessToken
  })

  const getRole = () => (user.value && (user.value as any).role) || ''

  const isVisitor = computed(() => {
    return getRole() === 'visitor'
  })

  const isSuperAdmin = computed(() => {
    return getRole() === 'superAdmin'
  })

  return {
    user: readonly(user),
    token: readonly(token), // 向后兼容
    tokenInfo: readonly(tokenInfo),
    isAccessTokenExpired,
    isRefreshTokenExpired,
    setUser,
    setToken, // 向后兼容
    setTokenInfo,
    isLogin,
    isVisitor,
    isSuperAdmin,
    logout,
  }
}
