import { eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { blogExplains } from '~~/lib/drizzle/schema'

export default defineStandardResponseHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'failed',
    })
  }

  const hasAuth = await verifyUserRole(event.context.userId)

  if (!hasAuth) {
    throw createError({
      statusCode: 401,
      message: '无权限访问',
    })
  }

  const [data] = await db.select().from(blogExplains).where(eq(blogExplains.id, id))

  if (!data) {
    throw createError({
      statusCode: 404,
      message: 'Record not found',
    })
  }

  await db.delete(blogExplains).where(eq(blogExplains.id, id))

  return data
})
