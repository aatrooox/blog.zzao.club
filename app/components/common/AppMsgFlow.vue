<script lang="ts" setup>
const config = useRuntimeConfig()
// const colorMode = useColorMode()
// const modes = ['system', 'light', 'dark']
// const index = ref(modes.indexOf(colorMode.preference))
// const modeIcon = computed(() => {
//   switch (colorMode.preference) {
//     case 'system':
//       return 'icon-park-outline:computer'
//     case 'light':
//       return 'icon-park-outline:sun-one'
//     case 'dark':
//       return 'icon-park-outline:moon'
//     default:
//       return 'icon-park-outline:computer'
//   }
// })
// function toggleDarkMode() {
//   colorMode.preference = modes[(++index.value) % modes.length] as string
// }
</script>

<template>
  <div class="flex flex-col gap-4">
    <Card class="hover-shadow-zinc">
      <template #title>
        <div class="text-xl font-bold">
          V{{ config.public.Z_BLOG_VERSION }}
        </div>
      </template>
    </Card>
  </div>
</template>

<style lang="less" scoped></style>
