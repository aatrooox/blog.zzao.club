<script setup lang="ts">
definePageMeta({ layout: 'default' })

const userStore = useUser()
const { createTodo, fetchTags } = useTodos()
const toast = useGlobalToast()
const router = useRouter()

const tags = ref<any[]>([])
const submitting = ref(false)

const form = reactive({
  title: '',
  description: '',
  visibility: 'public',
  targetType: 'none',
  targetRef: '',
  targetTitle: '',
  dueAt: '',
  tagIds: [] as string[],
})

const errors = reactive({
  title: '',
})

const targetTypeOptions = [
  { label: '无', value: 'none' },
  { label: 'URL 链接', value: 'url' },
  { label: '项目', value: 'project' },
  { label: '文章', value: 'post' },
  { label: '笔记', value: 'note' },
  { label: '其他', value: 'other' },
]
const visibilityOptions = [
  { label: '公开', value: 'public' },
  { label: '私密', value: 'private' },
]

const showTarget = computed(() => form.targetType !== 'none')
const selectedTagCount = computed(() => form.tagIds.length)

function toggleTag(tagId: string) {
  const idx = form.tagIds.indexOf(tagId)
  if (idx === -1) {
    if (form.tagIds.length >= 3) {
      toast.warn('最多选择 3 个标签')
      return
    }
    form.tagIds.push(tagId)
  }
  else {
    form.tagIds.splice(idx, 1)
  }
}

function validate() {
  errors.title = ''
  if (!form.title.trim()) {
    errors.title = '标题不能为空'
    return false
  }
  if (form.title.length > 500) {
    errors.title = '标题不超过 500 字'
    return false
  }
  return true
}

async function submit() {
  if (!validate())
    return
  submitting.value = true
  try {
    const result = await createTodo({
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      visibility: form.visibility,
      targetType: form.targetType,
      targetRef: form.targetRef.trim() || undefined,
      targetTitle: form.targetTitle.trim() || undefined,
      dueAt: form.dueAt || undefined,
      tagIds: form.tagIds.length > 0 ? form.tagIds : undefined,
    })
    if (result?.id) {
      router.push(`/issues/${result.id}`)
    }
  }
  finally {
    submitting.value = false
  }
}

onMounted(async () => {
  if (!userStore.isLogin) {
    toast.warn('请先登录')
    await navigateTo('/login')
    return
  }
  const res = await fetchTags()
  tags.value = res
})
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <NuxtLink to="/issues">
        <UButton variant="ghost" size="sm" icon="i-lucide-arrow-left" />
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
        新建 Issue
      </h1>
    </div>

    <UCard>
      <div class="space-y-5">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            标题 <span class="text-red-500">*</span>
          </label>
          <UInput
            v-model="form.title"
            placeholder="简要描述问题或建议..."
            :maxlength="500"
          />
          <p v-if="errors.title" class="mt-1 text-xs text-red-500">
            {{ errors.title }}
          </p>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            描述
          </label>
          <UTextarea
            v-model="form.description"
            placeholder="详细描述，支持 Markdown..."
            :rows="5"
            :maxlength="5000"
          />
        </div>

        <!-- Visibility -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            可见性
          </label>
          <USelect
            v-model="form.visibility"
            :options="visibilityOptions"
            option-attribute="label"
            value-attribute="value"
          />
        </div>

        <!-- Tags -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            标签（最多 3 个，已选 {{ selectedTagCount }}）
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tag in tags"
              :key="tag.id"
              type="button"
              class="px-3 py-1 rounded-full text-xs border transition-colors"
              :class="form.tagIds.includes(tag.id)
                ? 'bg-primary-500 border-primary-500 text-white'
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-400'"
              @click="toggleTag(tag.id)"
            >
              {{ tag.name }}
            </button>
          </div>
        </div>

        <!-- Target type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            关联对象类型
          </label>
          <USelect
            v-model="form.targetType"
            :options="targetTypeOptions"
            option-attribute="label"
            value-attribute="value"
          />
        </div>

        <!-- Target ref / title -->
        <template v-if="showTarget">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              关联地址 / 路径
            </label>
            <UInput
              v-model="form.targetRef"
              placeholder="例如 /post/some-article 或 https://..."
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              关联标题（可选）
            </label>
            <UInput
              v-model="form.targetTitle"
              placeholder="关联对象的显示名称"
            />
          </div>
        </template>

        <!-- Due date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            截止日期（可选）
          </label>
          <UInput
            v-model="form.dueAt"
            type="date"
          />
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-3 pt-2">
          <UButton
            color="primary"
            :loading="submitting"
            @click="submit"
          >
            提交
          </UButton>
          <NuxtLink to="/issues">
            <UButton variant="ghost">
              取消
            </UButton>
          </NuxtLink>
        </div>
      </div>
    </UCard>
  </div>
</template>
