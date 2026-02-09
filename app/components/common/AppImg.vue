<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{ src: string | undefined, alt?: string, width?: number | undefined, height?: number | undefined }>()

// const img = useImage()

const derivedAlt = computed(() => {
  if (!props.src)
    return 'image'
  const filename = props.src.split('/').pop()?.split('.')[0] || 'image'
  return decodeURIComponent(filename).replace(/[-_]/g, ' ')
})
</script>

<template>
  <NuxtImg :src="props.src" loading="lazy" :alt="props.alt || derivedAlt" :width="width" :height="height" placeholder />
  <!-- <NuxtImg :src="props.src" loading="lazy" alt="image" :width="width" :height="height"
    :placeholder="img('/placeholder.svg')" /> -->
</template>
