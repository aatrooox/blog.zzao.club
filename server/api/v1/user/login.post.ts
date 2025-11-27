import bcrypt from 'bcrypt'
import { count, eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { users } from '~~/lib/drizzle/schema'
import { API_CODES } from '~~/shared/utils/apiCodes'

export const schema = z.object({
  username: z.string(),
  password: z.string(),
})

export default defineStandardResponseHandler(async (event) => {
  const body = await useSafeValidatedBody(event, schema)

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

  const { username, password } = body.data

  if (password === 'NEED_RESET_PASSWORD') {
    throw createError({
      statusCode: 400,
      data: {
        code: API_CODES.VALIDATION_ERROR,
        message: '未设置密码，请使用其他登录方式',
      },
    })
  }

  let [user] = await db.select().from(users).where(eq(users.username, username))

  if (!user) {
    // 创建新用户 (自动注册)
    // 获取用户数
    const [{ count: userCount }] = await db.select({ count: count() }).from(users)
    // 第一个注册的用户为管理员
    let role = 'user'
    if (userCount === 0) {
      role = 'superAdmin'
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    await db.insert(users).values({
      username,
      password: hashedPassword,
      nickname: username,
      role,
    })
    const [newUser] = await db.select().from(users).where(eq(users.username, username))
    user = newUser
  }
  else {
    // 验证密码 (支持平滑迁移)
    let isValid = false
    // 简单的判断是否为 bcrypt 哈希 (以 $2a$ 或 $2b$ 开头)
    const isBcryptHash = user.password.startsWith('$2a$') || user.password.startsWith('$2b$')

    if (isBcryptHash) {
      isValid = await bcrypt.compare(password, user.password)
    }
    else {
      // 旧明文密码验证
      isValid = user.password === password
      if (isValid) {
        // 迁移到 bcrypt
        const hashedPassword = await bcrypt.hash(password, 10)
        await db.update(users)
          .set({ password: hashedPassword })
          .where(eq(users.id, user.id))
        console.log(`用户 ${username} 密码已自动升级为 Hash 存储`)
      }
    }

    if (!isValid) {
      throw createError({
        statusCode: 401,
        data: {
          code: API_CODES.AUTH_FAILED,
          message: '账号或密码错误',
        },
      })
    }
  }

  console.log('准备生成双token，用户ID:', user.id)

  try {
    const tokenPair = await generateTokenPair(user.id)
    console.log('双token生成成功:', tokenPair)

    // 直接返回数据，由 handler 包装
    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      accessExpiresAt: tokenPair.accessExpiresAt,
      refreshExpiresAt: tokenPair.refreshExpiresAt,
      user,
    }
  }
  catch (error) {
    console.error('双token生成失败:', error)
    throw createError({
      statusCode: 500,
      data: {
        code: API_CODES.INTERNAL_ERROR,
        message: '登录失败，请重试',
      },
    })
  }
})
