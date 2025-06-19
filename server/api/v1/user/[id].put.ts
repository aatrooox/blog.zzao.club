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
    const user = await prisma.user.findUnique({
      where: {
        nickname: updateData.nickname,
      },
    })
    // 如果已经存在了 nickname
    if (user?.nickname === updateData.nickname && user?.id !== id) {
      throw createError({
        statusCode: 400,
        message: '昵称已经存在',
      })
    }
  }

  if (updateData.username) {
    const user = await prisma.user.findUnique({
      where: {
        username: updateData.username,
      },
    })
    // 如果已经存在了 nickname
    if (user?.username === updateData.username && user?.id !== id) {
      throw createError({
        statusCode: 400,
        message: '用户名已经存在',
      })
    }
  }

  const updateUser = await prisma.user.update({
    where: {
      id,
    },
    data: updateData,
  })

  return updateUser
})
