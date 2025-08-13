import { and, eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { memoTagRelations, memoTags } from '~~/lib/drizzle/schema'

export default defineStandardResponseHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    tagName: z.string(),
    memo_id: z.string().optional(),
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }

  const { tagName, memo_id } = body.data

  // 检查 tag 是否已存在
  const existingTag = await db.select().from(memoTags).where(
    and(
      eq(memoTags.tagName, tagName),
      eq(memoTags.userId, event.context.userId),
    ),
  ).limit(1)

  if (existingTag.length > 0) {
    throw createError({
      statusCode: 400,
      message: '标签已存在',
    })
  }

  // 创建 tag
  const now = new Date()
  await db.insert(memoTags).values({
    tagName,
    userId: event.context.userId,
    createTs: now,
    updatedTs: now,
  })

  // 获取刚创建的标签
  const [tag] = await db.select().from(memoTags).where(
    and(
      eq(memoTags.tagName, tagName),
      eq(memoTags.userId, event.context.userId),
    ),
  ).limit(1)

  // 如果提供了 memo_id，创建关联
  if (memo_id) {
    const now = new Date()
    await db.insert(memoTagRelations).values({
      tagId: tag.id,
      memoId: memo_id,
      createTs: now,
      updatedTs: now,
    })
  }

  return tag
})
