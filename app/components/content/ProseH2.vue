<script setup lang="ts">
import { computed, useRuntimeConfig } from '#imports'

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => props.id && ((typeof headings?.anchorLinks === 'boolean' && headings?.anchorLinks === true) || (typeof headings?.anchorLinks === 'object' && headings?.anchorLinks?.h1)))
</script>

<template>
  <div :id="props.id" class="heading mt-16 mb-6 cursor-pointer scroll-mt-20">
    <span class="text-xl font-bold" style="color: var(--pixel-text-primary); text-shadow: 1px 1px 0 var(--pixel-shadow-primary);">
      <a v-if="props.id && generate" :href="`#${props.id}`" class="!font-bold" style="color: var(--pixel-text-primary); text-shadow: 1px 1px 0 var(--pixel-shadow-primary);">
        <slot />
      </a>
      <slot v-else />
    </span>
  </div>
</template>
