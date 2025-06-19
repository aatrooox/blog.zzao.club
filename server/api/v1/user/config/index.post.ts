// 更新和创建用户配置
export default defineStandardResponseHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    userId: z.string(),
    allowEmailNotify: z.number().optional().default(0),
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }
  // 前端校验合法性
  const { userId, allowEmailNotify } = body.data

  const config = await prisma.userConfig.upsert({
    where: {
      userId,
    },
    update: {
      allowEmailNotify,
    },
    create: {
      userId,
      allowEmailNotify,
    },
  })

  return config
})
