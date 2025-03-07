import prisma from "@@/lib/prisma"

// content              String
//   create_ts            DateTime @default(now())
//   updated_ts           DateTime @updatedAt
//   comment_id           Int
//   // 如果一级评论删除了，则删除所有二级评论
//   comment_info         Comments @relation(fields: [comment_id], references: [id], onDelete: Cascade)
//   reply_sub_comment_id Int?
//   user_id              Int
//   user_info            User     @relation(fields: [user_id], references: [id], onDelete: NoAction)
//   memo_id              Int?
//   likes                Likes[]

export default defineEventHandler(async (event) => {

  let  body
  try {
    body = await useSafeValidatedBody(event, z.object({
      content: z.string(), // 内容
      comment_id: z.string(), // 评论的哪条评论
      reply_sub_comment_id: z.string().optional(), // 评论的哪条回复
      user_id: z.string() // 评论者
    }))
    if (!body.success) {
      throw createError({
        statusCode: 400,
        message: JSON.stringify(body.error)
      })
    }
  } catch (err) {
    throw createError({
      statusCode: 400,
      message: '参数解析失败'
    })

  }
   
  const commentData = {
      ...body.data
  }
  const data = await prisma.blogSubComment.create({
    data: commentData
  })

  return {
    data,
    message: 'ok'
  }
})
