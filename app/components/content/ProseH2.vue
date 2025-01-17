<template>
  <div :id="props.id" class="my-4 cursor-pointer">
    <span
      class="text-black py-1 text-lg font-bold border-b-2 border-black dark:text-zinc-200 dark:border-zinc-200 ">
      <!-- <span class="h2-box w-1 h-4 bg-black !inline-block dark:bg-zinc-100 mr-2"></span> -->
      <a v-if="props.id && generate" :href="`#${props.id}`" class="dark:text-zinc-200">
        #<slot />
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