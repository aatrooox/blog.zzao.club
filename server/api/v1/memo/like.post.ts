import { and, eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { blogLikes } from '~~/lib/drizzle/schema'

export default defineStandardResponseHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    memo_id: z.string(),
    user_id: z.string(), // 点赞者
  }))
  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }

  // 检查是否已经点赞过
  const [existingLike] = await db.select()
    .from(blogLikes)
    .where(and(
      eq(blogLikes.target, 'memo'),
      eq(blogLikes.blogMemoId, body.data.memo_id),
      eq(blogLikes.userId, body.data.user_id),
    ))

  // 如果已经点赞过，直接返回成功
  if (existingLike) {
    return { success: true, message: '已经点赞过了' }
  }

  // 创建新的点赞记录
  const now = new Date()
  const [data] = await db.insert(blogLikes).values({
    target: 'memo',
    blogMemoId: body.data.memo_id,
    userId: body.data.user_id,
    createTs: now,
    updatedTs: now,
  })

  return { success: true, data }
})
