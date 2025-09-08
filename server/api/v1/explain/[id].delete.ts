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

  await assertSuperAdmin(event.context.userId)

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
