<template>
  <div :id="props.id" class="heading mt-16 mb-6 cursor-pointer scroll-mt-20">
    <span class="text-xl font-bold ">
      <a v-if="props.id && generate" :href="`#${props.id}`" class="!text-zinc-800 dark:!text-zinc-200">
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