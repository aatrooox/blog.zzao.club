export default defineEventHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    visitorId: z.string(),
    visitorName: z.string(),
    visitorEmail: z.string(),
    visitorWebsite: z.string().optional()
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error)
    })
  }  
  let role = 'visitor'
  // 前端校验合法性
  const { visitorId, visitorName, visitorEmail, visitorWebsite } = body.data

  const _user = await prisma.user.findUnique({
    where: {
      id: visitorId
    }
  })

  if (_user) { 
    throw createError({
      statusCode: 400,
      message: '已经注册过了'
    })
  }
  // 创建新用户 - 游客 游客不需要登录，依靠前端生成指纹来判断唯一性
  // 但相应的会无法参与某一部分互动
  const user = await prisma.user.create({
    data: {
      id: visitorId,
      username: visitorName,
      password: 'null',
      email: visitorEmail,
      website: visitorWebsite,
      role,
    }
  })

  return {
    data: user,
    message: '注册成功',
  }
})