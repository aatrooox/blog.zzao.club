import { eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { users } from '~~/lib/drizzle/schema'

// 获取根据id/uid获取用户详情
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

  const user = await db.select().from(users).where(eq(users.id, body.data.id)).limit(1)

  return user[0] || null
})
