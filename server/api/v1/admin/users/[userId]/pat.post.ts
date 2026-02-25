import type { PatScopeKey } from '~~/server/utils/token'
import { eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { users } from '~~/lib/drizzle/schema'
import { generatePAT, PAT_SCOPES } from '~~/server/utils/token'
import { API_CODES } from '~~/shared/utils/apiCodes'

const validScopes = Object.keys(PAT_SCOPES) as PatScopeKey[]

export default defineStandardResponseHandler(async (event) => {
  // 仅 superAdmin 可调用
  await assertSuperAdmin(event.context.userId)

  const { userId } = event.context.params as { userId: string }
  if (!userId) {
    throw createError({
      statusCode: 400,
      data: { code: API_CODES.VALIDATION_ERROR, message: '缺少 userId 参数' },
    })
  }

  const body = await useSafeValidatedBody(event, z.object({
    note: z.string().min(1, '备注不能为空').max(50, '备注不能超过 50 个字符'),
    expiresInDays: z.number().min(0).max(3650).default(365),
    scopes: z.array(z.enum(validScopes as [PatScopeKey, ...PatScopeKey[]])).min(1, '至少选择一个权限').default(['memo']),
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      data: {
        code: API_CODES.VALIDATION_ERROR,
        message: '参数验证失败',
        data: body.error,
      },
    })
  }

  // 确认目标用户存在且不是 superAdmin（不允许为 superAdmin 签发 PAT，他们走正常登录）
  const [targetUser] = await db.select({ id: users.id, role: users.role, username: users.username })
    .from(users)
    .where(eq(users.id, userId))

  if (!targetUser) {
    throw createError({
      statusCode: 404,
      data: { code: API_CODES.RESOURCE_NOT_FOUND, message: '用户不存在' },
    })
  }

  if (targetUser.role === 'superAdmin') {
    throw createError({
      statusCode: 403,
      data: { code: API_CODES.PERMISSION_DENIED, message: '不允许为超级管理员签发 PAT，请直接登录' },
    })
  }

  const { note, expiresInDays, scopes } = body.data

  // 复用现有 generatePAT 逻辑
  const rawToken = await generatePAT(userId, note, expiresInDays, scopes)

  const expiresAt = expiresInDays === 0
    ? new Date('2099-12-31')
    : new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)

  // 审计日志
  console.log(`[ADMIN AUDIT] superAdmin ${event.context.userId} issued PAT for user ${userId} (${targetUser.username}), note="${note}", scopes=${scopes.join(',')}, expiresInDays=${expiresInDays} at ${new Date().toISOString()}`)

  return {
    token: rawToken,
    note,
    expiresInDays,
    scopes,
    expiresAt,
    message: 'Token 生成成功，请立即复制保存，它将不会再次显示。',
  }
})
