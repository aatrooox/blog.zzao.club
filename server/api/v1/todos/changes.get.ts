import { and, asc, eq, gt } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { todoEvents } from '~~/lib/drizzle/schema'

export default defineStandardResponseHandler(async (event) => {
  const query = await useSafeValidatedQuery(event, z.object({
    cursor: z.coerce.number().int().min(0).default(0),
    limit: z.coerce.number().int().min(1).max(100).default(50),
    todoItemId: z.string().optional(),
  }))

  if (!query.success) {
    throw createError({ statusCode: 400, data: { code: API_CODES.VALIDATION_ERROR, message: '参数错误' } })
  }

  const { cursor, limit, todoItemId } = query.data

  const conditions = [gt(todoEvents.id, cursor)]
  if (todoItemId) {
    conditions.push(eq(todoEvents.todoItemId, todoItemId))
  }

  const events = await db.select()
    .from(todoEvents)
    .where(and(...conditions))
    .orderBy(asc(todoEvents.id))
    .limit(limit)

  const nextCursor = events.length > 0 ? events[events.length - 1].id : cursor

  return {
    events,
    nextCursor,
    hasMore: events.length === limit,
  }
})
