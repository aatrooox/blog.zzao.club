// 登录接口, 获取jwt token
export default defineEventHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    username: z.string(),
    password: z.string()
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error)
    })
  }
  const { username, password } = body.data
  const user = await prisma.user.findUnique({
    where: {
      username
    }
  })

  if (!user) {
    throw createError({
      statusCode: 400,
      message: '用户不存在'
    })
  }

  if (user.password !== password) {
    throw createError({
      status: 400,
      statusText: '账号或密码错误'
    })
  }

  // 生成 token ，保存到 redis
  const [token, expiresAt] = await generateAccessToken(user.id)
  const data = {
    token,
    expiresAt,
    userId: user.id,
    isRevoked: false,
  }
  const tokenInfo = await prisma.accessToken.upsert({
    where: {
      token
    },
    create: {
      ...data
    },
    update: {}
  })
  

  return {
    data: {
      token,
      user
    },
    msg: '登录成功'
  }
})