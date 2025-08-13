import { eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { blogExplains } from '~~/lib/drizzle/schema'

export default defineStandardResponseHandler(async (event) => {
  // 文章id
  // const id = getRouterParam(event, 'id')
  const schema = z.object({
    id: z.string(),
  })
  const query = await useSafeValidatedQuery(event, schema)

  if (!query.success) {
    throw createError({
      statusCode: 400,
      statusMessage: (query as any).message ?? '参数错误',
    })
  }

  const data = await db.select()
    .from(blogExplains)
    .where(eq(blogExplains.articleId, decodeURIComponent(query.data.id)))

  return data
})
