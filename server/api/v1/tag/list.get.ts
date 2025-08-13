import { desc, eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { memoTags } from '~~/lib/drizzle/schema'

export default defineStandardResponseHandler(async (event) => {
  const schema = z.object({
    user_id: z.string().optional(),
  })
  const query = await useSafeValidatedQuery(event, schema)

  if (!query.success) {
    throw createError({
      statusCode: 400,
      statusMessage: (query as any).message ?? '参数错误',
    })
  }

  const userId = query.data.user_id || event.context.userId

  const tags = await db.select().from(memoTags).where(eq(memoTags.userId, userId)).orderBy(desc(memoTags.createTs))

  return tags
})
