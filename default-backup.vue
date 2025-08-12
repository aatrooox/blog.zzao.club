<script setup lang="ts">
import Sonner from '@/components/ui/sonner.vue'

// 页面标题设置
useHead({
  titleTemplate: '%s - 社区服务中心',
  meta: [
    {
      name: 'description',
      content: '社区服务中心管理系统 - 提供便民服务管理功能',
    },
  ],
})

const appNavBar = [
  {
    name: '首页',
    path: '/',
    icon: 'pixelarticons:home',
  },
  {
    name: '链接',
    path: '/connect',
    icon: 'pixelarticons:paperclip',
  },
  // {
  //   name: '数据看板',
  //   path: '/data-dashboard',
  //   icon: 'pixelarticons:chart-bar',
  // },
  {
    name: '设置',
    path: '/settings',
    icon: 'pixelarticons:mood-neutral',
  },
]
</script>

<template>
  <div class="pixel-layout">
    <!-- 全局灵动岛组件 -->
    <AppDynamicIsland />
    <!-- 全局 Toast 组件 -->
    <Sonner />

    <!-- PC端布局：左侧导航 + 右侧内容 -->
    <div class="hidden lg:flex min-h-screen w-full relative">
      <!-- PC端悬浮左侧导航 -->
      <aside class="pixel-sidebar-floating">
        <div class="pixel-sidebar-header">
          <Icon name="pixelarticons:building-skyscraper" class="pixel-sidebar-logo" />
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
        </nav>
      </aside>

      <!-- PC端内容区域 -->
      <main class="pixel-desktop-main-floating">
        <slot />
      </main>
    </div>

    <!-- 移动端布局：内容 + 底部导航 -->
    <div class="lg:hidden flex flex-col min-h-screen relative">
      <!-- 移动端内容区域 -->
      <main class="pixel-main">
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
  </div>
</template>

<style scoped>
@reference 'tailwindcss';

/* 使用公共像素风格变量和类 */
.pixel-layout {
  @apply min-h-screen bg-[var(--pixel-bg-primary)];
  font-family:
    ui-monospace, SFMono-Regular, 'Cascadia Code', 'Segoe UI Mono', 'Liberation Mono', Menlo, Monaco, Consolas,
    'Courier New', monospace;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

.pixel-main {
  @apply overflow-y-auto pb-24 min-h-[calc(100vh-80px)];
}

/* 移动端悬浮底部导航栏样式 */
.pixel-nav-floating {
  @apply fixed bottom-6 left-6 right-6 bg-[var(--pixel-bg-secondary)] border-2 border-[var(--pixel-border-dark)] z-50 h-16;
  box-shadow:
    2px 2px 0 var(--pixel-border-dark),
    4px 4px 0 var(--pixel-border-dark);
  border-radius: 0;
}

.pixel-nav-container {
  @apply flex justify-around items-center h-full px-4;
}

.pixel-nav-item {
  @apply flex flex-col items-center justify-center gap-1 px-3 py-2 text-[var(--pixel-text-secondary)] no-underline transition-all duration-150 border-2 border-transparent rounded-none min-w-[64px] relative;
}

.pixel-nav-item:hover {
  @apply text-[var(--pixel-cyan)] bg-[var(--pixel-bg-tertiary)] border-[var(--pixel-border-dark)] -translate-y-px;
  box-shadow: 2px 2px 0 var(--pixel-border-dark);
}

.pixel-nav-item.active {
  @apply text-[var(--pixel-cyan)] bg-[var(--pixel-bg-tertiary)] border-[var(--pixel-cyan)];
  box-shadow:
    2px 2px 0 var(--pixel-border-dark),
    4px 4px 0 var(--pixel-border-dark);
}

.pixel-nav-item:active {
  @apply translate-y-px;
  box-shadow: 1px 1px 0 var(--pixel-border-dark);
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
  @apply fixed left-6 top-6 bottom-6 w-36 bg-[var(--pixel-bg-secondary)] border-2 border-[var(--pixel-border-dark)] z-50;
  box-shadow:
    2px 2px 0 var(--pixel-border-dark),
    4px 4px 0 var(--pixel-border-dark);
  border-radius: 0;
}

.pixel-sidebar-header {
  @apply flex items-center justify-center p-6 border-b-2 border-[var(--pixel-border-dark)] bg-[var(--pixel-bg-tertiary)];
}

.pixel-sidebar-logo {
  @apply w-8 h-8 text-[var(--pixel-cyan)];
  image-rendering: pixelated;
}

.pixel-sidebar-title {
  @apply text-[var(--pixel-cyan)] font-bold text-lg;
}

.pixel-sidebar-nav {
  @apply p-4 space-y-2 flex-1 overflow-y-auto;
}

.pixel-sidebar-item {
  @apply flex items-center gap-3 px-4 py-3 text-[var(--pixel-text-secondary)] no-underline transition-all duration-150 border-2 border-transparent rounded-none;
}

.pixel-sidebar-item:hover {
  @apply text-[var(--pixel-cyan)] bg-[var(--pixel-bg-tertiary)] border-[var(--pixel-border-dark)] -translate-x-px;
  box-shadow: 2px 2px 0 var(--pixel-border-dark);
}

.pixel-sidebar-item.active {
  @apply text-[var(--pixel-cyan)] bg-[var(--pixel-bg-tertiary)] border-[var(--pixel-cyan)];
  box-shadow:
    2px 2px 0 var(--pixel-border-dark),
    4px 4px 0 var(--pixel-border-dark);
}

.pixel-sidebar-item:active {
  @apply translate-x-px;
  box-shadow: 1px 1px 0 var(--pixel-border-dark);
}

.pixel-sidebar-icon {
  @apply w-5 h-5;
  image-rendering: pixelated;
}

.pixel-sidebar-text {
  @apply font-bold text-sm;
}

.pixel-desktop-main-floating {
  @apply flex-1 overflow-auto bg-[var(--pixel-bg-primary)] ml-48 mr-6 my-6 border-2 border-[var(--pixel-border-dark)];
  box-shadow:
    inset 0 2px 8px 0 var(--pixel-border-dark),
    2px 2px 0 var(--pixel-border-dark);
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

@media (min-width: 1024px) {
  .pixel-main {
    @apply pb-0 mb-0;
  }

  .pixel-nav-floating {
    @apply hidden;
  }
}
</style>
