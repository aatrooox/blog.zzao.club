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

const derivedAlt = computed(() => {
  if (!props.src)
    return 'image'
  const filename = props.src.split('/').pop()?.split('.')[0] || 'image'
  return decodeURIComponent(filename).replace(/[-_]/g, ' ')
})
</script>

<template>
  <ClientOnly>
    <div v-viewer class="blog-zzao-club-img-component card inline">
      <NuxtImg
        :src="refinedSrc" loading="lazy" :alt="alt || derivedAlt" :width="width" :height="height"
        placeholder
      />
    </div>
  </ClientOnly>
</template>

<style lang="less" scoped></style>
