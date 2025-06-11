<template>
  <div class="memos">
    <div class="memo-editor mx-auto bg-white mb-4 sticky top-10 z-[60] w-full md:w-[500px]">
      <AppCommentInput ref="commentRef" @send="createMemo" :showHello="false" input-tip="当前仅博主可发表 Memo">
      </AppCommentInput>
    </div>
    <div class="w-full flex flex-col items-center">
      <transition-group appear @enter="onEnter" @leave="onLeave" @before-enter="onBeforeEnter">
        <template v-for="memo in memos" :key="memo.id">
          <div
            class="card w-full md:w-[500px] mb-4 border rounded-sm border-zinc-800 border-b-4 box-border p-4 pb-0 bg-white transition-all duration-200 dark:bg-zinc-800 dark:border-zinc-700 break-inside-avoid">
            <MemoPanel :memo="memo"></MemoPanel>
          </div>
        </template>
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
// definePageMeta({
//   layout: false
// })
useSeoMeta({
  title: 'Memoz｜早早集市',
  description: '基于Api数据实现SSR的页面，一些牢骚，一些知识碎片'
})

const { getMemos, memos, createMemo } = useMemos()
const userStore = useUserStore()
const { $api } = useNuxtApp()

await getMemos()

const onEnter = (el) => {
  animate(el, {
    opacity: [
      { to: '1', delay: 100, duration: 100 }
    ],
    duration: 200,
    // delay: 200,
    ease: 'inOut',
  })
}
const onBeforeEnter = (el) => {
  el.style.opacity = '0'
}

const onLeave = (el, done) => {
  animate(el, {
    scale: [1, 1.1, 1],
    opacity: '0',
    duration: 200,
    delay: 300,
    ease: 'inOut',
    onComplete: () => {
      done && done()
    }
  })
}

</script>
