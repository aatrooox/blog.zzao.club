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

const { $api } = useNuxtApp()
const toast = useGlobalToast()
const userStore = useUserStore()
const schema = ref<any>(null)
const configSchema = ref<any>(null)

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

onMounted(() => {
  getUserInfo()
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 pb-8">
    <h2 class="text-3xl font-bold mb-4">
      基本信息
    </h2>
    <div class="flex flex-col gap-8 mb-4">
      <AutoForm v-if="schema" class="space-y-6" :schema="schema" @submit="onSubmit">
        <Button type="submit" class="mr-2">
          保存
        </Button>
        <Button href="/api/v1/auth/github?setting=1" as="a">
          关联 Github 头像
        </Button>
      </AutoForm>
    </div>
    <h2 class="text-3xl font-bold mb-4">
      用户设置
    </h2>
    <div class="flex flex-col gap-8 mb-4">
      <AutoForm
        v-if="configSchema" class="space-y-6" :schema="configSchema" :field-config="{
          allowEmailNotify: {
            component: 'switch',
          },
        }" @submit="onSubmitConfig"
      >
        <Button type="submit">
          保存设置
        </Button>
      </AutoForm>
    </div>

    <h2 class="text-3xl font-bold mb-4">
      修改密码
    </h2>
    <div class="flex flex-col gap-8">
      <AutoForm
        v-if="passwordSchema" class="space-y-6" :schema="passwordSchema" :field-config="{
          password: {
            inputProps: {
              type: 'password',
              placeholder: '••••••••',
            },
          },
        }" @submit="onSubmitPassword"
      >
        <Button type="submit">
          修改密码
        </Button>
      </AutoForm>
    </div>
  </div>
</template>
