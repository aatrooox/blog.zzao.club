import prisma from '~~/server/utils/prisma'

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
      name: z.string(),
    }).optional(),
    // 作为游客评论时，临时存储
    visitorName: z.string().optional(),
    visitorEmail: z.string().email().optional(),
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }
  const { type, content, article_id, user_id, path } = body.data

  const data = await prisma.blogComment.create({
    data: { type, content, article_id, user_id },
  })

  const myEmail = 'gnakzz@qq.com'
  try {
    sendMailNotice('有新的评论', { text: content, to: myEmail, subject: '博客有新评论了', path })
  }
  catch {}

  return {
    data,
    message: 'ok',
  }
})
