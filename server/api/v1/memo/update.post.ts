import { and, eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { blogMemos, memoTagRelations, memoTags } from '~~/lib/drizzle/schema'

export default defineStandardResponseHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    id: z.string(),
    content: z.string(),
    tags: z.array(z.string()).optional(),
    visible: z.string().optional(),
    defalt_floded: z.boolean().optional(),
    flod_tip: z.string().optional(),
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }

  const { id, ...memoData } = body.data
  console.log(`更新memo`, { id, ...memoData })

  // 检查memo是否存在且属于当前用户
  const existingMemo = await db.select().from(blogMemos).where(
    and(
      eq(blogMemos.id, id),
      eq(blogMemos.userId, event.context.userId),
    ),
  ).limit(1)

  if (existingMemo.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'Memo不存在或无权限修改',
    })
  }

  const updateData: any = {
    ...memoData,
  }

  // 删除 tags 字段，因为我们要单独处理
  delete updateData.tags

  // 先删除现有的标签关联
  await db.delete(memoTagRelations).where(eq(memoTagRelations.memoId, id))

  // 更新备忘录
  await db.update(blogMemos)
    .set(updateData)
    .where(eq(blogMemos.id, id))
    .catch(() => {
      throw createError({
        statusCode: 500,
        message: '更新失败',
      })
    })

  // 获取更新后的数据
  const [data] = await db.select().from(blogMemos).where(eq(blogMemos.id, id)).limit(1)

  // 如果存在 tags，创建标签和关联
  if (memoData.tags?.length) {
    for (const tagName of memoData.tags) {
      // 查找现有标签
      const existingTag = await db.select().from(memoTags).where(
        and(
          eq(memoTags.tagName, tagName),
          eq(memoTags.userId, event.context.userId),
        ),
      ).limit(1)

      let tag
      if (existingTag.length > 0) {
        tag = existingTag[0]
      }
      else {
        // 创建新标签
        const now = new Date()
        await db.insert(memoTags).values({
          tagName,
          userId: event.context.userId,
          createTs: now,
          updatedTs: now,
        })
        // 获取刚创建的标签
        const [newTag] = await db.select().from(memoTags).where(
          and(
            eq(memoTags.tagName, tagName),
            eq(memoTags.userId, event.context.userId),
          ),
        ).limit(1)
        tag = newTag
      }

      // 创建关联
      const now = new Date()
      await db.insert(memoTagRelations).values({
        tagId: tag.id,
        memoId: id,
        createTs: now,
        updatedTs: now,
      })
    }
  }

  return data
})
