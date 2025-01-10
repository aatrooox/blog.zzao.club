<template>
  <!-- <AppBg></AppBg> -->
  <div class="h-full box-border max-w-7xl px-4 lg:w-6xl md:w-3xl m-auto bg-grid-dashed">
    <Toast />
    <Toast group="http" position="top-center" />
    <ScrollTop />
    <div class="m-auto flex gap-5 box-border">
      <!-- <AppMenu></AppMenu> -->
      <div class="w-[100%] md:w-[100%] lg:w-[100%]">
        <AppMenuBar></AppMenuBar>
        <div class="px-4 pb-10 m-auto mb-4 sm:px-8 sm:rounded-lg">
          <main class="max-w-none relative">
            <slot />
          </main>
        </div>
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