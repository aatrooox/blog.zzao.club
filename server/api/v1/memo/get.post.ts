export default defineEventHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    id: z.string(),
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }

  const queryInclude: any = {
    // 默认查询用户信息
    user_info: {
      select: {
        username: true,
        avatar_url: true,
      },
    },
    comments: {
      // 关联查询 评论
      include: {
        // 关联查询 评论表中 的用户
        user_info: {
          select: {
            username: true,
            avatar_url: true,
          },
        },
        _count: {
          select: {
            sub_comments: true,
          },
        },
      },
    },
    // likes: {
    //   include: {
    //     user_id: true,
    //     id: true
    //   }
    // },
    // 默认查询评论数量
    _count: {
      select: {
        comments: true,
      },
    },
  }

  const data = await prisma.blogMemo.findFirst({
    where: {
      id: body.data.id,
    },
    include: queryInclude,
  })

  return {
    data,
    message: 'ok',
  }
})
