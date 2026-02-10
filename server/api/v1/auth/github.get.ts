import { and, eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { oauths, users } from '~~/lib/drizzle/schema'

export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true,
  },
  async onSuccess(event, { user: ghUser }: any) {
    const query = getQuery(event)
    const redirect = (query?.redirect as string) || '/'

    try {
      // 1. 查找/创建 OAuth 记录
      const [existingOAuth] = await db.select().from(oauths).where(
        and(
          eq(oauths.provider, 'github'),
          eq(oauths.providerId, `${ghUser.id}`),
        ),
      ).limit(1)

      let oauthRecord = existingOAuth
      const now = new Date()

      if (!oauthRecord) {
        // 新 OAuth 记录
        await db.insert(oauths).values({
          provider: 'github',
          providerId: `${ghUser.id}`,
          providerEmail: ghUser.email || null,
          providerAvatar: ghUser.avatar_url || null,
          providerLogin: ghUser.login || null,
          createdAt: now,
          updatedAt: now,
        })
        const [inserted] = await db.select().from(oauths).where(
          and(
            eq(oauths.provider, 'github'),
            eq(oauths.providerId, `${ghUser.id}`),
          ),
        ).limit(1)
        oauthRecord = inserted
      }
      else {
        // 更新已有 OAuth 记录的 GitHub 信息
        await db.update(oauths).set({
          providerEmail: ghUser.email || oauthRecord.providerEmail,
          providerAvatar: ghUser.avatar_url || oauthRecord.providerAvatar,
          providerLogin: ghUser.login || oauthRecord.providerLogin,
          updatedAt: now,
        }).where(eq(oauths.id, oauthRecord.id))
      }

      // 2. 查找/创建用户
      let userId: string

      if (oauthRecord.userId) {
        // OAuth 已关联用户
        userId = oauthRecord.userId
      }
      else if (ghUser.email) {
        // 尝试通过邮箱匹配已有用户
        const [existingUser] = await db.select().from(users).where(eq(users.email, ghUser.email)).limit(1)

        if (existingUser) {
          userId = existingUser.id
        }
        else {
          // 创建新用户
          userId = await createUserFromGitHub(ghUser)
        }

        // 关联 OAuth 到用户
        await db.update(oauths).set({ userId }).where(eq(oauths.id, oauthRecord.id))
      }
      else {
        // 无邮箱，直接创建新用户
        userId = await createUserFromGitHub(ghUser)
        await db.update(oauths).set({ userId }).where(eq(oauths.id, oauthRecord.id))
      }

      // 3. 生成一次性 code，存入 Redis（30秒过期）
      const code = useNanoId(32)
      await useStorage('redis').setItem(
        `oauth_code:${code}`,
        { userId },
        { ttl: 30 },
      )

      // 4. 重定向到前端 callback 页面
      return sendRedirect(event, `/auth/callback?code=${code}&redirect=${encodeURIComponent(redirect)}`)
    }
    catch (error) {
      console.error('GitHub OAuth processing error:', error)
      return sendRedirect(event, `/?login=github&status=fail`)
    }
  },
  onError(event, error) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/?login=github&status=fail')
  },
})

/**
 * 从 GitHub 用户信息创建本站用户
 */
async function createUserFromGitHub(ghUser: any): Promise<string> {
  let username = ghUser.login || `gh_${ghUser.id}`

  // 检查用户名是否已存在
  const [existing] = await db.select().from(users).where(eq(users.username, username)).limit(1)

  if (existing) {
    username = `${username}_${useNanoId(4)}`
  }

  const newUserId = crypto.randomUUID()
  await db.insert(users).values({
    id: newUserId,
    username,
    nickname: ghUser.login || username,
    password: 'OAUTH_NO_PASSWORD',
    email: ghUser.email || null,
    avatarUrl: ghUser.avatar_url || null,
    role: 'user',
    status: 1,
  })

  return newUserId
}
