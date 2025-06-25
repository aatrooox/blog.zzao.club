export default defineStandardResponseHandler(async (event) => {
  const schema = z.object({
    memo_ids: z.array(z.string()).optional().default([]),
  })
  const query = await useSafeValidatedQuery(event, schema)

  if (!query.success) {
    throw createError({
      statusCode: 400,
      statusMessage: (query as any).message ?? '参数错误',
    })
  }

  let where = {}
  if (query.data.memo_ids.length) {
    where = {
      blogMemoId: {
        in: query.data.memo_ids,
      },
    }
  }
  const likes = await prisma.blogLike.findMany({
    where,
  })

  const result: Record<string, number> = {}

  likes.forEach((item) => {
    if (item.blogMemoId) {
      result[item.blogMemoId] = (result[item.blogMemoId] || 0) + 1
    }
  })

  return result
}) // 缓存 12 小时
