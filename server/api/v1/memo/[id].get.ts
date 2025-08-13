import { eq, sql } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { blogComments, blogMemos, memoTagRelations, memoTags, users } from '~~/lib/drizzle/schema'

export default defineStandardResponseHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'id is required',
    })
  }

  const data = await db.select({
    id: blogMemos.id,
    content: blogMemos.content,
    createTs: blogMemos.createTs,
    updatedTs: blogMemos.updatedTs,
    visible: blogMemos.visible,
    defaltFloded: blogMemos.defaltFloded,
    flodTip: blogMemos.flodTip,
    userId: blogMemos.userId,
    from: blogMemos.from,
    courier: blogMemos.courier,
    user_info: {
      username: users.username,
      nickname: users.nickname,
      avatarUrl: users.avatarUrl,
    },
    tags: sql`(
      SELECT CASE 
        WHEN COUNT(mt.id) = 0 THEN JSON_ARRAY() 
        ELSE JSON_ARRAYAGG(JSON_OBJECT('id', mt.id, 'tagName', mt.tag_name))
      END
      FROM ${memoTagRelations} mtr
      LEFT JOIN ${memoTags} mt ON mtr.tagId = mt.id
      WHERE mtr.memoId = ${blogMemos.id}
    )`,
    comments: sql`(
      SELECT CASE 
        WHEN COUNT(bc.id) = 0 THEN JSON_ARRAY() 
        ELSE JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', bc.id,
            'content', bc.content,
            'createTs', bc.create_ts,
            'updatedTs', bc.updated_ts,
            'userId', bc.user_id,
            'user_info', JSON_OBJECT(
              'username', u.username,
              'avatarUrl', u.avatar_url
            )
          )
        )
      END
      FROM ${blogComments} bc
      LEFT JOIN ${users} u ON bc.user_id = u.id
      WHERE bc.memo_id = ${blogMemos.id}
    )`,
  })
    .from(blogMemos)
    .leftJoin(users, eq(blogMemos.userId, users.id))
    .where(eq(blogMemos.id, id))
    .limit(1)

  const memo = data[0]

  return memo
})
