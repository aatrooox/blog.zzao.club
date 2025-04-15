<template>
  <ClientOnly>
    <div class="blog-zzao-club-img-component card inline" v-viewer>
      <NuxtImg :src="refinedSrc" loading="lazy" alt="image" :width="width" :height="height"
      placeholder />
    </div>
  </ClientOnly>
</template>
<script lang="ts" setup>
import { withTrailingSlash, withLeadingSlash, joinURL } from 'ufo'
import { useRuntimeConfig, computed } from '#imports'

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: undefined
  },
  height: {
    type: [String, Number],
    default: undefined
  }
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
<style lang="less" scoped></style>