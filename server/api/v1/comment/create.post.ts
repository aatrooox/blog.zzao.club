import { desc, eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { blogComments } from '~~/lib/drizzle/schema'

export default defineStandardResponseHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    content: z.string(), // 内容
    type: z.string().optional().default('article'), // 对象 blog / memo / article
    article_id: z.string().optional(),
    memo_id: z.string().optional(),
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
  }).refine((data: { article_id?: string, memo_id?: string }) => data.article_id || data.memo_id, {
    message: 'Either article_id or memo_id must be provided',
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }
  const { type, content, article_id, memo_id, user_id, path } = body.data

  const now = new Date()
  await db.insert(blogComments).values({
    type,
    content,
    articleId: article_id,
    memoId: memo_id,
    userId: user_id,
    createTs: now,
    updatedTs: now,
  })

  // 查询刚创建的评论
  const [data] = await db.select().from(blogComments).where(eq(blogComments.userId, user_id)).orderBy(desc(blogComments.createTs)).limit(1)

  const myEmail = 'gnakzz@qq.com'
  try {
    sendMailNotice('有新的评论', { text: content, to: myEmail, subject: '博客有新评论了', path })
  }
  catch {}

  return data
})
