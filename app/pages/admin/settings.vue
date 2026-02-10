<script lang="ts" setup>
import * as z from 'zod'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const { $api } = useNuxtApp()
const toast = useGlobalToast()
const userStore = useUser()
const route = useRoute()
const { user: sessionUser } = useUserSession()

const userId = computed(() => userStore.user.value?.id)

// Tab state
const tabs = [
  { label: '基本信息', value: 'profile' },
  { label: '用户设置', value: 'account' },
  { label: '安全设置', value: 'security' },
]
const currentTab = ref('profile')

// --- Profile Form ---
const profileSchema = z.object({
  username: z.string().min(6, '用户名最少 6 位'),
  nickname: z.string().min(4, '昵称最少 4 位').max(8, '昵称最多 8 位'),
  email: z.string().email('请输入正确的邮箱格式'),
  website: z.string().url('无效的 URL 路径').or(z.literal('')),
})
const profileState = reactive({
  username: '',
  nickname: '',
  email: '',
  website: '',
})
const profileLoading = ref(false)

async function loadProfile() {
  const res = await $api.post('/api/v1/user/detail', { id: userId.value })
  if (res.data) {
    profileState.username = res.data.username || ''
    profileState.nickname = res.data.nickname || ''
    profileState.email = res.data.email || ''
    profileState.website = res.data.website || ''
  }
}

async function onSubmitProfile() {
  profileLoading.value = true
  try {
    const values = Object.fromEntries(
      Object.entries(profileState).filter(([_, v]) => v !== null && v !== undefined && v !== ''),
    )
    const res = await $api.put(`/api/v1/user/${userId.value}`, values)
    if (res.data) {
      toast.success('基本信息更新成功')
    }
  }
  catch {
    toast.error('更新失败')
  }
  finally {
    profileLoading.value = false
  }
}

// --- Account Form ---
const allowEmailNotify = ref(false)
const accountLoading = ref(false)

async function loadConfig() {
  const res = await $api.get(`/api/v1/user/config/${userId.value}`)
  if (res.data) {
    allowEmailNotify.value = res.data.allowEmailNotify === 1
  }
}

async function onSubmitAccount() {
  accountLoading.value = true
  try {
    const res = await $api.post('/api/v1/user/config', {
      userId: userId.value,
      allowEmailNotify: allowEmailNotify.value ? 1 : 0,
    })
    if (res.data) {
      toast.success('用户设置更新成功')
    }
  }
  catch {
    toast.error('更新失败')
  }
  finally {
    accountLoading.value = false
  }
}

// --- Security Form ---
const securitySchema = z.object({
  password: z.string().min(6, '密码最少 6 位').max(16, '密码最多 16 位'),
})
const securityState = reactive({
  password: '',
})
const securityLoading = ref(false)

async function onSubmitSecurity() {
  securityLoading.value = true
  try {
    const res = await $api.put(`/api/v1/user/${userId.value}`, {
      password: securityState.password,
    })
    if (res.data) {
      securityState.password = ''
      toast.success('密码修改成功')
    }
  }
  catch {
    toast.error('修改失败')
  }
  finally {
    securityLoading.value = false
  }
}

// --- OAuth handling ---
async function handleOAuth() {
  if (route.query.oath === '1' && sessionUser.value?.avatar_url) {
    const res = await $api.put(`/api/v1/user/${userId.value}`, {
      avatar_url: sessionUser.value.avatar_url,
    })
    if (res.data) {
      userStore.setUser(res.data)
      toast.success('已成功关联 GitHub 头像')
    }
  }
}

onMounted(async () => {
  await Promise.all([loadProfile(), loadConfig()])
  handleOAuth()
})
</script>

<template>
  <div class="p-6 space-y-6 max-w-3xl">
    <UTabs
      :items="tabs"
      :model-value="currentTab"
      @update:model-value="currentTab = $event as string"
    />

    <!-- Profile Tab -->
    <UCard v-if="currentTab === 'profile'">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">
            基本信息
          </h3>
          <UButton
            to="/api/v1/auth/github?setting=1"
            external
            variant="outline"
            icon="i-lucide-github"
            size="sm"
          >
            关联 Github 头像
          </UButton>
        </div>
      </template>

      <UForm :schema="profileSchema" :state="profileState" class="space-y-4" @submit="onSubmitProfile">
        <UFormField label="用户名" name="username">
          <UInput v-model="profileState.username" placeholder="输入用户名" class="w-full" />
        </UFormField>

        <UFormField label="昵称" name="nickname">
          <UInput v-model="profileState.nickname" placeholder="输入昵称" class="w-full" />
        </UFormField>

        <UFormField label="邮箱" name="email">
          <UInput v-model="profileState.email" type="email" placeholder="输入邮箱" class="w-full" />
        </UFormField>

        <UFormField label="主页" name="website">
          <UInput v-model="profileState.website" placeholder="https://example.com" class="w-full" />
        </UFormField>

        <UButton type="submit" :loading="profileLoading">
          保存信息
        </UButton>
      </UForm>
    </UCard>

    <!-- Account Tab -->
    <UCard v-if="currentTab === 'account'">
      <template #header>
        <h3 class="text-lg font-semibold">
          用户设置
        </h3>
      </template>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">
              邮件通知
            </p>
            <p class="text-sm text-muted">
              开启后将接收邮件通知
            </p>
          </div>
          <USwitch v-model="allowEmailNotify" />
        </div>

        <UButton :loading="accountLoading" @click="onSubmitAccount">
          保存设置
        </UButton>
      </div>
    </UCard>

    <!-- Security Tab -->
    <UCard v-if="currentTab === 'security'">
      <template #header>
        <h3 class="text-lg font-semibold">
          修改密码
        </h3>
      </template>

      <UForm :schema="securitySchema" :state="securityState" class="space-y-4" @submit="onSubmitSecurity">
        <UFormField label="新密码" name="password">
          <UInput v-model="securityState.password" type="password" placeholder="请输入新密码" class="w-full" />
        </UFormField>

        <UButton type="submit" :loading="securityLoading">
          修改密码
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>
