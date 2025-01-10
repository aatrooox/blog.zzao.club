<template>
  <div :id="props.id" class="my-4 cursor-pointer">
    <span
      class="relative text-black pl-2 py-2 text-lg font-bold before:content-[' '] before:w-1 before:h-4 before:bg-black before:p-0 before:absolute before:left-0 before:top-3 dark:text-zinc-100 dark:before:bg-zinc-100">
      <a v-if="props.id && generate" :href="`#${props.id}`" class="dark:text-zinc-200">
        <slot />
      </a>
      <slot v-else />
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, useRuntimeConfig } from '#imports'

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => props.id && ((typeof headings?.anchorLinks === 'boolean' && headings?.anchorLinks === true) || (typeof headings?.anchorLinks === 'object' && headings?.anchorLinks?.h1)))
</script>