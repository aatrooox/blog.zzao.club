<script lang="ts" setup>
import type { BlogMemoWithUser } from '~~/types/memo.d'

// 评论类型
const props = defineProps<Props>()
defineEmits(['refresh'])
const memoWrap = ref<any>(null)
const contentRef = ref<any>(null)

interface Props {
  memo: BlogMemoWithUser
  showAll?: boolean // 是否显示所有内容（图片+文字）
  hideBtns?: boolean // 是否隐藏按钮（预留）
  layout?: 'default' | 'xiaohongshu' | 'wechat' // 布局选项
  photoWidth?: number // 图片区域宽度，默认 300px
  maxWidth?: number // 整体最大宽度，默认 1200px
  displayMode?: 'all' | 'content-only' | 'photos-only' // 显示模式：全部 | 仅内容 | 仅图片
}

// 计算是否有图片
const hasPhotos = computed(() => {
  return props.memo.photos && Array.isArray(props.memo.photos) && props.memo.photos.length > 0
})

// 解析特殊用户字符的展示, 如标签, 双链等
const parsedContent = computed(() => {
  return props.memo.content as string
})

// 计算图片区域宽度
const photoSectionWidth = computed(() => {
  return `${props.photoWidth || 300}px`
})

// 计算整体最大宽度
const panelMaxWidth = computed(() => {
  return `${props.maxWidth || 1200}px`
})

// 计算图片容器的最大宽度（用于仅图片模式）
const photoMaxWidth = computed(() => {
  return `${Math.min(props.photoWidth || 400, 500)}px`
})

// 计算实际显示模式
const actualDisplayMode = computed(() => {
  // 如果指定了显示模式，优先使用
  if (props.displayMode) {
    if (props.displayMode === 'photos-only' && props.memo.photos?.length === 0)
      return 'content-only'
    return props.displayMode
  }

  // 兼容旧的 showAll 属性
  if (props.showAll === false) {
    // 如果 showAll 为 false，优先显示图片（如果有的话）
    return hasPhotos.value ? 'photos-only' : 'content-only'
  }

  // 默认显示全部
  return 'all'
})

// 计算是否显示图片
const shouldShowPhotos = computed(() => {
  return hasPhotos.value && (actualDisplayMode.value === 'all' || actualDisplayMode.value === 'photos-only')
})

// 计算是否显示内容
const shouldShowContent = computed(() => {
  const hasContent = parsedContent.value && parsedContent.value.trim()
  return hasContent && (actualDisplayMode.value === 'all' || actualDisplayMode.value === 'content-only')
})

// 计算是否使用小红书左右布局
const useHorizontalLayout = computed(() => {
  return props.layout === 'xiaohongshu' && shouldShowPhotos.value && shouldShowContent.value
})

// 计算是否使用微信布局
const useWechatLayout = computed(() => {
  return props.layout === 'wechat' && (shouldShowPhotos.value || shouldShowContent.value)
})

// 计算是否是仅图片模式
const isPhotosOnlyMode = computed(() => {
  return shouldShowPhotos.value && !shouldShowContent.value
})

// 计算微信布局中图片网格的行列数
const wechatGridConfig = computed(() => {
  if (!props.memo.photos || props.memo.photos.length === 0)
    return { rows: 0, cols: 0 }

  const count = props.memo.photos.length

  if (count === 1)
    return { rows: 1, cols: 1 }
  if (count === 2)
    return { rows: 1, cols: 2 }
  if (count === 3)
    return { rows: 1, cols: 3 }
  if (count === 4)
    return { rows: 2, cols: 2 }
  if (count <= 6)
    return { rows: 2, cols: 3 }
  if (count <= 9)
    return { rows: 3, cols: 3 }

  // 超过9张只显示前9张
  return { rows: 3, cols: 3 }
})

// 计算微信布局的最大宽度和高度
const wechatMaxSize = computed(() => {
  const maxWidth = Math.min(props.photoWidth || 400, 450) // 最大宽度
  const maxHeight = 'auto' // 最大高度与宽度相等，保持正方形
  return { maxWidth, maxHeight }
})

// async function copyURL2Clipboard() {
//   // await navigator.clipboard.writeText(`https://blog.zzao.club/m/${props.memo.uid}`);
//   // toast.add({ severity: 'contrast', summary: '链接已复制！', detail: '快去粘贴分享吧！', life: 3000 });
// }

// async function copyIMG2Clipboard() {
//   // await navigator.clipboard.writeText(`https://blog.zzao.club/m/${props.memo.uid}`);
//   // toast.add({ severity: 'contrast', summary: '图片已复制!(假的，还没写呢)', detail: '快去粘贴分享吧！', life: 3000 });
// }

// function memoReply() {
//   if (!userStore.isLogin) {
//     // toast.add({ severity: 'error', summary: '登录后就可以评论了', life: 3000 });
//     return
//   }
//   commentReplyOpen.value = !commentReplyOpen.value
// }
// 评论
// async function createComment(message: string) {
//   if (!userStore.isLogin) {
//     // toast.add({ severity: 'error', summary: '请先登录后再留言', life: 3000 });
//     return
//   }

//   const { data, error } = await $api.post('/api/v1/comment/create', { type: commentType, user_id: userStore.user?.id, memo_id: props.memo.id, content: message }, { server: false })
//   if (error.value) {
//     // disposeError(error)
//     return
//   }

//   // toast.add({ severity: 'contrast', summary: '评论成功', life: 3000 })
//   commentReplyOpen.value = false
//   refreshList()
//   // emit('refresh')
//   // refresh()
// }
// const isLiked = computed(() => !!props.memo.likes?.find((item) => item.user_id === userStore?.user?.id))

// function refreshList() {
//   refreshKey.value++
//   emit('refresh')
// }

// function updateTextColor() {
//   const rect = memoWrap.value.getBoundingClientRect()
//   const viewportHeight = window.innerHeight

//   // 计算组件中心相对于文档顶部的距离
//   const componentCenter = rect.top + rect.height / 2 + window.scrollY

//   // 计算视口中心相对于文档顶部的距离
//   const viewportCenter = window.scrollY + viewportHeight / 2

//   // 计算组件中心与视口中心的距离
//   const distanceFromCenter = Math.abs(componentCenter - viewportCenter)
//   // 根据距离调整透明度
//   const opacity = 1 - Math.min(distanceFromCenter / (viewportHeight / 2), 1)
//   const isDark = colorMode.preference === 'dark'
//   textColor.value = isDark ? `rgba(255, 255, 255, ${0.5 + opacity * 0.5})` : `rgba(0, 0, 0, ${0.5 + opacity * 0.5})` // 颜色从浅到深
//   // 根据距离调整字号
//   const minFontSize = 10 // 最小字号
//   const maxFontSize = 18 // 最大字号
//   const fontSize = minFontSize + (maxFontSize - minFontSize) * opacity // 动态计算字号
//   textFontSize.value = `${fontSize}px`
// }

// 检测内容是否溢出
// function checkContentOverflow() {
//   if (contentRef.value) {
//     const element = contentRef.value.$el || contentRef.value
//     isContentOverflowing.value = element.scrollHeight > element.clientHeight
//   }
// }

// 监听内容变化
// watch(() => props.memo.content, () => {
//   nextTick(() => {
//     checkContentOverflow()
//   })
// }, { immediate: true })

// onMounted(() => {
//   // isLikedLocal.value = false;
//   const callback = (entries: any) => {
//     entries.forEach((entry: any) => {
//       if (entry.isIntersecting) {
//         console.log('Div 进入视口')
//         // entry.target.style.backgroundColor = "green";
//         showInfo.value = true
//         updateTextColor()
//         window.addEventListener('scroll', updateTextColor)
//         // 检测内容溢出
//         nextTick(() => {
//           checkContentOverflow()
//         })
//       }
//       else {
//         console.log('Div 离开视口')
//         showInfo.value = false
//         window.removeEventListener('scroll', updateTextColor)
//         // entry.target.style.backgroundColor = "red";
//       }
//     })
//   }

//   const options = {
//     root: null,
//     rootMargin: '0px',
//     threshold: 0.5,
//   }

//   observer.value = new IntersectionObserver(callback, options)
//   observer.value.observe(memoWrap.value) // 开始观察

//   // 初始检测
//   nextTick(() => {
//     checkContentOverflow()
//   })
// })

// onUnmounted(() => {
//   observer.value?.disconnect()
//   window.removeEventListener('scroll', updateTextColor)
// })
</script>

<template>
  <div ref="memoWrap" class="pixel-memo-panel" :style="{ maxWidth: panelMaxWidth }">
    <!-- 微信布局：上方内容，下方九宫格图片 -->
    <div v-if="useWechatLayout" class="pixel-wechat-layout">
      <!-- 上方内容区域 -->
      <div v-if="memo.content && memo.content.trim()" class="pixel-wechat-content">
        <MDC ref="contentRef" :value="memo.content" tag="section" class="pixel-memo-content memo-mdc" />
      </div>

      <!-- 下方图片九宫格区域 -->
      <ClientOnly v-if="shouldShowPhotos">
        <div
          class="pixel-wechat-photos"
          :style="{
            maxWidth: `${wechatMaxSize.maxWidth}px`,
          }"
        >
          <!-- 单张图片特殊处理 -->
          <div v-if="memo.photos.length === 1" v-viewer class="pixel-wechat-single-photo">
            <img
              :src="memo.photos[0]"
              alt="Photo"
              class="pixel-wechat-single-image"
              :style="{ maxWidth: `${wechatMaxSize.maxWidth}px` }"
            >
          </div>

          <!-- 多张图片九宫格 -->
          <div
            v-else
            v-viewer
            class="pixel-wechat-grid"
            :style="{
              gridTemplateRows: `repeat(${wechatGridConfig.rows}, 1fr)`,
              gridTemplateColumns: `repeat(${wechatGridConfig.cols}, 1fr)`,
              maxWidth: `${wechatMaxSize.maxWidth}px`,
              maxHeight: `${wechatMaxSize.maxHeight}px`,
            }"
          >
            <div
              v-for="(photo, index) in memo.photos.slice(0, 9)"
              :key="index"
              class="pixel-wechat-grid-item"
            >
              <img
                :src="photo"
                :alt="`Photo ${index + 1}`"
                class="pixel-wechat-grid-image"
              >
            </div>
          </div>
        </div>
        <template #fallback>
          <div class="pixel-wechat-photos" :style="{ maxWidth: `${wechatMaxSize.maxWidth}px` }">
            <!-- 宽度自适应容器，高度给一个合适占位 -->
            <Skeleton style="width: 100%; height: 200px;" />
          </div>
        </template>
      </ClientOnly>
    </div>

    <!-- 小红书布局：左图右文（当图片和内容都需要显示时） -->
    <div v-else-if="useHorizontalLayout" class="pixel-horizontal-layout">
      <!-- 左侧图片轮播区域 -->
      <ClientOnly>
        <div class="pixel-photo-section" :style="{ flexBasis: photoSectionWidth }">
          <Carousel v-if="memo.photos && memo.photos.length > 1" class="w-full pixel-carousel">
            <template #default="{ canScrollNext, canScrollPrev, scrollNext, scrollPrev }">
              <div class="pixel-carousel-wrapper">
                <CarouselContent v-viewer>
                  <CarouselItem v-for="(photo, index) in memo.photos" :key="index">
                    <div class="pixel-photo-container">
                      <img
                        :src="photo"
                        :alt="`Photo ${index + 1}`"
                        class="pixel-photo-image"
                      >
                    </div>
                  </CarouselItem>
                </CarouselContent>
                <!-- 自定义内部导航按钮 - 基于整体轮播容器 -->
                <button
                  v-if="canScrollPrev"
                  class="pixel-carousel-btn pixel-carousel-prev"
                  @click="scrollPrev"
                >
                  <Icon name="material-symbols:chevron-left" class="w-5 h-5" />
                </button>
                <button
                  v-if="canScrollNext"
                  class="pixel-carousel-btn pixel-carousel-next"
                  @click="scrollNext"
                >
                  <Icon name="material-symbols:chevron-right" class="w-5 h-5" />
                </button>
              </div>
            </template>
          </Carousel>
          <!-- 单图展示 -->
          <div v-else-if="memo.photos && memo.photos.length === 1" v-viewer class="pixel-photo-container">
            <img
              :src="memo.photos[0]"
              alt="Photo"
              class="pixel-photo-image"
            >
          </div>
        </div>
        <template #fallback>
          <!-- this will be rendered on server side -->
          <div class="pixel-photo-section" :style="{ flexBasis: photoSectionWidth }">
            <!-- 复用正式内容的容器以获得固定比例 -->
            <div class="pixel-photo-container">
              <Skeleton style="width: 100%; height: 100%;" />
            </div>
          </div>
        </template>
      </ClientOnly>

      <!-- 右侧内容区域 -->
      <div class="pixel-content-section">
        <MDC ref="contentRef" :value="parsedContent" tag="section" class="pixel-memo-content memo-mdc" />
      </div>
    </div>

    <!-- 仅图片展示模式 -->
    <ClientOnly v-else-if="isPhotosOnlyMode">
      <div class="pixel-photos-only" :style="{ maxWidth: photoMaxWidth }">
        <Carousel v-if="memo.photos && memo.photos.length > 1" class="w-full pixel-carousel">
          <template #default="{ canScrollNext, canScrollPrev, scrollNext, scrollPrev }">
            <div class="pixel-carousel-wrapper">
              <CarouselContent v-viewer>
                <CarouselItem v-for="(photo, index) in memo.photos" :key="index">
                  <div class="pixel-photo-container-full">
                    <img
                      :src="photo"
                      :alt="`Photo ${index + 1}`"
                      class="pixel-photo-image-full"
                    >
                  </div>
                </CarouselItem>
              </CarouselContent>
              <!-- 自定义内部导航按钮 - 基于整体轮播容器 -->
              <button
                v-if="canScrollPrev"
                class="pixel-carousel-btn pixel-carousel-prev"
                @click="scrollPrev"
              >
                <Icon name="material-symbols:chevron-left" class="w-5 h-5" />
              </button>
              <button
                v-if="canScrollNext"
                class="pixel-carousel-btn pixel-carousel-next"
                @click="scrollNext"
              >
                <Icon name="material-symbols:chevron-right" class="w-5 h-5" />
              </button>
            </div>
          </template>
        </Carousel>
        <!-- 单图展示 -->
        <div v-else-if="memo.photos && memo.photos.length === 1" v-viewer class="pixel-photo-container-full">
          <img
            :src="memo.photos[0]"
            alt="Photo"
            class="pixel-photo-image-full"
          >
        </div>
      </div>
      <template #fallback>
        <!-- this will be rendered on server side -->
        <div class="pixel-photos-only" :style="{ maxWidth: photoMaxWidth }">
          <div class="pixel-photo-container-full">
            <Skeleton style="width: 100%; height: 100%;" />
          </div>
        </div>
      </template>
    </ClientOnly>

    <!-- 仅内容模式 -->
    <div v-else-if="shouldShowContent">
      <MDC ref="contentRef" :value="parsedContent" tag="section" class="memo-mdc pixel-memo-content" />
    </div>

    <!-- 空状态 -->
    <div v-else class="pixel-empty-state">
      <p class="text-[var(--pixel-text-secondary)] font-mono text-sm">
        暂无内容
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Pixel style memo panel */
.pixel-memo-panel {
  min-height: 30px;
  display: flex;
  flex-direction: column;
  font-family: ui-monospace, monospace;
  width: 100%;
  margin: 0 auto; /* 居中显示 */
}

/* 小红书水平布局 */
.pixel-horizontal-layout {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  width: 100%;
}

/* 微信布局 */
.pixel-wechat-layout {
  display: flex;
  flex-direction: column;
  /* gap: 1rem; */
  width: 100%;
}

.pixel-wechat-content {
  width: 100%;
}

.pixel-wechat-photos {
  width: 100%;
  /* 移除 margin: 0 auto，让图片靠左显示 */
}

/* 微信单张图片 */
.pixel-wechat-single-photo {
  display: flex;
  justify-content: flex-start; /* 改为靠左对齐 */
  align-items: flex-start; /* 改为顶部对齐 */
  width: 100%;
}

.pixel-wechat-single-image {
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease;
  cursor: zoom-in;
}

.pixel-wechat-single-image:hover {
  transform: scale(1.02);
}

/* 微信九宫格 */
.pixel-wechat-grid {
  display: grid;
  gap: 4px;
  width: 100%;
  /* 移除固定的 aspect-ratio: 1，让不同图片数量有不同的比例 */
}

.pixel-wechat-grid-item {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 100%; /* 强制每个格子为正方形 */
  overflow: hidden;
  border-radius: 4px;
  background-color: var(--pixel-bg-secondary);
}

.pixel-wechat-grid-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  cursor: zoom-in;
}

.pixel-wechat-grid-image:hover {
  transform: scale(1.05);
}

.pixel-photo-section {
  flex: 0 0 auto; /* 移除固定宽度，改为由 style 控制 */
  position: relative;
  min-width: 200px; /* 最小宽度限制 */
  max-width: 500px; /* 最大宽度限制 */
}

.pixel-content-section {
  flex: 1;
  min-width: 0; /* 防止flex内容溢出 */
}

/* 图片容器样式 */
.pixel-photo-container,
.pixel-photo-container-full {
  position: relative;
  width: 100%;
  aspect-ratio: 3/4; /* 小红书常用的图片比例 */
  /* border: 2px solid var(--pixel-border-primary); */
  /* border-radius: 8px; */
  overflow: hidden;
  background-color: var(--pixel-bg-secondary);
}

.pixel-photo-container-full {
  margin: 0 auto;
}

.pixel-photo-image,
.pixel-photo-image-full {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.pixel-photo-image:hover,
.pixel-photo-image-full:hover {
  transform: scale(1.02);
}

/* 仅图片模式 */
.pixel-photos-only {
  width: 100%;
  margin: 0 auto;
}

/* 轮播容器包装器 */
.pixel-carousel-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 自定义轮播按钮样式 - 调整为真正的内部定位 */
.pixel-carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  width: 32px;
  height: 32px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  opacity: 0;
  cursor: pointer;
}

.pixel-carousel-prev {
  left: 8px; /* 更靠内的位置 */
}

.pixel-carousel-next {
  right: 8px; /* 更靠内的位置 */
}

/* 鼠标悬停在轮播容器上时显示按钮 */
.pixel-carousel-wrapper:hover .pixel-carousel-btn {
  opacity: 0.9;
}

.pixel-carousel-btn:hover {
  background: rgba(0, 0, 0, 0.6);
  border-color: rgba(255, 255, 255, 0.9);
  transform: translateY(-50%) scale(1.05);
  opacity: 1;
}

/* 隐藏原有的 Carousel 按钮 */
:deep(.carousel-previous),
:deep(.carousel-next) {
  display: none;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .pixel-memo-panel {
    max-width: 100% !important;
  }

  .pixel-horizontal-layout {
    flex-direction: column;
    gap: 1rem;
  }

  .pixel-photo-section {
    flex: none;
    width: 100%;
    max-width: none; /* 移动端移除最大宽度限制 */
  }

  .pixel-photos-only {
    max-width: 100% !important; /* 移动端使用全宽 */
  }

  /* 微信布局移动端适配 */
  /* (移除空规则，避免 linter 报错) */

  .pixel-wechat-single-image {
    max-width: 100% !important;
    max-height: 300px !important;
  }

  .pixel-wechat-grid {
    max-width: 100% !important;
    max-height: 100% !important;
  }
}

.pixel-memo-content {
  flex: 1;
  color: var(--pixel-text-primary);
  font-family: ui-monospace, monospace;
  line-height: 1.6;
  font-size: 0.875rem;
}

/* Override MDC prose styles for pixel theme */
.pixel-memo-content :deep(p) {
  margin: 0.5rem 0;
  color: var(--pixel-text-primary);
  font-family: ui-monospace, monospace;
}

.pixel-memo-content :deep(h1),
.pixel-memo-content :deep(h2),
.pixel-memo-content :deep(h3),
.pixel-memo-content :deep(h4),
.pixel-memo-content :deep(h5),
.pixel-memo-content :deep(h6) {
  color: var(--pixel-highlight-teal-text);
  font-family: ui-monospace, monospace;
  font-weight: bold;
  margin: 1rem 0 0.5rem 0;
}

.pixel-memo-content :deep(a) {
  color: var(--pixel-gradient-start);
  text-decoration: underline;
  font-family: ui-monospace, monospace;
}

.pixel-memo-content :deep(a:hover) {
  color: var(--pixel-gradient-start);
}

.pixel-memo-content :deep(code) {
  background-color: var(--pixel-bg-tertiary);
  color: var(--pixel-highlight-green-text);
  padding: 0.125rem 0.25rem;
  border: 1px solid var(--pixel-border-primary);
  font-family: ui-monospace, monospace;
  font-size: 0.8rem;
}

.pixel-memo-content :deep(pre) {
  background-color: var(--pixel-bg-input);
  border: 2px solid var(--pixel-bg-secondary);
  padding: 1rem;
  overflow-x: auto;
  margin: 1rem 0;
}

.pixel-memo-content :deep(pre code) {
  background: none;
  border: none;
  padding: 0;
  color: var(--pixel-text-primary);
}

.pixel-memo-content :deep(blockquote) {
  border-left: 4px solid var(--pixel-highlight-teal);
  padding-left: 1rem;
  margin: 1rem 0;
  color: var(--pixel-text-tertiary);
  font-style: italic;
}

.pixel-memo-content :deep(ul),
.pixel-memo-content :deep(ol) {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.pixel-memo-content :deep(li) {
  margin: 0.25rem 0;
  color: var(--pixel-text-primary);
}

.pixel-memo-content :deep(img) {
  max-width: 100%;
  max-height: 400px;
  height: auto;
  border: 2px solid var(--pixel-border-primary);
  object-fit: contain;
}

@media (min-width: 768px) {
  .pixel-memo-content {
    font-size: 1rem;
  }

  .pixel-memo-content :deep(img) {
    max-height: 500px;
  }
}

@media (max-width: 767px) {
  .pixel-memo-content :deep(img) {
    max-height: 300px;
  }
}

/* 空状态样式 */
.pixel-empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  text-align: center;
  color: var(--pixel-text-secondary);
}
</style>
