const schema = z.object({
  type: z.string().optional().default('article'),
  page: z.string().optional().default('1').transform(Number),
  size: z.string().optional().default('10').transform(Number),
  article_id: z.string().optional(),
  memo_id: z.string().optional(),
}).refine((data: { article_id?: string, memo_id?: string }) => data.article_id || data.memo_id, {
  message: 'Either article_id or memo_id must be provided',
})

// only allows static definition
// wait for nitro support
// https://github.com/nitrojs/nitro/issues/2974
defineRouteMeta({
  openAPI: {
    tags: ['comment'],
    description: '获取评论列表',
    parameters: [
      { in: 'query', name: 'type', schema: { type: 'string', enum: ['article', 'memo'] } },
      { in: 'query', name: 'page', schema: { type: 'string' } },
      { in: 'query', name: 'size', schema: { type: 'string' } },
      { in: 'query', name: 'article_id', schema: { type: 'string' } },
      { in: 'query', name: 'memo_id', schema: { type: 'string' } },
    ],
  },
})

// console.log(`schema`, schema)
export default defineStandardResponseHandler(async (event) => {
  const query = await useSafeValidatedQuery(event, schema)

  if (!query.success) {
    throw createError({
      statusCode: 400,
      statusMessage: (query as any).message ?? '参数错误',
    })
  }

  const take = query.data.size
  const skip = (query.data.page - 1) * take

  // 构建动态查询条件
  const whereCondition: any = {
    type: query.data.type,
  }

  if (query.data.article_id) {
    whereCondition.article_id = query.data.article_id
  }

  if (query.data.memo_id) {
    whereCondition.memo_id = query.data.memo_id
  }

  const comments = await prisma.blogComment.findMany({
    where: whereCondition,
    skip,
    take,
    orderBy: [
      {
        create_ts: 'desc',
      },
    ],
    include: {
      user_info: {
        select: {
          username: true,
          nickname: true,
          website: true,
          avatar_url: true,
        },
      },
      sub_comments: {
        include: {
          user_info: {
            select: {
              username: true,
              nickname: true,
              website: true,
              avatar_url: true,
            },
          },

        },
      },
      // 关系计数
      _count: {
        select: {
          sub_comments: true,
        },
      },
    },
  })

  return comments
})
