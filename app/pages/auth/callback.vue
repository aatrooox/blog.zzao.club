<script lang="ts" setup>
definePageMeta({
  layout: false,
})

const route = useRoute()
const userStore = useUser()
const { $api } = useNuxtApp()

const status = ref<'loading' | 'success' | 'error'>('loading')
const errorMsg = ref('')

onMounted(async () => {
  const code = route.query.code as string
  const redirect = (route.query.redirect as string) || '/'

  if (!code) {
    status.value = 'error'
    errorMsg.value = '缺少授权码'
    return
  }

  try {
    const res = await $api.post('/api/v1/auth/exchange', { code })

    if (res.data) {
      const { user, accessToken, refreshToken, accessExpiresAt, refreshExpiresAt } = res.data
      userStore.setUser(user)
      userStore.setTokenInfo({ accessToken, refreshToken, accessExpiresAt, refreshExpiresAt })
      status.value = 'success'
      await navigateTo(redirect, { replace: true })
    }
    else {
      status.value = 'error'
      errorMsg.value = res.message || '登录失败'
    }
  }
  catch {
    status.value = 'error'
    errorMsg.value = '登录失败，请重试'
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center space-y-4">
      <template v-if="status === 'loading'">
        <div class="text-lg text-zinc-600 dark:text-zinc-400">
          正在登录...
        </div>
      </template>
      <template v-else-if="status === 'error'">
        <div class="text-lg text-red-500">
          {{ errorMsg }}
        </div>
        <NuxtLink to="/" class="text-sm text-primary hover:underline">
          返回首页
        </NuxtLink>
      </template>
    </div>
  </div>
</template>
