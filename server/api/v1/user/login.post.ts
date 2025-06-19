export const schema = z.object({
  username: z.string(),
  password: z.string(),
})

export default defineStandardResponseHandler(async (event) => {
  const body = await useSafeValidatedBody(event, schema)

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }
  const { username, password } = body.data

  if (password === 'NEED_RESET_PASSWORD') {
    throw createError({
      statusCode: 400,
      message: '未设置密码，请使用其他登录方式',
    })
  }

  let user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    // throw createError({
    //   statusCode: 400,
    //   message: '用户不存在'
    // })
    // 创建新用户
    user = await prisma.user.create({
      data: {
        username,
        password,
        role: 'user',
      },
    })
  }
  else {
    if (user.password !== password) {
      throw createError({
        status: 400,
        statusText: '账号或密码错误',
      })
    }
  }

  const tokenInfo = await upsertAccessToken(user.id)

  return {
    token: tokenInfo.token,
    user,
  }
})
