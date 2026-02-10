<script lang="ts" setup>
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const { $api } = useNuxtApp()
const toast = useGlobalToast()

interface UserItem {
  id: string
  username: string
  nickname: string | null
  email: string | null
  avatarUrl: string | null
  role: string
  status: number
}

const userList = ref<UserItem[]>([])
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)
const total = ref(0)
const pageSize = 15

async function fetchUsers() {
  loading.value = true
  try {
    const res = await $api.get<any>('/api/v1/admin/users', {
      page: currentPage.value,
      size: pageSize,
    })
    if (res.data) {
      userList.value = res.data.list || []
      total.value = res.data.total || 0
      totalPages.value = res.data.totalPages || 1
    }
  }
  catch {
    toast.error('加载用户列表失败')
  }
  finally {
    loading.value = false
  }
}

async function toggleRole(user: UserItem) {
  const newRole = user.role === 'superAdmin' ? 'user' : 'superAdmin'
  const label = newRole === 'superAdmin' ? '超级管理员' : '普通用户'
  // eslint-disable-next-line no-alert
  if (!window.confirm(`确定将 ${user.nickname || user.username} 的角色改为「${label}」吗？`))
    return

  try {
    const res = await $api.put<any>('/api/v1/admin/users', {
      userId: user.id,
      role: newRole,
    })
    if (res.data) {
      toast.success('角色已更新')
      fetchUsers()
    }
    else {
      toast.error(res.message || '更新失败')
    }
  }
  catch {
    toast.error('操作失败')
  }
}

async function toggleStatus(user: UserItem) {
  const newStatus = user.status === 1 ? 0 : 1
  const label = newStatus === 1 ? '启用' : '禁用'
  // eslint-disable-next-line no-alert
  if (!window.confirm(`确定${label}用户 ${user.nickname || user.username} 吗？`))
    return

  try {
    const res = await $api.put<any>('/api/v1/admin/users', {
      userId: user.id,
      status: newStatus,
    })
    if (res.data) {
      toast.success(`用户已${label}`)
      fetchUsers()
    }
    else {
      toast.error(res.message || '操作失败')
    }
  }
  catch {
    toast.error('操作失败')
  }
}

function goPage(page: number) {
  if (page < 1 || page > totalPages.value)
    return
  currentPage.value = page
  fetchUsers()
}

function getRoleLabel(role: string) {
  return role === 'superAdmin' ? '超级管理员' : '普通用户'
}

function getRoleColor(role: string): 'error' | 'neutral' {
  return role === 'superAdmin' ? 'error' : 'neutral'
}

function getStatusLabel(status: number) {
  return status === 1 ? '正常' : '已禁用'
}

function getStatusColor(status: number): 'success' | 'error' {
  return status === 1 ? 'success' : 'error'
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div class="p-6 space-y-6">
    <div>
      <h2 class="text-xl font-semibold">
        用户管理
      </h2>
      <p class="text-sm text-muted-foreground">
        共 {{ total }} 位用户
      </p>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <UButton loading variant="ghost" disabled>
        加载中...
      </UButton>
    </div>

    <UCard v-else-if="userList.length === 0">
      <div class="text-center py-8 text-muted-foreground">
        暂无用户
      </div>
    </UCard>

    <div v-else class="space-y-3">
      <UCard v-for="user in userList" :key="user.id">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <UAvatar
              :src="user.avatarUrl || undefined"
              :alt="user.nickname || user.username"
              size="md"
            />
            <div class="space-y-0.5">
              <div class="flex items-center gap-2">
                <span class="font-medium">{{ user.nickname || user.username }}</span>
                <UBadge :color="getRoleColor(user.role)" variant="subtle" size="xs">
                  {{ getRoleLabel(user.role) }}
                </UBadge>
                <UBadge :color="getStatusColor(user.status)" variant="subtle" size="xs">
                  {{ getStatusLabel(user.status) }}
                </UBadge>
              </div>
              <div class="text-xs text-muted-foreground flex flex-wrap gap-x-3">
                <span>用户名: {{ user.username }}</span>
                <span v-if="user.email">邮箱: {{ user.email }}</span>
                <span class="font-mono text-[10px]">{{ user.id.slice(0, 8) }}...</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <UButton
              variant="outline"
              size="xs"
              :color="user.role === 'superAdmin' ? 'warning' : 'primary'"
              @click="toggleRole(user)"
            >
              {{ user.role === 'superAdmin' ? '降为普通用户' : '升为管理员' }}
            </UButton>
            <UButton
              variant="outline"
              size="xs"
              :color="user.status === 1 ? 'error' : 'success'"
              @click="toggleStatus(user)"
            >
              {{ user.status === 1 ? '禁用' : '启用' }}
            </UButton>
          </div>
        </div>
      </UCard>
    </div>

    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2">
      <UButton
        variant="outline"
        size="sm"
        :disabled="currentPage <= 1"
        @click="goPage(currentPage - 1)"
      >
        上一页
      </UButton>
      <span class="text-sm text-muted-foreground">
        {{ currentPage }} / {{ totalPages }}
      </span>
      <UButton
        variant="outline"
        size="sm"
        :disabled="currentPage >= totalPages"
        @click="goPage(currentPage + 1)"
      >
        下一页
      </UButton>
    </div>
  </div>
</template>
