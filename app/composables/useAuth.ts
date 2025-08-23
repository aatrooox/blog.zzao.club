import type { ApiResponse } from '~~/types/fetch'

interface LoginResponse {
  user: any
  accessToken: string
  refreshToken: string
  accessExpiresAt: string
  refreshExpiresAt: string
}

interface RefreshResponse {
  accessToken: string
  expiresAt: string
  message: string
}

export function useAuth() {
  const { $api } = useNuxtApp()
  const userStore = useUser()
  const globalToast = useGlobalToast()

  // 刷新access token
  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshToken = userStore.tokenInfo.value.refreshToken
      if (!refreshToken || userStore.isRefreshTokenExpired.value) {
        console.log('Refresh token 不存在或已过期，需要重新登录')
        userStore.logout()
        return false
      }

      console.log('开始刷新 access token...')
      const response = await $api.post<ApiResponse<RefreshResponse>>('/api/v1/auth/refresh', {
        refreshToken,
      })

      if (response.data) {
        // 更新access token信息
        userStore.setTokenInfo({
          accessToken: response.data.accessToken,
          accessExpiresAt: response.data.expiresAt,
        })
        console.log('Access token 刷新成功')
        return true
      }
      return false
    }
    catch (error: any) {
      console.error('刷新 token 失败:', error)
      userStore.logout()
      globalToast.add({
        type: 'error',
        message: '登录已过期，请重新登录',
      })
      return false
    }
  }

  // 检查并自动刷新token
  const ensureValidToken = async (): Promise<boolean> => {
    // 如果access token未过期，直接返回true
    if (!userStore.isAccessTokenExpired.value) {
      return true
    }

    // 尝试刷新token
    return await refreshToken()
  }

  const login = async (credentials: { username: string, password: string }) => {
    try {
      const response = await $api.post<ApiResponse<LoginResponse>>('/api/v1/user/login', credentials)

      if (response.data) {
        const { user, accessToken, refreshToken, accessExpiresAt, refreshExpiresAt } = response.data

        userStore.setUser(user)
        userStore.setTokenInfo({
          accessToken,
          refreshToken,
          accessExpiresAt,
          refreshExpiresAt,
        })

        globalToast.add({
          type: 'success',
          message: '登录成功！',
        })
        return response.data
      }
    }
    catch (error: any) {
      const errorMessage = error?.data?.message || '登录失败'
      globalToast.add({
        type: 'error',
        message: errorMessage,
      })
      throw error
    }
  }

  return {
    login,
    refreshToken,
    ensureValidToken,
  }
}
