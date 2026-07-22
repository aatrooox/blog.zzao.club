<script setup lang="ts">
const props = defineProps<{ id?: string }>()
</script>

<template>
  <h1
    :id="props.id"
    class="heading my-8 scroll-mt-20 text-[1.75em] font-black tracking-tight text-[color:inherit] leading-tight"
  >
    <slot />
  </h1>
</template>
