<template>
  <!-- <AppBg></AppBg> -->
  <div class="h-full box-border max-w-7xl px-4 lg:w-6xl md:w-3xl m-auto bg-grid-dashed">
    <Toast position="top-center">
      <template #container="{ message, closeCallback }">
        <section class="flex flex-col p-4 gap-4 w-full bg-primary/70 rounded-xl">
          <div class="flex items-center gap-2">
            <Icon name="twemoji:grinning-face" v-if="message.severity === 'success'" size="1.5em"></Icon>
            <Icon name="twemoji:grinning-face-with-sweat" v-if="message.severity === 'error'" size="1.5em"></Icon>
            <Icon name="twemoji:saluting-face" v-if="message.severity === 'info' || message.severity === 'contrast'" size="1.5em"></Icon>
            <Icon name="twemoji:angry-face" v-if="message.severity === 'warn'" size="1.5em"></Icon>
            <span class="text-sm font-bold dark:text-zinc-200" :class="message.severity === 'contrast' && 'text-zinc-200 dark:text-zinc-800' || 'text-zinc-800'">{{ message.summary }}</span>
          </div>
        </section>
      </template>
    </Toast>
    <Toast group="http" position="top-center" />
    <ScrollTop />
    <div class="m-auto flex gap-5 box-border">
      <!-- <AppMenu></AppMenu> -->
      <div class="w-[100%] md:w-[100%] lg:w-[100%] h-full">
        <AppMenuBar></AppMenuBar>
        <slot />
      </div>
      <div class="hidden sticky top-4 h-screen">
        <!-- <AppMsgFlow></AppMsgFlow> -->
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
const globalToast = useGlobalToast()
const toast = useToast();
import type { ToastMessageOptions } from 'primevue/toast'

watch(() => globalToast.toastState.value.messages, (messages) => {
  if (messages.length > 0) {
    const message = messages[messages.length - 1]
    toast.add(message as ToastMessageOptions)
    globalToast.clear();
  }
}, { deep: true })

</script>