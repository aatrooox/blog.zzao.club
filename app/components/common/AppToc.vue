<script lang="ts" setup>
const props = defineProps<{
  tocData: any[]
}>()

const activeId = ref('')
const observer = ref()

onMounted(async () => {
  await nextTick();
  setTimeout(() => {
    const headings = document.querySelectorAll('.heading')
    observer.value = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      })
    })
    headings.forEach(heading => observer.value.observe(heading))
  }, 100)



})

onUnmounted(() => observer.value?.disconnect())

</script>
<template>
  <div class="toc h-[500px] overflow-y-auto box-border dark:text-zinc-500" :style="{ width: tocData.length ? '200px' : '0'}">
    <ul>
      <template v-for="link in tocData">
        <li
          :class="[`text-sm truncate py-1 pl-4 transition-all duration-300 delay-100`, { 'font-bold active dark:text-zinc-300': link.id === activeId }]">
          <span
            :class="[`absolute left-0 text-zinc-300 dark:text-zinc-500 transition-opacity duration-300 opacity-0`, { 'opacity-100': link.id === activeId }]">#</span>
          <NuxtLink :href="`#${link.id}`"> {{ link.text }} </NuxtLink>
        </li>
        <template v-if="link.children">
          <template v-for="child in link.children">
            <li
              :class="[`text-sm truncate py-1 pl-8 transition-all duration-300 delay-100`, { 'font-bold active dark:text-zinc-300': child.id === activeId }]">
              <span
                :class="[`absolute left-0 text-zinc-300 dark:text-zinc-500 transition-opacity duration-300 opacity-0`, { 'opacity-100': child.id === activeId }]">#</span>
              <NuxtLink :href="`#${child.id}`"> {{ child.text }} </NuxtLink>
            </li>
          </template>

        </template>
      </template>
    </ul>
  </div>
</template>
<style scoped></style>