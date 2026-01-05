<script setup lang="ts">
import { computed, useRuntimeConfig } from '#imports'

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => props.id && ((typeof headings?.anchorLinks === 'boolean' && headings?.anchorLinks === true) || (typeof headings?.anchorLinks === 'object' && headings?.anchorLinks?.h1)))
</script>

<template>
  <div :id="props.id" class="heading my-4 cursor-pointer scroll-mt-14">
    <span class="py-1 text-lg font-bold">
      <a v-if="props.id && generate" :href="`#${props.id}`" class="!font-bold !no-underline">
        <slot />
      </a>
      <slot v-else />
    </span>
  </div>
</template>
