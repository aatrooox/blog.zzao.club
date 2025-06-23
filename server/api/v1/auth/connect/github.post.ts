// 使用 github 授权后，客户端发起关联请求，自动创建一个新用户
// 授权成功后，客户端判断是否已登录，未登录时，调用此接口生成用户，然后走自己的登录逻辑
export default defineStandardResponseHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    id: z.any(),
    avatar_url: z.string().url(),
    email: z.string().email(),
    login: z.string(),
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }

  const { id, avatar_url, email, login } = body.data
  // 查找是否已经有该 github 用户
  let authData = await prisma.oAuth.findUnique({
    where: {
      provider_providerId: {
        provider: 'github',
        providerId: `${id}`,
      },
    },
  })

  if (!authData) {
    // 存储 Oauth 信息
    authData = await prisma.oAuth.create({
      data: {
        provider: 'github',
        providerId: `${id}`,
      },
    })
  }

  let userData
  if (!authData.userId) {
    // 走 github 授权，不会创建新用户，此时主动请求再创建
    userData = await prisma.user.create({
      data: {
        username: login,
        nickname: login,
        password: 'NEED_RESET_PASSWORD',
        email,
        avatar_url,
        role: 'user',
        status: 2, // 临时用户
      },
    }).catch(() => {
      throw createError({
        statusCode: 500,
        message: '创建用户失败',
      })
    })
  }
  else {
    userData = await prisma.user.findUnique({ where: { id: authData.userId } })
  }

  // update user_id field for oauth table
  await updateOAuthUser(authData.id, userData!.id)

  // 如果有，则已经生成 user 了，走一遍登录即可
  const tokenInfo = await upsertAccessToken(userData!.id)

  return {
    user: userData,
    token: tokenInfo.token,
  }
})
