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
  background: var(--pixel-bg-card);
  border: 2px solid var(--pixel-border-primary);
  border-radius: 8px;
  box-shadow:
    2px 2px 0 var(--pixel-border-primary),
    4px 4px 0 var(--pixel-bg-tertiary);
  padding: 8px;
}

.pixel-img {
  display: block;
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}
</style>
