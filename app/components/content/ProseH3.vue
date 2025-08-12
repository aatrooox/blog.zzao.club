<script setup lang="ts">
import { computed, useRuntimeConfig } from '#imports'

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => props.id && ((typeof headings?.anchorLinks === 'boolean' && headings?.anchorLinks === true) || (typeof headings?.anchorLinks === 'object' && headings?.anchorLinks?.h1)))
</script>

<template>
  <div :id="props.id" class="heading my-4 cursor-pointer scroll-mt-14">
    <span class="px-2 py-1 text-lg font-bold font-mono" style="color: var(--pixel-text-primary); text-shadow: 1px 1px 0 var(--pixel-shadow-primary);">
      <a v-if="props.id && generate" :href="`#${props.id}`" class="!font-bold font-mono" style="color: var(--pixel-text-primary); text-shadow: 1px 1px 0 var(--pixel-shadow-primary);">
        <slot />
      </a>
      <slot v-else />
    </span>
  </div>
</template>
