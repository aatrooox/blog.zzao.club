import { eq } from 'drizzle-orm'
import { useSafeValidatedBody } from 'h3-zod'
import { db } from '~~/lib/drizzle'
import { blogMemos } from '~~/lib/drizzle/schema'

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

  // 先获取要删除的数据
  const [data] = await db.select().from(blogMemos).where(eq(blogMemos.id, body.data.id)).limit(1).catch(() => {
    throw createError({
      statusCode: 500,
      message: '查询失败',
    })
  })

  if (!data) {
    throw createError({
      statusCode: 404,
      message: '记录不存在',
    })
  }

  // 执行删除
  await db.delete(blogMemos)
    .where(eq(blogMemos.id, body.data.id))
    .catch(() => {
      throw createError({
        statusCode: 500,
        message: '删除失败',
      })
    })

  return data
})
