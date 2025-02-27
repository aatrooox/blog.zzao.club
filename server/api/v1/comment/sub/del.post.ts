import prisma from "@@/lib/prisma"

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
  

  const data = await prisma.blogSubComment.delete({
    where: {
      id: body.data.id
    }
  })

  return {
    data,
    message: 'ok'
  }
})
