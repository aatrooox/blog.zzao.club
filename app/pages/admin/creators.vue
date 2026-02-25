<script lang="ts" setup>
import * as z from 'zod'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const { $api } = useNuxtApp()
const toast = useGlobalToast()

// --- Creator List ---
interface CreatorItem {
  id: string
  username: string
  nickname: string | null
  email: string | null
  avatarUrl: string | null
  role: string
  status: number
}

const creatorList = ref<CreatorItem[]>([])
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)
const total = ref(0)
const pageSize = 15

async function fetchCreators() {
  loading.value = true
  try {
    const res = await $api.get<any>('/api/v1/admin/users', {
      page: currentPage.value,
      size: pageSize,
    })
    if (res.data) {
      // 仅展示普通用户（非 superAdmin）
      creatorList.value = (res.data.list || []).filter((u: CreatorItem) => u.role !== 'superAdmin')
      total.value = res.data.total || 0
      totalPages.value = res.data.totalPages || 1
    }
  }
  catch {
    toast.error('加载创作者列表失败')
  }
  finally {
    loading.value = false
  }
}

function goPage(page: number) {
  if (page < 1 || page > totalPages.value)
    return
  currentPage.value = page
  fetchCreators()
}

function getStatusLabel(status: number) {
  return status === 1 ? '正常' : '已禁用'
}

function getStatusColor(status: number): 'success' | 'error' {
  return status === 1 ? 'success' : 'error'
}

// --- Create Creator ---
const createModalOpen = ref(false)

const createSchema = z.object({
  username: z.string().min(2, '用户名至少 2 个字符').max(50),
  password: z.string().min(6, '密码至少 6 个字符'),
  nickname: z.string().max(50).optional(),
  avatarUrl: z.string().optional(),
})

const createState = reactive({
  username: '',
  password: 'changeme123',
  nickname: '',
  avatarUrl: '',
})

const creating = ref(false)

async function onSubmitCreate() {
  creating.value = true
  try {
    const res = await $api.post<any>('/api/v1/admin/users', {
      username: createState.username,
      password: createState.password,
      nickname: createState.nickname || undefined,
      avatarUrl: createState.avatarUrl || undefined,
    })
    if (res.data) {
      toast.success('创作者已创建')
      createModalOpen.value = false
      createState.username = ''
      createState.password = 'changeme123'
      createState.nickname = ''
      createState.avatarUrl = ''
      fetchCreators()
    }
    else {
      toast.error(res.message || '创建失败')
    }
  }
  catch (e: any) {
    toast.error(e?.data?.message || '创建失败')
  }
  finally {
    creating.value = false
  }
}

// --- Issue PAT ---
const patModalOpen = ref(false)
const patTargetUser = ref<CreatorItem | null>(null)

const patSchema = z.object({
  note: z.string().min(1, '备注不能为空').max(50),
  expiresInDays: z.coerce.number().min(0).max(3650).default(365),
})

const patState = reactive({
  note: '',
  expiresInDays: 365,
})

const availableScopes = ref<{ key: string, label: string }[]>([])
const selectedScopes = ref<string[]>(['memo'])

async function fetchScopes() {
  const res = await $api.get('/api/v1/token/scopes')
  if (res.data?.scopes) {
    availableScopes.value = res.data.scopes.filter((s: any) => s.key !== 'all')
  }
}

function toggleScope(scopeKey: string) {
  if (selectedScopes.value.includes(scopeKey)) {
    const next = selectedScopes.value.filter(s => s !== scopeKey)
    selectedScopes.value = next.length > 0 ? next : ['memo']
  }
  else {
    selectedScopes.value = [...selectedScopes.value, scopeKey]
  }
}

function isScopeSelected(scopeKey: string) {
  return selectedScopes.value.includes(scopeKey)
}

function getScopeLabel(scopeKey: string) {
  return availableScopes.value.find(a => a.key === scopeKey)?.label || scopeKey
}

const generatedPAT = ref<{ token: string, note: string, expiresInDays: number, scopes: string[], expiresAt: string } | null>(null)
const generatingPAT = ref(false)

function openPATModal(creator: CreatorItem) {
  patTargetUser.value = creator
  generatedPAT.value = null
  patState.note = `${creator.nickname || creator.username} 的 Token`
  patState.expiresInDays = 365
  selectedScopes.value = ['memo']
  patModalOpen.value = true
}

async function onSubmitPAT() {
  if (!patTargetUser.value)
    return
  generatingPAT.value = true
  try {
    const res = await $api.post<any>(`/api/v1/admin/users/${patTargetUser.value.id}/pat`, {
      note: patState.note,
      expiresInDays: patState.expiresInDays,
      scopes: selectedScopes.value,
    })
    if (res.data) {
      generatedPAT.value = res.data
      toast.success('PAT 生成成功')
    }
    else {
      toast.error(res.message || '生成失败')
    }
  }
  catch (e: any) {
    toast.error(e?.data?.message || '生成失败')
  }
  finally {
    generatingPAT.value = false
  }
}

function copyPAT() {
  if (generatedPAT.value?.token) {
    navigator.clipboard.writeText(generatedPAT.value.token)
    toast.success('已复制到剪贴板')
  }
}

onMounted(() => {
  fetchCreators()
  fetchScopes()
})
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold">
          创作者管理
        </h2>
        <p class="text-sm text-muted-foreground">
          共 {{ creatorList.length }} 位创作者（当前页）
        </p>
      </div>
      <UButton icon="i-lucide-user-plus" @click="createModalOpen = true">
        新增创作者
      </UButton>
    </div>

    <!-- 创作者列表 -->
    <div v-if="loading" class="flex justify-center py-12">
      <UButton loading variant="ghost" disabled>
        加载中...
      </UButton>
    </div>

    <UCard v-else-if="creatorList.length === 0">
      <div class="text-center py-8 text-muted-foreground">
        暂无创作者，点击「新增创作者」添加
      </div>
    </UCard>

    <div v-else class="space-y-3">
      <UCard v-for="creator in creatorList" :key="creator.id">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <UAvatar
              :src="creator.avatarUrl || undefined"
              :alt="creator.nickname || creator.username"
              size="md"
            />
            <div class="space-y-0.5">
              <div class="flex items-center gap-2">
                <span class="font-medium">{{ creator.nickname || creator.username }}</span>
                <UBadge :color="getStatusColor(creator.status)" variant="subtle" size="xs">
                  {{ getStatusLabel(creator.status) }}
                </UBadge>
              </div>
              <div class="text-xs text-muted-foreground flex flex-wrap gap-x-3">
                <span>用户名: {{ creator.username }}</span>
                <span v-if="creator.email">邮箱: {{ creator.email }}</span>
                <span class="font-mono text-[10px]">{{ creator.id.slice(0, 8) }}...</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <UButton
              variant="outline"
              size="xs"
              color="primary"
              icon="i-lucide-key"
              @click="openPATModal(creator)"
            >
              签发 PAT
            </UButton>
          </div>
        </div>
      </UCard>
    </div>

    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2">
      <UButton variant="outline" size="sm" :disabled="currentPage <= 1" @click="goPage(currentPage - 1)">
        上一页
      </UButton>
      <span class="text-sm text-muted-foreground">{{ currentPage }} / {{ totalPages }}</span>
      <UButton variant="outline" size="sm" :disabled="currentPage >= totalPages" @click="goPage(currentPage + 1)">
        下一页
      </UButton>
    </div>

    <!-- 新增创作者 Modal -->
    <UModal v-model:open="createModalOpen" title="新增创作者">
      <template #content>
        <div class="p-6 space-y-4">
          <h3 class="text-lg font-semibold">
            新增创作者
          </h3>
          <UForm :schema="createSchema" :state="createState" class="space-y-4" @submit="onSubmitCreate">
            <UFormField label="用户名" name="username" required>
              <UInput v-model="createState.username" placeholder="登录用户名" class="w-full" />
            </UFormField>
            <UFormField label="初始密码" name="password" required>
              <UInput v-model="createState.password" type="password" placeholder="至少 6 位" class="w-full" />
            </UFormField>
            <UFormField label="昵称（可选）" name="nickname">
              <UInput v-model="createState.nickname" placeholder="显示名称" class="w-full" />
            </UFormField>
            <UFormField label="头像 URL（可选）" name="avatarUrl">
              <UInput v-model="createState.avatarUrl" placeholder="https://..." class="w-full" />
            </UFormField>
            <div class="flex justify-end gap-2">
              <UButton variant="outline" @click="createModalOpen = false">
                取消
              </UButton>
              <UButton type="submit" :loading="creating">
                创建
              </UButton>
            </div>
          </UForm>
        </div>
      </template>
    </UModal>

    <!-- 签发 PAT Modal -->
    <UModal v-model:open="patModalOpen" title="为创作者签发 PAT">
      <template #content>
        <div class="p-6 space-y-4">
          <h3 class="text-lg font-semibold">
            为 {{ patTargetUser?.nickname || patTargetUser?.username }} 签发 PAT
          </h3>

          <!-- 生成结果 -->
          <UAlert
            v-if="generatedPAT"
            color="success"
            title="PAT 生成成功！请立即复制保存，它将不会再次显示。"
          />
          <div v-if="generatedPAT" class="space-y-3">
            <div class="flex items-center gap-2">
              <code class="flex-1 bg-muted border rounded p-3 font-mono text-xs break-all select-all">
                {{ generatedPAT.token }}
              </code>
              <UButton icon="i-lucide-copy" variant="outline" size="sm" @click="copyPAT">
                复制
              </UButton>
            </div>
            <div class="text-xs text-muted-foreground space-y-0.5">
              <p>备注：{{ generatedPAT.note }}</p>
              <p>有效期：{{ generatedPAT.expiresInDays === 0 ? '永久' : `${generatedPAT.expiresInDays} 天` }}</p>
              <p>权限范围：{{ generatedPAT.scopes?.map(s => getScopeLabel(s)).join('、') }}</p>
            </div>
            <div class="flex justify-end gap-2">
              <UButton variant="outline" @click="generatedPAT = null">
                再生成一个
              </UButton>
              <UButton @click="patModalOpen = false">
                完成
              </UButton>
            </div>
          </div>

          <!-- 生成表单 -->
          <UForm v-else :schema="patSchema" :state="patState" class="space-y-4" @submit="onSubmitPAT">
            <UFormField label="Token 备注" name="note" required>
              <UInput v-model="patState.note" placeholder="例如：iOS 快捷指令" class="w-full" />
            </UFormField>
            <UFormField label="有效期（天，0 = 永久）" name="expiresInDays">
              <UInput v-model.number="patState.expiresInDays" type="number" placeholder="365" class="w-full" />
            </UFormField>
            <div class="space-y-2">
              <label class="text-sm font-medium">权限范围</label>
              <div class="flex flex-wrap gap-2">
                <UButton
                  v-for="scope in availableScopes"
                  :key="scope.key"
                  :variant="isScopeSelected(scope.key) ? 'solid' : 'outline'"
                  :color="isScopeSelected(scope.key) ? 'primary' : 'neutral'"
                  size="sm"
                  @click="toggleScope(scope.key)"
                >
                  {{ scope.label }}
                </UButton>
              </div>
            </div>
            <div class="flex justify-end gap-2">
              <UButton variant="outline" @click="patModalOpen = false">
                取消
              </UButton>
              <UButton type="submit" :loading="generatingPAT">
                生成 PAT
              </UButton>
            </div>
          </UForm>
        </div>
      </template>
    </UModal>
  </div>
</template>
