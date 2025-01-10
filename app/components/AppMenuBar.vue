<template>
  <div
    class="flex justify-around sticky mb-4 top-0 w-full z-[999] h-14 border-b-2 border-b-zinc-800 dark:border-b-zinc-400">
    <!-- <AppLoginDialog :login="loginBlog" ref="loginForm" @showRegisterDialog="showRegisterDialog"></AppLoginDialog>
    <AppRegisterDialog :regist="userRegist" ref="registerForm"></AppRegisterDialog> -->
    <!-- <AppUserSetting ref="userSetting"></AppUserSetting> -->
    <AppSearchDialog ref="searchDialog"></AppSearchDialog>

    <Menubar
      class="w-full shadow-none !border-none bg-white/10 dark:bg-zinc-900/10 !backdrop-blur-md !backdrop-opacity-90"
      breakpoint="750px" :model="items">
      <template #end="{ item }">
        <div class="flex items-center gap-2">
          <Button rounded severity="secondary" size="small" @click="showSearchDialog">
            <Icon name="icon-park-outline:search"></Icon>
          </Button>
          

          <!-- <UserAvatar v-if="isLogin" :user-info="user" class="hover-shadow-zinc" @click="showSetting">
          </UserAvatar>
          <Button v-else severity="secondary" label="登录" size="small" @click="showLoginForm"></Button> -->
          <Tag :value="`v${config.public.Z_BLOG_VERSION}`"
            v-tooltip.bottom="`博客版本: v${config.public.Z_BLOG_VERSION} \n @nuxt/content@${config.public.branchName}`"></Tag>
          <!-- <Tag v-if="config.public.branchName" :value="`${config.public.branchName}`"
            v-tooltip.bottom="`@nuxt/content@${config.public.branchName}`">
          </Tag> -->
          <Button rounded severity="secondary" @click="toggleDarkMode()" size="small">
            <Icon :name="modeIcon"></Icon>
          </Button>
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
        <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
        </a>

      </template>
    </Menubar>
  </div>
</template>

<script setup>
const { isLogin, user, setUser } = useUser();
const loginForm = ref(null)
const registerForm = ref(null)
const userSetting = ref(null)
const searchDialog = ref(null)
const toast = useToast()
const config = useRuntimeConfig()
const colorMode = useColorMode()
const route = useRoute();
const { disposeError } = useErrorDispose()
const curLabel = ref('首页')
const modes = ['system', 'light', 'dark']
const index = ref(modes.indexOf(colorMode.preference))
const modeIcon = computed(() => {
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
      icon: 'icon-park-outline:home',
      route: '/'
  },
  {
      label: '文章',
      icon: 'icon-park-outline:read-book',
      route: '/article',
  },
  {
      label: '小册',
      icon: 'icon-park-outline:book-one',
      route: '/books'
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

const showSearchDialog = async () => {
  console.log(`searchDialog.value`, searchDialog.value)
  searchDialog.value?.show();
}

const toggleDarkMode = () => {
  colorMode.preference = modes[(++index.value) % modes.length]
}

const loginBlog = async (body) => {
  const { data, error } = await $http.post('/api/v1/user/login', body)
  if (error?.value) {
    disposeError(error)
    return;
  }
  console.log(`data`, data)
  setUser(data.value.data?.user)

  toast.add({
    severity: 'success',
    summary: '恭喜！登录成功!',
    detail: '',
    life: 3000
  })

}

const userRegist = async (body) => {
  const { data, error } = await $http.post('/api/v1/user/regist', body)
  if (error?.value) {
    disposeError(error)
    return;
  }

  toast.add({
    severity: 'success',
    summary: '恭喜！注册成功!',
    detail: '',
    life: 3000
  })

  await loginBlog(body)

}


const showRegisterDialog = () => {
  registerForm.value?.show()
}

const showLoginForm = () => {
  loginForm.value?.show()
}

const showSetting = () => {
  userSetting.value?.show()
}
</script>
