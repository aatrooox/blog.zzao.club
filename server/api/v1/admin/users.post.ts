import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { users } from '~~/lib/drizzle/schema'
import { API_CODES } from '~~/shared/utils/apiCodes'

export default defineStandardResponseHandler(async (event) => {
  // 仅 superAdmin 可调用
  await assertSuperAdmin(event.context.userId)

  const body = await useSafeValidatedBody(event, z.object({
    username: z.string().min(2, '用户名至少 2 个字符').max(50, '用户名不超过 50 个字符'),
    password: z.string().min(6, '密码至少 6 个字符').default('changeme123'),
    nickname: z.string().max(50).optional(),
    avatarUrl: z.string().url().optional().or(z.literal('')),
    bio: z.string().max(200).optional(),
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

  const { username, password, nickname, avatarUrl } = body.data

  // 检查用户名是否已存在
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.username, username))
  if (existing) {
    throw createError({
      statusCode: 400,
      data: {
        code: API_CODES.DUPLICATE_ERROR,
        message: '用户名已存在',
      },
    })
  }

  // 密码加密
  const hashedPassword = await bcrypt.hash(password, 10)

  // 创建普通用户（role 固定为 user，不允许创建 superAdmin）
  await db.insert(users).values({
    username,
    password: hashedPassword,
    nickname: nickname || null,
    avatarUrl: avatarUrl || null,
    role: 'user',
    status: 1,
  })

  const [created] = await db.select({
    id: users.id,
    username: users.username,
    nickname: users.nickname,
    avatarUrl: users.avatarUrl,
    role: users.role,
  }).from(users).where(eq(users.username, username))

  // 审计日志
  console.log(`[ADMIN AUDIT] superAdmin ${event.context.userId} created user ${created.id} (${username}) at ${new Date().toISOString()}`)

  return created
})
