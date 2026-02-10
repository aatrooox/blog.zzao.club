import { eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { users } from '~~/lib/drizzle/schema'

const schema = z.object({
  userId: z.string().min(1),
  role: z.enum(['superAdmin', 'user']).optional(),
  status: z.number().int().min(0).max(1).optional(),
})

export default defineStandardResponseHandler(async (event) => {
  await assertSuperAdmin(event.context.userId)

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

  const { userId, role, status } = body.data

  if (userId === event.context.userId && role && role !== 'superAdmin') {
    throw createError({
      statusCode: 400,
      data: {
        code: API_CODES.VALIDATION_ERROR,
        message: '不能修改自己的角色',
        data: null,
      },
    })
  }

  const [targetUser] = await db.select({ id: users.id })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!targetUser) {
    throw createError({
      statusCode: 404,
      data: {
        code: API_CODES.RESOURCE_NOT_FOUND,
        message: '用户不存在',
        data: null,
      },
    })
  }

  const updateData: Record<string, any> = {}
  if (role !== undefined)
    updateData.role = role
  if (status !== undefined)
    updateData.status = status

  if (Object.keys(updateData).length === 0) {
    throw createError({
      statusCode: 400,
      data: {
        code: API_CODES.VALIDATION_ERROR,
        message: '没有需要更新的字段',
        data: null,
      },
    })
  }

  await db.update(users)
    .set(updateData)
    .where(eq(users.id, userId))

  const [updated] = await db.select({
    id: users.id,
    username: users.username,
    nickname: users.nickname,
    email: users.email,
    avatarUrl: users.avatarUrl,
    role: users.role,
    status: users.status,
  })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  return updated
})
