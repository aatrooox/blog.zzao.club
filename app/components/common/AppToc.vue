<script lang="ts" setup>
defineProps<{
  tocData: any[]
}>()

const activeId = ref('')
const observer = ref()

function onEnter(el) {
  animate(el, {
    duration: 100,
    ease: 'inOut',
    onComplete: () => {
      animate('.toc-item', {
        x: [
          { to: '30px', ease: 'outExpo', duration: 200 },
          { to: 0, ease: 'outBounce', duration: 200, delay: 150 },
        ],
        opacity: '1',
        duration: 300,
        delay: (_, i) => i * 50,
        ease: 'inOutCirc',
        onComplete: () => {
        },
      })
    },
  })
}
function onBeforeEnter(el) {
  el.style.opacity = '0'
}

function onLeave(el, done) {
  animate(el, {
    opacity: '0',
    duration: 200,
    delay: 300,
    ease: 'inOut',
    onComplete: () => {
      done()
    },
  })
}

onMounted(async () => {
  await nextTick()
  setTimeout(() => {
    const headings = document.querySelectorAll('.heading')
    observer.value = new IntersectionObserver((_entries) => {
      // 重新检查所有标题的可见性，而不仅仅是状态变化的标题
      const allHeadings = document.querySelectorAll('.heading')
      const visibleHeadings = Array.from(allHeadings)
        .map((heading) => {
          const rect = heading.getBoundingClientRect()
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0
          return {
            id: heading.id,
            top: rect.top,
            isVisible,
          }
        })
        .filter(heading => heading.isVisible)
        .sort((a, b) => a.top - b.top) // 按照距离顶部的位置排序

      // 如果有可见的标题，选择最顶部的那个
      if (visibleHeadings.length > 0) {
        activeId.value = visibleHeadings[0]?.id || ''
      }
    })
    headings.forEach(heading => observer.value.observe(heading))
  }, 100)
})

onUnmounted(() => observer.value?.disconnect())
</script>

<template>
  <div
    class="toc h-[500px] overflow-y-auto box-border dark:text-zinc-500"
    :style="{ width: tocData.length ? '200px' : '0' }"
  >
    <transition-group tag="ul" appear @enter="onEnter" @leave="onLeave" @before-enter="onBeforeEnter">
      <template v-for="link in tocData" :key="link.id">
        <li
          class="toc-item text-sm truncate py-1 pl-4" :class="[{ 'active dark:text-zinc-300': link.id === activeId }]"
        >
          <!-- <span v-if="link.id === activeId" class="absolute -left-2 text-zinc-300 dark:text-zinc-500">#  </span> -->
          <NuxtLink :href="`#${link.id}`" class="transition-all" :class="[link.id === activeId && '!text-cyan-600 !font-bold !underline underline-cyan-600 underline-offset-4']">
            {{ link.text }}
          </NuxtLink>
        </li>
        <template v-if="link.children">
          <template v-for="child in link.children" :key="child.id">
            <li
              class="toc-item text-sm truncate py-1 !pl-6 transition-all" :class="[{ 'text-cyan-600 active dark:text-zinc-300': child.id === activeId }]"
            >
              <!-- <span v-if="child.id === activeId" class="absolute -left-2 text-zinc-300 dark:text-zinc-500">#</span> -->
              <NuxtLink :href="`#${child.id}`" :class="[child.id === activeId && '!text-cyan-600 !font-bold !underline underline-cyan-600 underline-offset-4']">
                {{ child.text }}
              </NuxtLink>
            </li>
          </template>
        </template>
      </template>
    </transition-group>
  </div>
</template>

<style scoped>
</style>
