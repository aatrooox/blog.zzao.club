<script setup lang="ts">
import { computed, useRuntimeConfig } from '#imports'

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => props.id && ((typeof headings?.anchorLinks === 'boolean' && headings?.anchorLinks === true) || (typeof headings?.anchorLinks === 'object' && headings?.anchorLinks?.h1)))
</script>

<template>
  <div :id="props.id" class="heading my-4 cursor-pointer scroll-mt-14">
    <span class="px-2 py-1 text-xl font-bold bg-zinc-800 text-white dark:bg-zinc-200 ">
      <a v-if="props.id && generate" :href="`#${props.id}`" class="!text-zinc-200 dark:!text-zinc-800">
        <slot />
      </a>
      <slot v-else />
    </span>
  </div>
</template>
