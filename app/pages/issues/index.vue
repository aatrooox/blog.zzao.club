<script setup lang="ts">
import type { TodoItem, TodoTag } from '~/composables/useTodos'

definePageMeta({ layout: 'default' })

const userStore = useUser()
const { updateDateFromNow, formatDate } = useDayjs()

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
const tabs = [
  { label: '全部', value: 'all' },
  { label: '待处理', value: 'open' },
  { label: '进行中', value: 'in_progress' },
  { label: '已完成', value: 'done' },
  { label: '已搁置', value: 'canceled' },
]

const {
  todos,
  status,
  total,
  totalPages,
  currentPage,
  filterStatus,
  filterTagId,
  searchQ,
  loadTodos,
  updateTodo,
  fetchTags,
} = useTodos()

const tags = ref<TodoTag[]>([])
let searchTimer: ReturnType<typeof setTimeout> | null = null
const updatingId = ref<string | null>(null)

const route = useRoute()
const router = useRouter()

function normalizeQueryString(val: unknown): string {
  if (Array.isArray(val))
    return val[0] ?? ''
  return typeof val === 'string' ? val : ''
}

function normalizeQueryNumber(val: unknown, fallback: number): number {
  const str = normalizeQueryString(val)
  const num = Number(str)
  if (!Number.isFinite(num))
    return fallback
  return Math.max(1, Math.floor(num))
}

const tagOptions = computed(() => [
  { label: '全部标签', value: 'all' },
  ...tags.value.map(t => ({ label: t.name, value: t.id })),
])

// superAdmin 才能快速切换状态
const statusMenuItems = (todo: TodoItem) => [
  {
    label: '待处理',
    icon: 'i-lucide-circle',
    class: todo.status === 'open' ? 'text-blue-500 font-medium' : '',
    disabled: todo.status === 'open',
    onSelect: () => quickUpdateStatus(todo, 'open'),
  },
  {
    label: '进行中',
    icon: 'i-lucide-loader',
    class: todo.status === 'in_progress' ? 'text-amber-500 font-medium' : '',
    disabled: todo.status === 'in_progress',
    onSelect: () => quickUpdateStatus(todo, 'in_progress'),
  },
  {
    label: '已完成',
    icon: 'i-lucide-check-circle-2',
    class: todo.status === 'done' ? 'text-green-500 font-medium' : '',
    disabled: todo.status === 'done',
    onSelect: () => quickUpdateStatus(todo, 'done'),
  },
  {
    label: '已搁置',
    icon: 'i-lucide-x-circle',
    class: todo.status === 'canceled' ? '' : '',
    disabled: todo.status === 'canceled',
    onSelect: () => quickUpdateStatus(todo, 'canceled'),
  },
]

async function quickUpdateStatus(item: TodoItem, newStatus: string) {
  if (updatingId.value)
    return
  updatingId.value = item.id
  try {
    const result = await updateTodo(item.id, { status: newStatus })
    if (result) {
      // 乐观更新本地列表
      const idx = todos.value.findIndex(t => t.id === item.id)
      if (idx !== -1)
        todos.value[idx] = { ...todos.value[idx], status: newStatus }
    }
  }
  finally {
    updatingId.value = null
  }
}

function isDueOverdue(dueAt: string) {
  return new Date(dueAt) < new Date()
}
function isDueSoon(dueAt: string) {
  const diff = new Date(dueAt).getTime() - Date.now()
  return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000
}
function dueClass(dueAt: string) {
  if (isDueOverdue(dueAt))
    return 'text-red-500'
  if (isDueSoon(dueAt))
    return 'text-amber-500'
  return 'text-zinc-400 dark:text-zinc-500'
}

function onSearchInput() {
  if (searchTimer)
    clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    loadTodos({ page: 1, q: searchQ.value })
  }, 300)
}

function onTabChange(val: string) {
  filterStatus.value = val
  loadTodos({ page: 1, status: val })
}

function onTagChange() {
  loadTodos({ page: 1, tagId: filterTagId.value })
}

function prevPage() {
  if (currentPage.value > 1)
    loadTodos({ page: currentPage.value - 1 })
}

function nextPage() {
  if (currentPage.value < totalPages.value)
    loadTodos({ page: currentPage.value + 1 })
}

onMounted(async () => {
  tags.value = await fetchTags()

  // init from URL query
  const initialStatus = normalizeQueryString(route.query.status)
  const initialTagId = normalizeQueryString(route.query.tagId)
  const initialQ = normalizeQueryString(route.query.q)
  const initialPage = normalizeQueryNumber(route.query.page, 1)
  if (initialStatus)
    filterStatus.value = initialStatus
  if (initialTagId)
    filterTagId.value = initialTagId
  if (initialQ)
    searchQ.value = initialQ
  currentPage.value = initialPage

  await loadTodos({
    page: initialPage,
    status: initialStatus || undefined,
    tagId: initialTagId || undefined,
    q: initialQ || undefined,
  })
})

// keep URL in sync
watch([currentPage, filterStatus, filterTagId, searchQ], ([page, st, tagId, q]) => {
  const query: Record<string, string> = {}
  if (page && page !== 1)
    query.page = String(page)
  if (st && st !== 'all')
    query.status = st
  if (tagId && tagId !== 'all')
    query.tagId = tagId
  if (q)
    query.q = q

  if (JSON.stringify(query) !== JSON.stringify(route.query))
    router.replace({ query })
})
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          待办
        </h1>
        <p class="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">
          {{ total }} 条待办
        </p>
      </div>
      <NuxtLink v-if="userStore.isLogin" to="/issues/new">
        <UButton icon="i-lucide-plus" color="primary" size="sm">
          新建待办
        </UButton>
      </NuxtLink>
    </div>

    <!-- Status pill tabs -->
    <div class="flex items-center gap-1.5 mb-4 flex-wrap">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        type="button"
        class="px-3 py-1 rounded-full text-sm font-medium transition-colors"
        :class="filterStatus === tab.value
          ? 'bg-primary text-white'
          : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'"
        @click="onTabChange(tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Search + tag filter -->
    <div class="flex gap-2 mb-5">
      <UInput
        v-model="searchQ"
        placeholder="搜索..."
        icon="i-lucide-search"
        class="flex-1"
        size="sm"
        @input="onSearchInput"
      />
      <USelect
        v-if="tags.length > 0"
        v-model="filterTagId"
        :items="tagOptions"
        class="w-32"
        size="sm"
        @update:model-value="onTagChange"
      />
    </div>

    <!-- Skeleton -->
    <div v-if="status === 'pending'" class="space-y-2.5">
      <div
        v-for="i in 4"
        :key="i"
        class="animate-pulse rounded-2xl border border-zinc-100 dark:border-zinc-800 p-4"
      >
        <div class="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-2/3 mb-2.5" />
        <div class="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-1/3" />
      </div>
    </div>

    <!-- List -->
    <div v-else-if="todos.length > 0" class="space-y-2.5">
      <div
        v-for="item in todos"
        :key="item.id"
        class="flex items-start gap-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3.5 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-sm transition-all group"
      >
        <!-- Status icon / quick action button -->
        <div class="mt-0.5 flex-shrink-0">
          <!-- superAdmin: 可点击的状态切换菜单 -->
          <UDropdownMenu
            v-if="userStore.isSuperAdmin"
            :items="statusMenuItems(item)"
            :popper="{ placement: 'bottom-start' }"
          >
            <button
              type="button"
              class="flex items-center justify-center w-5 h-5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
              :class="updatingId === item.id ? 'opacity-50 pointer-events-none' : ''"
              @click.stop
            >
              <UIcon
                :name="updatingId === item.id ? 'i-lucide-loader' : (STATUS_ICONS[item.status] ?? 'i-lucide-circle')"
                class="w-4 h-4"
                :class="[
                  STATUS_COLORS[item.status] ?? 'text-zinc-400',
                  updatingId === item.id ? 'animate-spin' : '',
                ]"
              />
            </button>
          </UDropdownMenu>
          <!-- 普通用户：纯展示图标 -->
          <UIcon
            v-else
            :name="STATUS_ICONS[item.status] ?? 'i-lucide-circle'"
            class="w-4 h-4"
            :class="STATUS_COLORS[item.status] ?? 'text-zinc-400'"
          />
        </div>

        <!-- Content (可点击跳转) -->
        <NuxtLink
          :to="`/issues/${item.id}`"
          class="flex-1 min-w-0"
        >
          <p
            class="text-sm font-medium text-zinc-800 dark:text-zinc-200 line-clamp-2 group-hover:text-primary transition-colors"
            :class="item.status === 'done' ? 'line-through text-zinc-400 dark:text-zinc-500' : ''"
          >
            {{ item.title }}
          </p>

          <!-- Meta row -->
          <div class="flex items-center flex-wrap gap-x-2 gap-y-1 mt-1.5">
            <UserAvatar
              :user-info="item.reporter"
              :size="18"
              class="flex-shrink-0"
            />
            <span class="text-xs text-zinc-400 dark:text-zinc-500">
              {{ item.reporter?.nickname || item.reporter?.username || '匿名' }}
            </span>
            <span class="text-xs text-zinc-300 dark:text-zinc-700">·</span>
            <span class="text-xs text-zinc-400 dark:text-zinc-500">
              {{ updateDateFromNow(item.createdAt) }}
            </span>
            <template v-if="item.dueAt">
              <span class="text-xs text-zinc-300 dark:text-zinc-700">·</span>
              <span class="text-xs flex items-center gap-0.5" :class="dueClass(item.dueAt)">
                <UIcon name="i-lucide-calendar" class="w-3 h-3" />
                {{ formatDate(item.dueAt, '-') }}
                <span v-if="isDueOverdue(item.dueAt)" class="ml-0.5">已逾期</span>
              </span>
            </template>
            <template v-if="(item.tags ?? []).length > 0">
              <span
                v-for="tag in (item.tags ?? [])"
                :key="tag.id"
                class="text-xs px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
              >
                {{ tag.name }}
              </span>
            </template>
            <span v-if="item.visibility === 'private'" class="text-xs px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
              仅自己
            </span>
          </div>
        </NuxtLink>

        <NuxtLink :to="`/issues/${item.id}`" class="flex-shrink-0 mt-0.5">
          <UIcon name="i-lucide-chevron-right" class="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 transition-colors" />
        </NuxtLink>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="flex flex-col items-center justify-center py-20 text-zinc-400">
      <div class="w-14 h-14 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
        <UIcon name="i-lucide-list-todo" class="w-7 h-7 text-zinc-400 dark:text-zinc-500" />
      </div>
      <p class="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        暂无待办
      </p>
      <p class="text-xs text-zinc-400 dark:text-zinc-600 mt-1">
        点击右上角「新建待办」开始记录
      </p>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-center gap-3 mt-8">
      <UButton variant="ghost" size="sm" :disabled="currentPage <= 1" @click="prevPage">
        上一页
      </UButton>
      <span class="text-sm text-zinc-400 dark:text-zinc-500">{{ currentPage }} / {{ totalPages }}</span>
      <UButton variant="ghost" size="sm" :disabled="currentPage >= totalPages" @click="nextPage">
        下一页
      </UButton>
    </div>
  </div>
</template>
