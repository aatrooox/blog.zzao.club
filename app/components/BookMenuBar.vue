<template>
  <div
    class="flex items-center justify-between sticky mb-4 top-0 w-full z-[999] h-14 border-b-2 border-b-zinc-800 dark:border-b-zinc-400 dark:bg-zinc-900/10 backdrop-blur-md backdrop-opacity-90">
    <div class="book-name text-xl font-bold">{{ name }}</div>
    <div class="btns font-bold flex items-center gap-4">
      <Button size="small" severity="priamry" @click="navigateTo('/books')">
        <Icon name="icon-park-outline:home"></Icon>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  name?: string | string[]
}
const { name = '名称' } = defineProps<Props>();

const colorMode = useColorMode()
const route = useRoute();
const curLabel = ref('首页')
const modes = ['system', 'light', 'dark']
const index = ref(modes.indexOf(colorMode.preference))

</script>
