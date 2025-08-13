import { count } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { blogMemos } from '~~/lib/drizzle/schema'

export default defineCachedEventHandler(async (_) => {
  const [{ count: memoCount }] = await db.select({ count: count() }).from(blogMemos)

  return {
    data: memoCount,
    msg: 'ok',
  }
}, { maxAge: 60 * 60 * 12 }) // 缓存 12 小时
