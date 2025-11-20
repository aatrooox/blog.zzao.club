import { and, eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { accessTokens } from '~~/lib/drizzle/schema'
import { API_CODES } from '~~/shared/utils/apiCodes'

export default defineStandardResponseHandler(async (event) => {
  const userId = event.context.userId
  if (!userId) {
    throw createError({
      statusCode: 401,
      data: {
        code: API_CODES.NO_TOKEN,
        message: '请先登录',
      },
    })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      data: {
        code: API_CODES.VALIDATION_ERROR,
        message: '参数错误',
      },
    })
  }

  // 软删除：标记为已撤销
  await db.update(accessTokens)
    .set({ isRevoked: true })
    .where(and(
      eq(accessTokens.id, id),
      eq(accessTokens.userId, userId), // 确保只能删除自己的
    ))

  return { success: true }
})
