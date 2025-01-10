<template>
  <NuxtImg :src="props.src" loading="lazy" alt="image" :width="width" :height="height"
    :placeholder="img('/placeholder.svg', { sizes: 'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw' })" />
</template>
<script lang="ts" setup>
const props = defineProps<{ src: string | undefined, width?: number | undefined, height?: number | undefined, String?: any }>()

const img = useImage()

</script>