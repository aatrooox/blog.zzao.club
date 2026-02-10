import { count, desc, eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { blogComments, users } from '~~/lib/drizzle/schema'
import { paginationSchema, withPagination } from '~~/server/utils/pagination'

export default defineStandardResponseHandler(async (event) => {
  await assertSuperAdmin(event.context.userId)

  const schema = z.object({
    ...paginationSchema,
  })
  const query = await useSafeValidatedQuery(event, schema)

  if (!query.success) {
    throw createError({
      statusCode: 400,
      statusMessage: (query as any).message ?? '参数错误',
    })
  }

  const take = query.data.size
  const skip = (query.data.page - 1) * take

  const countQuery = db.select({ count: count() }).from(blogComments)

  const dataQuery = db.select({
    id: blogComments.id,
    content: blogComments.content,
    type: blogComments.type,
    articleId: blogComments.articleId,
    memoId: blogComments.memoId,
    userId: blogComments.userId,
    visitorName: blogComments.visitorName,
    createTs: blogComments.createTs,
    updatedTs: blogComments.updatedTs,
    user_info: {
      username: users.username,
      nickname: users.nickname,
      avatarUrl: users.avatarUrl,
    },
  })
    .from(blogComments)
    .leftJoin(users, eq(blogComments.userId, users.id))
    .orderBy(desc(blogComments.createTs))
    .limit(take)
    .offset(skip)

  return await withPagination({
    page: query.data.page,
    size: query.data.size,
    countQuery,
    dataQuery,
  })
})
