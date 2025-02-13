<template>
  <div :id="props.id" class="heading text-center my-10 scroll-mt-14">
    <span class="text-black px-3 py-2 text-lg font-bold  dark:text-zinc-200 ">
      <a v-if="generate" :href="`#${props.id}`" class="text-xl dark:text-zinc-200">
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