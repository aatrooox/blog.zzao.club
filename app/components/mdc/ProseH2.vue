<script setup lang="ts">
import { computed, useRuntimeConfig } from '#imports'

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => props.id && ((typeof headings?.anchorLinks === 'boolean' && headings?.anchorLinks === true) || (typeof headings?.anchorLinks === 'object' && headings?.anchorLinks?.h1)))
</script>

<template>
  <div :id="props.id" class="custom-h2 heading mt-16 mb-6 cursor-pointer scroll-mt-20">
    <span class="text-xl font-mono font-bold !text-text-pixel-primary flex items-center gap-2">
      <span class="w-1.5 h-5 bg-accent-pixel-cyan inline-block" />
      <a
        v-if="props.id && generate" :href="`#${props.id}`" class="!font-bold font-mono !no-underline" style="color: var(--pixel-text-primary);"
      >
        <slot />
      </a>
      <slot v-else />
    </span>
  </div>
</template>
