<script lang="ts" setup>
const props = defineProps<{
  tocData: any[]
}>()

const activeId = ref('')
const observer = ref()

const onEnter = (el) => {
  animate(el, {
    duration: 100,
    ease: 'inOut',
    onComplete: () => {
      animate('.toc-item', {
        x: [
          { to: '30px', ease: 'outExpo', duration: 200 },
          { to: 0, ease: 'outBounce', duration: 200, delay: 150 }
        ],
        opacity: '1',
        duration: 300,
        delay: (_, i) => i * 50,
        ease: 'inOutCirc',
        onComplete: () => {

        }
      })
    }
  })
}
const onBeforeEnter = (el) => {
  el.style.opacity = '0'
}

const onLeave = (el, done) => {
  animate(el, {
    opacity: '0',
    duration: 200,
    delay: 300,
    ease: 'inOut',
    onComplete: () => {
      done()
    }
  })
}


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
  <div class="toc h-[500px] overflow-y-auto box-border dark:text-zinc-500"
    :style="{ width: tocData.length ? '200px' : '0' }">

    <transition-group tag="ul" appear @enter="onEnter" @leave="onLeave" @before-enter="onBeforeEnter">
      <template v-for="link in tocData">
        <li
          :class="[`toc-item text-sm truncate py-1 pl-4 transition-all`, { 'active dark:text-zinc-300': link.id === activeId }]">
          <span :class="[`absolute left-0 text-zinc-300 dark:text-zinc-500`]" v-if="link.id === activeId">#</span>
          <NuxtLink :href="`#${link.id}`" :class="{ '!text-cyan-600': link.id === activeId }"> {{ link.text }}
          </NuxtLink>
        </li>
        <template v-if="link.children">
          <template v-for="child in link.children">
            <li
              :class="[`toc-item text-sm truncate py-1 pl-8 transition-all`, { 'text-cyan-600 active dark:text-zinc-300': child.id === activeId }]">
              <span :class="[`absolute left-0 text-zinc-300 dark:text-zinc-500`,]" v-if="child.id === activeId">#</span>
              <NuxtLink :href="`#${child.id}`" :class="{ '!text-cyan-600': link.id === activeId }"> {{ child.text }}
              </NuxtLink>
            </li>
          </template>

        </template>
      </template>
    </transition-group>
  </div>
</template>
<style scoped></style>