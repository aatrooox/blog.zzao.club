<script lang="ts" setup>
import { Toaster } from 'vue-sonner'

const route = useRoute()
const { user } = useUser()
const globalToast = useGlobalToast()
const { $toast } = useNuxtApp() as any

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
        default:
          $toast(message.message, message.options as any)
      }
    })
    globalToast.clear()
  }
}, { deep: true })

const sidebarItems = [
  [{
    label: '仪表盘',
    icon: 'i-lucide-layout-dashboard',
    to: '/admin',
  }],
  [{
    label: '动态管理',
    icon: 'i-lucide-message-square',
    to: '/admin/memos',
  }, {
    label: '评论管理',
    icon: 'i-lucide-messages-square',
    to: '/admin/comments',
  }, {
    label: '标签管理',
    icon: 'i-lucide-tag',
    to: '/admin/tags',
  }],
  [{
    label: '用户管理',
    icon: 'i-lucide-users',
    to: '/admin/users',
  }, {
    label: 'Token 管理',
    icon: 'i-lucide-key',
    to: '/admin/tokens',
  }],
  [{
    label: '系统设置',
    icon: 'i-lucide-settings',
    to: '/admin/settings',
  }],
]

function handleLogout() {
  const { logout } = useUser()
  logout()
  navigateTo('/admin/login')
}

const pageTitle = computed(() => {
  const path = route.path
  if (path === '/admin')
    return '仪表盘'
  if (path.startsWith('/admin/memos'))
    return '动态管理'
  if (path.startsWith('/admin/comments'))
    return '评论管理'
  if (path.startsWith('/admin/tags'))
    return '标签管理'
  if (path.startsWith('/admin/users'))
    return '用户管理'
  if (path.startsWith('/admin/tokens'))
    return 'Token 管理'
  if (path.startsWith('/admin/settings'))
    return '系统设置'
  return 'Admin'
})

const commandPaletteOpen = ref(false)

const commandGroups = [{
  id: 'pages',
  label: '页面导航',
  items: [
    { id: 'nav-dashboard', label: '仪表盘', icon: 'i-lucide-layout-dashboard', to: '/admin' },
    { id: 'nav-memos', label: '动态管理', icon: 'i-lucide-message-square', to: '/admin/memos' },
    { id: 'nav-comments', label: '评论管理', icon: 'i-lucide-messages-square', to: '/admin/comments' },
    { id: 'nav-tags', label: '标签管理', icon: 'i-lucide-tag', to: '/admin/tags' },
    { id: 'nav-users', label: '用户管理', icon: 'i-lucide-users', to: '/admin/users' },
    { id: 'nav-tokens', label: 'Token 管理', icon: 'i-lucide-key', to: '/admin/tokens' },
    { id: 'nav-settings', label: '系统设置', icon: 'i-lucide-settings', to: '/admin/settings' },
  ],
}, {
  id: 'actions',
  label: '快捷操作',
  items: [
    { id: 'act-site', label: '前往站点', icon: 'i-lucide-external-link', to: '/' },
    { id: 'act-logout', label: '退出登录', icon: 'i-lucide-log-out' },
  ],
}]

function handleCommandSelect(item: any) {
  commandPaletteOpen.value = false
  if (item.id === 'act-logout') {
    handleLogout()
    return
  }
  if (item.to) {
    if (item.id === 'act-site') {
      window.open(item.to, '_blank')
    }
    else {
      navigateTo(item.to)
    }
  }
}

function handleKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    commandPaletteOpen.value = !commandPaletteOpen.value
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="h-screen">
    <Toaster position="top-right" rich-colors />

    <!-- Command Palette -->
    <UModal v-model:open="commandPaletteOpen" :ui="{ width: 'sm:max-w-xl' }">
      <template #content>
        <UCommandPalette
          :groups="commandGroups"
          placeholder="搜索页面或操作..."
          close
          @update:model-value="handleCommandSelect"
          @update:open="commandPaletteOpen = $event"
        />
      </template>
    </UModal>

    <UDashboardGroup>
      <UDashboardSidebar collapsible>
        <template #header>
          <div class="flex items-center gap-2 px-2 cursor-pointer" @click="navigateTo('/')">
            <span class="text-lg font-bold">zzao.club</span>
            <UBadge color="neutral" variant="subtle" size="xs">
              Admin
            </UBadge>
          </div>
        </template>

        <UNavigationMenu :items="sidebarItems" orientation="vertical" />

        <template #footer>
          <div class="flex items-center justify-between px-2 py-1">
            <div class="flex items-center gap-2 text-sm text-muted-foreground truncate">
              <UAvatar :src="(user as any)?.avatarUrl" :alt="(user as any)?.username" size="sm" />
              <span class="truncate">{{ (user as any)?.nickname || (user as any)?.username }}</span>
            </div>
            <UButton
              icon="i-lucide-log-out"
              variant="ghost"
              color="neutral"
              size="xs"
              @click="handleLogout"
            />
          </div>
        </template>
      </UDashboardSidebar>

      <UDashboardPanel>
        <template #header>
          <UDashboardNavbar :title="pageTitle">
            <template #right>
              <UButton
                icon="i-lucide-search"
                variant="ghost"
                color="neutral"
                size="sm"
                @click="commandPaletteOpen = true"
              >
                <span class="hidden md:inline">搜索</span>
                <UKbd class="ml-1 hidden md:inline">
                  ⌘K
                </UKbd>
              </UButton>
              <UButton
                icon="i-lucide-external-link"
                variant="ghost"
                color="neutral"
                size="sm"
                to="/"
                target="_blank"
              >
                前往站点
              </UButton>
            </template>
          </UDashboardNavbar>
        </template>

        <slot />
      </UDashboardPanel>
    </UDashboardGroup>
  </div>
</template>
