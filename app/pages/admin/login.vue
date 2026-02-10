<script lang="ts" setup>
definePageMeta({
  layout: 'clean',
})

const { login } = useAuth()
const { isLogin, isSuperAdmin } = useUser()
const route = useRoute()
const toast = useGlobalToast()

const form = reactive({
  username: '',
  password: '',
})
const isLoading = ref(false)

async function handleLogin() {
  if (!form.username || !form.password) {
    toast.error('请输入用户名和密码')
    return
  }

  isLoading.value = true
  try {
    await login({ username: form.username, password: form.password })

    if (isSuperAdmin.value) {
      const redirect = route.query.redirect as string || '/admin'
      navigateTo(redirect)
    }
    else {
      toast.error('权限不足，仅管理员可登录')
    }
  }
  catch {
    // useAuth().login() already shows toast
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (isLogin.value && isSuperAdmin.value) {
    navigateTo('/admin')
  }
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
    <div class="w-full max-w-sm space-y-6 px-4">
      <div class="text-center space-y-2">
        <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          zzao.club
        </h1>
        <p class="text-sm text-zinc-500 dark:text-zinc-400">
          管理后台登录
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="handleLogin">
        <UFormField label="用户名">
          <UInput
            v-model="form.username"
            placeholder="请输入用户名"
            icon="i-lucide-user"
            size="lg"
            autofocus
          />
        </UFormField>

        <UFormField label="密码">
          <UInput
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            icon="i-lucide-lock"
            size="lg"
            @keyup.enter="handleLogin"
          />
        </UFormField>

        <UButton
          type="submit"
          block
          size="lg"
          :loading="isLoading"
        >
          登录
        </UButton>
      </form>

      <div class="text-center">
        <NuxtLink to="/" class="text-sm text-zinc-400 hover:text-zinc-600 transition-colors">
          ← 返回站点
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
