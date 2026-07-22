<script setup lang="ts">
import { computed, useRuntimeConfig } from '#imports'

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => props.id && ((typeof headings?.anchorLinks === 'boolean' && headings?.anchorLinks === true) || (typeof headings?.anchorLinks === 'object' && headings?.anchorLinks?.h2)))
</script>

<template>
  <h2
    :id="props.id"
    class="heading group mt-14 mb-5 scroll-mt-20 text-[1.25em] font-extrabold leading-snug text-[color:inherit]"
  >
    <a
      v-if="props.id && generate"
      :href="`#${props.id}`"
      class="no-underline text-inherit font-extrabold hover:opacity-80 transition-opacity"
    >
      <slot />
    </a>
    <slot v-else />
  </h2>
</template>
