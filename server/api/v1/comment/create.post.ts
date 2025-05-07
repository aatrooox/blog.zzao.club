import prisma from "~~/server/utils/prisma"

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
    type: z.string().optional().default('article'), // 对象 blog / memo / article
    article_id: z.string(),
    user_id: z.string(), // 评论者
    path: z.string().optional(),
    email: z.object({
      to: z.string().email(),
      text: z.string(),
      name:  z.string()
    }).optional(),
    // 作为游客评论时，临时存储
    visitorName: z.string().optional(),
    visitorEmail: z.string().email().optional()
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error)
    })
  }
  const { type, content, article_id, user_id, email, path } = body.data

  const data = await prisma.blogComment.create({
    data: { type, content, article_id, user_id }
  })

  const myEmail = 'gnakzz@qq.com'
  try {
    sendMailNotice( '有新的评论', { text: content, to: myEmail, subject: '博客有新评论了', path })
  } catch( err) {}

  return {
    data,
    message: 'ok'
  }
})
