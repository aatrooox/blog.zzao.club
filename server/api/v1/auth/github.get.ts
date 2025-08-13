import { and, eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { oauths } from '~~/lib/drizzle/schema'

export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true,
  },
  async onSuccess(event: any, { user, tokens }: any) {
    console.log(`oauth user =>`, user)
    console.log(`oauth tokens =>`, tokens)
    await setUserSession(event, { user })

    const auth = await db.select().from(oauths).where(
      and(
        eq(oauths.provider, 'github'),
        eq(oauths.providerId, `${user.id}`),
      ),
    ).limit(1)

    // 保存必要的 oauth 信息
    if (auth.length === 0) {
      const now = new Date()
      await db.insert(oauths).values({
        provider: 'github',
        providerId: `${user.id}`,
        createdAt: now,
        updatedAt: now,
      })
    }

    // 请求 github 时，携带一个 settings 参数
    const query = getQuery(event)
    return sendRedirect(event, query?.setting ? '/settings?oauth=1' : '/?login=github&status=success')
  },
  // Optional, will return a json error and 401 status code by default
  onError(event: any, error: any) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/?login=github&status=fail')
  },
})
