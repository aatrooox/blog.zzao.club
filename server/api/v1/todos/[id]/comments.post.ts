import { eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { todoComments, todoEvents, todoItems } from '~~/lib/drizzle/schema'

export default defineStandardResponseHandler(async (event) => {
  if (!event.context.userId) {
    throw createError({ statusCode: 401, message: '请先登录' })
  }

  const params = await useValidatedParams(event, z.object({
    id: z.string(),
  }))

  const body = await useSafeValidatedBody(event, z.object({
    content: z.string().min(1).max(5000),
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      data: { code: API_CODES.VALIDATION_ERROR, message: '参数验证失败', data: body.error },
    })
  }

  // 检查 issue 是否存在
  const [item] = await db.select({ id: todoItems.id, visibility: todoItems.visibility, reporterUserId: todoItems.reporterUserId })
    .from(todoItems)
    .where(eq(todoItems.id, params.id))
    .limit(1)

  if (!item) {
    throw createError({ statusCode: 404, data: { code: API_CODES.RESOURCE_NOT_FOUND, message: 'Issue 不存在' } })
  }

  // 可见性检查：private issue 只允许 owner 或 reporter 评论
  const isOwner = await isSuperAdmin(event.context.userId)
  if (item.visibility === 'private' && !isOwner && item.reporterUserId !== event.context.userId) {
    throw createError({ statusCode: 403, data: { code: API_CODES.PERMISSION_DENIED, message: '无权评论' } })
  }

  const commentId = crypto.randomUUID()
  await db.insert(todoComments).values({
    id: commentId,
    todoItemId: params.id,
    authorUserId: event.context.userId,
    content: body.data.content,
  })

  // 写事件: commented
  await db.insert(todoEvents).values({
    todoItemId: params.id,
    actorUserId: event.context.userId,
    eventType: 'commented',
    payload: { commentId },
  })

  const [created] = await db.select().from(todoComments).where(eq(todoComments.id, commentId)).limit(1)
  return created
})
