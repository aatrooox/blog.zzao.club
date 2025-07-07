export default defineStandardResponseHandler(async (event) => {
  const schema = z.object({
    user_id: z.string().optional(),
  })
  const query = await useSafeValidatedQuery(event, schema)

  if (!query.success) {
    throw createError({
      statusCode: 400,
      statusMessage: (query as any).message ?? '参数错误',
    })
  }

  const userId = query.data.user_id || event.context.userId

  const tags = await prisma.memoTag.findMany({
    where: {
      user_id: userId,
    },
    include: {
      _count: {
        select: {
          memos: true,
        },
      },
    },
    orderBy: {
      create_ts: 'desc',
    },
  })

  return tags
})
