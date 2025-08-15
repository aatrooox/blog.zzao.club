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
  {
    name: '关于',
    path: '/about',
    icon: 'pixelarticons:info-box',
  },
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
      <aside class="pixel-sidebar-floating">
        <div class="pixel-sidebar-header">
          <!-- 用户信息区域 -->
          <div v-if="isLogin" class="pixel-user-info">
            <UserAvatar :user="user" class="pixel-user-avatar" />
            <!-- <div class="pixel-user-details">
              <div class="pixel-user-name">
                {{ user.nickname || user.username }}
              </div>
            </div> -->
          </div>
          <!-- 未登录时显示默认图标 -->
          <div v-else class="pixel-login-trigger" @click="showLoginDialog = true">
            <Icon name="pixelarticons:mood-sad" class="pixel-sidebar-logo" />
            <div class="pixel-login-hint">
              点击登录
            </div>
          </div>
        </div>
        <nav class="pixel-sidebar-nav">
          <NuxtLink
            v-for="nav in appNavBar"
            :key="nav.path"
            :to="nav.path"
            class="pixel-sidebar-item"
            :class="{ active: $route.path === nav.path }"
          >
            <Icon :name="nav.icon" class="pixel-sidebar-icon" />
            <span class="pixel-sidebar-text">{{ nav.name }}</span>
          </NuxtLink>
          <Icon v-if="userStore.isLogin.value" name="pixelarticons:logout" size="1.5em" class="text-[var(--pixel-text-primary)] absolute bottom-4 left-12 hover:text-[var(--pixel-status-error)]" @click="logout" />
        </nav>
      </aside>

      <!-- PC端内容区域 -->
      <main
        ref="scrollWrap"
        v-scroll="[onScroll, { throttle: 200, behavior: 'smooth' }]"
        class="pixel-desktop-main-floating"
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
        class="pixel-main"
      >
        <slot />
      </main>

      <!-- 移动端悬浮底部导航 -->
      <nav class="pixel-nav-floating">
        <div class="pixel-nav-container">
          <NuxtLink
            v-for="nav in appNavBar"
            :key="nav.path"
            :to="nav.path"
            class="pixel-nav-item"
            :class="{ active: $route.path === nav.path }"
          >
            <Icon :name="nav.icon" class="pixel-nav-icon" />
            <span class="pixel-nav-text">{{ nav.name }}</span>
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

<style scoped>
@reference 'tailwindcss';

/* 使用公共像素风格变量和类 */
.pixel-layout {
  @apply min-h-screen;
  background: var(--pixel-bg-primary);
  font-family:
    ui-monospace, SFMono-Regular, 'Cascadia Code', 'Segoe UI Mono', 'Liberation Mono', Menlo, Monaco, Consolas,
    'Courier New', monospace;
}

.pixel-main {
  @apply overflow-y-auto pb-24 min-h-[calc(100vh-80px)] p-4;
}

/* 移动端悬浮底部导航栏样式 */
.pixel-nav-floating {
  @apply fixed bottom-6 left-6 right-6 z-50 h-16;
  background: var(--pixel-bg-secondary);
  border: 2px solid var(--pixel-border-primary);
  box-shadow:
    2px 2px 0 var(--pixel-border-primary),
    4px 4px 0 var(--pixel-border-primary);
  border-radius: 0;
}

.pixel-nav-container {
  @apply flex justify-around items-center h-full px-4;
}

.pixel-nav-item {
  @apply flex flex-col items-center justify-center gap-1 px-3 py-2 no-underline transition-all duration-150 border-2 border-transparent rounded-none min-w-[64px] relative;
  color: var(--pixel-text-muted);
}

.pixel-nav-item:hover {
  @apply -translate-y-px;
  color: var(--pixel-accent-cyan);
  background: var(--pixel-bg-tertiary);
  border-color: var(--pixel-border-primary);
  box-shadow: 2px 2px 0 var(--pixel-border-primary);
}

.pixel-nav-item.active {
  color: var(--pixel-accent-cyan);
  background: var(--pixel-bg-tertiary);
  border-color: var(--pixel-accent-cyan);
  box-shadow:
    2px 2px 0 var(--pixel-border-primary),
    4px 4px 0 var(--pixel-border-primary);
}

.pixel-nav-item:active {
  @apply translate-y-px;
  box-shadow: 1px 1px 0 var(--pixel-border-primary);
}

.pixel-nav-icon {
  @apply w-5 h-5;
  image-rendering: pixelated;
}

.pixel-nav-text {
  @apply text-[10px] font-bold uppercase tracking-wide leading-none;
}

/* PC端悬浮侧边导航栏样式 */
.pixel-sidebar-floating {
  @apply fixed left-6 top-6 bottom-6 w-36 z-50;
  background: var(--pixel-bg-secondary);
}

.pixel-sidebar-header {
  @apply flex items-center justify-center p-6;
}

.pixel-sidebar-logo {
  @apply w-8 h-8;
  color: var(--pixel-accent-cyan);
  image-rendering: pixelated;
}

.pixel-sidebar-nav {
  @apply p-4 space-y-2 flex-1 overflow-y-auto;
}

.pixel-sidebar-item {
  @apply flex items-center gap-3 px-4 py-3 no-underline transition-all duration-150 border-2 border-transparent rounded-none;
  color: var(--pixel-text-secondary);
}

.pixel-sidebar-item:hover {
  @apply -translate-x-px;
  color: var(--pixel-accent-primary);
  background: var(--pixel-bg-tertiary);
  border-color: var(--pixel-accent-primary);
}

.pixel-sidebar-item.active {
  color: var(--pixel-accent-primary);
  background: var(--pixel-bg-tertiary);
  border-color: var(--pixel-accent-primary);
}

.pixel-sidebar-item:active {
  @apply translate-x-px;
  box-shadow: 1px 1px 0 var(--pixel-border-primary);
}

.pixel-sidebar-icon {
  @apply w-5 h-5;
  image-rendering: pixelated;
}

.pixel-sidebar-text {
  @apply font-bold text-sm;
}

.pixel-desktop-main-floating {
  @apply flex-1 overflow-auto p-6;
  background: var(--pixel-bg-secondary);
  margin-left: 192px;
  margin-right: 24px;
  margin-top: 24px;
  margin-bottom: 24px;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .pixel-nav-floating {
    @apply left-4 right-4 bottom-4;
  }

  .pixel-nav-container {
    @apply px-2;
  }

  .pixel-nav-item {
    @apply min-w-[60px] px-2 py-1;
  }

  .pixel-nav-text {
    @apply text-[9px];
  }

  .pixel-main {
    @apply pb-28;
  }
}

/* 用户信息样式 */
.pixel-user-info {
  @apply flex items-center gap-3 p-2 backdrop-blur-sm;
}

.pixel-user-avatar {
  @apply w-full h-full;
}

.pixel-user-details {
  @apply flex-1 min-w-0;
}

.pixel-user-name {
  @apply text-sm font-bold text-gray-800 truncate;
}

.pixel-login-trigger {
  @apply flex flex-col items-center gap-2 p-3 backdrop-blur-sm cursor-pointer transition-all duration-200;
}

.pixel-login-hint {
  @apply text-xs text-gray-600 font-medium;
}

@media (min-width: 1024px) {
  .pixel-main {
    @apply pb-0 mb-0;
  }

  .pixel-nav-floating {
    @apply hidden;
  }
}
</style>
