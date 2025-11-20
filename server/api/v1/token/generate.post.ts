import { z } from 'zod'
import { API_CODES } from '~~/shared/utils/apiCodes'

export const schema = z.object({
  note: z.string().min(1, '备注不能为空').max(50, '备注不能超过50个字符'),
  expiresInDays: z.number().min(0).max(3650).default(365),
})

export default defineStandardResponseHandler(async (event) => {
  const userId = event.context.userId
  if (!userId) {
    throw createError({
      statusCode: 401,
      data: {
        code: API_CODES.NO_TOKEN,
        message: '请先登录',
      },
    })
  }

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

  const { note, expiresInDays } = body.data
  const token = await generatePAT(userId, note, expiresInDays)

  return {
    token,
    note,
    expiresInDays,
    message: 'Token 生成成功，请立即复制保存，它将不会再次显示。',
  }
})
