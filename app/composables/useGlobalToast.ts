import { ref } from 'vue'
import type { ToastMessageOptions } from 'primevue/toast'

interface ToastState {
  messages: ToastMessageOptions[]
}

const toastState = ref<ToastState>({
  messages: []
})

export function useGlobalToast() {
  const add = (message: ToastMessageOptions) => {
    toastState.value.messages.push(message)
  }

  const success = (summary: string, detail?: string, life?: number) => {
    add({ severity: 'success', summary, detail, life: life || 3000 })
  }

  const info = (summary: string, detail?: string, life?: number) => {
    add({ severity: 'info', summary, detail, life: life || 3000 })
  }

  const contrast = (summary: string, detail?: string, life?: number) => {
    add({ severity: 'contrast', summary, detail, life: life || 3000 })
  }

  const warn = (summary: string, detail?: string, life?: number) => {
    add({ severity: 'warn', summary, detail, life: life || 3000 })
  }

  const error = (summary: string, detail?: string, life?: number) => {
    add({ severity: 'error', summary, detail, life: life || 3000 })
  }

  const clear = () => {
    toastState.value.messages = []
  }

  return {
    toastState,
    add,
    success,
    info,
    contrast,
    warn,
    error,
    clear
  }
}