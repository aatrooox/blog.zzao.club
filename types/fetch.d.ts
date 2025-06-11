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
  data: T,
  message?: string,
  error?: any
}