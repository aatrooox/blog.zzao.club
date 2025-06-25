import type { BlogMemo, Prisma } from '@prisma/client'

export type BlogMemoWithUser = Prisma.BlogMemoGetPayload<{
  include: {
    user_info: true
    _count: true
    tags: { include: { tag: true } }
    comments: true
    likes: { select: { user_id: true, id: true } }
  }
}>

export type BlogMemos = BlogMemo[]

export type BlogMemosWithUser = BlogMemoWithUser[]
