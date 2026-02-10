<script lang="ts" setup>
</script>

<template>
  <div class="clean-layout h-full w-full box-border">
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
