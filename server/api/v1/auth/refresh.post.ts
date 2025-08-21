import { API_CODES } from '~~/shared/utils/apiCodes'

export const schema = z.object({
  refreshToken: z.string(),
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

  const { refreshToken } = body.data

  try {
    const newTokenData = await refreshAccessToken(refreshToken)

    if (!newTokenData) {
      throw createError({
        statusCode: 401,
        data: {
          code: API_CODES.REFRESH_TOKEN_EXPIRED,
          message: 'Refresh token 无效或已过期',
        },
      })
    }

    // 直接返回数据，由 handler 包装
    return {
      accessToken: newTokenData.accessToken,
      expiresAt: newTokenData.expiresAt,
    }
  }
  catch (error: any) {
    // 如果是我们自己抛出的错误，直接重新抛出
    if (error.statusCode) {
      throw error
    }

    console.error('Token refresh 失败:', error)
    throw createError({
      statusCode: 500,
      data: {
        code: API_CODES.INTERNAL_ERROR,
        message: 'Token refresh 失败',
      },
    })
  }
})
