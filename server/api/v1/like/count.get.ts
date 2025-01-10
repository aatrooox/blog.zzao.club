import prisma from "@@/server/prisma"
// 查询一个或多个类型的点赞数
export default defineEventHandler(async (event) => {
  const schema = z.object({
    memo_ids: z.string().optional().default(''),
    article_ids: z.string().optional().default(''),
    comment_ids: z.string().optional().default(''),
    subcomment_ids: z.string().optional().default(''),
  })

  const query = await useSafeValidatedQuery(event, schema)
  
  if (!query.success) {
    throw createError({
      statusCode: 400,
      statusMessage: (query as any).message ?? '参数错误'
    })
  }

  const count = await prisma.likes.count({
    where: {
      OR: [
        {
          memo_id: {
            in: query.data.memo_ids.split(',').map(Number)
          }
        },
        {
          article_id: {
            in: query.data.article_ids.split(',').map(Number)
          }
        },
        {
          comment_id: {
            in: query.data.comment_ids.split(',').map(Number)
          }
        },
        {
          sub_comment_id: {
            in: query.data.subcomment_ids.split(',').map(Number)
          }
        }
      ]
    }
  });
  return {
    data: count,
    msg: 'ok'
  }
})