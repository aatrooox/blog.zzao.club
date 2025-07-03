<script setup lang="ts">
// const props = defineProps<{ id?: string }>()
const props = defineProps<{ id?: string }>()

// const { headings } = useRuntimeConfig().public.mdc
// const generate = computed(() => props.id && ((typeof headings?.anchorLinks === 'boolean' && headings?.anchorLinks === true) || (typeof headings?.anchorLinks === 'object' && headings?.anchorLinks?.h1)))
</script>

<template>
  <h1
    :id="props.id"
    class="heading text-center my-10 scroll-mt-14 text-black px-3 py-2 !text-2xl font-bold  dark:text-zinc-200 "
  >
    <slot />
  </h1>
</template>
