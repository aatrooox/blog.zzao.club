export default defineEventHandler( async (event) => {
  const path = getRouterParam(event, 'path')
  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: 'path is required',
    })
  }

  const body = await useSafeValidatedBody(event, z.object({
    name: z.string(),
    text: z.string(),
    to: z.string().email(),
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error)
    })
  }

  // 目前支持简单的换行
  if (path === 'mail') {
    const { name, text, to } = body.data
    return sendMailNotice( name, { text, to })
  }
})