import { eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { users } from '~~/lib/drizzle/schema'

export const schema = z.object({
  username: z.string(),
  password: z.string(),
})

export default defineStandardResponseHandler(async (event) => {
  const body = await useSafeValidatedBody(event, schema)

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }
  const { username, password } = body.data

  if (password === 'NEED_RESET_PASSWORD') {
    throw createError({
      statusCode: 400,
      message: '未设置密码，请使用其他登录方式',
    })
  }

  let [user] = await db.select().from(users).where(eq(users.username, username))

  if (!user) {
    // throw createError({
    //   statusCode: 400,
    //   message: '用户不存在'
    // })
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
        status: 400,
        statusText: '账号或密码错误',
      })
    }
  }

  console.log('准备生成token，用户ID:', user.id)

  try {
    const tokenInfo = await upsertAccessToken(user.id)
    console.log('token生成成功:', tokenInfo)

    return {
      token: tokenInfo.token,
      user,
    }
  }
  catch (error) {
    console.error('token生成失败:', error)
    throw createError({
      statusCode: 500,
      message: 'token生成失败',
    })
  }
})
