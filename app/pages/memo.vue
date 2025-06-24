<script lang="ts" setup>
import { useElementSize } from '@vueuse/core'

definePageMeta({
  layout: 'memo',
})

useSeoMeta({
  title: 'Memoz｜早早集市',
  description: '基于Api数据实现SSR的页面，一些日常记录、知识碎片、其他平台的摘录',
})
// 集中式高度管理
const resizeObserver = ref<ResizeObserver | null>(null)
const isMemosReady = ref(false)
const pendingMeasurements = ref(new Set<string>())
const containerRef = ref<HTMLElement>()
const { width: containerWidth } = useElementSize(containerRef)

// 高度缓存：存储每个memo的实际测量高度
const heightCache = ref<Map<string, number>>(new Map())

// 防抖计时器
let layoutUpdateTimer: NodeJS.Timeout | null = null
// 布局更新触发器ull
const layoutTrigger = ref(0)
const { getMemos, memos, createMemo, updateMemo } = useMemos()

const tags = ref([])

// 编辑相关状态
const isEditDrawerOpen = ref(false)
const editingMemo = ref<any>(null)
const editTags = ref([])

// Ensure memos are loaded on component mount
onMounted(async () => {
  await getMemos() // 在客户端获取数据
  initResizeObserver() // 初始化ResizeObserver
})

// 监听memos数组变化，统一管理高度测量
watch(memos, (newMemos) => {
  if (newMemos && newMemos.length > 0) {
    isMemosReady.value = true
    // 等待DOM渲染完成后统一观察所有memo元素
    nextTick(() => {
      observeAllMemoElements()
    })
  }
}, { immediate: true })

// 统一观察所有memo元素
function observeAllMemoElements() {
  if (!resizeObserver.value) {
    return
  }

  // 查找所有memo元素并开始观察
  const memoElements = document.querySelectorAll('.memo-item')
  memoElements.forEach((element) => {
    const memoId = element.getAttribute('data-memo-id')
    if (memoId && element instanceof HTMLElement) {
      observeMemoElement(element, memoId)
    }
  })
}

// 组件卸载时清理
onUnmounted(() => {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect()
    resizeObserver.value = null
  }
  if (layoutUpdateTimer) {
    clearTimeout(layoutUpdateTimer)
    layoutUpdateTimer = null
  }
})

// Waterfall layout configuration
interface MemoPosition {
  memo: any
  x: number
  y: number
  width: number
  height: number
}

// 批量更新高度
function batchUpdateHeights(measurements: { memoId: string, height: number }[]) {
  let hasChanges = false
  const threshold = 5

  measurements.forEach(({ memoId, height }) => {
    const previousHeight = heightCache.value.get(memoId)

    if (!previousHeight || Math.abs(previousHeight - height) >= threshold) {
      heightCache.value.set(memoId, height)
      hasChanges = true
    }
  })

  // 防抖更新布局
  if (hasChanges) {
    if (layoutUpdateTimer) {
      clearTimeout(layoutUpdateTimer)
    }

    layoutUpdateTimer = setTimeout(() => {
      nextTick(() => {
        layoutTrigger.value++
        layoutUpdateTimer = null
      })
    }, 100) // 增加防抖时间到100ms
  }
}

// 初始化ResizeObserver
function initResizeObserver() {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect()
  }

  resizeObserver.value = new ResizeObserver((entries) => {
    const measurements: { memoId: string, height: number }[] = []

    entries.forEach((entry) => {
      const memoId = entry.target.getAttribute('data-memo-id')
      if (memoId) {
        const height = entry.contentRect.height
        measurements.push({ memoId, height })
        pendingMeasurements.value.delete(memoId)
      }
    })

    // 批量处理高度更新
    if (measurements.length > 0) {
      batchUpdateHeights(measurements)
    }
  })
}

// 观察memo元素
function observeMemoElement(element: HTMLElement, memoId: string) {
  if (resizeObserver.value && !pendingMeasurements.value.has(memoId)) {
    element.setAttribute('data-memo-id', memoId)
    resizeObserver.value.observe(element)
    pendingMeasurements.value.add(memoId)
  }
}

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

// 处理编辑事件
function handleEdit(memo: any) {
  editingMemo.value = memo
  editTags.value = memo.tags || []
  isEditDrawerOpen.value = true
}

// 更新memo
async function handleUpdateMemo(data: any) {
  if (!editingMemo.value)
    return

  try {
    await updateMemo(editingMemo.value.id, {
      content: data.content,
      tags: data.tags,
    })

    // 关闭抽屉
    isEditDrawerOpen.value = false
    editingMemo.value = null
    editTags.value = []

    // 重新获取数据
    await getMemos()
  }
  catch (error) {
    console.error('更新失败:', error)
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
</script>

<template>
  <div class="memo-editor-wrapper mb-6 z-10">
    <div class="memo-editor mx-auto bg-white dark:bg-zinc-800 rounded-lg shadow p-4">
      <AppTagInput v-model="tags" />
      <AppCommentInput :show-hello="false" input-tip="当前仅博主可发表 Memo" @send="createMemo" />
    </div>
  </div>

  <!-- Memos waterfall container -->
  <ClientOnly>
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
            :data-memo-id="position.memo?.id"
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
            @edit="handleEdit"
          >
            <MemoPanel :memo="position.memo" />
          </MemoWrap>
        </template>
      </transition-group>
    </div>
    <template #fallback>
      <div class="flex justify-center items-center py-20">
        <div class="text-gray-500">
          加载中...
        </div>
      </div>
    </template>
  </ClientOnly>

  <!-- 编辑 Drawer -->
  <Drawer v-model:open="isEditDrawerOpen">
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>正在编辑 Memo</DrawerTitle>
        <DrawerDescription />
      </DrawerHeader>
      <div class="px-4 pb-4">
        <div class="mb-4">
          <AppTagInput v-model="editTags" />
        </div>
        <AppCommentInput
          v-if="editingMemo"
          :key="editingMemo.id"
          :show-hello="false"
          :initial-value="editingMemo.content"
          placeholder="修改你的想法..."
          input-tip="修改你的 Memo 内容"
          submit-btn-text="更新"
          @send="handleUpdateMemo"
          @cancel="isEditDrawerOpen = false"
        />
      </div>
    </DrawerContent>
  </Drawer>
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
