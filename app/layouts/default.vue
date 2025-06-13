<script lang="ts" setup>
import type { UseScrollReturn } from '@vueuse/core'
import { vScroll } from '@vueuse/components'

const globalToast = useGlobalToast()
const { $toast } = useNuxtApp() as any
const route = useRoute()
const navBarStore = useNavBarStore()
const scrollWrap = useTemplateRef<HTMLElement>('scrollWrap')
const scrollDirection = ref('')
const showScrollTopBtn = ref(false)
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

  // 往下滑并且距离顶部大于50
  if (isScrollBottom.value && state.y.value > 50) {
    if (isPostPage.value) {
      navBarStore.setNavStatus({ isHidden: true })
    }
  }

  if (isScrollTop.value && isPostPage.value) {
    navBarStore.setNavStatus({ isHidden: false })
  }

  showScrollTopBtn.value = state.y.value > 100
}

function scrollToTop() {
  scrollWrap.value?.scrollTo(0, 0)
}

watch(() => route.path, () => {
  if (isPostPage.value)
    scrollToTop()
})
</script>

<template>
  <div
    ref="scrollWrap"
    v-scroll="[onScroll, { throttle: 200, behavior: 'smooth' }]" class="app-layout h-full box-border max-w-7xl px-4 lg:w-5xl md:w-3xl m-auto bg-grid-dashed overflow-y-auto"
  >
    <Toaster position="top-right" rich-colors />
    <Icon
      v-if="showScrollTopBtn" name="twemoji:up-arrow"
      class="fixed right-2 bottom-2 z-[50] md:right-10 md:bottom-6 cursor-pointer" size="2em" @click="scrollToTop"
    />
    <div class="w-full box-border">
      <AppMenuBar />
      <slot />
    </div>
    <!-- <ClientOnly>
      <InteractiveGridPattern :class="'[mask-image:radial-gradient(350px_circle_at_center,white,transparent)] -z-10'"
        :width="40" :height="40" :squares="[80, 80]" squares-class-name="hover:fill-blue-500" />
    </ClientOnly> -->
  </div>
</template>
