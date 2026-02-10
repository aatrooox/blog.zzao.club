<script lang="ts" setup>
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const { $api } = useNuxtApp()

interface RecentMemo {
  id: string
  content: string
  createTs: string
}

interface RecentComment {
  id: string
  content: string
  type: string
  createTs: string
  visitorName: string | null
  username: string | null
  nickname: string | null
}

interface StatsData {
  articles: number
  memos: number
  users: number
  comments: number
  recentMemos: RecentMemo[]
  recentComments: RecentComment[]
}

const stats = ref<StatsData | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await $api.get<StatsData>('/api/v1/admin/stats')
    if (res.data) {
      stats.value = res.data
    }
  }
  finally {
    loading.value = false
  }
})

const statCards = computed(() => [
  { label: '文章数', icon: 'i-lucide-file-text', value: stats.value?.articles, to: '/article' },
  { label: '动态数', icon: 'i-lucide-message-square', value: stats.value?.memos, to: '/admin/memos' },
  { label: '用户数', icon: 'i-lucide-users', value: stats.value?.users, to: '/admin/users' },
  { label: '评论数', icon: 'i-lucide-messages-square', value: stats.value?.comments, to: '/admin/comments' },
])

const quickActions = [
  { label: '发布动态', icon: 'i-lucide-plus-circle', to: '/admin/memos' },
  { label: '管理评论', icon: 'i-lucide-messages-square', to: '/admin/comments' },
  { label: '管理标签', icon: 'i-lucide-tag', to: '/admin/tags' },
  { label: '生成 Token', icon: 'i-lucide-key', to: '/admin/tokens' },
  { label: '系统设置', icon: 'i-lucide-settings', to: '/admin/settings' },
]

function truncate(str: string | null, len = 80) {
  if (!str)
    return ''
  return str.length > len ? `${str.slice(0, len)}...` : str
}

function formatDate(dateStr: string) {
  if (!dateStr)
    return '--'
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function getCommentAuthor(c: RecentComment) {
  return c.nickname || c.username || c.visitorName || '匿名用户'
}
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <NuxtLink v-for="card in statCards" :key="card.label" :to="card.to" class="block">
        <UCard class="hover:ring-1 hover:ring-primary/30 transition-all">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg bg-primary/10">
              <UIcon :name="card.icon" class="w-5 h-5 text-primary" />
            </div>
            <div>
              <p class="text-sm text-muted-foreground">
                {{ card.label }}
              </p>
              <p class="text-2xl font-bold">
                <template v-if="loading">
                  --
                </template>
                <template v-else>
                  {{ card.value ?? '--' }}
                </template>
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>
    </div>

    <!-- Quick Actions -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">
          快捷操作
        </h3>
      </template>
      <div class="flex flex-wrap gap-2">
        <UButton
          v-for="action in quickActions"
          :key="action.label"
          :icon="action.icon"
          :to="action.to"
          variant="outline"
          size="sm"
        >
          {{ action.label }}
        </UButton>
      </div>
    </UCard>

    <!-- Two column layout for recent activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Memos -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">
              最近动态
            </h3>
            <UButton variant="link" size="xs" to="/admin/memos">
              查看全部
            </UButton>
          </div>
        </template>
        <div v-if="loading" class="text-center py-6 text-muted-foreground">
          加载中...
        </div>
        <div v-else-if="!stats?.recentMemos?.length" class="text-center py-6 text-muted-foreground">
          暂无动态
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="memo in stats.recentMemos"
            :key="memo.id"
            class="flex flex-col gap-1 p-3 rounded-lg border"
          >
            <p class="text-sm leading-relaxed">
              {{ truncate(memo.content) }}
            </p>
            <span class="text-xs text-muted-foreground">{{ formatDate(memo.createTs) }}</span>
          </div>
        </div>
      </UCard>

      <!-- Recent Comments -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">
              最近评论
            </h3>
            <UButton variant="link" size="xs" to="/admin/comments">
              查看全部
            </UButton>
          </div>
        </template>
        <div v-if="loading" class="text-center py-6 text-muted-foreground">
          加载中...
        </div>
        <div v-else-if="!stats?.recentComments?.length" class="text-center py-6 text-muted-foreground">
          暂无评论
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="comment in stats.recentComments"
            :key="comment.id"
            class="flex flex-col gap-1 p-3 rounded-lg border"
          >
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium">{{ getCommentAuthor(comment) }}</span>
              <UBadge :color="comment.type === 'memo' ? 'warning' : 'primary'" variant="subtle" size="xs">
                {{ comment.type === 'memo' ? '动态' : '文章' }}
              </UBadge>
            </div>
            <p class="text-sm leading-relaxed text-muted-foreground">
              {{ truncate(comment.content) }}
            </p>
            <span class="text-xs text-muted-foreground">{{ formatDate(comment.createTs) }}</span>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
