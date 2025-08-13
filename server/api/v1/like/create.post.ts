import { db } from '~~/lib/drizzle'
import { blogLikes } from '~~/lib/drizzle/schema'

export default defineStandardResponseHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    article_id: z.string(),
    user_id: z.string(), // 评论者
  }))
  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }

  const now = new Date()
  const [data] = await db.insert(blogLikes).values({
    articleId: body.data.article_id,
    userId: body.data.user_id,
    createTs: now,
    updatedTs: now,
  })

  return data
})
