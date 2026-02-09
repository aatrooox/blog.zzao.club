import type { FetchError } from 'ofetch'

export interface AppFetchError extends FetchError {
  toast?: {
    severity: string
    summary: string
    life: number
    group: string
  }
}

export interface ApiResponse<T = any> {
  data: T
  message?: string
  error?: any
  code?: number // 改为数值类型的错误代码
}

/**
 * 分页数据结构（API 返回的 data 字段）
 */
export interface PaginatedData<T> {
  list: T[]
  total: number
  page: number
  size: number
  totalPages: number
}

declare module 'nuxt/app' {
  interface NuxtApp {
    $api: {
      get: <T = ApiResponse>(url: string, params?: any, options?: UseFetchOptions<T>) => Promise<T>
      post: <T = ApiResponse>(url: string, data?: any, options?: UseFetchOptions<T>) => Promise<T>
      put: <T = ApiResponse>(url: string, data?: any, options?: UseFetchOptions<T>) => Promise<T>
      delete: <T = ApiResponse>(url: string, data?: any, options?: UseFetchOptions<T>) => Promise<T>
    }
  }
}
