export default defineStandardResponseHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    content: z.string(), // 解释内容
    text: z.string(), // 注解对象
    article_id: z.string(),
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }
  const hasAuth = await verifyUserRole(event.context.userId)
  if (!hasAuth) {
    throw createError({
      statusCode: 401,
      message: '无此操作权限',
    })
  }

  const { content, article_id, text } = body.data

  // 为文章添加注解
  const data = await prisma.blogExplain.create({
    data: { content, text, article_id },
  })

  return data
})
