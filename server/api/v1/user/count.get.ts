import { count } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { users } from '~~/lib/drizzle/schema'

// 查询用户数量 - 缓存 1 小时
export default defineStandardResponseHandler(async () => {
  const [{ count: userCount }] = await db.select({ count: count() }).from(users)
  return userCount
})
