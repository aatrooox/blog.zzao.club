import bcrypt from 'bcrypt'
import { count, eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { users } from '~~/lib/drizzle/schema'

export default defineStandardResponseHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    username: z.string(),
    password: z.string(),
    email: z.string().optional(),
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }
  let role = 'user'
  // 前端校验合法性
  const { email, password, username } = body.data

  // 获取用户数
  const [{ count: userCount }] = await db.select({ count: count() }).from(users)
  // 第一个注册的用户为管理员
  if (userCount === 0) {
    role = 'superAdmin'
  }

  const [_user] = await db.select().from(users).where(eq(users.username, username))

  if (_user) {
    throw createError({
      statusCode: 400,
      message: '用户名已存在',
    })
  }

  // 密码加密
  const hashedPassword = await bcrypt.hash(password, 10)

  // 创建新用户
  await db.insert(users).values({
    username,
    password: hashedPassword,
    email,
    role,
  })

  // 获取新创建的用户
  const [user] = await db.select().from(users).where(eq(users.username, username))

  return user
})
