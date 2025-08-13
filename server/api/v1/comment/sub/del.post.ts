import { eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { blogSubComments } from '~~/lib/drizzle/schema'

export default defineStandardResponseHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    id: z.string(),
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }

  // 先查询要删除的数据
  const data = await db.select().from(blogSubComments).where(
    eq(blogSubComments.id, body.data.id),
  ).limit(1)

  if (data.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Sub comment not found',
    })
  }

  // 执行删除
  await db.delete(blogSubComments).where(
    eq(blogSubComments.id, body.data.id),
  )

  return data[0]
})
