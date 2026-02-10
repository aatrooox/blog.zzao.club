<script lang="ts" setup>
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const { $api } = useNuxtApp()
const toast = useGlobalToast()

// State
const tags = ref<any[]>([])
const loading = ref(true)

// Modal state
const showModal = ref(false)
const editingTag = ref<any>(null)
const isEditing = computed(() => !!editingTag.value)
const tagNameInput = ref('')
const submitting = ref(false)

// Fetch tags
async function fetchTags() {
  loading.value = true
  try {
    const res = await $api.get<any>('/api/v1/tag/list')
    if (res.data) {
      tags.value = res.data
    }
  }
  catch {
    toast.error('加载标签列表失败')
  }
  finally {
    loading.value = false
  }
}

// Open create modal
function openCreate() {
  editingTag.value = null
  tagNameInput.value = ''
  showModal.value = true
}

// Open edit modal
function openEdit(tag: any) {
  editingTag.value = tag
  tagNameInput.value = tag.tagName
  showModal.value = true
}

// Submit
async function handleSubmit() {
  const name = tagNameInput.value.trim()
  if (!name) {
    toast.error('标签名不能为空')
    return
  }
  submitting.value = true
  try {
    if (isEditing.value) {
      const { error } = await $api.post('/api/v1/tag/update', {
        id: editingTag.value.id,
        tagName: name,
      })
      if (!error) {
        toast.success('标签已更新')
        showModal.value = false
        fetchTags()
      }
      else {
        toast.error('更新失败')
      }
    }
    else {
      const { error } = await $api.post('/api/v1/tag/create', {
        tagName: name,
      })
      if (!error) {
        toast.success('标签已创建')
        showModal.value = false
        fetchTags()
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

// Delete
async function handleDelete(tag: any) {
  // eslint-disable-next-line no-alert
  if (!window.confirm(`确定删除标签「${tag.tagName}」吗？`))
    return

  try {
    const { error } = await $api.post('/api/v1/tag/delete', { id: tag.id })
    if (!error) {
      toast.success('标签已删除')
      fetchTags()
    }
    else {
      toast.error('删除失败')
    }
  }
  catch {
    toast.error('删除失败')
  }
}

// Format date
function formatDate(dateStr: string) {
  if (!dateStr)
    return '--'
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

onMounted(() => {
  fetchTags()
})
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold">
          标签管理
        </h2>
        <p class="text-sm text-muted-foreground">
          共 {{ tags.length }} 个标签
        </p>
      </div>
      <UButton icon="i-lucide-plus" @click="openCreate">
        新建标签
      </UButton>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <UButton loading variant="ghost" disabled>
        加载中...
      </UButton>
    </div>

    <!-- Empty -->
    <UCard v-else-if="tags.length === 0">
      <div class="text-center py-8 text-muted-foreground">
        暂无标签，点击右上角创建
      </div>
    </UCard>

    <!-- Tag list -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <UCard v-for="tag in tags" :key="tag.id">
        <div class="flex items-center justify-between">
          <div>
            <UBadge variant="subtle" size="sm">
              {{ tag.tagName }}
            </UBadge>
            <p class="text-xs text-muted-foreground mt-1">
              创建于 {{ formatDate(tag.createTs) }}
            </p>
          </div>
          <div class="flex items-center gap-1">
            <UButton
              icon="i-lucide-pencil"
              variant="ghost"
              color="neutral"
              size="xs"
              @click="openEdit(tag)"
            />
            <UButton
              icon="i-lucide-trash-2"
              variant="ghost"
              color="error"
              size="xs"
              @click="handleDelete(tag)"
            />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Create/Edit Modal -->
    <UModal v-model:open="showModal">
      <template #header>
        <h3 class="text-lg font-semibold">
          {{ isEditing ? '编辑标签' : '新建标签' }}
        </h3>
      </template>

      <template #body>
        <div class="space-y-4">
          <div class="space-y-1.5">
            <label class="text-sm font-medium">标签名称</label>
            <UInput
              v-model="tagNameInput"
              placeholder="输入标签名称"
              @keydown.enter.prevent="handleSubmit"
            />
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="showModal = false">
            取消
          </UButton>
          <UButton :loading="submitting" @click="handleSubmit">
            {{ isEditing ? '更新' : '创建' }}
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
