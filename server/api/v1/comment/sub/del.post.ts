import prisma from "@@/server/prisma"

export default defineEventHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    id: z.number()
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error)
    })
  }
  

  const data = await prisma.subComments.delete({
    where: {
      id: body.data.id
    }
  })

  return {
    data,
    message: 'ok'
  }
})
