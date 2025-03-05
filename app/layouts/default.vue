<template>
  <!-- <AppBg></AppBg> -->
  <div class="h-full box-border max-w-7xl px-4 lg:w-6xl md:w-3xl m-auto bg-grid-dashed">
    <Toast position="top-center">
      <template #container="{ message, closeCallback }">
        <section class="flex flex-col p-4 gap-4 w-full bg-primary/70 rounded-xl">
          <div class="flex items-center gap-2">
            <Icon name="twemoji:grinning-face" v-if="message.severity === 'success'" size="1.5em"></Icon>
            <Icon name="twemoji:grinning-face-with-sweat" v-if="message.severity === 'error'" size="1.5em"></Icon>
            <Icon name="twemoji:saluting-face" v-if="message.severity === 'info'" size="1.5em"></Icon>
            <Icon name="twemoji:angry-face" v-if="message.severity === 'warn'" size="1.5em"></Icon>
            <span class="text-sm font-bold text-zinc-800 dark:text-zinc-200">{{ message.summary }}</span>
          </div>
        </section>
      </template>
    </Toast>
    <Toast group="http" position="top-center" />
    <ScrollTop />
    <div class="m-auto flex gap-5 box-border">
      <!-- <AppMenu></AppMenu> -->
      <div class="w-[100%] md:w-[100%] lg:w-[100%]">
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
// const handlePageScroll = (e) => {
//   console.log(`e.target`, e.target.scrollTop)
// }

</script>