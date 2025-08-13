import { eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { userConfigs } from '~~/lib/drizzle/schema'

export default defineStandardResponseHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'userId is required',
    })
  }

  const userConfig = await db.select()
    .from(userConfigs)
    .where(eq(userConfigs.userId, id))
    .limit(1)

  return userConfig.length > 0 ? userConfig[0] : null
})
