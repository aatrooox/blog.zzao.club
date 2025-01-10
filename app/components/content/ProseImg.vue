<template>
  <div class="blog-zzao-club-img-component card inline">
    <Image alt="Image" preview>
      <template #previewicon>
        <i class="pi pi-search"></i>
      </template>
      <template #image>
        <AppImg :src="refinedSrc" :width="Number(props.width)" :height="Number(props.height)"></AppImg>
      </template>
      <template #preview="slotProps : any">
        <AppImg :src="refinedSrc" :style="slotProps.style" @click="slotProps.onClick">
        </AppImg>
      </template>
    </Image>
  </div>
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