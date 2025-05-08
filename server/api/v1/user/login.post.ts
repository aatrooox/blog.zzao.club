export const schema = z.object({
  username: z.string(),
  password: z.string()
})

export default defineEventHandler(async (event) => {
  const body = await useSafeValidatedBody(event, schema)

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
 
  const tokenInfo = await upsertAccessToken(user.id)

  return {
    data: {
      token: tokenInfo.token,
      user
    },
    msg: '登录成功'
  }
})