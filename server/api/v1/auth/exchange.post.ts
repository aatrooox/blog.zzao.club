import { eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { users } from '~~/lib/drizzle/schema'
import { API_CODES } from '~~/shared/utils/apiCodes'

const schema = z.object({
  code: z.string().min(1),
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

  const { code } = body.data

  const codeData = await useStorage('redis').getItem<{ userId: string }>(`oauth_code:${code}`)
  await useStorage('redis').removeItem(`oauth_code:${code}`)

  if (!codeData?.userId) {
    throw createError({
      statusCode: 400,
      data: {
        code: API_CODES.AUTH_FAILED,
        message: '授权码无效或已过期',
      },
    })
  }

  const [user] = await db.select().from(users).where(eq(users.id, codeData.userId)).limit(1)

  if (!user) {
    throw createError({
      statusCode: 400,
      data: {
        code: API_CODES.RESOURCE_NOT_FOUND,
        message: '用户不存在',
      },
    })
  }

  const tokenPair = await generateTokenPair(user.id)

  return {
    accessToken: tokenPair.accessToken,
    refreshToken: tokenPair.refreshToken,
    accessExpiresAt: tokenPair.accessExpiresAt,
    refreshExpiresAt: tokenPair.refreshExpiresAt,
    user,
  }
})
