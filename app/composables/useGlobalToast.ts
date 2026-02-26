import type { ExternalToast } from 'vue-sonner'
import { ref } from 'vue'

type ToastType = 'success' | 'info' | 'warning' | 'error' | 'default'

interface ToastMessageOptions {
  type?: ToastType
  message: string
  options?: ExternalToast
}
interface ToastState {
  messages: ToastMessageOptions[]
}

const toastState = ref<ToastState>({
  messages: [],
})

export function useGlobalToast() {
  const add = (option: ToastMessageOptions) => {
    toastState.value.messages.push(option)
  }

  const warn = (message: string, options?: ExternalToast) => {
    toastState.value.messages.push({
      type: 'warning',
      message,
      options,
    })
  }

  const success = (message: string, options?: ExternalToast) => {
    toastState.value.messages.push({
      type: 'success',
      message,
      options,
    })
  }

  const error = (message: string, options?: ExternalToast) => {
    toastState.value.messages.push({
      type: 'error',
      message,
      options,
    })
  }

  const info = (message: string, options?: ExternalToast) => {
    toastState.value.messages.push({
      type: 'info',
      message,
      options,
    })
  }

  const clear = () => {
    toastState.value.messages = []
  }

  return {
    toastState,
    add,
    success,
    error,
    warn,
    info,
    clear,
  }
}
