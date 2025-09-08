import { and, eq, ne } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { memoTagRelations, memoTags } from '~~/lib/drizzle/schema'

export default defineStandardResponseHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    id: z.string(),
    tagName: z.string(),
    memo_ids: z.array(z.string()).optional(),
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }

  await assertSuperAdmin(event.context.userId)

  const { id, tagName, memo_ids } = body.data

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
      message: '标签不存在或无权限修改',
    })
  }

  // 检查新名称是否与其他标签冲突
  const conflictingTag = await db.select().from(memoTags).where(
    and(
      eq(memoTags.tagName, tagName),
      eq(memoTags.userId, event.context.userId),
      ne(memoTags.id, id),
    ),
  ).limit(1)

  if (conflictingTag.length > 0) {
    throw createError({
      statusCode: 400,
      message: '标签名称已存在',
    })
  }

  // 更新 tag
  await db.update(memoTags).set({
    tagName,
  }).where(eq(memoTags.id, id))

  // 查询更新后的标签
  const updatedTag = await db.select().from(memoTags).where(
    eq(memoTags.id, id),
  ).limit(1)

  // 如果提供了 memo_ids，更新关联
  if (memo_ids !== undefined) {
    // 删除现有关联
    await db.delete(memoTagRelations).where(
      eq(memoTagRelations.tagId, id),
    )

    // 创建新关联
    if (memo_ids.length > 0) {
      const now = new Date()
      await db.insert(memoTagRelations).values(
        memo_ids.map((memoId: string) => ({
          tagId: id,
          memoId,
          createTs: now,
          updatedTs: now,
        })),
      )
    }
  }

  return updatedTag[0]
})
