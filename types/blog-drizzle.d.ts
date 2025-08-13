import type { InferSelectModel } from 'drizzle-orm'
import type { blogComments, blogSubComments, users } from '~~/lib/drizzle/schema'

// 基础类型
export type BlogComment = InferSelectModel<typeof blogComments>
export type BlogSubComment = InferSelectModel<typeof blogSubComments>
export type User = InferSelectModel<typeof users>

// 扩展类型
export type BlogCommentWithUserInfo = BlogComment & {
  user_info: {
    id: string
    username: string
    nickname: string | null
    avatarUrl: string | null
    email: string | null
    phone: string | null
    password: string
    website: string | null
    role: string
    status: number
  }
  _count: {
    sub_comments: number
  }
  sub_comments: Array<BlogSubComment & {
    user_info: {
      id: string
      username: string
      nickname: string | null
      avatarUrl: string | null
      email: string | null
      phone: string | null
      password: string
      website: string | null
      role: string
      status: number
    }
  }>
}

export type BlogCommentsWithUserInfo = BlogCommentWithUserInfo[]
