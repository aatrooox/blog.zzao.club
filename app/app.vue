<script lang="ts" setup>
import type { ExternalToast } from 'vue-sonner'
import { toast, Toaster } from 'vue-sonner'

const globalToast = useGlobalToast()

watch(() => globalToast.toastState.value.messages, (messages) => {
  if (messages.length > 0) {
    messages.forEach((message) => {
      const options: ExternalToast | undefined = message.options
      switch (message.type) {
        case 'success':
          toast.success(message.message, options)
          break
        case 'error':
          toast.error(message.message, options)
          break
        case 'info':
          toast.info(message.message, options)
          break
        case 'warning':
          toast.warning(message.message, options)
          break
        default:
          toast(message.message, options)
      }
    })
    globalToast.clear()
  }
}, { deep: true })
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster position="top-right" rich-colors />
  </UApp>
</template>
