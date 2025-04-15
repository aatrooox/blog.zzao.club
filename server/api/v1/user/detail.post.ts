// 获取根据id/uid获取用户详情
export default defineEventHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    id: z.string()
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error)
    })
  }

  const user =  await prisma.user.findUnique({
    where: {
      id: body.data.id
    }
  })

  return {
    data: user,
    msg: 'ok'
  }
})
