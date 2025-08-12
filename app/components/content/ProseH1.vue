<script setup lang="ts">
// const props = defineProps<{ id?: string }>()
const props = defineProps<{ id?: string }>()

// const { headings } = useRuntimeConfig().public.mdc
// const generate = computed(() => props.id && ((typeof headings?.anchorLinks === 'boolean' && headings?.anchorLinks === true) || (typeof headings?.anchorLinks === 'object' && headings?.anchorLinks?.h1)))
</script>

<template>
  <h1
    :id="props.id"
    class="heading text-center my-10 scroll-mt-14 px-3 py-2 !text-2xl font-bold font-mono"
    style="color: oklch(90% 0.03 250); text-shadow: 1px 1px 0 oklch(25% 0.05 250);"
  >
    <slot />
  </h1>
</template>
