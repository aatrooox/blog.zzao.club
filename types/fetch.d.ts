 import type { FetchError } from 'ofetch'
export interface AppFetchError extends FetchError {
  toast?: {
    severity: string
    summary: string
    life: number
    group: string
  }
}