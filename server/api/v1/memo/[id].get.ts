export default defineStandardResponseHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'id is required',
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
    // 关联查询 tags
    tags: {
      include: {
        tag: {
          select: {
            id: true,
            tag_name: true,
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
      id,
    },
    include: queryInclude,
  })

  return data
})
