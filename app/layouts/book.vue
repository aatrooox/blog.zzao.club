<script lang="ts" setup>
</script>

<template>
  <div class="h-full w-full box-border">
    <Toast />
    <Toast group="http" position="top-center" />
    <ScrollTop />
    <slot />
  </div>
</template>
