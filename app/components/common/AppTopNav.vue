<script setup lang="ts">
defineProps({
  maxWidthClass: {
    type: String,
    default: 'max-w-2xl',
  },
})

const { navItems } = useAppNavigation()
const { user, isLogin, isSuperAdmin } = useUser()
const userStore = useUser()
const showLoginDialog = ref(false)

const userAvatarLink = computed(() => isSuperAdmin.value ? '/admin' : '/settings')

function logout() {
  userStore.logout()
}
</script>

<template>
  <header class="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 border-b border-zinc-100">
    <div class="mx-auto px-4 h-14 flex items-center justify-between" :class="[maxWidthClass]">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <Icon name="pixelarticons:radio-signal" class="w-6 h-6 text-zinc-800 group-hover:text-primary transition-colors" />
        <span class="font-bold text-lg tracking-tight text-zinc-800 group-hover:text-primary transition-colors">早早集市</span>
      </NuxtLink>

      <!-- Navigation -->
      <nav class="hidden md:flex items-center gap-1">
        <NuxtLink
          v-for="nav in navItems"
          :key="nav.path"
          :to="nav.path"
          class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
          :class="[$route.path === nav.path ? 'text-primary bg-primary/10' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50']"
        >
          {{ nav.name }}
        </NuxtLink>
      </nav>

      <!-- User / Actions -->
      <div class="flex items-center gap-2">
        <template v-if="isLogin">
          <NuxtLink :to="userAvatarLink" class="flex items-center gap-2 hover:bg-zinc-50 p-1.5 rounded-full transition-colors">
            <UserAvatar :user="user" :size="28" />
          </NuxtLink>
          <button
            class="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
            title="退出登录"
            @click="logout"
          >
            <Icon name="pixelarticons:logout" class="w-5 h-5" />
          </button>
        </template>
        <template v-else>
          <button
            class="text-sm font-medium text-zinc-600 hover:text-cyan-600 transition-colors px-3 py-1.5"
            @click="showLoginDialog = true"
          >
            登录
          </button>
        </template>
      </div>
    </div>
  </header>

  <AppLoginDialog v-model="showLoginDialog" />
</template>
