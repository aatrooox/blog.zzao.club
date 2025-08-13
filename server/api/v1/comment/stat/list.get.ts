import { and, count, eq, inArray } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { blogComments, blogSubComments } from '~~/lib/drizzle/schema'

export default defineCachedEventHandler(async (event) => {
  const schema = z.object({
    type: z.string().optional().default('article'),
    article_ids: z.array(z.string()).optional().default([]),
  })
  const query = await useSafeValidatedQuery(event, schema)

  if (!query.success) {
    throw createError({
      statusCode: 400,
      statusMessage: (query as any).message ?? '参数错误',
    })
  }

  const whereConditions = [eq(blogComments.type, query.data.type)]

  if (query.data.article_ids.length) {
    whereConditions.push(inArray(blogComments.articleId, query.data.article_ids))
  }

  const comments = await db.select({
    id: blogComments.id,
    articleId: blogComments.articleId,
  })
    .from(blogComments)
    .where(and(...whereConditions))

  const result: Record<string, number> = {}

  // 为每个评论计算子评论数量
  for (const comment of comments) {
    if (comment.articleId) {
      const subCommentsCount = await db.select({ count: count() })
        .from(blogSubComments)
        .where(eq(blogSubComments.commentId, comment.id))

      result[comment.articleId] = (result[comment.articleId] || 0) + 1 + subCommentsCount[0].count
    }
  }

  return {
    data: result,
    msg: 'ok',
  }
}, { maxAge: 60 * 60 * 12 }) // 缓存 12 小时
