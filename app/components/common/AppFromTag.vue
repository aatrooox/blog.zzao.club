<script lang="ts" setup>
const props = defineProps<{
  from: string
}>()

const froms = ref({
  blog: {
    href: 'https://zzao.club',
  },
  zotepad: {
    href: 'https://zzao.club/product/zotepad',
  },
})
</script>

<template>
  <div>
    <NuxtLink
      v-if="froms[props.from]"
      :to="froms[props.from].href"
      class="inline-block px-2 py-1 bg-gray-200 dark:bg-gray-800 text-xs rounded hover:underline"
    >
      {{ props.from }}
    </NuxtLink>
  </div>
</template>

<style scoped>
</style>
