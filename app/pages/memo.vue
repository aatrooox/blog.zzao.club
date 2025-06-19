<script lang="ts" setup>
// definePageMeta({
//   layout: false
// })
useSeoMeta({
  title: 'Memoz｜早早集市',
  description: '基于Api数据实现SSR的页面，一些牢骚，一些知识碎片',
})

const { getMemos, memos, createMemo } = useMemos()
// const userStore = useUserStore()
// const { $api } = useNuxtApp()

const tags = ref([])
await getMemos()

function onEnter(el) {
  animate(el, {
    opacity: [
      { to: '1', delay: 100, duration: 100 },
    ],
    duration: 200,
    // delay: 200,
    ease: 'inOut',
  })
}
function onBeforeEnter(el) {
  el.style.opacity = '0'
}

function onLeave(el, done) {
  animate(el, {
    scale: [1, 1.1, 1],
    opacity: '0',
    duration: 200,
    delay: 300,
    ease: 'inOut',
    onComplete: () => {
      done && done()
    },
  })
}
</script>

<template>
  <div class="memos">
    <div class="memo-editor mx-auto bg-white dark:bg-zinc-800 mb-4 sticky top-10 z-[40] w-full md:w-[500px]">
      <AppTagInput v-model="tags" />
      <AppCommentInput :show-hello="false" input-tip="当前仅博主可发表 Memo" @send="createMemo" />
    </div>
    <div class="w-full flex flex-col items-center">
      <transition-group appear @enter="onEnter" @leave="onLeave" @before-enter="onBeforeEnter">
        <template v-for="memo in memos" :key="memo.id">
          <div
            class="card w-full md:w-[500px] mb-8 border rounded-sm border-zinc-800 border-b-6 border-r-6 box-border px-4 pb-0 bg-white transition-all duration-200 dark:bg-zinc-800 dark:border-zinc-700 break-inside-avoid"
          >
            <div class="w-full h-2 py-2 flex gap-2 justify-end">
              <div class="w-2 h-2 rounded-full bg-zinc-700"></div>
              <div class="w-2 h-2 rounded-full border-2 border-zinc-800"></div>
              <div class="w-2 h-2 rounded-full border-2 border-zinc-800"></div>
            </div>
            <MemoPanel :memo="memo" />
          </div>
        </template>
      </transition-group>
    </div>
  </div>
</template>
