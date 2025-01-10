<template>
  <div class="h-full w-full px-6">
    <Toast />
    <Toast group="http" position="top-center" />
    <ScrollTop />
    <slot></slot>
  </div>

</template>

<script lang="ts" setup>
// const handlePageScroll = (e) => {
//   console.log(`e.target`, e.target.scrollTop)
// }

</script>