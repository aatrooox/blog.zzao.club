import prisma from "~~/server/utils/prisma"

export default defineEventHandler(async (event) => {
  // 文章id
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: '无 article_id'
    })
  }
  

  const data = await prisma.blogExplain.findMany({
    where: {
      article_id: id
    }
  })

  return {
    data,
    message: 'ok'
  }
})
