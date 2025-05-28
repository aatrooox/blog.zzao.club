import prisma from "~~/server/utils/prisma"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'failed'
    })
  }

  const hasAuth = await verifyUserRole(event.context.userId)
  
  if (!hasAuth) {
    throw createError({
      statusCode: 401,
      message: '无权限访问'
    })
  }

  const data = await prisma.blogExplain.delete({
    where: {
      id
    }
  })

  return {
    data,
    message: 'ok'
  }
})
