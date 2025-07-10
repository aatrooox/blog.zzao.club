<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  href: {
    type: String,
    default: '',
  },
  target: {
    type: String as PropType<'_blank' | '_parent' | '_self' | '_top' | (string & object) | null | undefined>,
    default: '_blank',
    required: false,
  },
})
</script>

<template>
  <NuxtLink
    :href="props.href"
    :target="props.target" class="font-bold border-b-2 border-dashed border-zinc-600 hover:border-solid hover:border-zinc-900 dark:border-zinc-300 dark:hover:border-zinc-100 dark:text-zinc-200"
    @click.stop
  >
    <slot />
  </NuxtLink>
</template>
