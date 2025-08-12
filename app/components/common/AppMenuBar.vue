<script setup lang="ts">
// const searchDialog = ref(null)
const toast = useGlobalToast()
const loginForm = ref(null)
const registerForm = ref<{ show: () => void } | null>(null)
// const config = useRuntimeConfig()
const userStore = useUserStore()
const tokenStore = useTokenStore()
const navBarStore = useNavBarStore()
// const colorMode = useColorMode()
const { $api } = useNuxtApp()
// const modes = ['light', 'dark']
// const index = ref(modes.indexOf(colorMode.preference))
// const modeIcon = computed(() => {
//   console.log(`colorMode.preference`, colorMode.preference)
//   switch (colorMode.preference) {
//     case 'light':
//       return 'icon-park-outline:sun-one'
//     case 'dark':
//       return 'icon-park-outline:moon'
//     default:
//       return 'icon-park-outline:computer'
//   }
// })
// const { openSearchDialog, showSearchDialog } = useSearch()

interface MenuItem {
  label: string
  icon: string
  route?: string
  href?: string
  children?: MenuItem[]
}
const items = ref<MenuItem[]>([
  {
    label: '首页',
    icon: 'twemoji:wedding',
    route: '/',
  },
  {
    label: '文章',
    icon: 'twemoji:page-facing-up',
    route: '/article',
  },
  {
    label: '动态',
    icon: 'twemoji:page-facing-up',
    route: '/memo',
  },
  {
    label: 'IMGX',
    icon: 'twemoji:framed-picture',
    route: '/imgx',
  },
  {
    label: '友链',
    icon: 'twemoji:clinking-beer-mugs',
    route: '/links',
  },
  {
    label: '关于',
    icon: 'icon-park-outline:setting-two',
    route: '/about',
    // children: [
    //   {
    //     label: '关于本站',
    //     route: '/about'
    //   }
    // ]
  },
])

async function loginBlog(body) {
  const res = await $api.post('/api/v1/user/login', body)
  if (res) {
    userStore.setUser(res.data.user)
    tokenStore.setToken(res.data.token)
    toast.add({ type: 'success', message: '登录成功' })
  }
}

// function showAppMenu() {

// }

function showRegisterDialog() {
  registerForm.value?.show && registerForm.value.show()
}

// function showLoginForm() {
//   loginForm.value?.show()
// }

// async function showSearchDialog() {
//   console.log(`searchDialog.value`, searchDialog.value)
//   searchDialog.value?.show()
// }

// function toggleDarkMode() {
//   colorMode.preference = modes[(++index.value) % modes.length]
// }
</script>

<template>
  <!-- 像素风格导航栏 -->
  <div
    class="sticky top-0 w-full z-[49] mb-4 md:mb-8 transition-all duration-200"
    :style="{
      top: navBarStore.navBar?.isHidden ? '0px' : '-100px',
    }"
  >
    <!-- 主导航容器 -->
    <div class="pixel-bg pixel-border-bottom pixel-shadow-md pixel-font">
      <div class="max-w-7xl mx-auto px-4 md:px-8 py-3 md:py-4">
        <div class="flex justify-between items-center">
          <!-- Logo/品牌区域 -->
          <div class="flex items-center gap-3 md:gap-4">
            <NuxtLink to="/" class="flex items-center gap-2 md:gap-3 group">
              <div class="w-8 h-8 md:w-10 md:h-10 pixel-btn-primary flex items-center justify-center group-hover:pixel-btn-secondary transition-all duration-200">
                <Icon name="twemoji:wedding" class="text-white text-sm md:text-lg" />
              </div>
              <span class="text-lg md:text-xl pixel-title pixel-text hidden sm:block group-hover:text-[var(--pixel-gradient-start)] transition-colors duration-200">早早集市</span>
            </NuxtLink>
          </div>

          <!-- 桌面端导航菜单 -->
          <nav class="hidden md:flex items-center gap-2">
            <div v-for="menu in items" :key="menu.label" class="relative">
              <NuxtLink
                v-slot="{ isActive, navigate }"
                :to="menu.route"
                custom
                class="cursor-pointer"
              >
                <button
                  class="px-4 py-2 pixel-border pixel-font font-bold text-sm transition-all duration-200 hover:scale-105"
                  :class="[
                    isActive
                      ? 'pixel-btn-primary'
                      : 'pixel-btn-secondary hover:pixel-btn-primary',
                  ]"
                  @click="navigate"
                >
                  <div class="flex items-center gap-2">
                    <span>{{ menu.label }}</span>
                  </div>
                </button>
              </NuxtLink>
            </div>
          </nav>

          <!-- 移动端菜单按钮 -->
          <ClientOnly>
            <nav class="block md:hidden">
              <AppNavDrawer />
            </nav>
          </ClientOnly>

          <!-- 用户操作区域 -->
          <ClientOnly>
            <div class="flex items-center gap-2 md:gap-3">
              <AppLoginDialog
                v-if="!userStore.isLogin"
                ref="loginForm"
                :login="loginBlog"
                @show-register-dialog="showRegisterDialog"
              />
              <AppUserMenu v-else />
            </div>
          </ClientOnly>
        </div>
      </div>
    </div>

    <!-- 装饰性像素边框 -->
    <div class="h-1 bg-gradient-to-r from-[var(--pixel-gradient-start)] via-[var(--pixel-gradient-mid)] to-[var(--pixel-gradient-end)]">
      <div class="max-w-7xl mx-auto px-4 md:px-8 h-full" />
    </div>
  </div>
</template>
