import { eq } from 'drizzle-orm'
import { useSafeValidatedBody } from 'h3-zod'
import { db } from '~~/lib/drizzle'
import { blogComments } from '~~/lib/drizzle/schema'

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

  await assertSuperAdmin(event.context.userId)

  const [data] = await db.select().from(blogComments).where(eq(blogComments.id, body.data.id))

  if (!data) {
    throw createError({
      statusCode: 404,
      message: 'Comment not found',
    })
  }

  await db.delete(blogComments).where(eq(blogComments.id, body.data.id))

  return data
})
