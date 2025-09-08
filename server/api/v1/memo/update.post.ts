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
    photos: z.array(z.string()).optional(), // 新增字段，允许上传多张图片
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }

  await assertSuperAdmin(event.context.userId)

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

  // 构建更新数据，只包含允许更新的字段，避免时间戳字段
  const updateData: Record<string, any> = {}

  if (memoData.content !== undefined)
    updateData.content = memoData.content
  if (memoData.visible !== undefined)
    updateData.visible = memoData.visible
  if (memoData.defalt_floded !== undefined)
    updateData.defaltFloded = Boolean(memoData.defalt_floded)
  if (memoData.flod_tip !== undefined)
    updateData.flodTip = memoData.flod_tip
  if (memoData.photos !== undefined && Array.isArray(memoData.photos))
    updateData.photos = memoData.photos

  console.log('接收到的原始数据:', memoData)
  console.log('准备更新的数据:', updateData)

  // 先删除现有的标签关联
  try {
    console.log('删除现有标签关联...')
    await db.delete(memoTagRelations).where(eq(memoTagRelations.memoId, id))
    console.log('标签关联删除成功')
  }
  catch (error) {
    console.error('删除标签关联失败:', error)
    // 不抛出错误，继续执行更新操作
  }

  // 更新备忘录 - 使用简单更新，避免时间戳问题
  try {
    console.log('开始更新memo...')
    await db.update(blogMemos)
      .set(updateData)
      .where(eq(blogMemos.id, id))
    console.log('更新成功')
  }
  catch (error) {
    console.error('更新memo失败详细错误:', error)
    throw createError({
      statusCode: 500,
      message: `更新失败: ${String(error)}`,
    })
  }

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
        // 创建新标签（让数据库自动设置时间戳）
        await db.insert(memoTags).values({
          tagName,
          userId: event.context.userId,
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

      // 创建关联（让数据库自动设置时间戳）
      await db.insert(memoTagRelations).values({
        tagId: tag.id,
        memoId: id,
      })
    }
  }

  return data
})
