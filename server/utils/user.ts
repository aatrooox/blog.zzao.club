import { eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { oauths } from '~~/lib/drizzle/schema'

export async function updateOAuthUser(oauthId: string, userId: string) {
  try {
    await db.update(oauths)
      .set({ userId })
      .where(eq(oauths.id, oauthId))

    const data = await db.select()
      .from(oauths)
      .where(eq(oauths.id, oauthId))
      .limit(1)

    return data[0]
  }
  catch {
    throw createError({
      statusCode: 500,
      message: '更新用户失败',
    })
  }
}
