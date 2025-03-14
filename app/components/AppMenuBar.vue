<template>
  <div
    class="flex justify-around sticky mb-4 top-0 w-full z-[999] h-14 border-b-2 border-b-zinc-800 dark:border-b-zinc-400">
    <AppLoginDialog :login="loginBlog" ref="loginForm" @showRegisterDialog="showRegisterDialog"></AppLoginDialog>
    <AppRegisterDialog :regist="userRegist" ref="registerForm"></AppRegisterDialog>
    <!-- <AppUserSetting ref="userSetting"></AppUserSetting> -->
    <AppSearchDialog ref="searchDialog"></AppSearchDialog>

    <Menubar
      class="w-full shadow-none !border-none bg-white/10 dark:bg-zinc-900/10 !backdrop-blur-md !backdrop-opacity-90"
      breakpoint="750px" :model="items">
      <template #end="{ item }">
        <div class="flex items-center gap-2">
          <ClientOnly>
            <Button rounded severity="secondary" size="small" @click="showSearchDialog">
              <Icon name="icon-park-outline:search"></Icon>
            </Button>
            <Tag v-if="userStore.isLogin" :value="userStore.user.username"></Tag>
            <Button v-else severity="secondary" label="登录" size="small" @click="showLoginForm"></Button>
            <Tag :value="`v${config.public.Z_BLOG_VERSION}`"
              v-tooltip.bottom="`博客版本: v${config.public.Z_BLOG_VERSION} \n @nuxt/content@${config.public.ContentVersion}`">
            </Tag>
            <Button rounded severity="secondary" @click="toggleDarkMode()" size="small">
              <Icon :name="modeIcon"></Icon>
            </Button>
          </ClientOnly>
        </div>
      </template>
      <template #item="{ item, props }">
        <NuxtLink v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <div
            :class="`w-full cursor-pointer rounded-md flex items-center box-border px-2 py-2 ${curLabel === item.label ? 'bg-secondary' : ''}`"
            v-ripple :href="href" @click="navigate">
            <Icon :name="item.icon" size="1.5em" />
            <span class="ml-2">{{ item.label }}</span>
            <!-- <Badge v-if="item.badge" class="ml-auto" :value="item.badge" /> -->
            <span v-if="item.shortcut"
              class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut
              }}</span>
          </div>
        </NuxtLink>
        <a v-else v-ripple :href="item.url" :target="item.target || '_blank'" v-bind="props.action"
          class="flex items-center box-border">
          <Icon :name="item.icon" size="1.5em" />
          <span>{{ item.label }}</span>
        </a>

      </template>
    </Menubar>
  </div>
</template>

<script setup>
const searchDialog = ref(null)
const toast = useGlobalToast()
const loginForm = ref(null)
const registerForm = ref(null)
const config = useRuntimeConfig()
const userStore = useUserStore()
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
