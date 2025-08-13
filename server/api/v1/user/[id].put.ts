import { and, eq, ne } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { users } from '~~/lib/drizzle/schema'

export default defineStandardResponseHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await useSafeValidatedBody(event, z.object({
    email: z.string().optional(),
    nickname: z.string().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    website: z.string().optional(),
    avatar_url: z.string().optional(),
  }))
  if (!body.success || !id) {
    throw createError({
      statusCode: 400,
      message: body.error ? JSON.stringify(body.error) : 'id is required',
    })
  }

  if (Object.keys(body.data).length === 0) {
    throw createError({
      statusCode: 400,
      message: '没有需要更新的字段',
    })
  }

  const updateData: any = {}

  Object.keys(body.data).forEach((key) => {
    const value = body.data[key as keyof typeof body.data]
    if (value !== undefined && value !== null) {
      updateData[key] = value
    }
  })

  if (updateData.nickname) {
    const existingUser = await db.select()
      .from(users)
      .where(and(eq(users.nickname, updateData.nickname), ne(users.id, id)))
      .limit(1)

    if (existingUser.length > 0) {
      throw createError({
        statusCode: 400,
        message: '昵称已经存在',
      })
    }
  }

  if (updateData.username) {
    const existingUser = await db.select()
      .from(users)
      .where(and(eq(users.username, updateData.username), ne(users.id, id)))
      .limit(1)

    if (existingUser.length > 0) {
      throw createError({
        statusCode: 400,
        message: '用户名已经存在',
      })
    }
  }

  // 转换字段名
  const drizzleUpdateData: any = {}
  Object.keys(updateData).forEach((key) => {
    if (key === 'avatar_url') {
      drizzleUpdateData.avatarUrl = updateData[key]
    }
    else {
      drizzleUpdateData[key] = updateData[key]
    }
  })

  await db.update(users)
    .set(drizzleUpdateData)
    .where(eq(users.id, id))

  const updateUser = await db.select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1)

  return updateUser[0]
})
