import { NuxtLink } from '../../.nuxt/content/components';
<script lang="ts" setup>
definePageMeta({
  layout: false,
})

useSeoMeta({
  title: 'Memoz｜早早集市',
  description: '基于Api数据实现SSR的页面，一些牢骚，一些知识碎片',
})

const { getMemos, memos, createMemo } = useMemos()
const userStore = useUserStore()
// const { $api } = useNuxtApp()

const tags = ref([])
await getMemos() // Ensure memos are fetched

// Computed property to split memos into two columns for waterfall layout
const columnizedMemos = computed(() => {
  if (!memos.value || memos.value.length === 0) {
    return { left: [], right: [] }
  }
  // Assuming memos are already sorted by time (newest first by default from useMemos)
  // To achieve left-to-right, top-to-bottom with earlier items on the left:
  // We need to sort them oldest first for this distribution logic.
  // If useMemos provides newest first, we might need to reverse or sort them.
  // For now, let's assume they are in the desired chronological order (oldest to newest for this logic)
  // Or, if they are newest first, we can reverse them before splitting.
  const sortedMemos = [...memos.value]// Oldest first for left-to-right distribution

  const leftColumn: typeof memos.value = []
  const rightColumn: typeof memos.value = []

  sortedMemos.forEach((memo, index) => {
    if (index % 2 === 0) {
      leftColumn.push(memo)
    }
    else {
      rightColumn.push(memo)
    }
  })
  return { left: leftColumn, right: rightColumn }
})

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

const userInfo = ref({
  name: 'Memoz',
  avatar: 'https://avatars.githubusercontent.com/u/13368294?v=4',
  memoCount: 128,
  activeDays: 365,
})

// const heatmapData = ref(Array.from({ length: 365 }, (_, i) => ({
//   date: new Date(Date.now() - (365 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
//   count: Math.floor(Math.random() * 5),
// })))

const popularTags = ref([
  { id: '1', name: 'Nuxt', count: 20 },
  { id: '2', name: 'Vue', count: 15 },
  { id: '3', name: 'TypeScript', count: 18 },
  { id: '4', name: 'TailwindCSS', count: 12 },
  { id: '5', name: 'SSR', count: 10 },
])
</script>

<template>
  <div class="memos-page-container min-h-screen bg-gray-100 dark:bg-zinc-900 p-4 flex flex-col md:flex-row gap-4">
    <!-- Left Column: User Info & Stats -->
    <aside class="w-1/4 lg:w-1/5 hidden md:block p-4 bg-white dark:bg-zinc-800 rounded-lg shadow sticky top-4 self-start">
      <div class="user-info text-center">
        <NuxtLink to="/">
          <UserAvatar :user-info="userStore.user" alt="User Avatar" class="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-zinc-300 dark:border-zinc-700" />
        </NuxtLink>
        <h2 class="text-xl font-semibold dark:text-white">
          {{ userStore.user.nickname }}
        </h2>
      </div>
      <div class="stats mt-6 space-y-2">
        <div class="stat-item flex justify-between dark:text-gray-300">
          <span>Memos 发表:</span>
          <span class="font-semibold dark:text-white">{{ userInfo.memoCount }} 条</span>
        </div>
        <div class="stat-item flex justify-between dark:text-gray-300">
          <span>活跃天数:</span>
          <span class="font-semibold dark:text-white">{{ userInfo.activeDays }} 天</span>
        </div>
        <!-- Add more stats as needed -->
      </div>
      <!-- Right sidebar content when lg breakpoint is not met -->
      <div class="md:block lg:hidden mt-6 space-y-6">
        <transition name="slide-down" appear>
          <div class="heatmap-container">
            <h3 class="text-lg font-semibold mb-2 dark:text-white">
              贡献热力图
            </h3>
            <div class="heatmap bg-gray-200 dark:bg-zinc-700 p-2 rounded h-32 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
              <!-- Placeholder for Heatmap Component -->
              热力图占位
              <!-- Example: <GithubHeatmap :data="heatmapData" /> -->
            </div>
          </div>
        </transition>
        <transition name="slide-down" appear>
          <div class="tags-cloud">
            <h3 class="text-lg font-semibold mb-2 dark:text-white">
              热门标签
            </h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="tag in popularTags" :key="tag.id" class="px-2 py-1 bg-sky-100 text-sky-700 dark:bg-sky-700 dark:text-sky-100 rounded-md text-sm cursor-pointer hover:bg-sky-200 dark:hover:bg-sky-600">
                {{ tag.name }} ({{ tag.count }})
              </span>
            </div>
          </div>
        </transition>
      </div>
    </aside>

    <!-- Middle Column: Memo Editor & Memos List -->
    <main class="w-full md:flex-1 md:max-w-3xl md:mx-auto">
      <!-- Compact User Info for Mobile/Small Screens -->
      <div class="compact-user-info md:hidden mb-6 bg-white dark:bg-zinc-800 rounded-lg shadow p-3">
        <div class="flex items-center space-x-3">
          <NuxtLink to="/" class="flex-shrink-0">
            <img :src="userInfo.avatar" alt="User Avatar" class="w-10 h-10 rounded-full border-2 border-zinc-300 dark:border-zinc-700 hover:opacity-80 transition-opacity cursor-pointer">
          </NuxtLink>
          <div class="flex-1 flex items-center space-x-4">
            <h2 class="text-base font-semibold dark:text-white">
              {{ userInfo.name }}
            </h2>
            <div class="flex space-x-3 text-sm text-gray-600 dark:text-gray-400">
              <span class="flex items-center space-x-1">
                <Icon name="material-symbols:edit-note-outline" class="w-4 h-4" />
                <span>{{ userInfo.memoCount }} 条</span>
              </span>
              <span class="flex items-center space-x-1">
                <Icon name="material-symbols:calendar-today-outline" class="w-4 h-4" />
                <span>{{ userInfo.activeDays }} 天</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="memo-editor-wrapper mb-6 z-10">
        <div class="memo-editor mx-auto bg-white dark:bg-zinc-800 rounded-lg shadow p-4">
          <AppTagInput v-model="tags" />
          <AppCommentInput :show-hello="false" input-tip="当前仅博主可发表 Memo" @send="createMemo" />
        </div>
      </div>

      <!-- Modified Memos List Container -->
      <div class="memos-list-container flex flex-col sm:flex-row gap-6">
        <!-- Left Column for Memos -->
        <div class="w-full sm:w-1/2 space-y-6">
          <transition-group appear @enter="onEnter" @leave="onLeave" @before-enter="onBeforeEnter">
            <template v-for="memo in columnizedMemos.left" :key="`left-${memo.id}`">
              <MemoWrap :memo="memo" @refresh="getMemos">
                <MemoPanel :memo="memo" />
              </MemoWrap>
            </template>
          </transition-group>
        </div>
        <!-- Right Column for Memos -->
        <div class="w-full sm:w-1/2 space-y-6">
          <transition-group appear @enter="onEnter" @leave="onLeave" @before-enter="onBeforeEnter">
            <template v-for="memo in columnizedMemos.right" :key="`right-${memo.id}`">
              <MemoWrap :memo="memo" @refresh="getMemos">
                <MemoPanel :memo="memo" />
              </MemoWrap>
            </template>
          </transition-group>
        </div>
      </div>
    </main>

    <!-- Right Column: Heatmap & Tags -->
    <aside class="w-1/4 lg:w-1/5 hidden lg:block p-4 bg-white dark:bg-zinc-800 rounded-lg shadow sticky top-4 self-start">
      <div class="heatmap-container mb-6">
        <h3 class="text-lg font-semibold mb-2 dark:text-white">
          贡献热力图
        </h3>
        <div class="heatmap bg-gray-200 dark:bg-zinc-700 p-2 rounded h-40 flex items-center justify-center text-gray-500 dark:text-gray-400">
          <!-- Placeholder for Heatmap Component -->
          热力图占位
          <!-- Example: <GithubHeatmap :data="heatmapData" /> -->
        </div>
      </div>
      <div class="tags-cloud">
        <h3 class="text-lg font-semibold mb-2 dark:text-white">
          热门标签
        </h3>
        <div class="flex flex-wrap gap-2">
          <span v-for="tag in popularTags" :key="tag.id" class="px-2 py-1 bg-sky-100 text-sky-700 dark:bg-sky-700 dark:text-sky-100 rounded-md text-sm cursor-pointer hover:bg-sky-200 dark:hover:bg-sky-600">
            {{ tag.name }} ({{ tag.count }})
          </span>
        </div>
      </div>
    </aside>
  </div>
</template>

<!-- Removed <style scoped> section -->
