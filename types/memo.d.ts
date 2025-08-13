import type { InferSelectModel } from 'drizzle-orm'
import type { blogComments, blogLikes, blogMemos, memoTagRelations, memoTags, users } from '~~/lib/drizzle/schema'

// 基础类型
export type BlogMemo = InferSelectModel<typeof blogMemos>
export type User = InferSelectModel<typeof users>
export type MemoTag = InferSelectModel<typeof memoTags>
export type MemoTagRelation = InferSelectModel<typeof memoTagRelations>
export type BlogComment = InferSelectModel<typeof blogComments>
export type BlogLike = InferSelectModel<typeof blogLikes>

// 扩展类型
export type BlogMemoWithUser = BlogMemo & {
  user_info: {
    username: string
    nickname: string | null
    avatarUrl: string | null
  }
  tags: Array<{
    id: string
    tagName: string
  }>
  likes: Array<{
    userId: string
    id: number
  }>
  _count: {
    comments: number
    likes: number
  }
}

export type BlogMemos = BlogMemo[]
export type BlogMemosWithUser = BlogMemoWithUser[]

// API 响应类型
export interface MemoListResponse {
  data: BlogMemoWithUser[]
  message?: string
}

export interface MemoCreateResponse {
  data: BlogMemo
  message?: string
}

export interface MemoLikeResponse {
  success: boolean
  message?: string
  data?: any
}

export interface UserRegistResponse {
  user: User
  token: string
}
