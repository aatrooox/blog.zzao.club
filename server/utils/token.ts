import { createHash } from 'node:crypto'
import process from 'node:process'
import { and, eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import { db } from '~~/lib/drizzle'
import { accessTokens, users } from '~~/lib/drizzle/schema'

/**
 * PAT Scope 定义
 * 每个 scope 对应允许访问的 API 路径前缀
 */
export const PAT_SCOPES = {
  all: { label: '全部权限', paths: ['/api/v1/'] },
  wx: { label: '微信接口', paths: ['/api/v1/wx/'] },
  memo: { label: '动态管理', paths: ['/api/v1/memo/'] },
  comment: { label: '评论管理', paths: ['/api/v1/comment/'] },
  upload: { label: '文件上传', paths: ['/api/v1/upload/'] },
  user: { label: '用户信息', paths: ['/api/v1/user/'] },
} as const

export type PatScopeKey = keyof typeof PAT_SCOPES

/**
 * 检查路径是否在 scope 允许范围内
 */
export function isPathAllowedByScope(scope: string, pathname: string): boolean {
  // 解析 scope 字符串，格式: "scopes:wx,memo|note:我的备注"
  const scopeMatch = scope.match(/^scopes:([^|]+)/)
  if (!scopeMatch) {
    // 兼容旧格式 "pat:备注"，视为 all 权限
    return true
  }

  const scopeKeys = scopeMatch[1].split(',') as PatScopeKey[]

  // 检查是否有 all 权限
  if (scopeKeys.includes('all')) {
    return true
  }

  // 检查路径是否匹配任一 scope 的允许路径
  return scopeKeys.some((key) => {
    const scopeDef = PAT_SCOPES[key]
    if (!scopeDef)
      return false
    return scopeDef.paths.some(allowedPath => pathname.startsWith(allowedPath))
  })
}

// JWT配置
const config = useRuntimeConfig()
const JWT_SECRET = config.jwtSecret || 'your-secret-key-change-in-production'

if (process.dev && JWT_SECRET === 'your-secret-key-change-in-production') {
  console.warn('\x1B[33m%s\x1B[0m', '⚠️ [Security] 您正在使用默认的 JWT 密钥。请在 .env 中配置 NUXT_JWT_SECRET 以确保生产环境安全。')
}

const ACCESS_TOKEN_EXPIRES_IN = '15m' // 15分钟
const REFRESH_TOKEN_EXPIRES_IN = 7 * 24 * 60 * 60 // 7天（秒）

/**
 * 生成 Personal Access Token (PAT)
 * 用于第三方应用调用 API
 * @param userId 用户ID
 * @param note 备注/名称
 * @param expiresInDays 有效期（天），0表示永不过期
 * @param scopes 权限范围数组，默认 ['all']
 */
export async function generatePAT(
  userId: string,
  note: string,
  expiresInDays: number = 365,
  scopes: PatScopeKey[] = ['all'],
) {
  const rawToken = `pat_${useNanoId(40)}`
  const hashedToken = createHash('sha256').update(rawToken).digest('hex')

  const now = new Date()
  const expiresAt = expiresInDays === 0
    ? new Date('2099-12-31')
    : new Date(now.getTime() + expiresInDays * 24 * 60 * 60 * 1000)

  // scope 格式: "scopes:wx,memo|note:我的备注"
  const scopeString = `scopes:${scopes.join(',')}|note:${note}`

  await db.insert(accessTokens).values({
    userId,
    token: hashedToken,
    scope: scopeString,
    status: 1,
    isRevoked: false,
    expiresAt,
    createdAt: now,
    updatedAt: now,
  })

  return rawToken
}

/**
 * 验证 Personal Access Token
 */
export async function verifyPAT(token: string): Promise<{ isAuth: boolean, userId?: string, scope?: string }> {
  if (!token.startsWith('pat_')) {
    return { isAuth: false }
  }

  const hashedToken = createHash('sha256').update(token).digest('hex')

  const [tokenData] = await db.select().from(accessTokens).where(eq(accessTokens.token, hashedToken))

  if (!tokenData) {
    return { isAuth: false }
  }

  if (tokenData.isRevoked || new Date(tokenData.expiresAt) < new Date()) {
    return { isAuth: false }
  }

  return {
    isAuth: true,
    userId: tokenData.userId,
    scope: tokenData.scope,
  }
}

interface JWTPayload {
  userId: string
  scope: string
  iat?: number
  exp?: number
}

interface RefreshTokenData {
  userId: string
  scope: string
  expiresAt: Date
  isRevoked: boolean
}

interface TokenPair {
  accessToken: string
  refreshToken: string
  accessExpiresAt: Date
  refreshExpiresAt: Date
}

/**
 * 生成JWT Access Token（无状态）+ Redis Refresh Token（有状态）
 * @param userId 用户ID
 * @param scope 权限范围
 * @returns TokenPair
 */
export async function generateTokenPair(userId: string, scope: string = 'all'): Promise<TokenPair> {
  // 生成JWT Access Token（无状态，包含用户信息）
  const accessTokenPayload: JWTPayload = {
    userId,
    scope,
  }
  const accessToken = jwt.sign(accessTokenPayload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  })

  // 生成Refresh Token（随机字符串，存储在Redis）
  const refreshToken = useNanoId(64)
  const now = new Date()
  const accessExpiresAt = new Date(now.getTime() + 15 * 60 * 1000) // 15分钟
  const refreshExpiresAt = new Date(now.getTime() + REFRESH_TOKEN_EXPIRES_IN * 1000) // 7天

  // 只将Refresh Token存储到Redis
  const refreshTokenData: RefreshTokenData = {
    userId,
    scope,
    expiresAt: refreshExpiresAt,
    isRevoked: false,
  }

  await useStorage('redis').setItem(
    `refresh_token:${refreshToken}`,
    refreshTokenData,
    { ttl: REFRESH_TOKEN_EXPIRES_IN },
  )

  return {
    accessToken,
    refreshToken,
    accessExpiresAt,
    refreshExpiresAt,
  }
}

/**
 * 验证JWT Access Token（无状态）
 * @param token JWT token
 * @returns 验证结果和用户信息
 */
export function verifyJWTAccessToken(token: string): { isAuth: boolean, userId?: string, scope?: string, error?: string } {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    return {
      isAuth: true,
      userId: decoded.userId,
      scope: decoded.scope,
    }
  }
  catch (error: any) {
    return {
      isAuth: false,
      error: error.message,
    }
  }
}

/**
 * 使用 Refresh Token 刷新 Access Token (实现 Token 轮换)
 * @param refreshToken 旧的 Refresh Token
 * @returns 新的 Token Pair
 */
export async function refreshAccessToken(refreshToken: string): Promise<TokenPair | null> {
  // 1. 从Redis获取旧 token 数据
  const refreshData = await useStorage('redis').getItem<RefreshTokenData>(`refresh_token:${refreshToken}`)

  // 2. 立即删除旧 token (防止重放攻击，实现轮换)
  await useStorage('redis').removeItem(`refresh_token:${refreshToken}`)

  // 3. 校验有效性
  if (!refreshData || refreshData.isRevoked) {
    // TODO: 安全警报 - 检测到可能的 Refresh Token 重用/盗用
    // 建议在此处撤销该用户的所有 Token
    return null
  }

  if (new Date(refreshData.expiresAt) < new Date()) {
    return null
  }

  // 4. 生成全新的 Token Pair (Access + Refresh)
  return await generateTokenPair(refreshData.userId, refreshData.scope)
}

/**
 * 撤销 Refresh Token
 * @param refreshToken Refresh Token
 */
export async function revokeRefreshToken(refreshToken: string): Promise<void> {
  const refreshData = await useStorage('redis').getItem<RefreshTokenData>(`refresh_token:${refreshToken}`)
  if (refreshData) {
    await useStorage('redis').setItem(
      `refresh_token:${refreshToken}`,
      { ...refreshData, isRevoked: true },
      { ttl: 60 * 60 * 24 }, // 保留1天用于审计
    )
  }
}

/**
 * 撤销用户的所有 Refresh Token（通过扫描Redis）
 * @param userId 用户ID
 */
export async function revokeAllRefreshTokens(userId: string): Promise<void> {
  // 注意：这个实现依赖于Redis的SCAN命令，在生产环境中可能需要优化
  // 更好的方案是在Redis中维护一个用户->token映射

  // 这里简化处理，实际生产中建议维护用户token映射表
  console.warn(`revokeAllRefreshTokens for user ${userId} - 需要实现Redis SCAN逻辑`)
}

// === 以下是为了向后兼容保留的旧函数，建议逐步迁移到JWT方案 ===

/**
 * @deprecated 使用 verifyJWTAccessToken 替代
 */
export async function verifyAccessToken({ token }: { token?: string }): Promise<{ isAuth: boolean, userId?: string, scope?: string }> {
  if (!token) {
    return { isAuth: false }
  }

  // 尝试JWT验证
  const jwtResult = verifyJWTAccessToken(token)
  if (jwtResult.isAuth) {
    return {
      isAuth: true,
      userId: jwtResult.userId,
      scope: jwtResult.scope,
    }
  }

  // 降级到数据库验证（兼容旧token）
  const [tokenData] = await db.select().from(accessTokens).where(eq(accessTokens.token, token))

  if (tokenData?.isRevoked || new Date(tokenData?.expiresAt || '') < new Date()) {
    return {
      isAuth: false,
      userId: tokenData?.userId,
      scope: tokenData?.scope,
    }
  }

  return {
    isAuth: true,
    userId: tokenData?.userId,
    scope: tokenData?.scope,
  }
}

/**
 * @deprecated 建议使用JWT方案
 */
export async function verifyAccessUser({ userId, scope = 'all' }: { userId?: string, scope?: string }) {
  if (!userId) {
    return false
  }

  const [tokenData] = await db.select().from(accessTokens).where(and(
    eq(accessTokens.userId, userId),
    eq(accessTokens.scope, scope),
  ))

  if (tokenData?.isRevoked || new Date(tokenData?.expiresAt ?? '') < new Date()) {
    return false
  }

  return true
}

/**
 * @deprecated 建议使用 revokeRefreshToken
 */
export async function revokeAccessToken({ token, userId, scope = 'all' }: { userId: string, token?: string, scope?: string }) {
  const whereConditions = [
    eq(accessTokens.userId, userId),
    eq(accessTokens.scope, scope),
  ]

  if (token) {
    whereConditions.push(eq(accessTokens.token, token))
  }

  await db.update(accessTokens)
    .set({ isRevoked: true })
    .where(and(...whereConditions))
}

/**
 * @deprecated 使用 generateTokenPair 替代
 */
export async function upsertAccessToken(userId: string) {
  const tokenPair = await generateTokenPair(userId)
  const now = new Date()
  const data = {
    token: tokenPair.accessToken,
    expiresAt: tokenPair.accessExpiresAt,
    userId,
    isRevoked: false,
    createdAt: now,
    updatedAt: now,
  }

  return data
}

export async function verifyUserRole(userId: string, allRoles = ['superAdmin']) {
  const [userData] = await db.select().from(users).where(eq(users.id, userId))
  console.log(`userData?.role`, userData?.role)

  if (!allRoles.includes(userData?.role ?? '')) {
    console.log(` 无权限`)
    return false
  }

  return true
}
