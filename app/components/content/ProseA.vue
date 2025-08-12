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
    style="color: var(--pixel-accent-cyan); border-color: var(--pixel-accent-cyan-border);"
    @mouseover="$event.target.style.color = 'var(--pixel-accent-cyan-hover)'; $event.target.style.borderColor = 'var(--pixel-accent-cyan-border)'; $event.target.style.borderStyle = 'solid';"
    @mouseleave="$event.target.style.color = 'var(--pixel-accent-cyan)'; $event.target.style.borderColor = 'var(--pixel-accent-cyan-border)'; $event.target.style.borderStyle = 'dashed';"
  >
    <slot />
  </NuxtLink>
</template>
