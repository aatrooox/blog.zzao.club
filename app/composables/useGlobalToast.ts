import { ref } from 'vue'
interface ToastMessageOptions {
  type?: 'success' | 'info' | 'contrast' | 'warning' | 'error' | 'promise',
  message: string,
  options?: {
    description?: string,
    action?: Function,
    class?: string,
    style?: Record<string, string>,
    loading?: string,
    success?: Function,
    error?: Function
  }
}
interface ToastState {
  messages: ToastMessageOptions[]
}

const toastState = ref<ToastState>({
  messages: []
})

export function useGlobalToast() {
  const add = (option: ToastMessageOptions) => {
    toastState.value.messages.push(option)
  }

  const warn = (message: string, options?: ToastMessageOptions) => {
    toastState.value.messages.push({
      type: 'warning',
      message,
      ...options
    })
  }

  const success = (message: string, options?: ToastMessageOptions) => {
    toastState.value.messages.push({
      type: 'success',
      message,
      ...options
    })
  }

  const error = (message: string, options?: ToastMessageOptions) => {
    toastState.value.messages.push({
      type: 'error',
      message,
      ...options
    })
  }

  const contrast = (message: string, options?: ToastMessageOptions) => {
    toastState.value.messages.push({
      type: 'contrast',
      message,
      ...options
    })
  }

   const info = (message: string, options?: ToastMessageOptions) => {
    toastState.value.messages.push({
      type: 'info',
      message,
      ...options
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
    contrast,
    clear
  }
}