import { and, count, desc, eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { blogComments, blogSubComments, users } from '~~/lib/drizzle/schema'

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
  const whereConditions = [eq(blogComments.type, query.data.type)]

  if (query.data.article_id) {
    whereConditions.push(eq(blogComments.articleId, query.data.article_id))
  }

  if (query.data.memo_id) {
    whereConditions.push(eq(blogComments.memoId, query.data.memo_id))
  }

  // 查询评论列表
  const comments = await db.select({
    id: blogComments.id,
    content: blogComments.content,
    type: blogComments.type,
    articleId: blogComments.articleId,
    memoId: blogComments.memoId,
    userId: blogComments.userId,
    createTs: blogComments.createTs,
    updatedTs: blogComments.updatedTs,
    user_info: {
      username: users.username,
      nickname: users.nickname,
      website: users.website,
      avatar_url: users.avatarUrl,
    },
  })
    .from(blogComments)
    .leftJoin(users, eq(blogComments.userId, users.id))
    .where(and(...whereConditions))
    .orderBy(desc(blogComments.createTs))
    .limit(take)
    .offset(skip)

  // 为每个评论查询子评论
  const commentsWithSubComments = await Promise.all(
    comments.map(async (comment) => {
      const subComments = await db.select({
        id: blogSubComments.id,
        content: blogSubComments.content,
        commentId: blogSubComments.commentId,
        userId: blogSubComments.userId,
        createTs: blogSubComments.createTs,
        updatedTs: blogSubComments.updatedTs,
        replySubCommentId: blogSubComments.replySubCommentId,
        user_info: {
          username: users.username,
          nickname: users.nickname,
          website: users.website,
          avatar_url: users.avatarUrl,
        },
      })
        .from(blogSubComments)
        .leftJoin(users, eq(blogSubComments.userId, users.id))
        .where(eq(blogSubComments.commentId, comment.id))

      // 计算子评论数量
      const subCommentsCount = await db.select({ count: count() })
        .from(blogSubComments)
        .where(eq(blogSubComments.commentId, comment.id))

      return {
        ...comment,
        sub_comments: subComments,
        _count: {
          sub_comments: subCommentsCount[0].count,
        },
      }
    }),
  )

  return commentsWithSubComments
})
