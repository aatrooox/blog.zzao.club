<script lang="ts" setup>
const props = defineProps<{
  from: string
}>()

const froms = ref({
  blog: {
    href: '',
  },
  zotepad: {
    href: 'https://zzao.club/product/zotepad',
  },
})
</script>

<template>
  <div>
    <TooltipProvider v-if="froms[props.from]">
      <Tooltip>
        <TooltipTrigger as-child>
          <span
            class="inline-block px-2 py-1 bg-gray-200 dark:bg-gray-800 text-xs rounded hover:underline"
          >
            {{ props.from }}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            来自于 {{ props.from }}<NuxtLink
              v-if="froms[props.from].href"
              :to="froms[props.from].href"
              class="inline-block text-xs ml-1 hover:underline"
            >
              了解更多
            </NuxtLink>
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>

<style scoped>
</style>
