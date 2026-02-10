<script lang="ts" setup>
// settings.vue 已迁移到 /admin/settings 和 /admin/tokens
// 此页面仅做重定向兼容
definePageMeta({
  middleware: [
    function () {
      return navigateTo('/admin/settings', { redirectCode: 301 })
    },
  ],
})
</script>

<template>
  <div />
</template>
