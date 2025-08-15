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
    :target="props.target" class="font-bold !underline-4 !underline-offset-4 !decoration-dashed !text-text-pixel-primary !text-base"
    @click.stop
  >
    <slot />
    <Icon name="pixelarticons:external-link" size="1em" />
  </NuxtLink>
</template>
