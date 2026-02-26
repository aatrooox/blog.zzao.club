import { db } from '~~/lib/drizzle'
import { todoTags } from '~~/lib/drizzle/schema'

export default defineStandardResponseHandler(async (_event) => {
  const tags = await db.select().from(todoTags).orderBy(todoTags.name)
  return tags
})
