import prisma from '~~/server/utils/prisma'

export default defineCachedEventHandler(async (event) => {
  const schema = z.object({
    type: z.string().optional().default('article'),
    article_ids: z.array(z.string()).optional().default([]),
  })
  const query = await useSafeValidatedQuery(event, schema)

  if (!query.success) {
    throw createError({
      statusCode: 400,
      statusMessage: (query as any).message ?? '参数错误',
    })
  }

  let where: any = {
    type: query.data.type,
  }

  if (query.data.article_ids.length) {
    where = {
      ...where,
      article_id: {
        in: query.data.article_ids,
      },
    }
  }

  const comments = await prisma.blogComment.findMany({
    where,
    include: {
      // 关系计数
      _count: {
        select: {
          sub_comments: true,
        },
      },
    },
  })

  const result: Record<string, number> = {}

  comments.forEach((item) => {
    if (item.article_id) {
      result[item.article_id] = (result[item.article_id] || 0) + 1 + item._count.sub_comments
    }
  })

  return {
    data: result,
    msg: 'ok',
  }
}, { maxAge: 60 * 60 * 12 }) // 缓存 12 小时
