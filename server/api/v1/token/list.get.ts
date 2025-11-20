import { and, desc, eq, like } from 'drizzle-orm'
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

  // 查询该用户的所有 PAT (scope 以 pat: 开头)
  const pats = await db.select({
    id: accessTokens.id,
    scope: accessTokens.scope,
    createdAt: accessTokens.createdAt,
    expiresAt: accessTokens.expiresAt,
    isRevoked: accessTokens.isRevoked,
  })
    .from(accessTokens)
    .where(and(
      eq(accessTokens.userId, userId),
      like(accessTokens.scope, 'pat:%'),
      eq(accessTokens.isRevoked, false), // 只返回未撤销的
    ))
    .orderBy(desc(accessTokens.createdAt))

  // 格式化返回数据
  return pats.map(pat => ({
    id: pat.id,
    note: pat.scope.replace('pat:', ''),
    createdAt: pat.createdAt,
    expiresAt: pat.expiresAt,
  }))
})
