export default defineStandardResponseHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    visitorId: z.number().or(z.string()).transform((v: string | number) => v.toString()),
    visitorName: z.string().optional(),
    visitorEmail: z.string().optional(),
    visitorWebsite: z.string().optional(),
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }
  const role = 'visitor'
  // 前端校验合法性
  const { visitorId, visitorName, visitorEmail, visitorWebsite } = body.data

  const _user = await prisma.user.findUnique({
    where: {
      id: visitorId,
    },
  })

  // 点赞时触发，则创建一个游客用户
  // 评论时注册，则使用自定义用户名
  const username = `visitor${useNanoId(6)}`
  const nickname = visitorName || username

  if (_user) {
    const tokenInfo = await upsertAccessToken(_user.id)
    return {
      token: tokenInfo.token,
      user: _user,
    }
  }

  // 创建新用户 - 游客 游客不需要登录，依靠前端生成指纹来判断唯一性
  // 但相应的会无法参与某一部分互动
  const user = await prisma.user.create({
    data: {
      id: visitorId,
      username,
      nickname,
      password: 'NEED_RESET_PASSWORD',
      email: visitorEmail,
      website: visitorWebsite,
      role,
    },
  })

  const tokenInfo = await upsertAccessToken(user.id)
  return {
    token: tokenInfo.token,
    user,
  }
})
