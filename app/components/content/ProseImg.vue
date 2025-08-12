<script lang="ts" setup>
import { computed, useRuntimeConfig } from '#imports'
import { joinURL, withLeadingSlash, withTrailingSlash } from 'ufo'

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: '',
  },
  width: {
    type: [String, Number],
    default: undefined,
  },
  height: {
    type: [String, Number],
    default: undefined,
  },
})

const refinedSrc = computed(() => {
  if (props.src?.startsWith('/') && !props.src.startsWith('//')) {
    const _base = withLeadingSlash(withTrailingSlash(useRuntimeConfig().app.baseURL))
    if (_base !== '/' && !props.src.startsWith(_base)) {
      return joinURL(_base, props.src)
    }
  }
  return props.src
})
</script>

<template>
  <ClientOnly>
    <div v-viewer class="blog-zzao-club-img-component pixel-img-container">
      <NuxtImg
        :src="refinedSrc" loading="lazy" alt="image" :width="width" :height="height"
        placeholder
        class="pixel-img"
      />
    </div>
  </ClientOnly>
</template>

<style scoped>
.pixel-img-container {
  display: inline-block;
  margin: 16px 0;
  background: oklch(28% 0.05 250);
  border: 2px solid oklch(40% 0.05 250);
  border-radius: 8px;
  box-shadow:
    2px 2px 0 oklch(40% 0.05 250),
    4px 4px 0 oklch(35% 0.05 250);
  padding: 8px;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

.pixel-img {
  display: block;
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}
</style>
