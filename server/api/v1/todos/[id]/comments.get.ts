import { asc, eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { todoComments, todoItems, users } from '~~/lib/drizzle/schema'

export default defineStandardResponseHandler(async (event) => {
  const params = await useValidatedParams(event, z.object({
    id: z.string(),
  }))

  // 检查 issue 是否存在 + 可见性
  const [item] = await db.select({ id: todoItems.id, visibility: todoItems.visibility, reporterUserId: todoItems.reporterUserId })
    .from(todoItems)
    .where(eq(todoItems.id, params.id))
    .limit(1)

  if (!item) {
    throw createError({ statusCode: 404, data: { code: API_CODES.RESOURCE_NOT_FOUND, message: 'Issue 不存在' } })
  }

  if (item.visibility === 'private') {
    const isOwner = event.context.userId ? await isSuperAdmin(event.context.userId) : false
    if (!isOwner && item.reporterUserId !== event.context.userId) {
      throw createError({ statusCode: 403, data: { code: API_CODES.PERMISSION_DENIED, message: '无权访问' } })
    }
  }

  const comments = await db.select({
    id: todoComments.id,
    todoItemId: todoComments.todoItemId,
    content: todoComments.content,
    createdAt: todoComments.createdAt,
    updatedAt: todoComments.updatedAt,
    author: {
      id: users.id,
      username: users.username,
      nickname: users.nickname,
      avatarUrl: users.avatarUrl,
    },
  })
    .from(todoComments)
    .leftJoin(users, eq(todoComments.authorUserId, users.id))
    .where(eq(todoComments.todoItemId, params.id))
    .orderBy(asc(todoComments.createdAt))

  return comments
})
