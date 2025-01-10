import prisma from "@@/server/prisma"
export default defineEventHandler(async (event) => {
  const schema = z.object({
    type: z.string(),
    page: z.string().optional().default('1').transform(Number),
    size: z.string().optional().default('10').transform(Number)
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

  const comments = await prisma.comments.findMany({
    where: {
      type: query.data.type,
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
          avatar_url: true
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