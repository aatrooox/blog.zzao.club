import type { ApiResponse } from '~~/types/fetch'

export function useAuth() {
  const { $api } = useNuxtApp()
  const userStore = useUser()
  const globalToast = useGlobalToast()

  const login = async (credentials: { username: string, password: string }) => {
    try {
      const response = await $api.post<ApiResponse<{ user: any, token: string }>>('/api/v1/user/login', credentials)

      if (response.data) {
        userStore.setUser(response.data.user)
        userStore.setToken(response.data.token)
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
  }
}
