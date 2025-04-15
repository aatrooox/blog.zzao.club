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

  const clear = () => {
    toastState.value.messages = []
  }

  return {
    toastState,
    add,
    clear
  }
}