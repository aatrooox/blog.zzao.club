import type { UseFetchOptions } from 'nuxt/app'
// 定义响应数据类型
interface ApiResponse<T = any> {
  data: T
  error?: any
}

// 定义请求方法类型
type HttpMethod = "get" | "post" | "put" | "delete" | "patch" | "head" | "connect" | "options" | "trace" | "GET" | "HEAD" | "PATCH" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | undefined

export default defineNuxtPlugin({
  name: 'custom-fetch',
  async setup() {
      // 创建自定义 fetch 实例
    const $$fetch = {
      // 通用请求方法
      async request<T = any>(
        url: string,
        method: HttpMethod,
        data?: any,
        options?: UseFetchOptions<T>
      ): Promise<ApiResponse<T>> {
        // 合并默认选项和用户选项
        const defaultOptions: UseFetchOptions<T> = {
          method,
          ...options
        }
    
        // 根据请求方法设置数据
        if (method === 'GET') {
          defaultOptions.query = data
        } else {
          defaultOptions.body = data
        }
    
        try {
          // @ts-ignore
          const response: any = await $fetch<T>(url, defaultOptions)
          return { data: response?.data }
        } catch (error: any) {
          // 处理错误
          let errorMessage = '请求失败'
          
          if (error.data?.message) {
            errorMessage = error.data.message
          } else if (error.message) {
            errorMessage = error.message 
          } else {
            errorMessage = error.statusMessage
          }
          
           // 使用全局 toast 显示错误信息
          const globalToast = useGlobalToast()
          globalToast.error(errorMessage)
          
          // 返回错误信息
          return { data: null as any, error }
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
      }
    }

    return {
      provide: {
        api: $$fetch
      }
    }
  }
})