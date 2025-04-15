export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await useSafeValidatedBody(event, z.object({
    email: z.string().optional(),
    nickname: z.string().optional(),
    avatar_url: z.string().optional(),
  }))
  if (!body.success || !id) {
    throw createError({
      statusCode: 400,
      message: body.error ? JSON.stringify(body.error) : 'id is required'
    })
  }
  
  if(Object.keys(body.data).length === 1) { 
    throw createError({
      statusCode: 400,
      message: '没有需要更新的字段'
    })
  }
 
  const updateUser = await prisma.user.update({
    where: {
      id
    },
    data: {
      email: body.data.email,
      nickname: body.data.nickname,
      avatar_url: body.data.avatar_url,
    }
  })


  return {
    data: updateUser,
    message: 'ok'
  }
})
