import { Prisma, type BlogMemo } from '@prisma/client';

export type BlogMemoWithUser = Prisma.BlogCommentGetPayload<{
  include: { user_info: true, _count: true }
}>

export type BlogMemos = BlogMemo[]

export type BlogMemosWithUser = BlogMemoWithUser[]

