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
