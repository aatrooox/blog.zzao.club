export default defineEventHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    memo_id: z.string(),
    user_id: z.string(), // 点赞者
  }))
  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }

  const data = await prisma.blogLike.create({
    data: {
      target: 'memo',
      blogMemoId: body.data.memo_id,
      user_id: body.data.user_id,
    },
  })

  return data
})
