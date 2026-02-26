import { and, count, desc, eq, inArray, like, or, sql } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { todoItems, todoTagRelations, todoTags, users } from '~~/lib/drizzle/schema'
import { paginationSchema, withPagination } from '~~/server/utils/pagination'

export default defineStandardResponseHandler(async (event) => {
  const schema = z.object({
    ...paginationSchema,
    status: z.string().optional(),
    visibility: z.enum(['public', 'private', 'all']).optional(),
    tagId: z.string().optional(),
    q: z.string().optional(),
    scope: z.enum(['created_by_me', 'assigned_to_me', 'all']).optional().default('all'),
  })

  const query = await useSafeValidatedQuery(event, schema)
  if (!query.success) {
    throw createError({ statusCode: 400, data: { code: API_CODES.VALIDATION_ERROR, message: '参数错误' } })
  }

  const { page, size, status, visibility, tagId, q, scope } = query.data
  const take = size
  const skip = (page - 1) * take

  const isOwner = event.context.userId ? await isSuperAdmin(event.context.userId) : false
  const userId = event.context.userId

  // 构建 where 条件
  const conditions: any[] = []

  // 可见性过滤：非 owner 只能看公开 or 自己创建的
  if (!isOwner) {
    if (userId) {
      conditions.push(
        or(
          eq(todoItems.visibility, 'public'),
          eq(todoItems.reporterUserId, userId),
        )!,
      )
    }
    else {
      conditions.push(eq(todoItems.visibility, 'public'))
    }
  }
  else if (visibility && visibility !== 'all') {
    conditions.push(eq(todoItems.visibility, visibility))
  }

  // scope 过滤
  if (scope === 'created_by_me' && userId) {
    conditions.push(eq(todoItems.reporterUserId, userId))
  }

  // status 过滤
  if (status) {
    conditions.push(eq(todoItems.status, status))
  }

  // 关键词搜索
  if (q) {
    conditions.push(
      or(
        like(todoItems.title, `%${q}%`),
        like(todoItems.description, `%${q}%`),
      )!,
    )
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  // 标签过滤需要子查询
  let todoIdsFromTag: string[] | undefined
  if (tagId) {
    const tagRelRows = await db.select({ todoItemId: todoTagRelations.todoItemId })
      .from(todoTagRelations)
      .where(eq(todoTagRelations.tagId, tagId))
    todoIdsFromTag = tagRelRows.map(r => r.todoItemId)
    if (todoIdsFromTag.length === 0) {
      return { list: [], total: 0, page, size, totalPages: 0 }
    }
  }

  const finalWhere = todoIdsFromTag
    ? and(whereClause, inArray(todoItems.id, todoIdsFromTag))
    : whereClause

  const countQuery = db.select({ count: count() }).from(todoItems).where(finalWhere)

  const dataQuery = db.select({
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
    .where(finalWhere)
    .orderBy(desc(todoItems.updatedAt))
    .limit(take)
    .offset(skip)

  return await withPagination({ page, size, countQuery, dataQuery })
})
