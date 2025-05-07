import prisma from "~~/server/utils/prisma"
export default defineEventHandler(async (event) => {
  const schema = z.object({
    type: z.string().optional().default('article'),
    page: z.string().optional().default('1').transform(Number),
    size: z.string().optional().default('10').transform(Number),
    article_id: z.string(),
  })
  const query = await useSafeValidatedQuery(event, schema)
  
  if (!query.success) {
    throw createError({
      statusCode: 400,
      statusMessage: (query as any).message ?? '参数错误'
    })
  }

  const take = query.data.size
  const skip = (query.data.page - 1) * take
  const comments = await prisma.blogComment.findMany({
    where: {
      type: query.data.type,
      article_id: query.data.article_id
    },
    skip,
    take,
    orderBy: [
      {
        create_ts: 'desc'
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
      sub_comments: {
        include: {
          user_info: {
            select: {
              username: true,
              nickname: true,
              website: true,
              avatar_url: true
            }
          }

        }
      },
      // 关系计数
      _count: {
        select: {
          sub_comments: true
        }
      }
    }
  })

  return {
    data: comments,
    msg: 'ok'
  }
})