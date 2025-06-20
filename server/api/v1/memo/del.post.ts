import { useSafeValidatedBody } from 'h3-zod'

export default defineStandardResponseHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    id: z.string(),
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }

  const data = await prisma.blogMemo.delete({
    where: {
      id: body.data.id,
    },
  }).catch((err) => {
    throw createError({
      statusCode: 500,
      message: '删除失败',
    })
  })

  return data
})
