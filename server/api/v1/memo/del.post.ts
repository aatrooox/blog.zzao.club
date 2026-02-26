import { eq } from 'drizzle-orm'
import { useSafeValidatedBody } from 'h3-zod'
import { db } from '~~/lib/drizzle'
import { blogMemos, memoTagRelations } from '~~/lib/drizzle/schema'

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

  // 先获取要删除的数据
  const [memo] = await db.select().from(blogMemos).where(eq(blogMemos.id, body.data.id)).limit(1).catch(() => {
    throw createError({
      statusCode: 500,
      message: '查询失败',
    })
  })

  if (!memo) {
    throw createError({
      statusCode: 404,
      data: {
        code: API_CODES.RESOURCE_NOT_FOUND,
        message: '记录不存在',
      },
    })
  }

  const callerId = event.context.userId
  const isOwner = memo.userId === callerId
  const isAdmin = await isSuperAdmin(callerId)

  if (!isOwner && !isAdmin) {
    throw createError({
      statusCode: 200,
      data: {
        code: API_CODES.PERMISSION_DENIED,
        message: '无权限删除该 memo，仅限本人或超级管理员',
      },
    })
  }

  const deletePath = isOwner ? 'owner' : 'superAdmin'

  // 执行删除（先删除关联的标签关系，再删除memo）
  try {
    // 1. 先删除标签关系
    await db.delete(memoTagRelations).where(eq(memoTagRelations.memoId, body.data.id))

    // 2. 再删除memo
    await db.delete(blogMemos).where(eq(blogMemos.id, body.data.id))

    console.log(`[memo:del] memoId=${body.data.id} deletedBy=${callerId} path=${deletePath}`)
  }
  catch (err) {
    console.error('删除失败:', err)
    throw createError({
      statusCode: 500,
      message: '删除失败',
    })
  }

  return memo
})
