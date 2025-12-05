import { and, desc, eq, like, or } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { accessTokens } from '~~/lib/drizzle/schema'
import { API_CODES } from '~~/shared/utils/apiCodes'

/**
 * 解析 scope 字符串
 * 新格式: "scopes:wx,memo|note:我的备注"
 * 旧格式: "pat:我的备注"
 */
function parseScope(scope: string): { scopes: string[], note: string } {
  // 新格式
  const newFormatMatch = scope.match(/^scopes:([^|]+)\|note:(.+)$/)
  if (newFormatMatch) {
    return {
      scopes: newFormatMatch[1].split(','),
      note: newFormatMatch[2],
    }
  }

  // 旧格式
  const oldFormatMatch = scope.match(/^pat:(.+)$/)
  if (oldFormatMatch) {
    return {
      scopes: ['all'],
      note: oldFormatMatch[1],
    }
  }

  return { scopes: ['all'], note: scope }
}

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

  // 查询该用户的所有 PAT (scope 以 pat: 或 scopes: 开头)
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
      or(
        like(accessTokens.scope, 'pat:%'),
        like(accessTokens.scope, 'scopes:%'),
      ),
      eq(accessTokens.isRevoked, false), // 只返回未撤销的
    ))
    .orderBy(desc(accessTokens.createdAt))

  // 格式化返回数据
  return pats.map((pat) => {
    const { scopes, note } = parseScope(pat.scope)
    return {
      id: pat.id,
      note,
      scopes,
      createdAt: pat.createdAt,
      expiresAt: pat.expiresAt,
    }
  })
})
