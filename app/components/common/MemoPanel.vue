<script lang="ts" setup>
import type { BlogMemoWithUser } from '~~/types/memo.d'

// 评论类型
const props = defineProps<Props>()
defineEmits(['refresh'])
const memoWrap = ref<any>(null)
const contentRef = ref<any>(null)

// Memo 内容渲染统一 class：强制 prose-sm 字号（ProseP 等自定义组件会硬编码 text-base，需覆盖）
const memoProseClass = 'prose prose-sm dark:prose-invert max-w-none [&_p]:text-sm [&_li]:text-sm [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm'

// 检测内容是否溢出
const isContentOverflowing = ref(false)

// 检查内容是否超出最大高度
function checkContentOverflow() {
  if (contentRef.value && props.preview) {
    nextTick(() => {
      const element = contentRef.value.$el || contentRef.value
      // 7.5rem = 120px
      isContentOverflowing.value = element.scrollHeight > 120
    })
  }
}

// 监听内容和预览模式变化
watch(() => [props.memo.content, props.preview], () => {
  checkContentOverflow()
}, { immediate: true })

onMounted(() => {
  checkContentOverflow()
})

interface Props {
  memo: BlogMemoWithUser
  showAll?: boolean // 是否显示所有内容（图片+文字）
  preview?: boolean // 是否为预览模式（限制内容高度）
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

  // 如果是预览模式，显示全部内容（内容+图片）
  if (props.preview === true) {
    return 'all'
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
const _wechatMaxSize = computed(() => {
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
  <div ref="memoWrap" class="w-full" :style="{ maxWidth: panelMaxWidth }">
    <!-- 微信布局：上方图片，下方内容 -->
    <div v-if="useWechatLayout" class="flex flex-col gap-3">
      <!-- 上方图片区域（非 preview：全宽展示，保持原比例；preview：小尺寸裁切） -->
      <ClientOnly v-if="shouldShowPhotos">
        <div :class="{ 'preview-photos': preview }">
          <!-- 单张图片：保持原始比例 -->
          <div v-if="memo.photos.length === 1" v-viewer class="overflow-hidden rounded-lg">
            <img
              :src="memo.photos[0]"
              alt="Photo"
              :class="preview ? 'preview-single-photo w-full object-cover' : 'w-full h-auto rounded-lg'"
            >
          </div>

          <!-- 多张图片：preview 用九宫格，非 preview 用响应式网格保持原比例 -->
          <div
            v-else
            v-viewer
            :class="preview ? 'preview-grid' : 'grid gap-2'"
            :style="preview ? {
              gridTemplateRows: `repeat(${wechatGridConfig.rows}, 1fr)`,
              gridTemplateColumns: `repeat(${wechatGridConfig.cols}, 1fr)`,
              maxWidth: '200px',
              maxHeight: '150px',
            } : {
              gridTemplateColumns: memo.photos.length === 2 ? 'repeat(2, 1fr)' : memo.photos.length === 3 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
            }"
          >
            <div
              v-for="(photo, index) in memo.photos.slice(0, 9)"
              :key="index"
              :class="preview ? 'aspect-square overflow-hidden rounded-md' : 'overflow-hidden rounded-md'"
            >
              <img
                :src="photo"
                :alt="`Photo ${index + 1}`"
                :class="preview ? 'w-full h-full object-cover' : 'w-full h-auto'"
              >
            </div>
          </div>
        </div>
        <template #fallback>
          <Skeleton style="width: 100%; height: 200px;" class="rounded-lg" />
        </template>
      </ClientOnly>
      <!-- 下方内容区域 -->
      <div v-if="memo.content && memo.content.trim()" class="relative">
        <div :class="{ 'preview-content': preview }">
          <MDC ref="contentRef" :value="memo.content" tag="section" :class="memoProseClass" />
        </div>
        <!-- 预览模式的渐变遮罩 - 仅在内容溢出时显示 -->
        <div v-if="preview && isContentOverflowing" class="preview-gradient" />
      </div>
    </div>

    <!-- 小红书布局：左图右文（当图片和内容都需要显示时） -->
    <div v-else-if="useHorizontalLayout" class="flex flex-col md:flex-row gap-4">
      <!-- 左侧图片轮播区域 -->
      <ClientOnly>
        <div class="flex-none w-full md:w-auto" :style="{ flexBasis: photoSectionWidth }">
          <Carousel v-if="memo.photos && memo.photos.length > 1" class="w-full group relative">
            <template #default="{ canScrollNext, canScrollPrev, scrollNext, scrollPrev }">
              <div class="relative overflow-hidden rounded-lg">
                <CarouselContent v-viewer>
                  <CarouselItem v-for="(photo, index) in memo.photos" :key="index">
                    <div class="aspect-[3/4] w-full">
                      <img
                        :src="photo"
                        :alt="`Photo ${index + 1}`"
                        class="w-full h-full object-cover"
                      >
                    </div>
                  </CarouselItem>
                </CarouselContent>
                <!-- 自定义内部导航按钮 - 基于整体轮播容器 -->
                <button
                  v-if="canScrollPrev"
                  class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  @click="scrollPrev"
                >
                  <Icon name="material-symbols:chevron-left" class="w-5 h-5" />
                </button>
                <button
                  v-if="canScrollNext"
                  class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  @click="scrollNext"
                >
                  <Icon name="material-symbols:chevron-right" class="w-5 h-5" />
                </button>
              </div>
            </template>
          </Carousel>
          <!-- 单图展示 -->
          <div v-else-if="memo.photos && memo.photos.length === 1" v-viewer class="aspect-[3/4] w-full overflow-hidden rounded-lg">
            <img
              :src="memo.photos[0]"
              alt="Photo"
              class="w-full h-full object-cover"
            >
          </div>
        </div>
        <template #fallback>
          <!-- this will be rendered on server side -->
          <div class="flex-none w-full md:w-auto" :style="{ flexBasis: photoSectionWidth }">
            <!-- 复用正式内容的容器以获得固定比例 -->
            <div class="aspect-[3/4] w-full">
              <Skeleton style="width: 100%; height: 100%;" />
            </div>
          </div>
        </template>
      </ClientOnly>

      <!-- 右侧内容区域 -->
      <div class="flex-1 min-w-0 relative">
        <div :class="{ 'preview-content': preview }">
          <MDC ref="contentRef" :value="parsedContent" tag="section" :class="memoProseClass" />
        </div>
        <!-- 预览模式的渐变遮罩 - 仅在内容溢出时显示 -->
        <div v-if="preview && isContentOverflowing" class="preview-gradient" />
      </div>
    </div>

    <!-- 仅图片展示模式 -->
    <ClientOnly v-else-if="isPhotosOnlyMode">
      <div class="w-full mx-auto" :style="{ maxWidth: photoMaxWidth }">
        <Carousel v-if="memo.photos && memo.photos.length > 1" class="w-full group relative">
          <template #default="{ canScrollNext, canScrollPrev, scrollNext, scrollPrev }">
            <div class="relative overflow-hidden rounded-lg">
              <CarouselContent v-viewer>
                <CarouselItem v-for="(photo, index) in memo.photos" :key="index">
                  <div class="aspect-[3/4] w-full">
                    <img
                      :src="photo"
                      :alt="`Photo ${index + 1}`"
                      class="w-full h-full object-cover"
                    >
                  </div>
                </CarouselItem>
              </CarouselContent>
              <!-- 自定义内部导航按钮 - 基于整体轮播容器 -->
              <button
                v-if="canScrollPrev"
                class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                @click="scrollPrev"
              >
                <Icon name="material-symbols:chevron-left" class="w-5 h-5" />
              </button>
              <button
                v-if="canScrollNext"
                class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                @click="scrollNext"
              >
                <Icon name="material-symbols:chevron-right" class="w-5 h-5" />
              </button>
            </div>
          </template>
        </Carousel>
        <!-- 单图展示 -->
        <div v-else-if="memo.photos && memo.photos.length === 1" v-viewer class="aspect-[3/4] w-full overflow-hidden rounded-lg">
          <img
            :src="memo.photos[0]"
            alt="Photo"
            class="w-full h-full object-cover"
          >
        </div>
      </div>
      <template #fallback>
        <!-- this will be rendered on server side -->
        <div class="w-full mx-auto" :style="{ maxWidth: photoMaxWidth }">
          <div class="aspect-[3/4] w-full">
            <Skeleton class="w-full h-full" />
          </div>
        </div>
      </template>
    </ClientOnly>

    <!-- 仅内容模式 -->
    <div v-else-if="shouldShowContent" class="relative">
      <div :class="{ 'preview-content': preview }">
        <MDC ref="contentRef" :value="parsedContent" tag="section" :class="memoProseClass" />
      </div>
      <!-- 预览模式的渐变遮罩 - 仅在内容溢出时显示 -->
      <div v-if="preview && isContentOverflowing" class="preview-gradient" />
    </div>

    <!-- 空状态 -->
    <div v-else class="flex items-center justify-center min-h-[120px] text-center text-gray-500">
      <p class="text-sm">
        暂无内容
      </p>
    </div>
  </div>
</template>

<style scoped>
/* 隐藏原有的 Carousel 按钮 */
:deep(.carousel-previous),
:deep(.carousel-next) {
  display: none;
}

/* 预览模式样式 */
.preview-content {
  max-height: 7.5rem; /* 约 5 行文字 (line-height: 1.5rem) */
  overflow: hidden;
  position: relative;
}

/* 预览模式渐变遮罩 - 匹配浅绿色背景 rgb(220 252 231) = primary-50 */
.preview-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3rem;
  background: linear-gradient(to bottom, rgba(220, 252, 231, 0), rgba(220, 252, 231, 1));
  pointer-events: none;
}

/* 暗色模式下的遮罩 - 匹配 zinc-900 */
.dark .preview-gradient {
  background: linear-gradient(to bottom, rgba(24, 24, 27, 0), rgba(24, 24, 27, 1));
}

/* 预览模式下的小图样式 */
.preview-photos {
  max-width: 200px !important;
}

.preview-single-photo {
  max-height: 150px;
  object-fit: cover;
}

/* 预览模式九宫格 - 紧凑布局 */
.preview-grid {
  display: grid;
  gap: 2px; /* 减小间隔 */
  max-width: 200px !important;
  max-height: 150px !important;
}

.preview-grid .aspect-square {
  width: 100%;
  height: 100%;
  aspect-ratio: 1 / 1;
}

.preview-grid .aspect-square img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
