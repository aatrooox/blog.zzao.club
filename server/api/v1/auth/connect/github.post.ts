import { and, desc, eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { oauths, users } from '~~/lib/drizzle/schema'

// 使用 github 授权后，客户端发起关联请求，自动创建一个新用户
// 授权成功后，客户端判断是否已登录，未登录时，调用此接口生成用户，然后走自己的登录逻辑
export default defineStandardResponseHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    id: z.any(),
    avatar_url: z.string().url(),
    email: z.string().email(),
    login: z.string(),
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }

  const { id, avatar_url, email, login } = body.data
  // 查找是否已经有该 github 用户
  let authData = await db.select()
    .from(oauths)
    .where(and(eq(oauths.provider, 'github'), eq(oauths.providerId, `${id}`)))
    .limit(1)

  if (authData.length === 0) {
    // 存储 Oauth 信息
    const now = new Date()
    await db.insert(oauths).values({
      provider: 'github',
      providerId: `${id}`,
      createdAt: now,
      updatedAt: now,
    })

    authData = await db.select()
      .from(oauths)
      .where(eq(oauths.providerId, `${id}`))
      .limit(1)
  }

  let userData
  if (!authData[0].userId) {
    // 走 github 授权，不会创建新用户，此时主动请求再创建
    try {
      await db.insert(users).values({
        username: login,
        nickname: login,
        password: 'NEED_RESET_PASSWORD',
        email,
        avatarUrl: avatar_url,
        role: 'user',
        status: 2, // 临时用户
      })

      userData = await db.select()
        .from(users)
        .where(eq(users.username, login))
        .limit(1)

      userData = userData[0]
    }
    catch {
      throw createError({
        statusCode: 500,
        message: '创建用户失败',
      })
    }
  }
  else {
    const userResult = await db.select()
      .from(users)
      .where(eq(users.id, authData[0].userId!))
      .limit(1)
    userData = userResult[0]
  }

  // update user_id field for oauth table
  await updateOAuthUser(authData[0].id, userData!.id)

  // 如果有，则已经生成 user 了，走一遍登录即可
  const tokenInfo = await upsertAccessToken(userData!.id)

  return {
    user: userData,
    token: tokenInfo.token,
  }
})
