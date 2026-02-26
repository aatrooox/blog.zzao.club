<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { CalendarDate } from '@internationalized/date'

definePageMeta({ layout: 'default' })

const userStore = useUser()
const { createTodo, fetchTags } = useTodos()
const toast = useGlobalToast()
const router = useRouter()

const tags = ref<any[]>([])
const submitting = ref(false)
const showAdvanced = ref(false)

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
  { label: '🌐 公开', value: 'public' },
  { label: '🔒 仅自己', value: 'private' },
]

// DateValue ↔ string 双向转换
function stringToCalendarDate(iso: string): CalendarDate | undefined {
  if (!iso)
    return undefined
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m)
    return undefined
  return new CalendarDate(Number(m[1]), Number(m[2]), Number(m[3]))
}

function calendarDateToString(d: CalendarDate | undefined): string {
  if (!d)
    return ''
  return `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`
}

const dueAtDate = computed<DateValue | undefined>({
  get: () => stringToCalendarDate(form.dueAt),
  set: (val) => {
    form.dueAt = calendarDateToString(val as CalendarDate | undefined)
  },
})

const showTarget = computed(() => form.targetType !== 'none')
const selectedTagCount = computed(() => form.tagIds.length)
const canSubmit = computed(() => form.title.trim().length > 0)

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
  <div class="max-w-xl mx-auto px-4 py-10">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-8">
      <NuxtLink to="/issues">
        <UButton variant="ghost" size="sm" icon="i-lucide-arrow-left" color="neutral" />
      </NuxtLink>
      <div>
        <h1 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          新建待办
        </h1>
        <p class="text-xs text-zinc-400 mt-0.5">
          记录下你想完成的事
        </p>
      </div>
    </div>

    <div class="space-y-4">
      <!-- Title card -->
      <div class="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
        <UTextarea
          v-model="form.title"
          placeholder="今天要做什么？"
          :rows="2"
          autoresize
          :maxlength="500"
          variant="ghost"
          size="xl"
          class="w-full text-base font-medium placeholder:text-zinc-300 dark:placeholder:text-zinc-600 resize-none"
          :class="errors.title ? 'ring-1 ring-red-400 rounded-xl' : ''"
        />
        <p v-if="errors.title" class="mt-1.5 text-xs text-red-500 px-1">
          {{ errors.title }}
        </p>
        <div class="mt-3 pt-3 border-t border-zinc-50 dark:border-zinc-800">
          <UTextarea
            v-model="form.description"
            placeholder="添加备注..."
            :rows="3"
            autoresize
            :maxlength="5000"
            variant="ghost"
            size="sm"
            class="w-full placeholder:text-zinc-300 dark:placeholder:text-zinc-600 text-sm resize-none"
          />
        </div>
      </div>

      <!-- Options card -->
      <div class="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 divide-y divide-zinc-50 dark:divide-zinc-800">
        <!-- Due date -->
        <div class="flex items-center justify-between px-5 py-3.5">
          <div class="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <UIcon name="i-lucide-calendar" class="w-4 h-4" />
            <span>截止日期</span>
          </div>
          <div class="flex items-center gap-2">
            <span v-if="form.dueAt" class="text-xs text-zinc-400 dark:text-zinc-500">
              {{ form.dueAt }}
            </span>
            <UInputDate
              v-model="dueAtDate"
              size="sm"
              color="neutral"
              variant="ghost"
              :placeholder="form.dueAt ? '' : '选择日期'"
            />
          </div>
        </div>

        <!-- Visibility -->
        <div class="flex items-center justify-between px-5 py-3.5">
          <div class="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <UIcon name="i-lucide-eye" class="w-4 h-4" />
            <span>可见性</span>
          </div>
          <USelect
            v-model="form.visibility"
            :items="visibilityOptions"
            size="sm"
            variant="ghost"
            color="neutral"
            class="w-28 text-right"
          />
        </div>

        <!-- Tags -->
        <div v-if="tags.length > 0" class="px-5 py-3.5">
          <div class="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-3">
            <UIcon name="i-lucide-tag" class="w-4 h-4" />
            <span>标签</span>
            <span class="ml-auto text-xs text-zinc-400">{{ selectedTagCount }}/3</span>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="tag in tags"
              :key="tag.id"
              type="button"
              class="px-3 py-1 rounded-full text-xs border transition-all"
              :class="form.tagIds.includes(tag.id)
                ? 'bg-primary border-primary text-white shadow-sm'
                : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-primary/40 hover:text-primary'"
              @click="toggleTag(tag.id)"
            >
              {{ tag.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Advanced settings -->
      <div class="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        <button
          type="button"
          class="w-full flex items-center justify-between px-5 py-3.5 text-sm text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          @click="showAdvanced = !showAdvanced"
        >
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-settings-2" class="w-4 h-4" />
            <span>高级设置</span>
          </div>
          <UIcon
            :name="showAdvanced ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
            class="w-4 h-4"
          />
        </button>

        <div v-if="showAdvanced" class="px-5 pb-4 space-y-4 border-t border-zinc-50 dark:border-zinc-800 pt-4">
          <div>
            <label class="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">
              关联对象类型
            </label>
            <USelect
              v-model="form.targetType"
              :items="targetTypeOptions"
              size="sm"
            />
          </div>

          <template v-if="showTarget">
            <div>
              <label class="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">
                关联地址 / 路径
              </label>
              <UInput
                v-model="form.targetRef"
                placeholder="例如 /post/some-article 或 https://..."
                size="sm"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">
                关联标题（可选）
              </label>
              <UInput
                v-model="form.targetTitle"
                placeholder="关联对象的显示名称"
                size="sm"
              />
            </div>
          </template>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 pt-1">
        <UButton
          color="primary"
          size="md"
          class="flex-1"
          :loading="submitting"
          :disabled="!canSubmit"
          @click="submit"
        >
          创建待办
        </UButton>
        <NuxtLink to="/issues">
          <UButton variant="outline" color="neutral" size="md">
            取消
          </UButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
