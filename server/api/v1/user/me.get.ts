import { eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { users } from '~~/lib/drizzle/schema'

export default defineStandardResponseHandler(async (event) => {
  const userId = event.context.userId

  if (!userId) {
    throw createError({
      statusCode: 401,
      data: {
        code: API_CODES.NO_TOKEN,
        message: '未登录',
      },
    })
  }

  const [userData] = await db.select({
    id: users.id,
    username: users.username,
    nickname: users.nickname,
    email: users.email,
    role: users.role,
    avatarUrl: users.avatarUrl,
    status: users.status,
  }).from(users).where(eq(users.id, userId)).limit(1)

  if (!userData) {
    throw createError({
      statusCode: 404,
      data: {
        code: API_CODES.RESOURCE_NOT_FOUND,
        message: '用户不存在',
      },
    })
  }

  return userData
})
