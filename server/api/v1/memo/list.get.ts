export default defineStandardResponseHandler(async (event) => {
  const schema = z.object({
    page: z.string().optional().default('1').transform(Number),
    size: z.string().optional().default('50').transform(Number),
    qc: z.string().optional().default('0').transform(Number),
  })
  const query = await useSafeValidatedQuery(event, schema)

  if (!query.success) {
    throw createError({
      statusCode: 400,
      statusMessage: (query as any).message ?? '参数错误',
    })
  }

  const take = query.data.size
  const skip = (query.data.page - 1) * take

  // 关联查询
  const queryInclude: any = {
    // 默认查询用户信息
    user_info: {
      select: {
        username: true,
        avatar_url: true,
      },
    },
    // 默认查询评论数量
    // _count: {
    //   select: {
    //     comments: true
    //   }
    // }
  }
  // 是否查询关联的评论信息
  // query comment ?
  const qc = query.data.qc
  if (qc === 1) {
    queryInclude.comments = {
      // 关联查询 评论
      include: {
        // 关联查询 评论表中 的用户
        user_info: {
          select: {
            username: true,
            avatar_url: true,
          },
        },
        // _count: {
        //   select: {
        //     sub_comments: true
        //   }
        // }
      },
    }
  }

  // 关联查询点赞的用户
  queryInclude.likes = {
    select: {
      user_id: true,
      id: true,
    },
  }

  const memos = await prisma.blogMemo.findMany({
    skip,
    take,
    orderBy: [
      {
        create_ts: 'desc',
      },
    ],
    include: queryInclude,
  })

  console.log(`memos`, memos)
  return memos
})
