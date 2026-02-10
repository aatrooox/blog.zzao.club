<script lang="ts" setup>
import { toast, Toaster } from 'vue-sonner'

const globalToast = useGlobalToast()

watch(() => globalToast.toastState.value.messages, (messages) => {
  if (messages.length > 0) {
    messages.forEach((message) => {
      switch (message.type) {
        case 'success':
          toast.success(message.message, message.options as any)
          break
        case 'error':
          toast.error(message.message, message.options as any)
          break
        case 'info':
          toast.info(message.message, message.options as any)
          break
        case 'warning':
          toast.warning(message.message, message.options as any)
          break
        case 'promise':
          toast.promise(message.options as any)
          break
        default:
          toast(message.message, message.options as any)
      }
    })
    globalToast.clear()
  }
}, { deep: true })
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster position="top-right" rich-colors />
</template>
