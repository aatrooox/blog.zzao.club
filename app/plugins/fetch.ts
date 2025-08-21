import type { UseFetchOptions } from 'nuxt/app'
// 定义响应数据类型
import type { ApiResponse } from '~~/types/fetch'

// 定义请求方法类型
type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'connect' | 'options' | 'trace' | 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | undefined

export default defineNuxtPlugin({
  name: 'custom-fetch',
  async setup() {
    // 是否正在刷新token的标记
    let isRefreshing = false
    // 待重试的请求队列
    let failedQueue: Array<{ resolve: (value: any) => void, reject: (reason: any) => void }> = []

    // 处理队列中的请求
    const processQueue = (error: any, token: string | null = null) => {
      failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
          reject(error)
        }
        else {
          resolve(token)
        }
      })

      failedQueue = []
    }

    // 创建自定义 fetch 实例
    const $api = $fetch.create({
      onRequest: async ({ options }) => {
        const userStore = useUser()

        // 设置Authorization头
        if (userStore.tokenInfo.value.accessToken) {
          options.headers.set('Authorization', `Bearer ${userStore.tokenInfo.value.accessToken}`)
        }
      },

      onResponse: async ({ request, response }) => {
        const userStore = useUser()
        const globalToast = useGlobalToast()

        // 处理业务层面的错误（200状态码 + 错误代码）
        const apiResponse = response._data
        console.log('API响应:', apiResponse)

        if (apiResponse?.code && apiResponse.code !== API_CODES.SUCCESS) {
          const { code, message } = apiResponse

          // 处理认证相关错误
          if ([API_CODES.NO_TOKEN, API_CODES.TOKEN_INVALID, API_CODES.AUTH_FAILED].includes(code)) {
            // 不可刷新的认证错误，直接登出
            userStore.logout()
            globalToast.add({
              message: message || '认证失败，请重新登录',
              type: 'error',
            })
            return
          }

          // 处理token过期（可刷新）
          if (code === API_CODES.TOKEN_EXPIRED) {
            // 如果是refresh接口失败，直接退出登录
            if (request.toString().includes('/api/v1/auth/refresh')) {
              userStore.logout()
              globalToast.add({
                message: '登录已过期，请重新登录',
                type: 'error',
              })
              return
            }

            // 如果当前正在刷新token，将请求加入队列
            if (isRefreshing) {
              return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject })
              })
            }

            // 开始刷新token
            if (userStore.tokenInfo.value.refreshToken && !userStore.isRefreshTokenExpired.value) {
              isRefreshing = true

              try {
                const { refreshToken } = useAuth()
                const success = await refreshToken()

                if (success) {
                  processQueue(null, userStore.tokenInfo.value.accessToken)
                }
                else {
                  throw new Error('Token refresh failed')
                }
              }
              catch (error) {
                processQueue(error, null)
                userStore.logout()
                globalToast.add({
                  message: '登录已过期，请重新登录',
                  type: 'error',
                })
                throw error
              }
              finally {
                isRefreshing = false
              }
            }
            else {
              // refresh token 也过期了，退出登录
              userStore.logout()
              globalToast.add({
                message: '登录已过期，请重新登录',
                type: 'error',
              })
            }
            return
          }

          // 处理权限相关错误
          if ([API_CODES.PERMISSION_DENIED, API_CODES.FORBIDDEN].includes(code)) {
            globalToast.add({
              message: message || '无权限访问',
              type: 'error',
            })
            return
          }

          // 处理其他业务错误
          globalToast.add({
            message: message || '操作失败',
            type: 'error',
          })
        }
      },

      onResponseError: async ({ response }) => {
        const globalToast = useGlobalToast()

        console.error('[useHttp] [network error]', response.status, response._data)

        // 处理真正的网络错误（非200状态码）
        const errorMessage = response?._data?.message || '网络请求失败'
        globalToast.add({ message: errorMessage, type: 'error' })
      },
    })

    const $$fetch = {
      // 通用请求方法
      async request<T = any>(
        url: string,
        method: HttpMethod,
        data?: any,
        options?: UseFetchOptions<T>,
      ): Promise<ApiResponse<T>> {
        // 合并默认选项和用户选项
        const defaultOptions: UseFetchOptions<T> = {
          method,
          ...options ?? {},
        }

        // 根据请求方法设置数据
        if (method === 'GET') {
          defaultOptions.query = data
        }
        else {
          defaultOptions.body = data
        }

        try {
          // @ts-expect-error unkown error
          const response: any = await $api<T>(url, defaultOptions)

          // 检查业务层面的响应
          if (response?.code && response.code !== API_CODES.SUCCESS) {
            // 业务层面的错误，已在 onResponseError 中处理
            return { data: null as any, error: true, code: response.code, message: response.message }
          }

          // 成功响应
          return { data: response?.data || response }
        }
        catch (error: any) {
          // 网络或其他错误
          return { data: null as any, error: true, message: error?.message || '请求失败' }
        }
      },

      // GET 请求
      get<T = any>(url: string, params?: any, options?: UseFetchOptions<T>) {
        return this.request<T>(url, 'GET', params, options)
      },

      // POST 请求
      post<T = any>(url: string, data?: any, options?: UseFetchOptions<T>) {
        return this.request<T>(url, 'POST', data, options)
      },

      // PUT 请求
      put<T = any>(url: string, data?: any, options?: UseFetchOptions<T>) {
        return this.request<T>(url, 'PUT', data, options)
      },

      // DELETE 请求
      delete<T = any>(url: string, data?: any, options?: UseFetchOptions<T>) {
        return this.request<T>(url, 'DELETE', data, options)
      },

      // PATCH 请求
      patch<T = any>(url: string, data?: any, options?: UseFetchOptions<T>) {
        return this.request<T>(url, 'PATCH', data, options)
      },
    }

    return {
      provide: {
        api: $$fetch,
      },
    }
  },
})
