import { eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { todoEvents, todoItems, todoTagRelations } from '~~/lib/drizzle/schema'

export default defineStandardResponseHandler(async (event) => {
  // 必须登录
  if (!event.context.userId) {
    throw createError({ statusCode: 401, message: '请先登录' })
  }

  const params = await useValidatedParams(event, z.object({
    id: z.string(),
  }))

  const body = await useSafeValidatedBody(event, z.object({
    title: z.string().min(1).max(500).optional(),
    description: z.string().nullable().optional(),
    targetType: z.enum(['none', 'url', 'project', 'post', 'note', 'other']).optional(),
    targetRef: z.string().max(1000).nullable().optional(),
    targetTitle: z.string().max(500).nullable().optional(),
    dueAt: z.string().nullable().optional(),
    // owner-only fields
    status: z.enum(['open', 'in_progress', 'blocked', 'done', 'canceled']).optional(),
    visibility: z.enum(['public', 'private']).optional(),
    tagIds: z.array(z.string()).optional(),
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      data: { code: API_CODES.VALIDATION_ERROR, message: '参数验证失败', data: body.error },
    })
  }

  const { id } = params

  // 获取现有 item
  const [existing] = await db.select().from(todoItems).where(eq(todoItems.id, id)).limit(1)
  if (!existing) {
    throw createError({ statusCode: 404, data: { code: API_CODES.RESOURCE_NOT_FOUND, message: 'Issue 不存在' } })
  }

  const isOwner = await isSuperAdmin(event.context.userId)
  const isReporter = existing.reporterUserId === event.context.userId

  if (!isOwner && !isReporter) {
    throw createError({ statusCode: 403, data: { code: API_CODES.PERMISSION_DENIED, message: '无权修改' } })
  }

  const { title, description, targetType, targetRef, targetTitle, dueAt, status, visibility, tagIds } = body.data

  // Reporter 只能改: title, description, targetType/Ref/Title, dueAt
  // Owner 可改所有字段
  const updateData: Record<string, any> = {}
  const events: { eventType: string, payload: any }[] = []

  if (title !== undefined && title !== existing.title) {
    updateData.title = title
    events.push({ eventType: 'edited', payload: { field: 'title', before: existing.title, after: title } })
  }
  if (description !== undefined) {
    updateData.description = description
    if (description !== existing.description) {
      events.push({ eventType: 'edited', payload: { field: 'description' } })
    }
  }
  if (targetType !== undefined)
    updateData.targetType = targetType
  if (targetRef !== undefined)
    updateData.targetRef = targetRef
  if (targetTitle !== undefined)
    updateData.targetTitle = targetTitle
  if (dueAt !== undefined)
    updateData.dueAt = dueAt ? new Date(dueAt) : null

  // Owner-only fields
  if (isOwner) {
    if (status !== undefined && status !== existing.status) {
      updateData.status = status
      // 自动设置 completedAt
      if (status === 'done' || status === 'canceled') {
        updateData.completedAt = new Date()
      }
      else {
        updateData.completedAt = null
      }
      events.push({ eventType: 'status_changed', payload: { before: existing.status, after: status } })
    }

    if (visibility !== undefined && visibility !== existing.visibility) {
      updateData.visibility = visibility
      events.push({ eventType: 'visibility_changed', payload: { before: existing.visibility, after: visibility } })
    }

    // 标签更新
    if (tagIds !== undefined) {
      // 删除旧标签关系
      await db.delete(todoTagRelations).where(eq(todoTagRelations.todoItemId, id))
      // 插入新标签关系
      for (const tagId of tagIds) {
        try {
          await db.insert(todoTagRelations).values({ todoItemId: id, tagId })
        }
        catch (e) {
          console.warn('[todos] insert tag relation failed', { todoItemId: id, tagId, e })
        }
      }
      events.push({ eventType: 'tagged', payload: { tagIds } })
    }
  }
  else {
    // Reporter 尝试改 owner-only 字段时忽略（不报错，只是不应用）
    if (status !== undefined || visibility !== undefined || tagIds !== undefined) {
      // 静默忽略，reporter 无法修改这些字段
    }
  }

  if (Object.keys(updateData).length > 0) {
    await db.update(todoItems).set(updateData).where(eq(todoItems.id, id))
  }

  // 写事件日志
  for (const ev of events) {
    await db.insert(todoEvents).values({
      todoItemId: id,
      actorUserId: event.context.userId,
      eventType: ev.eventType,
      payload: ev.payload,
    })
  }

  const [updated] = await db.select().from(todoItems).where(eq(todoItems.id, id)).limit(1)
  return updated
})
