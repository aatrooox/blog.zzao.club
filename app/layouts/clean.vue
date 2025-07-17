<script lang="ts" setup>
const globalToast = useGlobalToast()
const { $toast } = useNuxtApp() as any

// 监听全局 toast 状态并触发显示
watch(() => globalToast.toastState.value.messages, (messages) => {
  if (messages.length > 0) {
    messages.forEach((message) => {
      switch (message.type) {
        case 'success':
          $toast.success(message.message, message.options as any)
          break
        case 'error':
          $toast.error(message.message, message.options as any)
          break
        case 'info':
          $toast.info(message.message, message.options as any)
          break
        case 'warning':
          $toast.warning(message.message, message.options as any)
          break
        case 'promise':
          $toast.promise(message.options as any)
          break
        default:
          $toast(message.message, message.options as any)
      }
    })

    globalToast.clear()
  }
}, { deep: true })
</script>

<template>
  <div class="clean-layout h-full w-full box-border">
    <!-- Toast 组件 -->
    <Toaster position="top-right" rich-colors />

    <!-- 页面内容 -->
    <div class="w-full h-full">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.clean-layout {
  /* 可以根据需要添加特定样式 */
  background: var(--background);
  color: var(--foreground);
}
</style>
