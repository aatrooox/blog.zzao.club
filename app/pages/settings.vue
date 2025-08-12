<script lang="ts" setup>
import type { ApiResponse } from '~~/types/fetch'
import { AutoForm } from '#components'
import md5 from 'md5'
import * as z from 'zod'

useHead({
  title: '设置',
  meta: [
    {
      name: 'description',
      content: '设置个人信息',
    },
  ],
})

definePageMeta({
  middleware: [
    function () {
      // Custom inline middleware
      if (!localStorage?.getItem('blog/token')) {
        return navigateTo('/', { redirectCode: 301 })
        // return abortNavigation('请先登录')
      }
    },
  ],
})

const { user } = useUserSession()
const { $api } = useNuxtApp()
const toast = useGlobalToast()
const userStore = useUserStore()
const schema = ref<any>(null)
const configSchema = ref<any>(null)
const route = useRoute()

const passwordSchema = z.object({
  password: z.string()
    .min(6, {
      message: '密码最少6位',
    })
    .max(16, {
      message: '密码最多16位',
    })
    .describe('密码'),
})

console.log(`passwordSchema`, passwordSchema, z.string().describe('密码'))
async function onSubmit(values: Record<string, any>) {
  // 过滤掉空值
  values = Object.fromEntries(Object.entries(values).filter(([_, value]) => value !== null && value !== undefined))

  console.log(`values`, values)

  const res = await $api.put<ApiResponse>(`/api/v1/user/${userStore.user.id}`, values)

  if (res.data) {
    toast.success('更新成功')
  }
}

async function onSubmitConfig(values: Record<string, any>) {
  // 过滤掉空值
  values = Object.fromEntries(Object.entries(values).filter(([_, value]) => value !== null && value !== undefined))

  console.log(`values`, values)
  values.allowEmailNotify = values.allowEmailNotify ? 1 : 0
  const res = await $api.post<ApiResponse>(`/api/v1/user/config`, { ...values, userId: userStore.user.id })
  if (res.data) {
    toast.success('更新成功')
  }
  // toast({
  //   title: 'You submitted the following values:',
  //   description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
  // })
}

async function onSubmitPassword(values: Record<string, any>) {
  // 过滤掉空值
  values = Object.fromEntries(Object.entries(values).filter(([_, value]) => value !== null && value !== undefined))

  values.password = md5(values.password)
  const res = await $api.put(`/api/v1/user/${userStore.user.id}`, { ...values })
  if (res.data) {
    toast.success('更新成功')
  }
}

async function getUserInfo() {
  const res = await $api.post('/api/v1/user/detail', { id: userStore.user.id })
  const res2 = await $api.get(`/api/v1/user/config/${userStore.user.id}`)

  console.log(`res`, res, res2)
  if (res.data) {
    schema.value = z.object({
      username: z
        .string({
          required_error: '用户名必填',
        })
        .min(6, {
          message: '用户名最少 6 位',
        })
        .describe('用户名')
        .default(res.data.username),

      nickname: z
        .string()
        .min(4, {
          message: '昵称最少6位',
        })
        .max(8, {
          message: '昵称最多8位',
        })
        .describe('昵称')
        .default(res.data.nickname),

      email: z
        .string()
        .email({
          message: '请输入正确的邮箱格式',
        })
        .describe('邮箱')
        .default(res.data.email),

      website: z
        .string()
        .url({
          message: '无效的url路径',
        })
        .describe('主页')
        .default(res.data.website),
      // file: z.string().optional(),
    })
  }

  configSchema.value = z.object({
    allowEmailNotify: z.boolean().describe('接受邮件通知').default(res2.data?.allowEmailNotify === 1),
  })
}

watchEffect(async () => {
  // 关联 github 的头像
  if (route.query.oath === '1') {
    const { data, error } = await $api.put(`/api/v1/user/${userStore.user.id}`, {
      avatar_url: user.value?.avatar_url,
    })

    if (!error) {
      userStore.setUser(data.user)
      userStore.setToken(data.token)
      toast.success('已成功关联 github 头像')
    }
  }
})
onMounted(() => {
  getUserInfo()
})
</script>

<template>
  <div class="flex flex-col gap-4 md:gap-8 max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-8 bg-bg-paper font-cartoon">
    <!-- 页面标题卡片 -->
    <div class="bg-white rounded-lg md:rounded-xl shadow-pixel border-2 md:border-4 border-bg-base p-4 md:p-8 text-center">
      <h1 class="text-lg md:text-2xl font-pixel text-bg-base mb-2">
        个人设置
      </h1>
      <p class="text-sm md:text-base font-cartoon text-gray-600">
        管理您的个人信息和账户设置
      </p>
    </div>

    <!-- 基本信息卡片 -->
    <div class="bg-white rounded-lg md:rounded-xl shadow-pixel border-2 md:border-4 border-bg-base p-4 md:p-8">
      <h2 class="text-base md:text-lg font-pixel text-bg-base mb-3 md:mb-4 flex items-center gap-2">
        <div class="w-2 h-2 bg-primary-600 rounded-sm" />
        基本信息
      </h2>
      <div class="flex flex-col gap-4 md:gap-6">
        <AutoForm v-if="schema" class="space-y-4 md:space-y-6" :schema="schema" @submit="onSubmit">
          <div class="flex flex-wrap gap-2 md:gap-3">
            <button
              type="submit"
              class="bg-primary-600 hover:bg-secondary-500 text-white font-cartoon font-bold px-4 md:px-6 py-2 md:py-3 rounded-lg border-2 md:border-4 border-bg-base shadow-pixel hover:shadow-[6px_6px_0_0_#000000] transition-all duration-200 hover:scale-105"
            >
              <span class="text-sm md:text-base">保存信息</span>
            </button>
            <a
              href="/api/v1/auth/github?setting=1"
              class="bg-secondary-500 hover:bg-primary-600 text-bg-base font-cartoon font-bold px-4 md:px-6 py-2 md:py-3 rounded-lg border-2 md:border-4 border-bg-base shadow-pixel hover:shadow-[6px_6px_0_0_#000000] transition-all duration-200 hover:scale-105 inline-block"
            >
              <span class="text-sm md:text-base">关联 Github 头像</span>
            </a>
          </div>
        </AutoForm>
      </div>
    </div>

    <!-- 用户设置卡片 -->
    <div class="bg-white rounded-lg md:rounded-xl shadow-pixel border-2 md:border-4 border-bg-base p-4 md:p-8">
      <h2 class="text-base md:text-lg font-pixel text-bg-base mb-3 md:mb-4 flex items-center gap-2">
        <div class="w-2 h-2 bg-secondary-500 rounded-sm" />
        用户设置
      </h2>
      <div class="flex flex-col gap-4 md:gap-6">
        <AutoForm
          v-if="configSchema" class="space-y-4 md:space-y-6" :schema="configSchema" :field-config="{
            allowEmailNotify: {
              component: 'switch',
            },
          }" @submit="onSubmitConfig"
        >
          <button
            type="submit"
            class="bg-primary-600 hover:bg-secondary-500 text-white font-cartoon font-bold px-4 md:px-6 py-2 md:py-3 rounded-lg border-2 md:border-4 border-bg-base shadow-pixel hover:shadow-[6px_6px_0_0_#000000] transition-all duration-200 hover:scale-105"
          >
            <span class="text-sm md:text-base">保存设置</span>
          </button>
        </AutoForm>
      </div>
    </div>

    <!-- 修改密码卡片 -->
    <div class="bg-white rounded-lg md:rounded-xl shadow-pixel border-2 md:border-4 border-bg-base p-4 md:p-8">
      <h2 class="text-base md:text-lg font-pixel text-bg-base mb-3 md:mb-4 flex items-center gap-2">
        <div class="w-2 h-2 bg-accent-400 rounded-sm" />
        修改密码
      </h2>
      <div class="flex flex-col gap-4 md:gap-6">
        <AutoForm
          v-if="passwordSchema" class="space-y-4 md:space-y-6" :schema="passwordSchema" :field-config="{
            password: {
              inputProps: {
                type: 'password',
                placeholder: '••••••••',
              },
            },
          }" @submit="onSubmitPassword"
        >
          <button
            type="submit"
            class="bg-primary-600 hover:bg-secondary-500 text-white font-cartoon font-bold px-4 md:px-6 py-2 md:py-3 rounded-lg border-2 md:border-4 border-bg-base shadow-pixel hover:shadow-[6px_6px_0_0_#000000] transition-all duration-200 hover:scale-105"
          >
            <span class="text-sm md:text-base">修改密码</span>
          </button>
        </AutoForm>
      </div>
    </div>
  </div>
</template>
