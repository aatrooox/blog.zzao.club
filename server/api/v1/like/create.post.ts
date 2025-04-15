import prisma from "~~/server/utils/prisma"

export default defineEventHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    article_id: z.string(),
    user_id: z.string() // 评论者
  }))
  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error)
    })
  }

  const data = await prisma.blogLike.create({
    data: body.data
  })

  return {
    data,
    message: 'ok'
  }
})
