import prisma from "@@/server/prisma"

// content      String
//   create_ts    DateTime      @default(now())
//   updated_ts   DateTime      @updatedAt
//   type         String        @default("article") // article / memo / blog
//   memo_id      Int?
//   memo_info    Memos?        @relation(fields: [memo_id], references: [id])
//   article_id   Int?
//   article_info Articles?     @relation(fields: [article_id], references: [id])
//   user_id      Int
//   user_info    User          @relation(fields: [user_id], references: [id], onDelete: NoAction)
//   sub_comments SubComments[] // 一对多的二级评论
//   likes        Likes[]

export default defineEventHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    content: z.string(), // 内容
    type: z.string(), // 对象 blog / memo / article
    memo_id: z.number().optional(),
    article_id: z.number().optional(),
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
  console.log(`创建评论`, commentData)
  const data = await prisma.comments.create({
    data: commentData
  })

  return {
    data,
    message: 'ok'
  }
})
