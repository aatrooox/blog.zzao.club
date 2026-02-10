<script lang="ts" setup>
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const { $api } = useNuxtApp()
const toast = useGlobalToast()

// State
const memos = ref<any[]>([])
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)
const total = ref(0)
const pageSize = 15

// Tags for selection
const availableTags = ref<any[]>([])

// Modal state
const showModal = ref(false)
const editingMemo = ref<any>(null)
const isEditing = computed(() => !!editingMemo.value)

// Form
const formState = reactive({
  content: '',
  visible: 'public',
  tagInput: '',
})
const selectedTags = ref<string[]>([])
const submitting = ref(false)

const visibleOptions = [
  { label: '公开', value: 'public' },
  { label: '私密', value: 'private' },
]

// Fetch memos
async function fetchMemos() {
  loading.value = true
  try {
    const res = await $api.get<any>('/api/v1/memo/list', {
      page: currentPage.value,
      size: pageSize,
    })
    if (res.data) {
      memos.value = res.data.list || []
      total.value = res.data.total || 0
      totalPages.value = res.data.totalPages || 1
    }
  }
  catch {
    toast.error('加载动态列表失败')
  }
  finally {
    loading.value = false
  }
}

// Fetch tags
async function fetchTags() {
  try {
    const res = await $api.get<any>('/api/v1/tag/list')
    if (res.data) {
      availableTags.value = res.data
    }
  }
  catch {
    // silent
  }
}

// Open create modal
function openCreate() {
  editingMemo.value = null
  formState.content = ''
  formState.visible = 'public'
  formState.tagInput = ''
  selectedTags.value = []
  showModal.value = true
}

// Open edit modal
function openEdit(memo: any) {
  editingMemo.value = memo
  formState.content = memo.content || ''
  formState.visible = memo.visible || 'public'
  formState.tagInput = ''
  selectedTags.value = (memo.tags || []).map((t: any) => t.tagName)
  showModal.value = true
}

// Add tag
function addTag() {
  const tag = formState.tagInput.trim()
  if (tag && !selectedTags.value.includes(tag)) {
    if (selectedTags.value.length >= 3) {
      toast.error('最多只能添加 3 个标签')
      return
    }
    selectedTags.value.push(tag)
  }
  formState.tagInput = ''
}

// Select existing tag
function toggleTag(tagName: string) {
  const idx = selectedTags.value.indexOf(tagName)
  if (idx >= 0) {
    selectedTags.value.splice(idx, 1)
  }
  else {
    if (selectedTags.value.length >= 3) {
      toast.error('最多只能添加 3 个标签')
      return
    }
    selectedTags.value.push(tagName)
  }
}

// Remove selected tag
function removeTag(tagName: string) {
  selectedTags.value = selectedTags.value.filter(t => t !== tagName)
}

// Submit form
async function handleSubmit() {
  if (!formState.content.trim()) {
    toast.error('内容不能为空')
    return
  }
  submitting.value = true
  try {
    if (isEditing.value) {
      const { error } = await $api.post('/api/v1/memo/update', {
        id: editingMemo.value.id,
        content: formState.content,
        tags: selectedTags.value,
        visible: formState.visible,
      })
      if (!error) {
        toast.success('动态已更新')
        showModal.value = false
        fetchMemos()
      }
      else {
        toast.error('更新失败')
      }
    }
    else {
      const { error } = await $api.post('/api/v1/memo/create', {
        content: formState.content,
        tags: selectedTags.value,
        visible: formState.visible,
      })
      if (!error) {
        toast.success('动态已创建')
        showModal.value = false
        fetchMemos()
      }
      else {
        toast.error('创建失败')
      }
    }
  }
  catch {
    toast.error('操作失败')
  }
  finally {
    submitting.value = false
  }
}

// Delete memo
async function handleDelete(memo: any) {
  // eslint-disable-next-line no-alert
  if (!window.confirm(`确定删除这条动态吗？`))
    return

  try {
    const { error } = await $api.post('/api/v1/memo/del', { id: memo.id })
    if (!error) {
      toast.success('动态已删除')
      fetchMemos()
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
  fetchMemos()
}

// Format date
function formatDate(dateStr: string) {
  if (!dateStr)
    return '--'
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// Truncate content for display
function truncate(str: string | null, len = 200) {
  if (!str)
    return ''
  return str.length > len ? `${str.slice(0, len)}...` : str
}

onMounted(() => {
  fetchMemos()
  fetchTags()
})
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold">
          动态管理
        </h2>
        <p class="text-sm text-muted-foreground">
          共 {{ total }} 条动态
        </p>
      </div>
      <UButton icon="i-lucide-plus" @click="openCreate">
        发布动态
      </UButton>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <UButton loading variant="ghost" disabled>
        加载中...
      </UButton>
    </div>

    <!-- Empty -->
    <UCard v-else-if="memos.length === 0">
      <div class="text-center py-8 text-muted-foreground">
        暂无动态
      </div>
    </UCard>

    <!-- Memo list -->
    <div v-else class="space-y-4">
      <UCard v-for="memo in memos" :key="memo.id">
        <div class="space-y-3">
          <!-- Meta row -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{{ memo.user_info?.nickname || memo.user_info?.username || '未知用户' }}</span>
              <span>·</span>
              <span>{{ formatDate(memo.createTs) }}</span>
              <UBadge v-if="memo.visible === 'private'" color="warning" variant="subtle" size="xs">
                私密
              </UBadge>
            </div>
            <div class="flex items-center gap-1">
              <UButton
                icon="i-lucide-pencil"
                variant="ghost"
                color="neutral"
                size="xs"
                @click="openEdit(memo)"
              />
              <UButton
                icon="i-lucide-trash-2"
                variant="ghost"
                color="error"
                size="xs"
                @click="handleDelete(memo)"
              />
            </div>
          </div>

          <!-- Content -->
          <p class="whitespace-pre-wrap text-sm leading-relaxed">
            {{ truncate(memo.content) }}
          </p>

          <!-- Photos -->
          <div v-if="memo.photos && memo.photos.length > 0" class="flex flex-wrap gap-2">
            <img
              v-for="(photo, idx) in memo.photos"
              :key="idx"
              :src="photo"
              class="w-20 h-20 object-cover rounded-md border"
              :alt="`图片${idx + 1}`"
            >
          </div>

          <!-- Tags + stats -->
          <div class="flex items-center justify-between">
            <div class="flex flex-wrap gap-1">
              <UBadge
                v-for="tag in memo.tags"
                :key="tag.id"
                variant="subtle"
                color="neutral"
                size="xs"
              >
                {{ tag.tagName }}
              </UBadge>
            </div>
            <div class="flex items-center gap-3 text-xs text-muted-foreground">
              <span class="flex items-center gap-1">
                <UIcon name="i-lucide-heart" class="w-3 h-3" />
                {{ memo._count?.likes ?? 0 }}
              </span>
              <span class="flex items-center gap-1">
                <UIcon name="i-lucide-message-circle" class="w-3 h-3" />
                {{ memo._count?.comments ?? 0 }}
              </span>
            </div>
          </div>
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

    <!-- Create/Edit Modal -->
    <UModal v-model:open="showModal">
      <template #header>
        <h3 class="text-lg font-semibold">
          {{ isEditing ? '编辑动态' : '发布动态' }}
        </h3>
      </template>

      <template #body>
        <div class="space-y-4">
          <!-- Content -->
          <div class="space-y-1.5">
            <label class="text-sm font-medium">内容</label>
            <UTextarea
              v-model="formState.content"
              placeholder="写点什么..."
              :rows="6"
              autoresize
            />
          </div>

          <!-- Visibility -->
          <div class="space-y-1.5">
            <label class="text-sm font-medium">可见性</label>
            <USelect
              v-model="formState.visible"
              :items="visibleOptions"
              value-key="value"
            />
          </div>

          <!-- Tags -->
          <div class="space-y-1.5">
            <label class="text-sm font-medium">标签（最多 3 个）</label>
            <!-- Selected tags -->
            <div v-if="selectedTags.length > 0" class="flex flex-wrap gap-1 mb-2">
              <UBadge
                v-for="tag in selectedTags"
                :key="tag"
                variant="subtle"
                color="primary"
                size="sm"
                class="cursor-pointer"
                @click="removeTag(tag)"
              >
                {{ tag }}
                <UIcon name="i-lucide-x" class="w-3 h-3 ml-1" />
              </UBadge>
            </div>
            <!-- Tag input -->
            <div class="flex gap-2">
              <UInput
                v-model="formState.tagInput"
                placeholder="输入新标签名"
                size="sm"
                class="flex-1"
                @keydown.enter.prevent="addTag"
              />
              <UButton size="sm" variant="outline" @click="addTag">
                添加
              </UButton>
            </div>
            <!-- Existing tags -->
            <div v-if="availableTags.length > 0" class="flex flex-wrap gap-1 mt-2">
              <UBadge
                v-for="tag in availableTags"
                :key="tag.id"
                :variant="selectedTags.includes(tag.tagName) ? 'solid' : 'outline'"
                :color="selectedTags.includes(tag.tagName) ? 'primary' : 'neutral'"
                size="xs"
                class="cursor-pointer"
                @click="toggleTag(tag.tagName)"
              >
                {{ tag.tagName }}
              </UBadge>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="showModal = false">
            取消
          </UButton>
          <UButton :loading="submitting" @click="handleSubmit">
            {{ isEditing ? '更新' : '发布' }}
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
