<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()
const userStore = useUser()
const { fetchTodo, updateTodo, fetchComments, addComment, fetchTags } = useTodos()
const toast = useGlobalToast()
const { updateDateFromNow, formatDate, formatDateTime } = useDayjs()

const id = computed(() => route.params.id as string)

const issue = ref<any>(null)
const comments = ref<any[]>([])
const allTags = ref<any[]>([])
const loading = ref(true)
const submittingComment = ref(false)
const savingStatus = ref(false)
const savingStatusTarget = ref<string | null>(null)
const commentInputRef = ref()

// Edit mode
const editMode = ref(false)
const editTitle = ref('')
const editDescription = ref('')
const savingEdit = ref(false)

const STATUS_LABELS: Record<string, string> = {
  open: '待处理',
  in_progress: '进行中',
  done: '已完成',
  canceled: '已搁置',
}
const STATUS_ICONS: Record<string, string> = {
  open: 'i-lucide-circle',
  in_progress: 'i-lucide-loader',
  done: 'i-lucide-check-circle-2',
  canceled: 'i-lucide-x-circle',
}
const STATUS_COLORS: Record<string, string> = {
  open: 'text-blue-500',
  in_progress: 'text-amber-500',
  done: 'text-green-500 dark:text-green-400',
  canceled: 'text-zinc-400',
}

const visibilityOptions = [
  { label: '公开', value: 'public' },
  { label: '仅自己', value: 'private' },
]

const isOwner = computed(() => userStore.isSuperAdmin)
const isReporter = computed(() => issue.value && userStore.userInfo?.id === issue.value.reporterUserId)
const canEdit = computed(() => isOwner.value || isReporter.value)

const MAX_VISIBLE_PARTICIPANTS = 5
const visibleParticipants = computed(() => {
  const list = issue.value?.participants ?? []
  return list.slice(0, MAX_VISIBLE_PARTICIPANTS)
})
const extraParticipantsCount = computed(() => {
  const list = issue.value?.participants ?? []
  return Math.max(0, list.length - MAX_VISIBLE_PARTICIPANTS)
})

const nextStatusActions = computed(() => {
  const s = issue.value?.status
  if (!s)
    return []
  const all = [
    { label: '开始处理', value: 'in_progress', icon: 'i-lucide-play', color: 'amber' },
    { label: '标记完成', value: 'done', icon: 'i-lucide-check-circle-2', color: 'green' },
    { label: '搁置', value: 'canceled', icon: 'i-lucide-x-circle', color: 'neutral' },
    { label: '重新打开', value: 'open', icon: 'i-lucide-rotate-ccw', color: 'blue' },
  ]
  return all.filter(a => a.value !== s)
})

function isDueOverdue(dueAt: string) {
  return new Date(dueAt) < new Date()
}
function isDueSoon(dueAt: string) {
  const diff = new Date(dueAt).getTime() - Date.now()
  return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000
}

async function load() {
  loading.value = true
  try {
    const [issueData, commentsData, tagsData] = await Promise.all([
      fetchTodo(id.value),
      fetchComments(id.value),
      fetchTags(),
    ])
    if (!issueData) {
      toast.error('待办不存在')
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
  savingStatusTarget.value = newStatus
  try {
    const result = await updateTodo(id.value, { status: newStatus })
    if (result)
      issue.value = { ...issue.value, status: result.status }
  }
  finally {
    savingStatus.value = false
    savingStatusTarget.value = null
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

async function onCommentSend(data: { content: string }) {
  if (!data.content?.trim())
    return
  submittingComment.value = true
  try {
    const result = await addComment(id.value, data.content.trim())
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
      commentInputRef.value?.clear()
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
    <div class="mb-5">
      <NuxtLink to="/issues">
        <UButton variant="ghost" size="sm" icon="i-lucide-arrow-left">
          返回待办
        </UButton>
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="animate-pulse space-y-4">
      <div class="h-6 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-3/4" />
      <div class="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-1/4" />
      <div class="h-32 bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />
    </div>

    <template v-else-if="issue">
      <!-- Issue header card -->
      <div class="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 mb-4 space-y-4">
        <!-- Title row -->
        <div v-if="!editMode" class="flex items-start gap-3">
          <UIcon
            :name="STATUS_ICONS[issue.status] ?? 'i-lucide-circle'"
            class="mt-1 w-5 h-5 flex-shrink-0"
            :class="STATUS_COLORS[issue.status] ?? 'text-zinc-400'"
          />
          <div class="flex-1 min-w-0">
            <h1
              class="text-xl font-bold text-zinc-900 dark:text-zinc-100"
              :class="issue.status === 'done' ? 'line-through text-zinc-400 dark:text-zinc-500' : ''"
            >
              {{ issue.title }}
            </h1>
            <div class="flex flex-wrap items-center gap-2 mt-2">
              <span
                class="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                :class="{
                  'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400': issue.status === 'open',
                  'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400': issue.status === 'in_progress',
                  'bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400': issue.status === 'done',
                  'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400': issue.status === 'canceled',
                }"
              >
                {{ STATUS_LABELS[issue.status] ?? issue.status }}
              </span>
              <span v-if="issue.visibility === 'private'" class="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
                仅自己
              </span>
              <span
                v-for="tag in (issue.tags ?? [])"
                :key="tag.id"
                class="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
              >
                {{ tag.name }}
              </span>
            </div>

            <!-- 状态快捷操作（仅 superAdmin，非编辑模式） -->
            <div v-if="isOwner && !editMode" class="flex flex-wrap gap-2 mt-3 pt-3 border-t border-zinc-50 dark:border-zinc-800/60">
              <UButton
                v-for="action in nextStatusActions"
                :key="action.value"
                size="xs"
                variant="soft"
                :color="action.color as any"
                :icon="action.icon"
                :loading="savingStatus && savingStatusTarget === action.value"
                :disabled="savingStatus"
                @click="onStatusChange(action.value)"
              >
                {{ action.label }}
              </UButton>
            </div>
          </div>
          <UButton v-if="canEdit" variant="ghost" size="sm" icon="i-lucide-pencil" @click="startEdit" />
        </div>

        <!-- Edit mode -->
        <div v-else class="space-y-3">
          <UInput v-model="editTitle" placeholder="标题" :maxlength="500" />
          <UTextarea v-model="editDescription" placeholder="备注..." :rows="4" :maxlength="5000" />
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
        <div class="flex flex-wrap gap-x-4 gap-y-2 text-xs text-zinc-400 dark:text-zinc-500 pt-1 border-t border-zinc-50 dark:border-zinc-800/60">
          <!-- Reporter -->
          <span class="flex items-center gap-1.5">
            <UserAvatar
              :user-info="issue.reporter"
              :size="18"
              class="flex-shrink-0"
            />
            {{ issue.reporter?.nickname || issue.reporter?.username || '匿名' }}
          </span>
          <!-- Participants -->
          <span v-if="(issue.participants ?? []).length > 0" class="flex items-center gap-1.5">
            <div class="flex items-center -space-x-1.5">
              <UserAvatar
                v-for="p in visibleParticipants"
                :key="p.userId"
                :user-info="{ username: p.username, nickname: p.nickname, avatarUrl: p.avatarUrl }"
                :size="20"
                class="ring-2 ring-white dark:ring-zinc-900 flex-shrink-0"
              />
              <div
                v-if="extraParticipantsCount > 0"
                class="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700 ring-2 ring-white dark:ring-zinc-900 flex items-center justify-center text-[10px] font-medium text-zinc-500 dark:text-zinc-400"
              >
                +{{ extraParticipantsCount }}
              </div>
            </div>
            <span>等 {{ (issue.participants ?? []).length }} 人参与</span>
          </span>
          <span class="flex items-center gap-1">
            <UIcon name="i-lucide-clock" class="w-3.5 h-3.5" />
            {{ formatDateTime(issue.createdAt) }}
          </span>
          <template v-if="issue.dueAt">
            <span
              class="flex items-center gap-1"
              :class="isDueOverdue(issue.dueAt)
                ? 'text-red-500'
                : isDueSoon(issue.dueAt)
                  ? 'text-amber-500'
                  : ''"
            >
              <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5" />
              {{ formatDate(issue.dueAt, '-') }}
              <span v-if="isDueOverdue(issue.dueAt)">· 已逾期</span>
              <span v-else-if="isDueSoon(issue.dueAt)">· 即将截止</span>
            </span>
          </template>
        </div>

        <!-- Target link -->
        <div v-if="issue.targetType !== 'none' && issue.targetRef" class="text-xs">
          <span class="text-zinc-400 dark:text-zinc-500 mr-1">关联：</span>
          <a
            v-if="issue.targetType === 'url'"
            :href="issue.targetRef"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary hover:underline"
          >{{ issue.targetTitle || issue.targetRef }}</a>
          <NuxtLink
            v-else
            :to="issue.targetRef"
            class="text-primary hover:underline"
          >
            {{ issue.targetTitle || issue.targetRef }}
          </NuxtLink>
        </div>

        <!-- Description -->
        <div v-if="issue.description && !editMode" class="pt-3 border-t border-zinc-50 dark:border-zinc-800/60">
          <p class="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap leading-relaxed">
            {{ issue.description }}
          </p>
        </div>
      </div>

      <!-- Owner controls（只保留可见性和标签，状态已在上方处理） -->
      <div v-if="isOwner" class="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 mb-4">
        <p class="text-xs font-medium text-zinc-400 dark:text-zinc-500 mb-3 uppercase tracking-wide">
          管理
        </p>
        <div class="flex items-center gap-1.5">
          <span class="text-xs text-zinc-400 dark:text-zinc-500">可见性</span>
          <USelect
            :model-value="issue.visibility"
            :items="visibilityOptions"
            size="sm"
            class="w-24"
            @update:model-value="onVisibilityChange"
          />
        </div>
        <!-- Tag management -->
        <div v-if="allTags.length > 0" class="mt-3 pt-3 border-t border-zinc-50 dark:border-zinc-800/60">
          <p class="text-xs text-zinc-400 dark:text-zinc-500 mb-2">
            标签
          </p>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="tag in allTags"
              :key="tag.id"
              type="button"
              class="px-2.5 py-0.5 rounded-full text-xs border transition-colors"
              :class="(issue.tags ?? []).some((t: any) => t.id === tag.id)
                ? 'bg-primary border-primary text-white'
                : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400'"
              @click="toggleTag(tag.id)"
            >
              {{ tag.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Comments -->
      <div class="space-y-3">
        <h2 class="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          评论 <span class="text-zinc-400 font-normal">{{ comments.length }}</span>
        </h2>

        <div v-if="comments.length === 0" class="text-sm text-zinc-400 dark:text-zinc-600 py-4 text-center">
          还没有评论，来说点什么吧
        </div>

        <div
          v-for="comment in comments"
          :key="comment.id"
          class="flex gap-3"
        >
          <UserAvatar
            :user-info="comment.author"
            :size="32"
            class="flex-shrink-0 border border-zinc-100 dark:border-zinc-700"
          />
          <div class="flex-1 min-w-0 bg-primary/5 dark:bg-zinc-800/50 rounded-xl px-4 py-3">
            <div class="flex items-center gap-2 mb-1.5">
              <span class="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {{ comment.author?.nickname || comment.author?.username || '匿名' }}
              </span>
              <span class="text-xs text-zinc-400 dark:text-zinc-500">
                {{ updateDateFromNow(comment.createdAt) }}
              </span>
            </div>
            <p class="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
              {{ comment.content }}
            </p>
          </div>
        </div>

        <!-- Comment input -->
        <div v-if="userStore.isLogin" class="pt-1">
          <AppCommentInput
            ref="commentInputRef"
            placeholder="写下你的想法..."
            input-tip="最多 5000 字"
            :max-length="5000"
            submit-btn-text="发表"
            :show-hello="false"
            @send="onCommentSend"
            @cancel="() => {}"
          />
        </div>
        <div v-else class="text-sm text-zinc-400 dark:text-zinc-600 text-center py-3">
          <NuxtLink to="/login" class="text-primary hover:underline">
            登录
          </NuxtLink>
          后才能评论
        </div>
      </div>
    </template>
  </div>
</template>
