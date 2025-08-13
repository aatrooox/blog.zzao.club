import { eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { users } from '~~/lib/drizzle/schema'

export default defineStandardResponseHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    visitorId: z.number().or(z.string()).transform((v: string | number) => v.toString()),
    visitorName: z.string().optional(),
    visitorEmail: z.string().optional(),
    visitorWebsite: z.string().optional(),
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }
  const role = 'visitor'
  // 前端校验合法性
  const { visitorId, visitorName, visitorEmail, visitorWebsite } = body.data

  const existingUser = await db.select()
    .from(users)
    .where(eq(users.id, visitorId))
    .limit(1)

  // 点赞时触发，则创建一个游客用户
  // 评论时注册，则使用自定义用户名
  const username = `visitor${useNanoId(6)}`
  const nickname = visitorName || username

  if (existingUser.length > 0) {
    const tokenInfo = await upsertAccessToken(existingUser[0].id)
    return {
      token: tokenInfo.token,
      user: existingUser[0],
    }
  }

  // 创建新用户 - 游客 游客不需要登录，依靠前端生成指纹来判断唯一性
  // 但相应的会无法参与某一部分互动
  await db.insert(users).values({
    id: visitorId,
    username,
    nickname,
    password: 'NEED_RESET_PASSWORD',
    email: visitorEmail,
    website: visitorWebsite,
    role,
  })

  const user = await db.select()
    .from(users)
    .where(eq(users.id, visitorId))
    .limit(1)

  const tokenInfo = await upsertAccessToken(user[0].id)
  return {
    token: tokenInfo.token,
    user: user[0],
  }
})
