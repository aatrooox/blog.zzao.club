<template>
  <div class="sticky top-4 h-screen overflow-y-auto hidden md:block md:w-[25%] lg:w-[25%]">
    <AppMsgFlow></AppMsgFlow>
  </div>
</template>

<script setup>
const wechatOp = ref()
const loginForm = ref(null)
const registerForm = ref(null)
const toast = useToast()
const { disposeError } = useErrorDispose()
const { isLogin, user, setUser } = useUser();
const userName = computed(() => {
  return user?.value?.username
})

const items = ref([
  {
      separator: true
  },
  {
      label: '首页',
      icon: 'pi pi-home',
      route: '/'
  },
  {
      label: '文章',
      icon: 'pi pi-book',
      badge: 0,
      route: '/article'
  },
  {
      label: '动态',
      icon: 'pi pi-bolt',
      badge: 2,
      route: '/memos'
  },
  {
      label: '分类',
      icon: 'pi pi-tags',
      route: '/category'
  },
  {
      label: '设置',
      icon: 'pi pi-envelope',
      route: '/setting',
      visible: isLogin
  },
  // 分割线
  // {
  //     separator: true
  // }
])

const loginBlog = async (body) => {
  const { data, error } = await $http.post('/api/v1/user/login', body)
  if (error?.value) {
    disposeError(error)
    return;
  }
  setUser(data.value.data?.user)

  toast.add({
    severity: 'success',
    summary: '恭喜！登录成功!',
    detail: '',
    life: 3000
  })

}

const userRegist = async (body) => {
  const { data, error } = await $http.post('/api/v1/user/login', body)

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


const toggleWechat = (event) => {
  wechatOp.value.toggle(event)
}

onMounted(async () => {
  const count = await queryCollection('content').count()
  items.value[2].badge = count
})
</script>
