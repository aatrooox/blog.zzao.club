import { count, desc, eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { blogComments, blogMemos, users } from '~~/lib/drizzle/schema'

export default defineStandardResponseHandler(async (event) => {
  await assertSuperAdmin(event.context.userId)

  const [[userResult], [memoResult], [commentResult], articleCount, recentMemos, recentComments] = await Promise.all([
    db.select({ count: count() }).from(users),
    db.select({ count: count() }).from(blogMemos),
    db.select({ count: count() }).from(blogComments),
    queryCollection(event, 'content').all().then(posts => posts.length),
    db.select({
      id: blogMemos.id,
      content: blogMemos.content,
      createTs: blogMemos.createTs,
    })
      .from(blogMemos)
      .orderBy(desc(blogMemos.createTs))
      .limit(5),
    db.select({
      id: blogComments.id,
      content: blogComments.content,
      type: blogComments.type,
      createTs: blogComments.createTs,
      visitorName: blogComments.visitorName,
      username: users.username,
      nickname: users.nickname,
    })
      .from(blogComments)
      .leftJoin(users, eq(blogComments.userId, users.id))
      .orderBy(desc(blogComments.createTs))
      .limit(5),
  ])

  return {
    articles: articleCount,
    memos: memoResult.count,
    users: userResult.count,
    comments: commentResult.count,
    recentMemos,
    recentComments,
  }
})
