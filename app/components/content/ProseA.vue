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
    :href="props.href" :target="props.target"
    class="font-bold font-mono border-b-2 border-dashed transition-all duration-200"
    style="color: oklch(70% 0.15 195); border-color: oklch(60% 0.15 195);"
    @mouseover="$event.target.style.color = 'oklch(75% 0.15 195)'; $event.target.style.borderColor = 'oklch(65% 0.15 195)'; $event.target.style.borderStyle = 'solid';"
    @mouseleave="$event.target.style.color = 'oklch(70% 0.15 195)'; $event.target.style.borderColor = 'oklch(60% 0.15 195)'; $event.target.style.borderStyle = 'dashed';"
  >
    <slot />
  </NuxtLink>
</template>
