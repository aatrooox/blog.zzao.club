import prisma from "~~/server/utils/prisma"

// 获取评论下的二级评论
export default defineEventHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    comment_id: z.string(),
  }))
  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error)
    })
  }
 
  // 查询所有二级评论
  const data = await prisma.blogSubComment.findMany({
    where: {
      comment_id: body.data.comment_id
    },
    // 最先评论的在最上边
    orderBy: [
      {
        create_ts: 'asc'
      }
    ],
    include: {
      user_info: {
        select: {
          username: true,
          nickname: true,
          website: true,
          avatar_url: true
        }
      },
    }
  })

  return {
    data,
    message: 'ok'
  }
})
