export default defineStandardResponseHandler(async (event) => {
  let body
  try {
    body = await useSafeValidatedBody(event, z.object({
      content: z.string(), // 内容
      comment_id: z.string(), // 评论的哪条评论
      reply_sub_comment_id: z.string().optional(), // 评论的哪条回复
      path: z.string().optional(),
      user_id: z.string(), // 评论者
    }))
    if (!body.success) {
      throw createError({
        statusCode: 400,
        message: JSON.stringify(body.error),
      })
    }
  }
  catch {
    throw createError({
      statusCode: 400,
      message: '参数解析失败',
    })
  }

  const commentData = {
    ...body.data,
  }

  // 被回复的评论者, 是否允许邮件通知
  const comment = await prisma.blogComment.findUnique({
    where: {
      id: commentData.comment_id,
    },
    include: {
      user_info: {
        select: {
          email: true,
          nickname: true,
          username: true,
          user_config: {
            select: {
              allowEmailNotify: true,
            },
          },
        },
      },
    },
  })

  if (comment?.user_info?.email && comment?.user_info?.user_config?.allowEmailNotify === 1) {
    try {
      sendMailNotice(comment?.user_info?.nickname || comment?.user_info?.username, {
        to: comment?.user_info?.email,
        subject: '有人回复了你在早早集市的评论',
        text: commentData.content,
        path: commentData.path,
      })
    }
    catch {}
  }

  // 如果是回复的二级评论
  if (body.data.reply_sub_comment_id) {
    const subComment = await prisma.blogSubComment.findUnique({
      where: {
        id: body.data.reply_sub_comment_id,
      },
      include: {
        user_info: {
          select: {
            email: true,
            nickname: true,
            username: true,
            user_config: {
              select: {
                allowEmailNotify: true,
              },
            },
          },
        },
      },
    })

    if (subComment?.user_info?.email && subComment?.user_info?.user_config?.allowEmailNotify === 1 && subComment?.user_info?.email !== comment?.user_info?.email) {
      try {
        sendMailNotice(subComment?.user_info?.nickname || subComment?.user_info?.username, {
          to: subComment!.user_info!.email,
          subject: '有人回复了你在早早集市的评论',
          text: commentData.content,
          path: commentData.path,
        })
      }
      catch {}
    }
  }
  const data = await prisma.blogSubComment.create({
    data: commentData,
  })

  return data
})
