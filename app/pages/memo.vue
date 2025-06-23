<script lang="ts" setup>
import { useElementSize } from '@vueuse/core'

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

// Ensure memos are loaded on component mount
onMounted(async () => {
  await getMemos() // Ensure memos are fetched
})

// Waterfall layout configuration
interface MemoPosition {
  memo: any
  x: number
  y: number
  width: number
  height: number
}

const containerRef = ref<HTMLElement>()
const { width: containerWidth } = useElementSize(containerRef)

// 高度缓存：存储每个memo的实际测量高度
const heightCache = ref<Map<string, number>>(new Map())

// 防抖计时器
let layoutUpdateTimer: NodeJS.Timeout | null = null
// 布局更新触发器
const layoutTrigger = ref(0)

// 处理高度测量事件
function handleHeightMeasured({ memoId, height }: { memoId: string, height: number }) {
  const previousHeight = heightCache.value.get(memoId)

  // 只有高度变化超过阈值才更新（避免微小变化导致频繁重计算）
  const threshold = 5
  if (previousHeight && Math.abs(previousHeight - height) < threshold) {
    return
  }

  heightCache.value.set(memoId, height)

  // 如果高度发生变化，使用防抖机制触发瀑布流重新计算
  if (previousHeight !== height) {
    // 清除之前的计时器
    if (layoutUpdateTimer) {
      clearTimeout(layoutUpdateTimer)
    }

    // 设置新的计时器，防抖延迟50ms
    layoutUpdateTimer = setTimeout(() => {
      nextTick(() => {
        // 通过更新响应式变量强制重新计算布局
        layoutTrigger.value++
        layoutUpdateTimer = null
      })
    }, 50)
  }
}

// 处理删除事件 - 立即从本地数据中移除
function handleDelete(memoId: string) {
  const index = memos.value.findIndex(memo => memo.id === memoId)
  if (index !== -1) {
    memos.value.splice(index, 1)
    // 同时清除高度缓存
    heightCache.value.delete(memoId)
  }
}

// Get container and card dimensions
function getContainerInfo() {
  const minCardWidth = 280
  const gap = 16
  const containerPadding = 0

  const availableWidth = (containerWidth.value || 800) - containerPadding * 2
  const columns = Math.max(1, Math.floor((availableWidth + gap) / (minCardWidth + gap)))
  const cardWidth = Math.floor((availableWidth - gap * (columns - 1)) / columns)

  return {
    containerWidth: availableWidth,
    cardWidth,
    columns,
    gap,
  }
}

// Calculate waterfall layout positions
const waterfallLayout = computed((): MemoPosition[] => {
  // 依赖layoutTrigger确保高度更新时重新计算
  void layoutTrigger.value

  if (!memos.value || memos.value.length === 0) {
    return []
  }

  const { cardWidth, columns, gap } = getContainerInfo()
  const columnHeights = Array.from({ length: columns }, () => 0)
  const positions: MemoPosition[] = []

  memos.value.forEach((memo) => {
    // Find the shortest column
    const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights))

    // Calculate position
    const x = shortestColumnIndex * (cardWidth + gap)
    const y = columnHeights[shortestColumnIndex] as number

    // Get cached height or estimate
    let cardHeight = heightCache.value.get(memo.id)
    if (!cardHeight) {
      // Estimate height based on content
      const baseHeight = 120 // Base card height (header + padding)

      // More precise content height estimation
      const contentLength = memo.content?.length || 0
      let actualContentHeight = 0

      if (contentLength === 0) {
        actualContentHeight = 20 // Empty content
      }
      else if (contentLength <= 50) {
        actualContentHeight = 30 // Short content
      }
      else if (contentLength <= 200) {
        actualContentHeight = Math.ceil(contentLength / 40) * 24 // Medium content
      }
      else {
        // Long content - more precise calculation
        const estimatedLines = Math.ceil(contentLength / 35) // ~35 chars per line
        actualContentHeight = estimatedLines * 24 // 24px line height
      }

      // Add buffer for long content
      const bufferHeight = contentLength > 1000 ? 50 : 20
      cardHeight = baseHeight + actualContentHeight + bufferHeight
    }

    positions.push({
      memo,
      x,
      y,
      width: cardWidth,
      height: cardHeight,
    })

    // Update column height with boundary check
    if (shortestColumnIndex >= 0 && shortestColumnIndex < columnHeights.length) {
      const currentHeight = columnHeights[shortestColumnIndex] ?? 0
      columnHeights[shortestColumnIndex] = currentHeight + cardHeight + gap
    }
  })

  return positions
})

// Container height based on tallest column
const containerHeight = computed(() => {
  if (waterfallLayout.value.length === 0) {
    return 0
  }

  const { columns, gap } = getContainerInfo()
  const columnHeights = Array.from({ length: columns }, () => 0)

  waterfallLayout.value.forEach((position) => {
    const columnIndex = Math.floor(position.x / (position.width + gap))
    if (columnIndex >= 0 && columnIndex < columnHeights.length) {
      const currentHeight = columnHeights[columnIndex] ?? 0
      columnHeights[columnIndex] = Math.max(currentHeight, position.y + position.height)
    }
  })

  return Math.max(...columnHeights)
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
    scale: [1, 0.8],
    opacity: '0',
    duration: 150,
    ease: 'out',
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

      <!-- Memos waterfall container -->
      <div
        ref="containerRef"
        class="memos-waterfall-container"
        :style="{ height: `${containerHeight}px`, position: 'relative' }"
      >
        <transition-group appear @enter="onEnter" @leave="onLeave" @before-enter="onBeforeEnter">
          <template v-for="position in waterfallLayout" :key="position.memo?.id">
            <MemoWrap
              :memo="position.memo"
              class="memo-item hover:z-50"
              :style="{
                position: 'absolute',
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: `${position.width}px`,
                transition: 'all 0.3s ease',
                zIndex: 1,
              }"
              @refresh="getMemos"
              @height-measured="handleHeightMeasured"
              @delete="handleDelete"
            >
              <MemoPanel :memo="position.memo" />
            </MemoWrap>
          </template>
        </transition-group>
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

<style scoped>
.memos-waterfall-container {
  position: relative;
  width: 100%;
  min-height: 200px;
}

.memo-item {
  box-sizing: border-box;
  overflow: hidden;
}

.memo-item:hover {
  z-index: 50 !important;
}

/* 移除内容高度限制，现在由Wrap组件控制 */

/* Alternative CSS Grid approach (commented out) */
/*
.memos-waterfall-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.memo-item {
  width: 100%;
}
*/
</style>
