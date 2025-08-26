<script lang="ts" setup>
// Keep the same logic as previous default.vue for admin
import type { UseScrollReturn } from '@vueuse/core'
import { vScroll } from '@vueuse/components'
import { toast as $toast, Toaster } from 'vue-sonner'
import { useSearch } from '~/composables/useSearch'

const globalToast = useGlobalToast()
const route = useRoute()
const navBarStore = useNavBar()
const scrollWrap = useTemplateRef<HTMLElement>('scrollWrap')
const scrollDirection = ref('')
const showScrollTopBtn = ref(false)
const { showSearchDialog } = useSearch()
const showLoginDialog = ref(false)

const isPostPage = computed(() => route.path.startsWith('/post'))
const isScrollBottom = computed(() => scrollDirection.value === 'bottom')
const isScrollTop = computed(() => scrollDirection.value === 'top')

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
    if (isScrollBottom.value && state.y.value > 50) {
      navBarStore.setNavStatus({ isHidden: false })
    }
    else if (isScrollTop.value || state.y.value <= 50) {
      navBarStore.setNavStatus({ isHidden: true })
    }
  }

  showScrollTopBtn.value = state.y.value > 100
}

function initNavBarStatus() {
  if (isPostPage.value) {
    navBarStore.setNavStatus({ isHidden: true })
  }
}

onMounted(() => {
  initNavBarStatus()
})

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
  <div class="pixel-layout">
    <Toaster position="top-right" rich-colors />
    <main
      ref="scrollWrap"
      v-scroll="[onScroll, { throttle: 200, behavior: 'smooth' }]"
      class="flex-1 overflow-auto p-6 bg-[var(--pixel-bg-secondary)] ml-[192px] mr-6 mb-6"
    >
      <slot />
    </main>

    <div
      v-if="showScrollTopBtn"
      class="fixed right-6 bottom-6 z-[50] pixel-btn-primary cursor-pointer flex items-center justify-center w-12 h-12 md:w-14 md:h-14"
      @click="scrollToTop"
    >
      <Icon name="twemoji:up-arrow" size="1.2em" class="pixel-text" />
    </div>

    <ResourceSearchDialog v-model="showSearchDialog" />
    <AppLoginDialog v-model="showLoginDialog" />
    <div class="fixed inset-0 -z-10 pixel-grid-bg" />
  </div>
</template>

<style scoped>
</style>
