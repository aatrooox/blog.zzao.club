export default defineStandardResponseHandler(async (event) => {
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

  // 检查是否已经点赞过
  const existingLike = await prisma.blogLike.findFirst({
    where: {
      target: 'memo',
      blogMemoId: body.data.memo_id,
      user_id: body.data.user_id,
    },
  })

  // 如果已经点赞过，直接返回成功
  if (existingLike) {
    return { success: true, message: '已经点赞过了' }
  }

  // 创建新的点赞记录
  const data = await prisma.blogLike.create({
    data: {
      target: 'memo',
      blogMemoId: body.data.memo_id,
      user_id: body.data.user_id,
    },
  })

  return { success: true, data }
})
