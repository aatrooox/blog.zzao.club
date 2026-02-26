import type { ApiResponse, PaginatedData } from '~~/types/fetch'

export interface TodoTag {
  id: string
  name: string
  color: string
  createdAt?: string
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

export default function useTodos() {
  const { $api } = useNuxtApp()
  const toast = useGlobalToast()

  async function fetchTodos(params?: {
    page?: number
    size?: number
    status?: string
    visibility?: string
    tagId?: string
    q?: string
    scope?: string
  }): Promise<ApiResponse<PaginatedData<TodoItem>>> {
    return $api.get<ApiResponse<PaginatedData<TodoItem>>>('/api/v1/todos', params ?? {})
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
    if (res?.code === 0) {
      toast.success('Issue 已创建')
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
    if (res?.code === 0) {
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
    if (res?.code === 0) {
      return res.data
    }
    toast.error(res?.message ?? '评论失败')
    return null
  }

  async function fetchTags(): Promise<TodoTag[]> {
    const res = await $api.get<ApiResponse<TodoTag[]>>('/api/v1/todos/tags')
    return res?.data ?? []
  }

  return {
    fetchTodos,
    fetchTodo,
    createTodo,
    updateTodo,
    fetchComments,
    addComment,
    fetchTags,
  }
}
