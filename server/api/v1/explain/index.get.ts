import prisma from "~~/server/utils/prisma"

export default defineEventHandler(async (event) => {
  // 文章id
  // const id = getRouterParam(event, 'id')
  const schema = z.object({
    id: z.string()
  })
  const query = await useSafeValidatedQuery(event, schema)

  if (!query.success) {
    throw createError({
      statusCode: 400,
      statusMessage: (query as any).message ?? '参数错误'
    })
  }
  

  const data = await prisma.blogExplain.findMany({
    where: {
      article_id: decodeURIComponent(query.data.id)
    }
  })

  return {
    data,
    message: 'ok'
  }
})
