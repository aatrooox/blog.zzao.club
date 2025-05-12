<template>
  <div class="h-full box-border max-w-7xl px-4 lg:w-6xl md:w-3xl m-auto bg-grid-dashed overflow-y-auto" ref="scrollWrap"
    v-scroll="[onScroll, { throttle: 200, behavior: 'smooth' }]">
    <Toaster position="top-right" richColors></Toaster>
    <Icon name="twemoji:up-arrow" class="fixed right-2 bottom-2 z-[50] md:right-10 md:bottom-6 cursor-pointer"
      size="2em" v-if="showScrollTopBtn" @click="scrollToTop"></Icon>
    <div class="m-auto flex gap-5 box-border">
      <div class="w-[100%] md:w-[100%] lg:w-[100%] h-full">
        <AppMenuBar></AppMenuBar>
        <slot />
      </div>
      <div class="hidden sticky top-4 h-screen">
        <!-- <AppMsgFlow></AppMsgFlow> -->
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
const globalToast = useGlobalToast()
const { $toast } = useNuxtApp()
const route = useRoute()
import type { UseScrollReturn } from '@vueuse/core'
import { vScroll } from '@vueuse/components'
const navBarStore = useNavBarStore()
const scrollWrap = useTemplateRef<HTMLElement>('scrollWrap')
const scrollDirection = ref('')
const showScrollTopBtn = ref(false)
const { x, y } = useWindowScroll()

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
          $toast.success(message.message, message.options as any);
          break;
        case 'error':
          $toast.error(message.message, message.options as any);
          break;
        case 'info':
          $toast.info(message.message, message.options as any);
          break;
        case 'warning':
          $toast.warning(message.message, message.options as any);
          break;
        case 'promise':
          $toast.promise(message.options as any);
          break;
        default:
          $toast(message.message, message.options as any)
      }
    })

    globalToast.clear();
  }
}, { deep: true })

function onScroll(state: UseScrollReturn) {
  // console.log(state) // {x, y, isScrolling, arrivedState, directions}
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


watch(() => route.path, (newVal, oldVal) => {
  if (isPostPage.value) scrollToTop();
})
</script>