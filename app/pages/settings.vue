<script lang="ts" setup>
import type { ApiResponse } from '~~/types/fetch'
import { AutoForm } from '#components'
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
      // 仅在客户端进行 Token 检查
      if (import.meta.client) {
        const tokenInfoStr = localStorage.getItem('blog/tokenInfo')
        let hasToken = false

        // 1. 检查新的 tokenInfo
        if (tokenInfoStr) {
          try {
            const tokenInfo = JSON.parse(tokenInfoStr)
            if (tokenInfo.accessToken) {
              hasToken = true
            }
          }
          catch (e) {
            console.error('Token parse error', e)
          }
        }

        // 2. 兼容旧的 token
        if (!hasToken && localStorage.getItem('blog/token')) {
          hasToken = true
        }

        if (!hasToken) {
          return navigateTo('/', { redirectCode: 301 })
        }
      }
    },
  ],
})

const { user } = useUserSession()
const { $api } = useNuxtApp()
const toast = useGlobalToast()
const userStore = useUser()
const schema = ref<any>(null)
const configSchema = ref<any>(null)
const route = useRoute()

// Tabs 配置
const tabs = [
  { label: '基本信息', value: 'profile', color: 'bg-primary-600' },
  { label: '用户设置', value: 'account', color: 'bg-primary-600' },
  { label: '安全设置', value: 'security', color: 'bg-primary-600' },
  { label: '开发者设置', value: 'developer', color: 'bg-primary-600' },
]
const currentTab = ref('profile')

// PAT 相关
const generatedToken = ref<{ token: string, note: string, expiresInDays: number, scopes: string[] } | null>(null)
const patList = ref<any[]>([])
const availableScopes = ref<{ key: string, label: string, paths: string[] }[]>([])
const selectedScopes = ref<string[]>(['all'])

const patSchema = z.object({
  note: z.string()
    .min(1, { message: '备注不能为空' })
    .max(50, { message: '备注不能超过50个字符' })
    .describe('Token 备注'),
  expiresInDays: z.number()
    .min(0)
    .max(3650)
    .default(365)
    .describe('有效期(天)'),
})

async function fetchScopes() {
  const res = await $api.get<ApiResponse>('/api/v1/token/scopes')
  if (res.data?.scopes) {
    availableScopes.value = res.data.scopes
  }
}

function toggleScope(scopeKey: string) {
  if (scopeKey === 'all') {
    // 选择 all 时清除其他选择
    selectedScopes.value = ['all']
    return
  }

  // 选择其他时移除 all
  const filtered = selectedScopes.value.filter(s => s !== 'all')

  if (filtered.includes(scopeKey)) {
    // 取消选择
    const newScopes = filtered.filter(s => s !== scopeKey)
    selectedScopes.value = newScopes.length > 0 ? newScopes : ['all']
  }
  else {
    // 添加选择
    selectedScopes.value = [...filtered, scopeKey]
  }
}

function isScopeSelected(scopeKey: string): boolean {
  return selectedScopes.value.includes(scopeKey)
}

async function fetchPATs() {
  const res = await $api.get<ApiResponse>('/api/v1/token/list')
  if (res.data) {
    patList.value = res.data
  }
}

async function deletePAT(id: string) {
  // eslint-disable-next-line no-alert
  if (!window.confirm('确定要移除这个 Token 吗？移除后将无法恢复，使用该 Token 的应用将无法访问。')) {
    return
  }
  const res = await $api.delete<ApiResponse>(`/api/v1/token/${id}`)
  if (res.code === 200) {
    toast.success('移除成功')
    fetchPATs()
  }
}

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

  const res = await $api.put<ApiResponse>(`/api/v1/user/${userStore.user.value.id}`, values)

  if (res.data) {
    toast.success('更新成功')
  }
}

async function onSubmitConfig(values: Record<string, any>) {
  // 过滤掉空值
  values = Object.fromEntries(Object.entries(values).filter(([_, value]) => value !== null && value !== undefined))

  console.log(`values`, values)
  values.allowEmailNotify = values.allowEmailNotify ? 1 : 0
  const res = await $api.post<ApiResponse>(`/api/v1/user/config`, { ...values, userId: userStore.user.value.id })
  if (res.data) {
    toast.success('更新成功')
  }
}

async function onSubmitPassword(values: Record<string, any>) {
  // 过滤掉空值
  values = Object.fromEntries(Object.entries(values).filter(([_, value]) => value !== null && value !== undefined))

  // 直接发送明文密码，由后端处理 Hash 或在登录时自动升级
  const res = await $api.put(`/api/v1/user/${userStore.user.value.id}`, { ...values })
  if (res.data) {
    toast.success('更新成功')
  }
}

async function onSubmitPAT(values: Record<string, any>) {
  const res = await $api.post<ApiResponse>('/api/v1/token/generate', {
    ...values,
    scopes: selectedScopes.value,
  })
  if (res.data) {
    generatedToken.value = res.data
    toast.success('Token 生成成功')
    selectedScopes.value = ['all'] // 重置选择
    fetchPATs() // 刷新列表
  }
}

function copyToken() {
  if (generatedToken.value?.token) {
    navigator.clipboard.writeText(generatedToken.value.token)
    toast.success('已复制到剪贴板')
  }
}

async function getUserInfo() {
  const res = await $api.post('/api/v1/user/detail', { id: userStore.user.value.id })
  const res2 = await $api.get(`/api/v1/user/config/${userStore.user.value.id}`)

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
    const { data, error } = await $api.put(`/api/v1/user/${userStore.user.value.id}`, {
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
  fetchPATs()
  fetchScopes()
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

    <!-- Tab 导航栏 -->
    <div class="flex flex-wrap gap-2 md:gap-4 justify-center md:justify-start">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="px-4 md:px-6 py-2 md:py-3 font-cartoon font-bold rounded-lg border-2 md:border-4 transition-all duration-200 text-sm md:text-base"
        :class="[
          currentTab === tab.value
            ? `${tab.color} text-gray-600 border-bg-base shadow-pixel transform -translate-y-1`
            : 'bg-white text-gray-600 border-transparent hover:border-bg-base hover:bg-gray-50',
        ]"
        @click="currentTab = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 基本信息卡片 -->
    <div v-if="currentTab === 'profile'" class="bg-white rounded-lg md:rounded-xl shadow-pixel border-2 md:border-4 border-bg-base p-4 md:p-8 animate-fade-in">
      <h2 class="text-base md:text-lg font-pixel text-bg-base mb-3 md:mb-4 flex items-center gap-2">
        <div class="w-2 h-2 bg-primary-600 rounded-sm" />
        基本信息
      </h2>
      <div class="flex flex-col gap-4 md:gap-6">
        <AutoForm v-if="schema" class="space-y-4 md:space-y-6" :schema="schema" @submit="onSubmit">
          <div class="flex flex-wrap gap-2 md:gap-3">
            <button
              type="submit"
              class="bg-primary-600 hover:bg-secondary-500 text-gray-600 font-cartoon font-bold px-4 md:px-6 py-2 md:py-3 rounded-lg border-2 md:border-4 border-bg-base shadow-pixel hover:shadow-[6px_6px_0_0_#000000] transition-all duration-200 hover:scale-105"
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
    <div v-if="currentTab === 'account'" class="bg-white rounded-lg md:rounded-xl shadow-pixel border-2 md:border-4 border-bg-base p-4 md:p-8 animate-fade-in">
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
            class="bg-primary-600 hover:bg-secondary-500 text-gray-600 font-cartoon font-bold px-4 md:px-6 py-2 md:py-3 rounded-lg border-2 md:border-4 border-bg-base shadow-pixel hover:shadow-[6px_6px_0_0_#000000] transition-all duration-200 hover:scale-105"
          >
            <span class="text-sm md:text-base">保存设置</span>
          </button>
        </AutoForm>
      </div>
    </div>

    <!-- 修改密码卡片 -->
    <div v-if="currentTab === 'security'" class="bg-white rounded-lg md:rounded-xl shadow-pixel border-2 md:border-4 border-bg-base p-4 md:p-8 animate-fade-in">
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
            class="bg-primary-600 hover:bg-secondary-500 text-gray-600 font-cartoon font-bold px-4 md:px-6 py-2 md:py-3 rounded-lg border-2 md:border-4 border-bg-base shadow-pixel hover:shadow-[6px_6px_0_0_#000000] transition-all duration-200 hover:scale-105"
          >
            <span class="text-sm md:text-base">修改密码</span>
          </button>
        </AutoForm>
      </div>
    </div>

    <!-- 开发者设置卡片 (PAT) -->
    <div v-if="currentTab === 'developer'" class="bg-white rounded-lg md:rounded-xl shadow-pixel border-2 md:border-4 border-bg-base p-4 md:p-8 animate-fade-in">
      <h2 class="text-base md:text-lg font-pixel text-bg-base mb-3 md:mb-4 flex items-center gap-2">
        <div class="w-2 h-2 bg-gray-800 rounded-sm" />
        开发者设置 (Personal Access Token)
      </h2>

      <div class="flex flex-col gap-6">
        <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-sm text-blue-800 font-cartoon">
          <p class="font-bold mb-1">
            什么是 PAT？
          </p>
          <p>
            Personal Access Token (PAT) 用于第三方应用或脚本访问您的账户数据。请妥善保管，不要泄露给他人。
          </p>
        </div>

        <div v-if="!generatedToken">
          <AutoForm
            class="space-y-4 md:space-y-6"
            :schema="patSchema"
            :field-config="{
              note: {
                inputProps: {
                  placeholder: '例如：我的 iOS 快捷指令',
                },
              },
              expiresInDays: {
                inputProps: {
                  type: 'number',
                  placeholder: '365',
                },
                description: '0 表示永不过期',
              },
            }"
            @submit="onSubmitPAT"
          >
            <!-- Scopes 选择 -->
            <div class="space-y-2">
              <label class="text-sm font-bold text-gray-700">权限范围</label>
              <p class="text-xs text-gray-500 mb-2">
                选择该 Token 可以访问的接口范围，建议按需选择最小权限
              </p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="scope in availableScopes"
                  :key="scope.key"
                  type="button"
                  class="px-3 py-1.5 text-sm rounded-lg border-2 transition-all duration-200 font-cartoon"
                  :class="[
                    isScopeSelected(scope.key)
                      ? 'bg-primary-600 border-bg-base text-gray-800 shadow-pixel'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50',
                  ]"
                  :title="scope.paths.join(', ')"
                  @click="toggleScope(scope.key)"
                >
                  {{ scope.label }}
                </button>
              </div>
              <p v-if="selectedScopes.length > 0 && !selectedScopes.includes('all')" class="text-xs text-blue-600 mt-1">
                已选择: {{ selectedScopes.map(s => availableScopes.find(a => a.key === s)?.label).join('、') }}
              </p>
            </div>

            <button
              type="submit"
              class="text-gray-600 font-cartoon font-bold px-4 md:px-6 py-2 md:py-3 rounded-lg border-2 md:border-4 border-bg-base shadow-pixel hover:shadow-[6px_6px_0_0_#000000] transition-all duration-200 hover:scale-105"
            >
              <span class="text-sm md:text-base">生成 Token</span>
            </button>
          </AutoForm>
        </div>

        <div v-else class="bg-green-50 border-2 border-green-200 rounded-lg p-6 animate-fade-in">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-pixel text-green-800 text-lg">
              Token 生成成功！
            </h3>
            <button
              class="text-sm text-gray-500 hover:text-gray-700 underline"
              @click="generatedToken = null"
            >
              生成新的
            </button>
          </div>

          <p class="text-sm text-green-700 mb-2 font-bold">
            请立即复制保存，它将不会再次显示：
          </p>

          <div class="flex items-center gap-2">
            <code class="flex-1 bg-white border-2 border-green-200 p-3 rounded font-mono text-sm break-all select-all">
              {{ generatedToken.token }}
            </code>
            <button
              class="bg-green-600 hover:bg-green-500 text-gray-600 px-4 py-3 rounded border-2 border-green-800 shadow-sm font-bold text-sm whitespace-nowrap"
              @click="copyToken"
            >
              复制
            </button>
          </div>

          <div class="mt-4 text-xs text-gray-500 space-y-1">
            <p>备注: {{ generatedToken.note }}</p>
            <p>有效期: {{ generatedToken.expiresInDays === 0 ? '永久' : `${generatedToken.expiresInDays} 天` }}</p>
            <p>权限范围: {{ generatedToken.scopes?.map(s => availableScopes.find(a => a.key === s)?.label || s).join('、') || '全部' }}</p>
          </div>
        </div>

        <!-- PAT 列表 -->
        <div v-if="patList.length > 0" class="mt-8">
          <h3 class="text-base font-pixel text-bg-base mb-4 flex items-center gap-2">
            <div class="w-1.5 h-1.5 bg-gray-600 rounded-sm" />
            已生成的 Token
          </h3>

          <div class="space-y-3">
            <div
              v-for="pat in patList"
              :key="pat.id"
              class="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-gray-300 transition-colors"
            >
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-bold text-gray-800">{{ pat.note }}</span>
                  <span
                    v-if="new Date(pat.expiresAt) < new Date()"
                    class="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded border border-red-200"
                  >
                    已过期
                  </span>
                </div>
                <div class="text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                  <span>创建于: <NuxtTime :datetime="pat.createdAt" /></span>
                  <span>过期时间: <NuxtTime :datetime="pat.expiresAt" /></span>
                </div>
                <div v-if="pat.scopes && pat.scopes.length > 0" class="mt-1 flex flex-wrap gap-1">
                  <span
                    v-for="scope in pat.scopes"
                    :key="scope"
                    class="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-200"
                  >
                    {{ availableScopes.find(a => a.key === scope)?.label || scope }}
                  </span>
                </div>
              </div>

              <button
                class="text-red-600 hover:text-red-700 text-sm font-bold px-3 py-1.5 rounded border-2 border-red-200 hover:border-red-300 bg-white hover:bg-red-50 transition-all"
                @click="deletePAT(pat.id)"
              >
                移除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
