<script lang="ts" setup>
import type { UseScrollReturn } from '@vueuse/core'
import { vScroll } from '@vueuse/components'
import { toast as $toast, Toaster } from 'vue-sonner'
import { useSearch } from '~/composables/useSearch'
// import 'vue-sonner/style.css'

const globalToast = useGlobalToast()
// const { $toast } = useNuxtApp() as any
const route = useRoute()
const userStore = useUser()
const navBarStore = useNavBar()
const scrollWrap = useTemplateRef<HTMLElement>('scrollWrap')
const scrollDirection = ref('')
const showScrollTopBtn = ref(false)
const { showSearchDialog } = useSearch()
const { user, isLogin } = useUser()
const showLoginDialog = ref(false)
// const { x, y } = useWindowScroll()

const appNavBar = [
  {
    name: '首页',
    path: '/',
    icon: 'pixelarticons:home',
  },
  {
    name: '文章',
    path: '/article',
    icon: 'pixelarticons:article',
  },
  {
    name: '动态',
    path: '/memo',
    icon: 'pixelarticons:message-processing',
  },
  // {
  //   name: 'IMGX',
  //   path: '/imgx',
  //   icon: 'pixelarticons:image-delete',
  // },
  {
    name: '友链',
    path: '/links',
    icon: 'pixelarticons:mood-neutral',
  },
  // {
  //   name: '关于',
  //   path: '/about',
  //   icon: 'pixelarticons:info-box',
  // },
]

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

function logout() {
  userStore.logout()
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
  <div class="pixel-layout">
    <!-- Toast 通知 -->
    <Toaster position="top-right" rich-colors />

    <!-- PC端布局：左侧导航 + 右侧内容 -->
    <div class="hidden lg:flex min-h-screen w-full relative">
      <!-- PC端悬浮左侧导航 -->
      <aside class="fixed left-6 top-6 bottom-6 w-48 z-50 flex flex-col bg-white/80 backdrop-blur-xl border border-border-pixel-primary rounded-2xl shadow-sm transition-all duration-300">
        <!-- 顶部 Logo 或 留白 -->
        <div class="p-6 flex justify-center">
          <!-- <NuxtLink to="/" class="group flex items-center gap-2">
            <Icon name="pixelarticons:radio-signal" class="w-6 h-6 text-text-pixel-primary group-hover:text-accent-pixel-cyan transition-colors" />
            <span class="font-bold text-lg tracking-tight text-text-pixel-primary group-hover:text-accent-pixel-cyan transition-colors">BLOGZ</span>
          </NuxtLink> -->
        </div>

        <!-- 导航菜单 -->
        <nav class="px-3 space-y-1 flex-1 overflow-y-auto">
          <NuxtLink
            v-for="nav in appNavBar"
            :key="nav.path"
            :to="nav.path"
            class="flex items-center gap-3 px-3 py-2.5 transition-all duration-200 rounded-lg group"
            :class="[$route.path === nav.path ? 'bg-zinc-100 text-zinc-900 font-medium' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900']"
          >
            <Icon
              :name="nav.icon"
              class="w-5 h-5 transition-colors"
              :class="[$route.path === nav.path ? 'text-accent-pixel-cyan' : 'text-zinc-400 group-hover:text-zinc-600']"
            />
            <span class="text-sm">{{ nav.name }}</span>
          </NuxtLink>
        </nav>

        <!-- 底部用户区域 -->
        <div class="p-3 mt-auto border-t border-border-pixel-primary/50">
          <div class="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-zinc-50 transition-colors group">
            <!-- 已登录：显示头像 -->
            <div v-if="isLogin" class="flex items-center gap-3 flex-1 min-w-0 cursor-pointer" @click="navigateTo('/settings')">
              <UserAvatar :user="user" :size="32" class="w-8 h-8 rounded-full ring-1 ring-border-pixel-primary shrink-0" style="overflow: hidden;" />
              <div class="flex-1 min-w-0">
                <div class="text-xs font-medium text-zinc-700 truncate">
                  {{ user?.nickname || user?.username || 'User' }}
                </div>
              </div>
            </div>

            <!-- 未登录：显示登录触发器 -->
            <div v-else class="flex items-center gap-3 flex-1 cursor-pointer" @click="showLoginDialog = true">
              <div class="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-accent-pixel-cyan group-hover:bg-accent-pixel-cyan-light/20 transition-colors">
                <Icon name="pixelarticons:user" class="w-4 h-4" />
              </div>
              <span class="text-xs font-medium text-zinc-500 group-hover:text-zinc-700">登录账户</span>
            </div>

            <!-- 退出按钮 (仅登录显示) -->
            <button
              v-if="isLogin"
              class="p-1.5 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors ml-1"
              title="退出登录"
              @click.stop="logout"
            >
              <Icon name="pixelarticons:logout" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <!-- PC端内容区域 -->
      <main
        ref="scrollWrap"
        v-scroll="[onScroll, { throttle: 200, behavior: 'smooth' }]"
        class="flex-1 overflow-auto p-8 bg-transparent ml-[216px] mr-6 min-h-screen"
      >
        <slot />
      </main>
    </div>

    <!-- 移动端布局：内容 + 底部导航 -->
    <div class="lg:hidden flex flex-col min-h-screen relative">
      <!-- 移动端内容区域 -->
      <main
        ref="scrollWrap"
        v-scroll="[onScroll, { throttle: 200, behavior: 'smooth' }]"
        class="overflow-y-auto pb-24 min-h-[calc(100vh-80px)] p-4"
      >
        <slot />
      </main>

      <!-- 移动端悬浮底部导航 -->
      <nav class="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-50 h-16 bg-white/90 backdrop-blur-xl border border-border-pixel-primary shadow-lg rounded-2xl lg:hidden">
        <div class="flex justify-around items-center h-full px-4">
          <!-- 用户信息区域 -->
          <div v-if="isLogin" class="flex items-center gap-3 p-2 backdrop-blur-sm">
            <UserAvatar :user="user" :size="40" class="w-full h-full" />
          </div>
          <!-- 未登录时显示默认图标 -->
          <div v-else class="flex flex-col items-center backdrop-blur-sm cursor-pointer transition-all duration-200" @click="showLoginDialog = true">
            <Icon name="pixelarticons:mood-sad" class="w-8 h-8 text-accent-pixel-cyan" />
          </div>
          <NuxtLink
            v-for="nav in appNavBar"
            :key="nav.path"
            :to="nav.path"
            class="flex flex-col items-center justify-center gap-1 px-3 py-2 transition-all duration-200 border border-transparent rounded-xl min-w-[64px] relative active:translate-y-0 active:scale-95"
            :class="[$route.path === nav.path ? 'text-accent-pixel-cyan bg-accent-pixel-cyan-light font-semibold' : 'text-text-pixel-muted hover:-translate-y-1 hover:text-accent-pixel-cyan hover:bg-accent-pixel-cyan-light hover:shadow-sm']"
          >
            <Icon :name="nav.icon" class="w-5 h-5" />
            <span class="text-[10px] font-medium uppercase tracking-wide leading-none">{{ nav.name }}</span>
          </NuxtLink>
        </div>
      </nav>
    </div>

    <!-- 悬浮回到顶部按钮 -->
    <div
      v-if="showScrollTopBtn"
      class="fixed right-6 bottom-6 z-[50] pixel-btn-primary cursor-pointer flex items-center justify-center w-12 h-12 md:w-14 md:h-14"
      @click="scrollToTop"
    >
      <Icon name="twemoji:up-arrow" size="1.2em" class="pixel-text" />
    </div>

    <!-- 搜索对话框 -->
    <ResourceSearchDialog v-model="showSearchDialog" />

    <!-- 登录对话框 -->
    <AppLoginDialog v-model="showLoginDialog" />

    <!-- 像素网格背景 -->
    <div class="fixed inset-0 -z-10 pixel-grid-bg" />

    <!-- 像素噪点背景 -->
    <div class="fixed inset-0 -z-10 pixel-noise-bg" />
  </div>
</template>
