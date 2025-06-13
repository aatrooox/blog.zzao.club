import prisma from '~~/server/utils/prisma'

export default defineCachedEventHandler(async (event) => {
  const schema = z.object({
    article_ids: z.array(z.string()).optional().default([]),
  })
  const query = await useSafeValidatedQuery(event, schema)

  if (!query.success) {
    throw createError({
      statusCode: 400,
      statusMessage: (query as any).message ?? '参数错误',
    })
  }

  let where = {}
  if (query.data.article_ids.length) {
    where = {
      article_id: {
        in: query.data.article_ids,
      },
    }
  }
  const likes = await prisma.blogLike.findMany({
    where,
  })

  const result: Record<string, number> = {}

  likes.forEach((item) => {
    if (item.article_id) {
      result[item.article_id] = (result[item.article_id] || 0) + 1
    }
  })

  return {
    data: result,
    msg: 'ok',
  }
}, { maxAge: 60 * 60 * 12 }) // 缓存 12 小时
