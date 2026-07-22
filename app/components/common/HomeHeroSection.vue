<script setup lang="ts">
/** @deprecated 使用 SiteHeader variant="home" */
const props = defineProps<{
  hotTags?: Array<{ name: string, count: number }>
}>()
</script>

<template>
  <SiteHeader
    variant="home"
    :hot-tags="props.hotTags"
  />
</template>
