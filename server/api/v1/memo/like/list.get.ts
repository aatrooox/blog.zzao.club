export default defineCachedEventHandler(async (event) => {
  const schema = z.object({
    memo_ids: z.string().optional(),
  })
  const query = await useSafeValidatedQuery(event, schema)

  if (!query.success) {
    throw createError({
      statusCode: 400,
      statusMessage: (query as any).message ?? '参数错误',
    })
  }

  let where = {}
  if (query.data.memo_ids) {
    // 将逗号分割的字符串转换为数组
    const memoIds = query.data.memo_ids.split(',').map((id: string) => id.trim()).filter((id: string) => id)
    if (memoIds.length > 0) {
      where = {
        blogMemoId: {
          in: memoIds,
        },
      }
    }
  }
  // 如果不传 memo_ids 参数，where 为空对象，会查询所有点赞记录
  const likes = await prisma.blogLike.findMany({
    where,
  })

  const result: Record<string, number> = {}

  likes.forEach((item) => {
    if (item.blogMemoId) {
      result[item.blogMemoId] = (result[item.blogMemoId] || 0) + 1
    }
  })

  return {
    data: result,
    msg: 'ok',
  }
}, { maxAge: 60 * 60 * 12 }) // 缓存 12 小时
