export default defineStandardResponseHandler(async (event) => {
  const schema = z.object({
    article_id: z.string(),
    user_id: z.string().optional(),
  })
  const query = await useSafeValidatedQuery(event, schema)

  if (!query.success) {
    throw createError({
      statusCode: 400,
      statusMessage: (query as any).message ?? '参数错误',
    })
  }

  const count = await prisma.blogLike.count({
    where: {
      article_id: query.data.article_id,
    },
  })
  // 查询该用户是否已经点赞
  if (query.data.user_id) {
    const isLiked = await prisma.blogLike.findFirst({
      where: {
        article_id: query.data.article_id,
        user_id: query.data.user_id,
      },
    })

    return {
      count,
      isLiked: !!isLiked,
    }
  }
  return { count }
})
