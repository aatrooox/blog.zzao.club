import { and, eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { todoEvents, todoItems, todoParticipants, todoTagRelations, todoTags } from '~~/lib/drizzle/schema'

export default defineStandardResponseHandler(async (event) => {
  // 必须登录
  if (!event.context.userId) {
    throw createError({ statusCode: 401, message: '请先登录' })
  }

  const body = await useSafeValidatedBody(event, z.object({
    title: z.string().min(1).max(500),
    description: z.string().optional(),
    visibility: z.enum(['public', 'private']).default('public'),
    targetType: z.enum(['none', 'url', 'project', 'post', 'note', 'other']).default('none'),
    targetRef: z.string().max(1000).optional(),
    targetTitle: z.string().max(500).optional(),
    dueAt: z.string().optional(), // ISO date string
    tagIds: z.array(z.string()).optional(), // preset tag ids
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      data: { code: API_CODES.VALIDATION_ERROR, message: '参数验证失败', data: body.error },
    })
  }

  const { title, description, visibility, targetType, targetRef, targetTitle, dueAt, tagIds } = body.data

  // 创建 todo item
  const todoId = crypto.randomUUID()
  await db.insert(todoItems).values({
    id: todoId,
    title,
    description: description || null,
    visibility,
    targetType: targetType || 'none',
    targetRef: targetRef || null,
    targetTitle: targetTitle || null,
    dueAt: dueAt ? new Date(dueAt) : null,
    reporterUserId: event.context.userId,
  })

  // 绑定标签
  if (tagIds && tagIds.length > 0) {
    // 验证标签存在
    const existingTags = await db
      .select({ id: todoTags.id })
      .from(todoTags)
      .where(and(...tagIds.map(id => eq(todoTags.id, id))))
    // Insert tag relations
    for (const tagId of tagIds) {
      const exists = existingTags.find(t => t.id === tagId)
      if (exists) {
        await db.insert(todoTagRelations).values({ todoItemId: todoId, tagId }).catch(() => {})
      }
    }
  }

  // 写事件: created
  await db.insert(todoEvents).values({
    todoItemId: todoId,
    actorUserId: event.context.userId,
    eventType: 'created',
    payload: { title, visibility, tagIds: tagIds || [] },
  })

  // 创建者自动成为 reporter + watcher
  await db.insert(todoParticipants).values({
    todoItemId: todoId,
    userId: event.context.userId,
    role: 'reporter',
    status: 'active',
  }).catch(() => {})

  // 获取并返回创建的数据
  const [created] = await db.select().from(todoItems).where(eq(todoItems.id, todoId)).limit(1)
  return created
})
