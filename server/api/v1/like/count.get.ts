import { and, count, eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { blogLikes } from '~~/lib/drizzle/schema'

export default defineStandardResponseHandler(async (event) => {
  const schema = z.object({
    article_id: z.string(),
    user_id: z.string().optional(),
  })
  const query = await useSafeValidatedQuery(event, schema)

  if (!query.success) {
    throw createError({
      statusCode: 400,
      statusMessage: (query as any).message ?? '参数错误',
    })
  }

  const [{ count: likeCount }] = await db.select({ count: count() })
    .from(blogLikes)
    .where(eq(blogLikes.articleId, query.data.article_id))
  // 查询该用户是否已经点赞
  if (query.data.user_id) {
    const [isLiked] = await db.select()
      .from(blogLikes)
      .where(and(
        eq(blogLikes.articleId, query.data.article_id),
        eq(blogLikes.userId, query.data.user_id),
      ))

    return {
      count: likeCount,
      isLiked: !!isLiked,
    }
  }
  return { count: likeCount }
})
