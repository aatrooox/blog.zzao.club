<script setup lang="ts">
import { computed, useRuntimeConfig } from '#imports'

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => props.id && ((typeof headings?.anchorLinks === 'boolean' && headings?.anchorLinks === true) || (typeof headings?.anchorLinks === 'object' && headings?.anchorLinks?.h3)))
</script>

<template>
  <h3
    :id="props.id"
    class="heading group mt-8 mb-3 scroll-mt-20 text-[1.125em] font-bold leading-snug text-[color:inherit]"
  >
    <a
      v-if="props.id && generate"
      :href="`#${props.id}`"
      class="no-underline text-inherit font-bold hover:opacity-80 transition-opacity"
    >
      <slot />
    </a>
    <slot v-else />
  </h3>
</template>
