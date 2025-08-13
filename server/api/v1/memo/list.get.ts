import { desc, eq, sql } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { blogComments, blogLikes, blogMemos, memoTagRelations, memoTags, users } from '~~/lib/drizzle/schema'

export default defineStandardResponseHandler(async (event) => {
  const schema = z.object({
    page: z.string().optional().default('1').transform(Number),
    size: z.string().optional().default('50').transform(Number),
  })
  const query = await useSafeValidatedQuery(event, schema)

  if (!query.success) {
    throw createError({
      statusCode: 400,
      statusMessage: (query as any).message ?? '参数错误',
    })
  }

  const take = query.data.size
  const skip = (query.data.page - 1) * take

  const memos = await db.select({
    id: blogMemos.id,
    content: blogMemos.content,
    createTs: blogMemos.createTs,
    updatedTs: blogMemos.updatedTs,
    userId: blogMemos.userId,
    user_info: {
      username: users.username,
      nickname: users.nickname,
      avatarUrl: users.avatarUrl,
    },
    tags: sql`JSON_ARRAYAGG(JSON_OBJECT('id', ${memoTags.id}, 'tagName', ${memoTags.tagName}))`,
    likes: sql`JSON_ARRAYAGG(JSON_OBJECT('userId', ${blogLikes.userId}, 'id', ${blogLikes.id}))`,
    _count: {
      comments: sql<number>`(SELECT COUNT(*) FROM ${blogComments} WHERE ${blogComments.memoId} = ${blogMemos.id})`,
      likes: sql<number>`(SELECT COUNT(*) FROM ${blogLikes} WHERE ${blogLikes.blogMemoId} = ${blogMemos.id})`,
    },
  })
    .from(blogMemos)
    .leftJoin(users, eq(blogMemos.userId, users.id))
    .leftJoin(memoTagRelations, eq(blogMemos.id, memoTagRelations.memoId))
    .leftJoin(memoTags, eq(memoTagRelations.tagId, memoTags.id))
    .leftJoin(blogLikes, eq(blogMemos.id, blogLikes.blogMemoId))
    .groupBy(blogMemos.id)
    .orderBy(desc(blogMemos.createTs))
    .limit(take)
    .offset(skip)

  // 通过 event.$fetch() 调用 tags 接口获取标签信息
  try {
    const tagsResponse = await event.$fetch('/api/v1/tag/list')
    console.log('Tags response:', tagsResponse)
  }
  catch (error) {
    console.error('Failed to fetch tags:', error)
  }

  return memos
})
