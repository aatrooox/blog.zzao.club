import { inArray } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { blogLikes } from '~~/lib/drizzle/schema'

export default defineCachedEventHandler(async (event) => {
  const schema = z.object({
    article_ids: z.array(z.string()).optional().default([]),
  })
  const query = await useSafeValidatedQuery(event, schema)

  if (!query.success) {
    throw createError({
      statusCode: 400,
      statusMessage: (query as any).message ?? '参数错误',
    })
  }

  let likes
  if (query.data.article_ids.length) {
    likes = await db.select()
      .from(blogLikes)
      .where(inArray(blogLikes.articleId, query.data.article_ids))
  }
  else {
    likes = await db.select().from(blogLikes)
  }

  const result: Record<string, number> = {}

  likes.forEach((item) => {
    if (item.articleId) {
      result[item.articleId] = (result[item.articleId] || 0) + 1
    }
  })

  return {
    data: result,
    msg: 'ok',
  }
}, { maxAge: 60 * 60 * 12 }) // 缓存 12 小时
