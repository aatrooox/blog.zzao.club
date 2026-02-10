import { count, desc } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { users } from '~~/lib/drizzle/schema'
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

  const countQuery = db.select({ count: count() }).from(users)

  const dataQuery = db.select({
    id: users.id,
    username: users.username,
    nickname: users.nickname,
    email: users.email,
    avatarUrl: users.avatarUrl,
    role: users.role,
    status: users.status,
  })
    .from(users)
    .orderBy(desc(users.id))
    .limit(take)
    .offset(skip)

  return await withPagination({
    page: query.data.page,
    size: query.data.size,
    countQuery,
    dataQuery,
  })
})
