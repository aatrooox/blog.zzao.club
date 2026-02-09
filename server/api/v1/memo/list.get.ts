import { count, desc, eq, sql } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { blogComments, blogLikes, blogMemos, memoTagRelations, memoTags, users } from '~~/lib/drizzle/schema'
import { paginationSchema, withPagination } from '~~/server/utils/pagination'

export default defineStandardResponseHandler(async (event) => {
  const schema = z.object({
    ...paginationSchema,
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

  const countQuery = db.select({ count: count() }).from(blogMemos)

  const dataQuery = db.select({
    id: blogMemos.id,
    content: blogMemos.content,
    createTs: blogMemos.createTs,
    updatedTs: blogMemos.updatedTs,
    userId: blogMemos.userId,
    from: blogMemos.from,
    user_info: {
      username: users.username,
      nickname: users.nickname,
      avatarUrl: users.avatarUrl,
    },
    photos: blogMemos.photos,
    tags: sql`(
      SELECT CASE 
        WHEN COUNT(mt.id) = 0 THEN JSON_ARRAY() 
        ELSE JSON_ARRAYAGG(JSON_OBJECT('id', mt.id, 'tagName', mt.tag_name))
      END
      FROM ${memoTagRelations} mtr
      LEFT JOIN ${memoTags} mt ON mtr.tagId = mt.id
      WHERE mtr.memoId = ${blogMemos.id}
    )`,
    likes: sql`(
      SELECT CASE 
        WHEN COUNT(bl.id) = 0 THEN JSON_ARRAY() 
        ELSE JSON_ARRAYAGG(JSON_OBJECT('userId', bl.user_id, 'id', bl.id))
      END
      FROM ${blogLikes} bl
      WHERE bl.blogMemoId = ${blogMemos.id}
    )`,
    _count: {
      comments: sql<number>`(SELECT COUNT(*) FROM ${blogComments} WHERE ${blogComments.memoId} = ${blogMemos.id})`,
      likes: sql<number>`(SELECT COUNT(*) FROM ${blogLikes} WHERE ${blogLikes.blogMemoId} = ${blogMemos.id})`,
    },
  })
    .from(blogMemos)
    .leftJoin(users, eq(blogMemos.userId, users.id))
    .orderBy(desc(blogMemos.createTs))
    .limit(take)
    .offset(skip)

  return await withPagination({
    page: query.data.page,
    size: query.data.size,
    countQuery,
    dataQuery,
  })
})
