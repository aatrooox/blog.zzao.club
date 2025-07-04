<script setup lang="ts">
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'

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
  <div
    class="flex sticky justify-between items-center mb-4 h-12 top-0 w-full z-[49] bg-white dark:bg-zinc-950/80 transition-all duration-150 transition-discrete"
    :style="{
      top: navBarStore.navBar?.isHidden ? '0px' : '-100px',
    }"
  >
    <!-- <AppRegisterDialog :regist="userRegist" ref="registerForm"></AppRegisterDialog> -->
    <!-- <AppUserSetting ref="userSetting"></AppUserSetting> -->
    <!-- <AppSearchDialog ref="searchDialog"></AppSearchDialog> -->
    <ClientOnly>
      <nav class="block md:hidden">
        <AppNavDrawer />
      </nav>
    </ClientOnly>

    <NavigationMenu class="hidden md:block">
      <NavigationMenuList>
        <NavigationMenuItem v-for="menu in items" :key="menu.label">
          <template v-if="menu.children?.length">
            <NavigationMenuTrigger class="text-md relative">
              <NuxtLink
                v-if="menu.route" v-slot="{ isActive, href, navigate }" :to="menu.route || menu.href" custom
                class="cursor-pointer text-md bg-transparent"
              >
                <NavigationMenuLink :active="isActive" :href="href" :class="navigationMenuTriggerStyle()" @click="navigate">
                  {{ menu.label }}
                </NavigationMenuLink>
              </NuxtLink>
              <span v-else> {{ menu.label }}</span>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul class="w-[340px] flex flex-wrap gap-4 py-6">
                <li v-for="subMenu in menu.children" :key="subMenu.label" class="w-[30%] text-center">
                  <NuxtLink
                    v-slot="{ isActive, href, navigate }" :to="subMenu.route || subMenu.href"
                    :external="!!subMenu.href" custom
                    class="cursor-pointer text-md underline underline-offset-2 decoration-4 decoration-cyan-600"
                  >
                    <NavigationMenuLink
                      :active="isActive" :href="href" :class="navigationMenuTriggerStyle()"
                      @click="navigate"
                    >
                      {{ subMenu.label }}
                    </NavigationMenuLink>
                  </NuxtLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </template>

          <NuxtLink v-else v-slot="{ isActive, href, navigate }" :to="menu.route" custom class="cursor-pointer text-md">
            <NavigationMenuLink :active="isActive" :href="href" :class="navigationMenuTriggerStyle()" @click="navigate">
              {{ menu.label }}
            </NavigationMenuLink>
          </NuxtLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
    <ClientOnly>
      <div class="icons pr-4 flex gap-2">
        <!-- <Button variant="ghost" size="icon" @click="openSearchDialog">
          <Icon name="lucide:search" size="1.5em" />
        </Button> -->
        <AppLoginDialog
          v-if="!userStore.isLogin" ref="loginForm" :login="loginBlog"
          @show-register-dialog="showRegisterDialog"
        />
        <AppUserMenu v-else />
        <!-- <Button variant="ghost" size="icon" @click="toggleDarkMode">
          <Icon :name="modeIcon" size="1.5em" />
        </Button> -->
      </div>
    </ClientOnly>
    <!-- <ResourceSearchDialog v-model="showSearchDialog" /> -->
  </div>
</template>
