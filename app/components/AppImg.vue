<template>
  <NuxtImg :src="props.src" loading="lazy" alt="image" :width="width" :height="height"
    placeholder />
    <!-- <NuxtImg :src="props.src" loading="lazy" alt="image" :width="width" :height="height"
    :placeholder="img('/placeholder.svg')" /> -->
</template>
<script lang="ts" setup>
const props = defineProps<{ src: string | undefined, width?: number | undefined, height?: number | undefined, String?: any }>()

const img = useImage()

</script>