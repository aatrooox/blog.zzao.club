import { desc, eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { blogExplains } from '~~/lib/drizzle/schema'

export default defineStandardResponseHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    content: z.string(), // 解释内容
    text: z.string(), // 注解对象
    article_id: z.string(),
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }

  await assertSuperAdmin(event.context.userId)

  const { content, article_id, text } = body.data

  // 为文章添加注解
  const now = new Date()
  await db.insert(blogExplains).values({
    content,
    text,
    articleId: article_id,
    createTs: now,
    updatedTs: now,
  })

  const [data] = await db.select()
    .from(blogExplains)
    .where(eq(blogExplains.articleId, article_id))
    .orderBy(desc(blogExplains.createTs))
    .limit(1)

  return data
})
