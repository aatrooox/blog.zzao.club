<script lang="ts" setup>
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const { $api } = useNuxtApp()
const toast = useGlobalToast()

// State
const comments = ref<any[]>([])
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)
const total = ref(0)
const pageSize = 15

// Fetch comments
async function fetchComments() {
  loading.value = true
  try {
    const res = await $api.get<any>('/api/v1/admin/comments', {
      page: currentPage.value,
      size: pageSize,
    })
    if (res.data) {
      comments.value = res.data.list || []
      total.value = res.data.total || 0
      totalPages.value = res.data.totalPages || 1
    }
  }
  catch {
    toast.error('加载评论列表失败')
  }
  finally {
    loading.value = false
  }
}

// Delete comment
async function handleDelete(comment: any) {
  // eslint-disable-next-line no-alert
  if (!window.confirm('确定删除这条评论吗？'))
    return

  try {
    const { error } = await $api.post('/api/v1/comment/del', { id: comment.id })
    if (!error) {
      toast.success('评论已删除')
      fetchComments()
    }
    else {
      toast.error('删除失败')
    }
  }
  catch {
    toast.error('删除失败')
  }
}

// Pagination
function goPage(page: number) {
  if (page < 1 || page > totalPages.value)
    return
  currentPage.value = page
  fetchComments()
}

// Format date
function formatDate(dateStr: string) {
  if (!dateStr)
    return '--'
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// Truncate content
function truncate(str: string | null, len = 300) {
  if (!str)
    return ''
  return str.length > len ? `${str.slice(0, len)}...` : str
}

// Get type label
function getTypeLabel(type: string) {
  return type === 'memo' ? '动态评论' : '文章评论'
}

// Get type color
function getTypeColor(type: string): 'primary' | 'warning' {
  return type === 'memo' ? 'warning' : 'primary'
}

// Get author display name
function getAuthor(comment: any) {
  if (comment.user_info?.nickname)
    return comment.user_info.nickname
  if (comment.user_info?.username)
    return comment.user_info.username
  if (comment.visitorName)
    return `${comment.visitorName}（游客）`
  return '匿名用户'
}

// Build source link for a comment
function getSourceLink(comment: any): string | null {
  if (comment.type === 'memo' && comment.memoId) {
    return `https://zzao.club/m/${comment.memoId}`
  }
  if (comment.articleId) {
    // Nuxt Content v3 id format: "content/post/tips/some-slug.md" → "/post/tips/some-slug"
    const path = comment.articleId.replace(/^content/, '').replace(/\.md$/, '')
    return `https://zzao.club${path}#评论区`
  }
  return null
}

// Get source label for a comment
function getSourceLabel(comment: any): string {
  if (comment.type === 'memo' && comment.memoId) {
    return `动态: ${comment.memoId.slice(0, 8)}...`
  }
  if (comment.articleId) {
    return `文章: ${comment.articleId.slice(0, 20)}...`
  }
  return ''
}

onMounted(() => {
  fetchComments()
})
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-xl font-semibold">
        评论管理
      </h2>
      <p class="text-sm text-muted-foreground">
        共 {{ total }} 条评论
      </p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <UButton loading variant="ghost" disabled>
        加载中...
      </UButton>
    </div>

    <!-- Empty -->
    <UCard v-else-if="comments.length === 0">
      <div class="text-center py-8 text-muted-foreground">
        暂无评论
      </div>
    </UCard>

    <!-- Comment list -->
    <div v-else class="space-y-3">
      <UCard v-for="comment in comments" :key="comment.id">
        <div class="space-y-2">
          <!-- Meta -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UAvatar
                v-if="comment.user_info?.avatarUrl"
                :src="comment.user_info.avatarUrl"
                size="xs"
              />
              <span class="text-sm font-medium">{{ getAuthor(comment) }}</span>
              <UBadge :color="getTypeColor(comment.type)" variant="subtle" size="xs">
                {{ getTypeLabel(comment.type) }}
              </UBadge>
              <a
                v-if="getSourceLink(comment)"
                :href="getSourceLink(comment)!"
                target="_blank"
                class="text-xs text-primary hover:underline"
              >
                {{ getSourceLabel(comment) }}
              </a>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-muted-foreground">{{ formatDate(comment.createTs) }}</span>
              <UButton
                icon="i-lucide-trash-2"
                variant="ghost"
                color="error"
                size="xs"
                @click="handleDelete(comment)"
              />
            </div>
          </div>

          <!-- Content -->
          <p class="text-sm leading-relaxed pl-8">
            {{ truncate(comment.content) }}
          </p>
        </div>
      </UCard>
    </div>

    <!-- Pagination -->
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
