import { and, eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { memoTags } from '~~/lib/drizzle/schema'

export default defineStandardResponseHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    id: z.string(),
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }

  const { id } = body.data

  // 检查 tag 是否存在且属于当前用户
  const existingTag = await db.select().from(memoTags).where(
    and(
      eq(memoTags.id, id),
      eq(memoTags.userId, event.context.userId),
    ),
  ).limit(1)

  if (existingTag.length === 0) {
    throw createError({
      statusCode: 400,
      message: '标签不存在或无权限删除',
    })
  }

  // 先获取要删除的标签数据
  const [tag] = await db.select().from(memoTags).where(eq(memoTags.id, id)).limit(1)

  // 删除 tag（关联表会自动删除，因为有 onDelete: NoAction）
  await db.delete(memoTags)
    .where(eq(memoTags.id, id))

  return tag
})
