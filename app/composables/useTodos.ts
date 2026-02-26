import type { ApiResponse, PaginatedData } from '~~/types/fetch'

export interface TodoTag {
  id: string
  name: string
  color: string
  createdAt?: string
}

export interface TodoParticipant {
  userId: string
  username: string
  nickname: string | null
  avatarUrl: string | null
  role: string
}
export interface TodoItem {
  id: string
  title: string
  description: string | null
  status: string
  visibility: string
  reporterUserId: string
  targetType: string
  targetRef: string | null
  targetTitle: string | null
  dueAt: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
  reporter?: {
    username: string
    nickname: string | null
    avatarUrl: string | null
  }
  tags?: TodoTag[]
  participants?: TodoParticipant[]
}

export interface TodoComment {
  id: string
  todoItemId: string
  content: string
  createdAt: string
  updatedAt: string
  author?: {
    id: string
    username: string
    nickname: string | null
    avatarUrl: string | null
  }
}

export default function useTodos(options?: {
  size?: number
  status?: string
  tagId?: string
  q?: string
}) {
  const { $api } = useNuxtApp()
  const toast = useGlobalToast()

  const pageSize = options?.size ?? 15
  const currentPage = ref(1)
  const totalPages = ref(1)
  const total = ref(0)
  const filterStatus = ref(options?.status ?? 'all')
  const filterTagId = ref(options?.tagId ?? 'all')
  const searchQ = ref(options?.q ?? '')

  const todos = ref<TodoItem[]>([])

  const listQuery = computed(() => ({
    page: currentPage.value,
    size: pageSize,
    ...(filterStatus.value && filterStatus.value !== 'all' ? { status: filterStatus.value } : {}),
    ...(filterTagId.value && filterTagId.value !== 'all' ? { tagId: filterTagId.value } : {}),
    ...(searchQ.value ? { q: searchQ.value } : {}),
  }))

  const { data, status, refresh } = useAsyncData(
    'todo-list',
    () => $api.get<ApiResponse<PaginatedData<TodoItem>>>('/api/v1/todos', listQuery.value),
    {
      watch: [],
    },
  )

  watch(data, (val) => {
    if (val?.data) {
      todos.value = (val.data.list ?? []).map((item: TodoItem) => ({
        ...item,
        tags: typeof (item.tags as any) === 'string'
          ? JSON.parse(item.tags as any)
          : (item.tags ?? []),
        participants: typeof (item.participants as any) === 'string'
          ? JSON.parse(item.participants as any)
          : (item.participants ?? []),
      }))
      totalPages.value = val.data.totalPages ?? 1
      total.value = val.data.total ?? 0
    }
  }, { immediate: true })

  async function loadTodos(params?: { page?: number, status?: string, tagId?: string, q?: string }) {
    if (params?.page !== undefined)
      currentPage.value = params.page
    if (params?.status !== undefined)
      filterStatus.value = params.status
    if (params?.tagId !== undefined)
      filterTagId.value = params.tagId
    if (params?.q !== undefined)
      searchQ.value = params.q

    await nextTick()
    await refresh()
  }

  async function fetchTodo(id: string): Promise<TodoItem | null> {
    const res = await $api.get<ApiResponse<TodoItem>>(`/api/v1/todos/${id}`)
    return res?.data ?? null
  }

  async function createTodo(payload: {
    title: string
    description?: string
    visibility?: string
    targetType?: string
    targetRef?: string
    targetTitle?: string
    dueAt?: string
    tagIds?: string[]
  }): Promise<TodoItem | null> {
    const res = await $api.post<ApiResponse<TodoItem>>('/api/v1/todos', payload)
    if (res?.data && !res.error) {
      toast.success('待办已创建')
      return res.data
    }
    toast.error(res?.message ?? '创建失败')
    return null
  }

  async function updateTodo(id: string, payload: {
    title?: string
    description?: string
    status?: string
    visibility?: string
    targetType?: string
    targetRef?: string
    targetTitle?: string
    dueAt?: string
    tagIds?: string[]
  }): Promise<TodoItem | null> {
    const res = await $api.patch<ApiResponse<TodoItem>>(`/api/v1/todos/${id}`, payload)
    if (res?.data && !res.error) {
      toast.success('已更新')
      return res.data
    }
    toast.error(res?.message ?? '更新失败')
    return null
  }

  async function fetchComments(todoId: string): Promise<TodoComment[]> {
    const res = await $api.get<ApiResponse<TodoComment[]>>(`/api/v1/todos/${todoId}/comments`)
    return res?.data ?? []
  }

  async function addComment(todoId: string, content: string): Promise<TodoComment | null> {
    const res = await $api.post<ApiResponse<TodoComment>>(`/api/v1/todos/${todoId}/comments`, { content })
    if (res?.data && !res.error) {
      return res.data
    }
    toast.error(res?.message ?? '评论失败')
    return null
  }

  async function fetchTags(): Promise<TodoTag[]> {
    const res = await $api.get<ApiResponse<TodoTag[]>>('/api/v1/todos/tags')
    return res?.data ?? []
  }

  const hasMore = computed(() => currentPage.value < totalPages.value)

  return {
    todos,
    status,
    total,
    totalPages,
    currentPage,
    filterStatus,
    filterTagId,
    searchQ,
    hasMore,
    loadTodos,
    fetchTodo,
    createTodo,
    updateTodo,
    fetchComments,
    addComment,
    fetchTags,
  }
}
