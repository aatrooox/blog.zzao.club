import prisma from "@@/server/prisma"

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
  const body = await useSafeValidatedBody(event, z.object({
    content: z.string(), // 内容
    comment_id: z.number(), // 评论的哪条评论
    reply_sub_comment_id: z.number().optional(), // 评论的哪条回复
    user_id: z.number() // 评论者
  }))
  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error)
    })
  }
  const uid = useNanoId()
  const commentData = {
      uid,
      ...body.data
  }
  console.log(`创建子评论`, commentData)
  const data = await prisma.subComments.create({
    data: commentData
  })

  return {
    data,
    message: 'ok'
  }
})
