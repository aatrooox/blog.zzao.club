import prisma from "@@/server/prisma"

// 获取根据id/uid获取用户详情
export default defineEventHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    id: z.number().optional(),
    uid: z.string().length(12).optional()
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error)
    })
  }

  if (!body.data.id && !body.data.uid) {
    throw createError({
      statusCode: 400,
      message: 'id or uid is required'
    })
  }

  if (body.data.id) {
    const user =  await prisma.user.findUnique({
      where: {
        id: body.data.id
      }
    })

    return {
      data: user,
      msg: 'ok'
    }
  } 

  if (body.data.uid) { 
    const user =  await prisma.user.findUnique({
      where: {
        uid: body.data.uid
      }
    })

    return {
      data: user,
      msg: 'ok'
    }
  }

})
