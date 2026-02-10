<script lang="ts" setup>
import * as z from 'zod'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const { $api } = useNuxtApp()
const toast = useGlobalToast()

// --- PAT List ---
const patList = ref<any[]>([])
const loading = ref(true)

async function fetchPATs() {
  loading.value = true
  try {
    const res = await $api.get('/api/v1/token/list')
    if (res.data) {
      patList.value = res.data
    }
  }
  finally {
    loading.value = false
  }
}

// --- Scopes ---
const availableScopes = ref<{ key: string, label: string, paths: string[] }[]>([])
const selectedScopes = ref<string[]>(['all'])

async function fetchScopes() {
  const res = await $api.get('/api/v1/token/scopes')
  if (res.data?.scopes) {
    availableScopes.value = res.data.scopes
  }
}

function toggleScope(scopeKey: string) {
  if (scopeKey === 'all') {
    selectedScopes.value = ['all']
    return
  }
  const filtered = selectedScopes.value.filter(s => s !== 'all')
  if (filtered.includes(scopeKey)) {
    const newScopes = filtered.filter(s => s !== scopeKey)
    selectedScopes.value = newScopes.length > 0 ? newScopes : ['all']
  }
  else {
    selectedScopes.value = [...filtered, scopeKey]
  }
}

function isScopeSelected(scopeKey: string): boolean {
  return selectedScopes.value.includes(scopeKey)
}

function getScopeLabel(scopeKey: string): string {
  return availableScopes.value.find(a => a.key === scopeKey)?.label || scopeKey
}

// --- Generate PAT ---
const patSchema = z.object({
  note: z.string().min(1, '备注不能为空').max(50, '备注不能超过 50 个字符'),
  expiresInDays: z.coerce.number().min(0).max(3650).default(365),
})
const patState = reactive({
  note: '',
  expiresInDays: 365,
})
const generatedToken = ref<{ token: string, note: string, expiresInDays: number, scopes: string[] } | null>(null)
const generating = ref(false)

async function onSubmitPAT() {
  generating.value = true
  try {
    const res = await $api.post('/api/v1/token/generate', {
      ...patState,
      scopes: selectedScopes.value,
    })
    if (res.data) {
      generatedToken.value = res.data
      toast.success('Token 生成成功')
      selectedScopes.value = ['all']
      patState.note = ''
      patState.expiresInDays = 365
      fetchPATs()
    }
  }
  catch {
    toast.error('生成失败')
  }
  finally {
    generating.value = false
  }
}

function copyToken() {
  if (generatedToken.value?.token) {
    navigator.clipboard.writeText(generatedToken.value.token)
    toast.success('已复制到剪贴板')
  }
}

// --- Delete PAT ---
async function deletePAT(id: string) {
  // eslint-disable-next-line no-alert
  if (!window.confirm('确定要移除这个 Token 吗？移除后将无法恢复，使用该 Token 的应用将无法访问。')) {
    return
  }
  await $api.delete(`/api/v1/token/${id}`)
  toast.success('移除成功')
  fetchPATs()
}

function isExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date()
}

onMounted(() => {
  fetchPATs()
  fetchScopes()
})
</script>

<template>
  <div class="p-6 space-y-6 max-w-4xl">
    <!-- Info Banner -->
    <UAlert
      title="什么是 PAT？"
      description="Personal Access Token (PAT) 用于第三方应用或脚本访问您的账户数据。请妥善保管，不要泄露给他人。"
      icon="i-lucide-info"
      color="info"
    />

    <!-- Generated Token Display -->
    <UCard v-if="generatedToken" color="success">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-green-800">
            Token 生成成功！
          </h3>
          <UButton variant="link" size="sm" @click="generatedToken = null">
            生成新的
          </UButton>
        </div>
      </template>

      <div class="space-y-3">
        <p class="text-sm font-medium text-green-700">
          请立即复制保存，它将不会再次显示：
        </p>
        <div class="flex items-center gap-2">
          <code class="flex-1 bg-white border rounded p-3 font-mono text-sm break-all select-all">
            {{ generatedToken.token }}
          </code>
          <UButton icon="i-lucide-copy" variant="outline" @click="copyToken">
            复制
          </UButton>
        </div>
        <div class="text-xs text-muted space-y-0.5">
          <p>备注：{{ generatedToken.note }}</p>
          <p>有效期：{{ generatedToken.expiresInDays === 0 ? '永久' : `${generatedToken.expiresInDays} 天` }}</p>
          <p>权限范围：{{ generatedToken.scopes?.map(s => getScopeLabel(s)).join('、') || '全部' }}</p>
        </div>
      </div>
    </UCard>

    <!-- Generate Form -->
    <UCard v-if="!generatedToken">
      <template #header>
        <h3 class="text-lg font-semibold">
          生成新 Token
        </h3>
      </template>

      <UForm :schema="patSchema" :state="patState" class="space-y-4" @submit="onSubmitPAT">
        <UFormField label="Token 备注" name="note">
          <UInput v-model="patState.note" placeholder="例如：我的 iOS 快捷指令" class="w-full" />
        </UFormField>

        <UFormField label="有效期（天）" name="expiresInDays" description="0 表示永不过期">
          <UInput v-model.number="patState.expiresInDays" type="number" placeholder="365" class="w-full" />
        </UFormField>

        <!-- Scopes Selection -->
        <div class="space-y-2">
          <label class="text-sm font-medium">权限范围</label>
          <p class="text-xs text-muted">
            选择该 Token 可以访问的接口范围，建议按需选择最小权限
          </p>
          <div class="flex flex-wrap gap-2">
            <UButton
              v-for="scope in availableScopes"
              :key="scope.key"
              :variant="isScopeSelected(scope.key) ? 'solid' : 'outline'"
              :color="isScopeSelected(scope.key) ? 'primary' : 'neutral'"
              size="sm"
              :title="scope.paths.join(', ')"
              @click="toggleScope(scope.key)"
            >
              {{ scope.label }}
            </UButton>
          </div>
          <p v-if="selectedScopes.length > 0 && !selectedScopes.includes('all')" class="text-xs text-blue-600">
            已选择：{{ selectedScopes.map(s => getScopeLabel(s)).join('、') }}
          </p>
        </div>

        <UButton type="submit" :loading="generating">
          生成 Token
        </UButton>
      </UForm>
    </UCard>

    <!-- Token List -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">
          已生成的 Token
        </h3>
      </template>

      <div v-if="loading" class="text-center py-8 text-muted">
        加载中...
      </div>

      <div v-else-if="patList.length === 0" class="text-center py-8 text-muted">
        暂无 Token
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="pat in patList"
          :key="pat.id"
          class="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-lg border"
        >
          <div class="flex-1 space-y-1">
            <div class="flex items-center gap-2">
              <span class="font-medium">{{ pat.note }}</span>
              <UBadge v-if="isExpired(pat.expiresAt)" color="error" variant="subtle" size="sm">
                已过期
              </UBadge>
            </div>
            <div class="text-xs text-muted flex flex-wrap gap-x-4 gap-y-1">
              <span>创建于：<NuxtTime :datetime="pat.createdAt" /></span>
              <span>过期时间：<NuxtTime :datetime="pat.expiresAt" /></span>
            </div>
            <div v-if="pat.scopes && pat.scopes.length > 0" class="flex flex-wrap gap-1 mt-1">
              <UBadge
                v-for="scope in pat.scopes"
                :key="scope"
                variant="subtle"
                size="sm"
              >
                {{ getScopeLabel(scope) }}
              </UBadge>
            </div>
          </div>

          <UButton
            color="error"
            variant="outline"
            size="sm"
            icon="i-lucide-trash-2"
            @click="deletePAT(pat.id)"
          >
            移除
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>
