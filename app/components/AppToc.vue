<script lang="ts" setup>
const props = defineProps<{
  tocData: any[]
}>()

const activeId = ref('')
const observer = ref()

onMounted(async () => {
  await nextTick();
  setTimeout(() => {
    // 获取所有标题元素
    const headings = document.querySelectorAll('.heading')

    observer.value = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      })
    })
    // 观察所有标题
    headings.forEach(heading => observer.value.observe(heading))
  }, 100)



})

onUnmounted(() => observer.value?.disconnect())

</script>
<template>
  <div
    class="toc fixed h-[50%] right-0 lg:right-0 pc:right-10 xl:right-20 2xl:right-[15%] top-[30%] w-[220px] hidden lg:block box-border dark:text-zinc-500">
    <ul>
      <li v-for="link in tocData"
        :class="[`text-sm truncate py-1 pl-4 transition-all duration-300 delay-100`, { 'font-bold active dark:text-zinc-300': link.id === activeId }]">
        <span
          :class="[`absolute left-0 text-zinc-300 dark:text-zinc-500 transition-opacity duration-300 opacity-0`, { 'opacity-100': link.id === activeId }]">#</span>
        <NuxtLink :href="`#${link.id}`"> {{ link.text }} </NuxtLink>
      </li>
    </ul>
  </div>
</template>
<style scoped></style>