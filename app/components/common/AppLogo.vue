<script setup lang="ts">
/**
 * 站点 LOGO：/logo.png（80×80 透明底黑标）
 */
const props = withDefaults(defineProps<{
  /** 显示边长，默认 80 */
  size?: number | string
  circle?: boolean
  label?: string
}>(), {
  size: 80,
  circle: false,
  label: '早早集市',
})

const boxStyle = computed(() => {
  const s = typeof props.size === 'number' ? `${props.size}px` : props.size
  return { width: s, height: s }
})
</script>

<template>
  <span
    class="app-logo inline-flex items-center justify-center shrink-0 select-none overflow-hidden"
    :class="circle ? 'rounded-full' : ''"
    :style="boxStyle"
    role="img"
    :aria-label="label"
  >
    <img
      src="/logo.png"
      :alt="label"
      class="block w-full h-full object-contain pointer-events-none"
      width="80"
      height="80"
      draggable="false"
      decoding="async"
    >
  </span>
</template>
