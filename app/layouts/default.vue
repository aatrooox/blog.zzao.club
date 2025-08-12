<script lang="ts" setup>
import type { UseScrollReturn } from '@vueuse/core'
import { vScroll } from '@vueuse/components'
import { useSearch } from '~/composables/useSearch'

const globalToast = useGlobalToast()
const { $toast } = useNuxtApp() as any
const route = useRoute()
const navBarStore = useNavBarStore()
const scrollWrap = useTemplateRef<HTMLElement>('scrollWrap')
const scrollDirection = ref('')
const showScrollTopBtn = ref(false)
const { showSearchDialog } = useSearch()
// const { x, y } = useWindowScroll()

const isPostPage = computed(() => {
  return route.path.startsWith('/post')
})

const isScrollBottom = computed(() => {
  return scrollDirection.value === 'bottom'
})

const isScrollTop = computed(() => {
  return scrollDirection.value === 'top'
})

watch(() => globalToast.toastState.value.messages, (messages) => {
  if (messages.length > 0) {
    messages.forEach((message) => {
      switch (message.type) {
        case 'success':
          $toast.success(message.message, message.options as any)
          break
        case 'error':
          $toast.error(message.message, message.options as any)
          break
        case 'info':
          $toast.info(message.message, message.options as any)
          break
        case 'warning':
          $toast.warning(message.message, message.options as any)
          break
        case 'promise':
          $toast.promise(message.options as any)
          break
        default:
          $toast(message.message, message.options as any)
      }
    })

    globalToast.clear()
  }
}, { deep: true })

function onScroll(state: UseScrollReturn) {
  navBarStore.setScrollY(state.y.value || 0)
  navBarStore.setPageScroll(state.isScrolling.value)

  if (state.isScrolling.value) {
    scrollDirection.value = state.directions.bottom ? 'bottom' : 'top'
  }

  if (isPostPage.value) {
    // 往下滑并且距离顶部大于50时显示悬浮标题栏
    if (isScrollBottom.value && state.y.value > 50) {
      navBarStore.setNavStatus({ isHidden: false })
    }
    // 往上滑或距离顶部小于等于50时隐藏悬浮标题栏
    else if (isScrollTop.value || state.y.value <= 50) {
      navBarStore.setNavStatus({ isHidden: true })
    }
  }

  showScrollTopBtn.value = state.y.value > 100
}

// 初始化导航栏状态
function initNavBarStatus() {
  if (isPostPage.value) {
    navBarStore.setNavStatus({ isHidden: true })
  }
}

// 页面加载时初始化
onMounted(() => {
  initNavBarStatus()
})

// 路由变化时重新初始化
watch(() => route.path, () => {
  initNavBarStatus()
  if (isPostPage.value) {
    scrollToTop()
  }
})

function scrollToTop() {
  scrollWrap.value?.scrollTo(0, 0)
}
</script>

<template>
  <div
    ref="scrollWrap"
    v-scroll="[onScroll, { throttle: 200, behavior: 'smooth' }]" class="app-layout h-full box-border max-w-7xl lg:w-5xl md:w-3xl m-auto bg-bg-paper overflow-y-auto font-cartoon"
  >
    <Toaster position="top-right" rich-colors />
    <div
      v-if="showScrollTopBtn"
      class="fixed right-8 bottom-8 z-[50] w-16 h-16 bg-primary-600 hover:bg-secondary-500 rounded-xl shadow-pixel cursor-pointer flex items-center justify-center transition-all duration-200 hover:scale-105"
      @click="scrollToTop"
    >
      <Icon name="twemoji:up-arrow" size="1.5em" class="text-white" />
    </div>
    <div class="w-full box-border min-h-screen">
      <AppMenuBar />
      <slot />
    </div>
    <ResourceSearchDialog v-model="showSearchDialog" />
    <!-- Pixel Grid Background -->
    <div class="fixed inset-0 -z-10 opacity-10">
      <div class="w-full h-full" style="background-image: repeating-linear-gradient(0deg, #FF5C39 0px, #FF5C39 1px, transparent 1px, transparent 8px), repeating-linear-gradient(90deg, #FF5C39 0px, #FF5C39 1px, transparent 1px, transparent 8px);" />
    </div>
  </div>
</template>
