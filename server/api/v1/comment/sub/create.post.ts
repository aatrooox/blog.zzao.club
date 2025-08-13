import { desc, eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { blogComments, blogSubComments, userConfigs, users } from '~~/lib/drizzle/schema'

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
  const commentResult = await db.select({
    id: blogComments.id,
    userEmail: users.email,
    userNickname: users.nickname,
    userName: users.username,
    allowEmailNotify: userConfigs.allowEmailNotify,
  })
    .from(blogComments)
    .leftJoin(users, eq(blogComments.userId, users.id))
    .leftJoin(userConfigs, eq(users.id, userConfigs.userId))
    .where(eq(blogComments.id, commentData.comment_id))
    .limit(1)

  const comment = commentResult[0]

  if (comment?.userEmail && comment?.allowEmailNotify === 1) {
    try {
      sendMailNotice(comment?.userNickname || comment?.userName || '', {
        to: comment.userEmail,
        subject: '有人回复了你在早早集市的评论',
        text: commentData.content,
        path: commentData.path,
      })
    }
    catch {}
  }

  // 如果是回复的二级评论
  if (body.data.reply_sub_comment_id) {
    const subCommentResult = await db.select({
      id: blogSubComments.id,
      userEmail: users.email,
      userNickname: users.nickname,
      userName: users.username,
      allowEmailNotify: userConfigs.allowEmailNotify,
    })
      .from(blogSubComments)
      .leftJoin(users, eq(blogSubComments.userId, users.id))
      .leftJoin(userConfigs, eq(users.id, userConfigs.userId))
      .where(eq(blogSubComments.id, body.data.reply_sub_comment_id))
      .limit(1)

    const subComment = subCommentResult[0]

    if (subComment?.userEmail && subComment?.allowEmailNotify === 1 && subComment?.userEmail !== comment?.userEmail) {
      try {
        sendMailNotice(subComment?.userNickname || subComment?.userName || '', {
          to: subComment.userEmail,
          subject: '有人回复了你在早早集市的评论',
          text: commentData.content,
          path: commentData.path,
        })
      }
      catch {}
    }
  }

  // 转换字段名以匹配数据库schema
  const now = new Date()
  const insertData = {
    content: commentData.content,
    commentId: commentData.comment_id,
    userId: commentData.user_id,
    replySubCommentId: commentData.reply_sub_comment_id,
    createTs: now,
    updatedTs: now,
  }

  await db.insert(blogSubComments).values(insertData)

  // 查询刚创建的数据
  const [data] = await db.select().from(blogSubComments).where(eq(blogSubComments.userId, insertData.userId)).orderBy(desc(blogSubComments.createTs)).limit(1)

  return data
})
