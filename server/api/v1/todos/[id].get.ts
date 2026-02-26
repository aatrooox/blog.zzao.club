import { eq, sql } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { todoItems, todoTagRelations, todoTags, users } from '~~/lib/drizzle/schema'

export default defineStandardResponseHandler(async (event) => {
  const params = await useValidatedParams(event, z.object({
    id: z.string(),
  }))

  const { id } = params

  const isOwner = event.context.userId ? await isSuperAdmin(event.context.userId) : false

  const [item] = await db.select({
    id: todoItems.id,
    title: todoItems.title,
    description: todoItems.description,
    status: todoItems.status,
    visibility: todoItems.visibility,
    reporterUserId: todoItems.reporterUserId,
    targetType: todoItems.targetType,
    targetRef: todoItems.targetRef,
    targetTitle: todoItems.targetTitle,
    dueAt: todoItems.dueAt,
    completedAt: todoItems.completedAt,
    createdAt: todoItems.createdAt,
    updatedAt: todoItems.updatedAt,
    reporter: {
      username: users.username,
      nickname: users.nickname,
      avatarUrl: users.avatarUrl,
    },
    tags: sql`(
      SELECT CASE 
        WHEN COUNT(tt.id) = 0 THEN JSON_ARRAY() 
        ELSE JSON_ARRAYAGG(JSON_OBJECT('id', tt.id, 'name', tt.name, 'color', tt.color))
      END
      FROM ${todoTagRelations} ttr
      LEFT JOIN ${todoTags} tt ON ttr.tag_id = tt.id
      WHERE ttr.todo_item_id = ${todoItems.id}
    )`,
  })
    .from(todoItems)
    .leftJoin(users, eq(todoItems.reporterUserId, users.id))
    .where(eq(todoItems.id, id))
    .limit(1)

  if (!item) {
    throw createError({ statusCode: 404, data: { code: API_CODES.RESOURCE_NOT_FOUND, message: 'Issue 不存在' } })
  }

  // 可见性检查：private 只允许 owner 或 reporter 查看
  if (item.visibility === 'private') {
    if (!isOwner && item.reporterUserId !== event.context.userId) {
      throw createError({ statusCode: 403, data: { code: API_CODES.PERMISSION_DENIED, message: '无权访问' } })
    }
  }

  return item
})
