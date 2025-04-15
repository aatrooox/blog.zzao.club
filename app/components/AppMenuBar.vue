<template>
  <div
    class="flex justify-around sticky mb-4 h-12 top-0 w-full z-[999] bg-white/80 transition-all duration-300 transition-discrete" :style="{
      top: navBarStore.navBar?.isHidden ? '-100px' : '0px'
    }">
    <!-- <AppLoginDialog :login="loginBlog" ref="loginForm" @showRegisterDialog="showRegisterDialog"></AppLoginDialog> -->
    <!-- <AppRegisterDialog :regist="userRegist" ref="registerForm"></AppRegisterDialog> -->
    <!-- <AppUserSetting ref="userSetting"></AppUserSetting> -->
    <!-- <AppSearchDialog ref="searchDialog"></AppSearchDialog> -->

    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem v-for="menu in items">
          <NuxtLink v-slot="{ isActive, href, navigate }" :to="menu.route" custom class="cursor-pointer">
            <NavigationMenuLink :active="isActive" :href :class="navigationMenuTriggerStyle()" @click="navigate">
              {{  menu.label }}
            </NavigationMenuLink>
          </NuxtLink>
        </NavigationMenuItem>
      </NavigationMenuList>
  </NavigationMenu>
  </div>
</template>

<script setup>
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'

const searchDialog = ref(null)
const toast = useGlobalToast()
const loginForm = ref(null)
const registerForm = ref(null)
const config = useRuntimeConfig()
const userStore = useUserStore()
const navBarStore = useNavBarStore()
const colorMode = useColorMode()
const { $api } = useNuxtApp();
const route = useRoute();
const curLabel = ref('首页')
const modes = ['system', 'light', 'dark']
const index = ref(modes.indexOf(colorMode.preference))
const modeIcon = computed(() => {
  console.log(`colorMode.preference`, colorMode.preference)
  switch (colorMode.preference) {
    case 'system':
      return 'icon-park-outline:computer'
    case 'light':
      return 'icon-park-outline:sun-one'
    case 'dark':
      return 'icon-park-outline:moon'
    default:
      return 'icon-park-outline:computer'
  }
})


const items = ref([
{
      label: '首页',
      icon: 'twemoji:wedding',
      route: '/'
  },
  {
      label: '文章',
      icon: 'twemoji:page-facing-up',
      route: '/article',
  },
  {
      label: '友链',
      icon: 'twemoji:clinking-beer-mugs',
      route: '/links'
  },
  // {
  //     label: '设置',
  //     icon: 'icon-park-outline:setting-two',
  //     route: '/setting',
  //     hidden: !user?.value
  // },
]);

watch(() => route.path, (newVal, oldVal) => {
  switch (newVal) {
    case '/':
      curLabel.value = '首页'; break;
    case '/article':
      curLabel.value = '文章'; break;
    case '/memos':
      curLabel.value = '动态'; break;
    case '/category':
      curLabel.value = '小册'; break;
    default:
      break;
  }
})

const loginBlog = async (body) => {
  const res = await $api.post('/api/v1/user/login', body)
  if (res) {
    userStore.setUser(res.data.user)

    console.log(`userStore.user`, userStore.user)
    toast.success('恭喜！登录成功!')
  }
}

const userRegist = async (body) => {
  const res = await $api.post('/api/v1/user/regist', body)
  if (res) {
    await loginBlog(body)
  }
}

const showRegisterDialog = () => {
  registerForm.value?.show()
}

const showLoginForm = () => {
  loginForm.value?.show()
}

const showSearchDialog = async () => {
  console.log(`searchDialog.value`, searchDialog.value)
  searchDialog.value?.show();
}

const toggleDarkMode = () => {
  colorMode.preference = modes[(++index.value) % modes.length]
}


</script>
