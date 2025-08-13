import { asc, eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { blogSubComments, users } from '~~/lib/drizzle/schema'

// 获取评论下的二级评论
export default defineStandardResponseHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    comment_id: z.string(),
  }))
  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }

  // 查询所有二级评论
  const data = await db.select({
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
    .where(eq(blogSubComments.commentId, body.data.comment_id))
    .orderBy(asc(blogSubComments.createTs))

  return data
})
