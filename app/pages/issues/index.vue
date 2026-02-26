<script setup lang="ts">
definePageMeta({ layout: 'default' })

const userStore = useUser()
const { fetchTodos, fetchTags } = useTodos()
const dayjs = useDayjs()

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

const issues = ref<any[]>([])
const tags = ref<any[]>([])
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const total = ref(0)
const pageSize = 15

const filterStatus = ref('')
const filterTagId = ref('')
const searchQ = ref('')
let searchTimer: ReturnType<typeof setTimeout> | null = null

const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '开放', value: 'open' },
  { label: '进行中', value: 'in_progress' },
  { label: '已关闭', value: 'closed' },
  { label: '不修复', value: 'wontfix' },
]

const tagOptions = computed(() => [
  { label: '全部标签', value: '' },
  ...tags.value.map(t => ({ label: t.name, value: t.id })),
])

async function loadTags() {
  const res = await fetchTags()
  tags.value = res
}

async function loadIssues() {
  loading.value = true
  try {
    const res = await fetchTodos({
      page: currentPage.value,
      size: pageSize,
      status: filterStatus.value || undefined,
      tagId: filterTagId.value || undefined,
      q: searchQ.value || undefined,
    })
    if (res?.data) {
      issues.value = res.data.list ?? []
      total.value = res.data.total ?? 0
      totalPages.value = res.data.totalPages ?? 1
    }
  }
  finally {
    loading.value = false
  }
}

function onSearchInput() {
  if (searchTimer)
    clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    currentPage.value = 1
    loadIssues()
  }, 300)
}

function onFilterChange() {
  currentPage.value = 1
  loadIssues()
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    loadIssues()
  }
}
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadIssues()
  }
}

onMounted(async () => {
  await loadTags()
  await loadIssues()
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Issues
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          共 {{ total }} 条
        </p>
      </div>
      <NuxtLink v-if="userStore.isLogin" to="/issues/new">
        <UButton icon="i-lucide-plus" color="primary">
          新建 Issue
        </UButton>
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-6">
      <UInput
        v-model="searchQ"
        placeholder="搜索标题或描述..."
        icon="i-lucide-search"
        class="flex-1 min-w-48"
        @input="onSearchInput"
      />
      <USelect
        v-model="filterStatus"
        :options="statusOptions"
        option-attribute="label"
        value-attribute="value"
        class="w-36"
        @change="onFilterChange"
      />
      <USelect
        v-model="filterTagId"
        :options="tagOptions"
        option-attribute="label"
        value-attribute="value"
        class="w-36"
        @change="onFilterChange"
      />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="animate-pulse rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
        <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
      </div>
    </div>

    <!-- Issue list -->
    <div v-else-if="issues.length > 0" class="space-y-3">
      <UCard
        v-for="issue in issues"
        :key="issue.id"
        class="hover:shadow-md transition-shadow"
      >
        <div class="flex items-start gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap mb-1">
              <UBadge :color="STATUS_COLORS[issue.status] ?? 'neutral'" variant="subtle" size="sm">
                {{ STATUS_LABELS[issue.status] ?? issue.status }}
              </UBadge>
              <UBadge v-if="issue.visibility === 'private'" color="neutral" variant="outline" size="sm">
                私密
              </UBadge>
              <UBadge
                v-for="tag in (issue.tags ?? [])"
                :key="tag.id"
                :color="tag.color ?? 'neutral'"
                variant="subtle"
                size="sm"
              >
                {{ tag.name }}
              </UBadge>
            </div>
            <NuxtLink :to="`/issues/${issue.id}`" class="text-base font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 line-clamp-2">
              {{ issue.title }}
            </NuxtLink>
            <div class="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span>{{ issue.reporter?.nickname || issue.reporter?.username || '匿名' }}</span>
              <span>·</span>
              <span>{{ dayjs(issue.createdAt).fromNow() }}</span>
            </div>
          </div>
          <NuxtLink :to="`/issues/${issue.id}`">
            <UButton variant="ghost" size="sm" icon="i-lucide-chevron-right" />
          </NuxtLink>
        </div>
      </UCard>
    </div>

    <!-- Empty state -->
    <div v-else class="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600">
      <UIcon name="i-lucide-inbox" class="w-12 h-12 mb-4" />
      <p class="text-sm">
        暂无 Issue
      </p>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-center gap-3 mt-8">
      <UButton variant="ghost" size="sm" :disabled="currentPage <= 1" @click="prevPage">
        上一页
      </UButton>
      <span class="text-sm text-gray-500 dark:text-gray-400">{{ currentPage }} / {{ totalPages }}</span>
      <UButton variant="ghost" size="sm" :disabled="currentPage >= totalPages" @click="nextPage">
        下一页
      </UButton>
    </div>
  </div>
</template>
