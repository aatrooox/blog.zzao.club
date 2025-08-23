import { eq } from 'drizzle-orm'
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
    // 创建新用户
    await db.insert(users).values({
      username,
      password,
      nickname: username,
      role: 'user',
    })
    const [newUser] = await db.select().from(users).where(eq(users.username, username))
    user = newUser
  }
  else {
    if (user.password !== password) {
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
