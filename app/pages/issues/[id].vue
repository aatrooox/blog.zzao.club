<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()
const userStore = useUser()
const { fetchTodo, updateTodo, fetchComments, addComment, fetchTags } = useTodos()
const toast = useGlobalToast()
const dayjs = useDayjs()

const id = computed(() => route.params.id as string)

const issue = ref<any>(null)
const comments = ref<any[]>([])
const allTags = ref<any[]>([])
const loading = ref(true)
const commentContent = ref('')
const submittingComment = ref(false)
const savingStatus = ref(false)

// Edit mode for reporter
const editMode = ref(false)
const editTitle = ref('')
const editDescription = ref('')
const savingEdit = ref(false)

const STATUS_LABELS: Record<string, string> = {
  open: '开放',
  in_progress: '进行中',
  closed: '已关闭',
  wontfix: '不修复',
}
const STATUS_COLORS: Record<string, string> = {
  open: 'success',
  in_progress: 'warning',
  closed: 'neutral',
  wontfix: 'neutral',
}

const statusOptions = [
  { label: '开放', value: 'open' },
  { label: '进行中', value: 'in_progress' },
  { label: '已关闭', value: 'closed' },
  { label: '不修复', value: 'wontfix' },
]
const visibilityOptions = [
  { label: '公开', value: 'public' },
  { label: '私密', value: 'private' },
]

const isOwner = computed(() => userStore.isSuperAdmin)
const isReporter = computed(() => issue.value && userStore.userInfo?.id === issue.value.reporterUserId)
const canEdit = computed(() => isOwner.value || isReporter.value)

async function load() {
  loading.value = true
  try {
    const [issueData, commentsData, tagsData] = await Promise.all([
      fetchTodo(id.value),
      fetchComments(id.value),
      fetchTags(),
    ])
    if (!issueData) {
      toast.error('Issue 不存在')
      router.replace('/issues')
      return
    }
    issue.value = issueData
    comments.value = commentsData
    allTags.value = tagsData
  }
  finally {
    loading.value = false
  }
}

function startEdit() {
  editTitle.value = issue.value?.title ?? ''
  editDescription.value = issue.value?.description ?? ''
  editMode.value = true
}

function cancelEdit() {
  editMode.value = false
}

async function saveEdit() {
  if (!editTitle.value.trim()) {
    toast.warn('标题不能为空')
    return
  }
  savingEdit.value = true
  try {
    const result = await updateTodo(id.value, {
      title: editTitle.value.trim(),
      description: editDescription.value.trim() || undefined,
    })
    if (result) {
      issue.value = { ...issue.value, title: result.title, description: result.description }
      editMode.value = false
    }
  }
  finally {
    savingEdit.value = false
  }
}

async function onStatusChange(newStatus: string) {
  savingStatus.value = true
  try {
    const result = await updateTodo(id.value, { status: newStatus })
    if (result)
      issue.value = { ...issue.value, status: result.status }
  }
  finally {
    savingStatus.value = false
  }
}

async function onVisibilityChange(newVis: string) {
  const result = await updateTodo(id.value, { visibility: newVis })
  if (result)
    issue.value = { ...issue.value, visibility: result.visibility }
}

function toggleTag(tagId: string) {
  const currentTags: any[] = issue.value?.tags ?? []
  const exists = currentTags.find((t: any) => t.id === tagId)
  const newTagIds = exists
    ? currentTags.filter((t: any) => t.id !== tagId).map((t: any) => t.id)
    : [...currentTags.map((t: any) => t.id), tagId]
  updateTodo(id.value, { tagIds: newTagIds }).then((result) => {
    if (result)
      issue.value = { ...issue.value, tags: result.tags }
  })
}

async function submitComment() {
  if (!commentContent.value.trim()) {
    toast.warn('评论内容不能为空')
    return
  }
  submittingComment.value = true
  try {
    const result = await addComment(id.value, commentContent.value.trim())
    if (result) {
      comments.value = [...comments.value, {
        ...result,
        author: {
          id: userStore.userInfo?.id,
          username: userStore.userInfo?.username,
          nickname: userStore.userInfo?.nickname,
          avatarUrl: userStore.userInfo?.avatarUrl,
        },
      }]
      commentContent.value = ''
    }
  }
  finally {
    submittingComment.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <!-- Back -->
    <div class="mb-4">
      <NuxtLink to="/issues">
        <UButton variant="ghost" size="sm" icon="i-lucide-arrow-left">
          返回列表
        </UButton>
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="animate-pulse space-y-4">
      <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
      <div class="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>

    <template v-else-if="issue">
      <!-- Issue header -->
      <UCard class="mb-6">
        <div class="space-y-3">
          <!-- Title row -->
          <div v-if="!editMode" class="flex items-start gap-3">
            <div class="flex-1">
              <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {{ issue.title }}
              </h1>
              <div class="flex items-center flex-wrap gap-2">
                <UBadge :color="STATUS_COLORS[issue.status] ?? 'neutral'" variant="subtle">
                  {{ STATUS_LABELS[issue.status] ?? issue.status }}
                </UBadge>
                <UBadge v-if="issue.visibility === 'private'" color="neutral" variant="outline">
                  私密
                </UBadge>
                <UBadge
                  v-for="tag in (issue.tags ?? [])"
                  :key="tag.id"
                  :color="tag.color ?? 'neutral'"
                  variant="subtle"
                >
                  {{ tag.name }}
                </UBadge>
              </div>
            </div>
            <UButton v-if="canEdit" variant="ghost" size="sm" icon="i-lucide-pencil" @click="startEdit" />
          </div>

          <!-- Edit mode -->
          <div v-else class="space-y-3">
            <UInput v-model="editTitle" placeholder="标题" :maxlength="500" />
            <UTextarea v-model="editDescription" placeholder="描述" :rows="4" :maxlength="5000" />
            <div class="flex gap-2">
              <UButton size="sm" color="primary" :loading="savingEdit" @click="saveEdit">
                保存
              </UButton>
              <UButton size="sm" variant="ghost" @click="cancelEdit">
                取消
              </UButton>
            </div>
          </div>

          <!-- Meta info -->
          <div class="text-sm text-gray-500 dark:text-gray-400 flex flex-wrap gap-3">
            <span>
              提交者：{{ issue.reporter?.nickname || issue.reporter?.username || '匿名' }}
            </span>
            <span>·</span>
            <span>{{ dayjs(issue.createdAt).format('YYYY-MM-DD HH:mm') }}</span>
            <template v-if="issue.dueAt">
              <span>·</span>
              <span>截止：{{ dayjs(issue.dueAt).format('YYYY-MM-DD') }}</span>
            </template>
          </div>

          <!-- Target link -->
          <div v-if="issue.targetType !== 'none' && issue.targetRef" class="text-sm">
            <span class="text-gray-500 dark:text-gray-400 mr-1">关联：</span>
            <a
              v-if="issue.targetType === 'url'"
              :href="issue.targetRef"
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary-500 hover:underline"
            >{{ issue.targetTitle || issue.targetRef }}</a>
            <NuxtLink
              v-else
              :to="issue.targetRef"
              class="text-primary-500 hover:underline"
            >
              {{ issue.targetTitle || issue.targetRef }}
            </NuxtLink>
          </div>

          <!-- Description -->
          <div v-if="issue.description && !editMode" class="pt-2 border-t border-gray-100 dark:border-gray-800">
            <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm">
              {{ issue.description }}
            </p>
          </div>
        </div>
      </UCard>

      <!-- Owner controls -->
      <UCard v-if="isOwner" class="mb-6">
        <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          管理
        </p>
        <div class="flex flex-wrap gap-4">
          <!-- Status -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500 dark:text-gray-400">状态：</span>
            <USelect
              :model-value="issue.status"
              :options="statusOptions"
              option-attribute="label"
              value-attribute="value"
              :loading="savingStatus"
              class="w-36"
              @update:model-value="onStatusChange"
            />
          </div>
          <!-- Visibility -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500 dark:text-gray-400">可见性：</span>
            <USelect
              :model-value="issue.visibility"
              :options="visibilityOptions"
              option-attribute="label"
              value-attribute="value"
              class="w-28"
              @update:model-value="onVisibilityChange"
            />
          </div>
        </div>
        <!-- Tag management -->
        <div class="mt-4">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
            标签：
          </p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tag in allTags"
              :key="tag.id"
              type="button"
              class="px-3 py-1 rounded-full text-xs border transition-colors"
              :class="(issue.tags ?? []).some((t: any) => t.id === tag.id)
                ? 'bg-primary-500 border-primary-500 text-white'
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-400'"
              @click="toggleTag(tag.id)"
            >
              {{ tag.name }}
            </button>
          </div>
        </div>
      </UCard>

      <!-- Comments -->
      <div class="space-y-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          评论（{{ comments.length }}）
        </h2>

        <div v-if="comments.length === 0" class="text-sm text-gray-400 dark:text-gray-600 py-4 text-center">
          暂无评论
        </div>

        <UCard
          v-for="comment in comments"
          :key="comment.id"
        >
          <div class="flex gap-3">
            <UAvatar
              :src="comment.author?.avatarUrl || undefined"
              :alt="comment.author?.nickname || comment.author?.username || '?'"
              size="sm"
            />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {{ comment.author?.nickname || comment.author?.username || '匿名' }}
                </span>
                <span class="text-xs text-gray-400 dark:text-gray-600">
                  {{ dayjs(comment.createdAt).fromNow() }}
                </span>
              </div>
              <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {{ comment.content }}
              </p>
            </div>
          </div>
        </UCard>

        <!-- Add comment -->
        <UCard v-if="userStore.isLogin">
          <div class="space-y-3">
            <UTextarea
              v-model="commentContent"
              placeholder="写下你的评论..."
              :rows="3"
              :maxlength="5000"
            />
            <div class="flex justify-end">
              <UButton
                color="primary"
                size="sm"
                :loading="submittingComment"
                :disabled="!commentContent.trim()"
                @click="submitComment"
              >
                发表评论
              </UButton>
            </div>
          </div>
        </UCard>
        <div v-else class="text-sm text-gray-400 dark:text-gray-600 text-center py-2">
          <NuxtLink to="/login" class="text-primary-500 hover:underline">
            登录
          </NuxtLink>
          后才能评论
        </div>
      </div>
    </template>
  </div>
</template>
