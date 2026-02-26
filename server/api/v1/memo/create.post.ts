import { desc, eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { blogMemos, memoTagRelations, memoTags } from '~~/lib/drizzle/schema'

export default defineStandardResponseHandler(async (event) => {
  // 检查用户是否已登录
  if (!event.context.userId) {
    throw createError({
      statusCode: 401,
      message: '请先登录',
    })
  }

  console.log(`当前用户`, event.context.userId)
  const body = await useSafeValidatedBody(event, z.object({
    content: z.string(),
    tags: z.array(z.string()).optional(),
    visible: z.string().optional(),
    defalt_floded: z.boolean().optional(),
    flod_tip: z.string().optional(),
    // user_id 字段已废弃，userId 始终从 token 中获取，保留此字段声明仅为向后兼容（值被忽略）
    from: z.string().optional(),
    photos: z.array(z.string()).optional(), // 新增字段，允许上传多张图片
  }))

  if (!body.success) {
    console.error('请求参数验证失败:', body.error)
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }

  // 任意已登录用户（含 PAT 持有者）均可创建 memo，userId 已在上方鉴权校验

  const memoData = {
    ...body.data,
  }
  console.log(`创建memo`, memoData)

  const createData: any = {
    content: memoData.content,
    visible: memoData.visible || 'public',
    defaltFloded: memoData.defalt_floded || false,
    flodTip: memoData.flod_tip,
    userId: event.context.userId,
    from: memoData.from || 'blog',
    photos: memoData.photos || [],
  }

  let insertedMemo
  try {
    console.log('准备插入数据:', createData)
    await db.insert(blogMemos).values(createData)
    // 获取新创建的 memo
    const [memo] = await db.select().from(blogMemos).where(eq(blogMemos.userId, createData.userId)).orderBy(desc(blogMemos.createTs)).limit(1)
    insertedMemo = memo
    console.log('插入成功:', insertedMemo)
  }
  catch (error) {
    console.error('数据库插入错误:', error)
    throw createError({
      statusCode: 500,
      message: '创建失败',
    })
  }

  // 如果存在 tags，创建标签和关联
  if (memoData.tags?.length) {
    for (const tagName of memoData.tags) {
      // 查找或创建标签
      let [tag] = await db.select().from(memoTags).where(eq(memoTags.tagName, tagName))

      if (!tag) {
        await db.insert(memoTags).values({
          tagName,
          userId: event.context.userId,
        })

        // 获取新创建的标签
        const [newTag] = await db.select().from(memoTags).where(eq(memoTags.tagName, tagName))
        tag = newTag
      }

      // 创建关联
      await db.insert(memoTagRelations).values({
        tagId: tag.id,
        memoId: insertedMemo.id,
      })
    }
  }
  console.log('create ok => ', insertedMemo)
  return insertedMemo
})
