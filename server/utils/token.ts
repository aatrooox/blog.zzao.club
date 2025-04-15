interface CachedUserValue {
  userId: string
  scope: string
  expiresAt: Date
  isRevoked: boolean
}

interface CachedTokenValue {
  token: string
  expiresAt: Date
  isRevoked: boolean
}
/**
 *  为用户生成 access token
 * @param userId 用户id
 * @returns token
 */
export async function generateAccessToken(userId: string, scope: string = 'all'): Promise<[string, Date]> {
  // 先看是否已经给用户生成了 token
  const cached = await useCachedToken(userId, scope)
  if (cached) {
    return [cached.token, cached.expiresAt]
  }
  // 如果是第一次登录，则生成 token
  const token = useNanoId()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)
  // 用于 login 接口判断重复
  await useStorage('redis').setItem(`user:${userId}:${scope}`, {
    token,
    expiresAt,
    isRevoked: false,
  }, { ttl: 60 * 60 * 24 })
  // 用于其他接口鉴权
  await useStorage('redis').setItem(`token:${token}`, {
    userId,
    scope,
    expiresAt,
    isRevoked: false,
  }, { ttl: 60 * 60 * 24 })
  return [token, expiresAt]
}

export async function useCachedToken(userId?: string, scope: string = 'all') {
  const storage = useStorage('redis')
  const cachedToken = await storage.getItem<CachedTokenValue>(`user:${userId}:${scope}`)
  return cachedToken
}
export async function useCachedUser(token?: string) {
  const storage = useStorage('redis')
  const cachedToken = await storage.getItem<CachedUserValue>(`token:${token ?? ''}`)
  return cachedToken
}
/**
 *  在 redis 里撤销 token
 * @param userId 用户id
 * @param scope 作用范围
 */
export async function revokeCachedToken(userId?: string, scope: string = 'all') {
  const tokenInfo = await useCachedToken(userId, scope)
  await useStorage('redis').setItem(`user:${userId}:${scope}`, {
    isRevoked: true,
  }, { ttl: 60 * 60 * 24 })

  await useStorage('redis').setItem(`token:${tokenInfo?.token}`, {
    isRevoked: true,
  }, { ttl: 60 * 60 * 24 })
}
/**
 *  检测 token 是否有效 （从 redis 和 mysql 校验）
 * @param token 被校验的 token
 * @returns boolean
 */
export async function verifyAccessToken({ token }: { token?: string }): Promise<{ isAuth: boolean, userId?: string, scope?: string }> {
  const cachedUser = await useCachedUser(token)
  // 有缓存
  if (cachedUser) {
    if (cachedUser.isRevoked || new Date(cachedUser.expiresAt) < new Date()) {
      return {
        isAuth: false,
        userId: cachedUser.userId,
        scope: cachedUser.scope
      }
    }

    return {
      isAuth: true,
      userId: cachedUser.userId,
      scope: cachedUser.scope
    }
  }
  // 无缓存

  const tokenData = await prisma.accessToken.findFirst({
    where: {
      token,
    },
  })

  // 已经无效了了, 写入到缓存中避免多次去查库
  if (tokenData?.isRevoked || new Date(tokenData?.expiresAt || '') < new Date()) {
    await useStorage('redis').setItem(`token:${token}`, {
      isRevoked: true,
    }, { ttl: 60 * 60 * 24 })
    return {
      isAuth: false,
      userId: tokenData?.userId,
      scope: tokenData?.scope
    }
  }

  return {
    isAuth: true,
    userId: tokenData?.userId,
    scope: tokenData?.scope
  }
}

export async function verifyAccessUser({ userId, scope = 'all' }: { userId?: string, scope?: string }) {
  // 没有传 token，则按 userId + scope 校验  
  const cachedToken = await useCachedToken(userId, scope)
  // 如果命中缓存 则不查库
  if (cachedToken) {
    if (cachedToken.isRevoked || new Date(cachedToken.expiresAt) < new Date()) {
      return false
    }

    return true
  }

  const tokenData = await prisma.accessToken.findFirst({
    where: {
      userId,
      scope
    },
  })
  // 已经无效了了, 写入到缓存中避免多次去查库
  if (tokenData?.isRevoked || new Date(tokenData?.expiresAt ?? '') < new Date()) {
    revokeCachedToken(userId, scope)
    return false
  }

  return true

}
/**
 * 撤销 token, 更新 mysql redis 中的 token 信息
 * @param param0 { token, userId }
 */
export async function revokeAccessToken({ token, userId, scope = 'all' }: { userId: string, token?: string, scope?: string }) {
  const revokeToken = async () => {
    const whereOption: any = { userId, scope }
    if (token) {
      whereOption.token = token
    }

    await prisma.accessToken.update({
      where: whereOption,
      data: {
        isRevoked: true,
      },
    })

    revokeCachedToken(userId, scope)
  }
  
  if (token) {
    await revokeToken()
    return
  }

  const tokens = await prisma.accessToken.findMany({
    where: {
      userId,
      scope
    },
  })

  // 移除所有userId && scope 下的 token，未来可能需要
  tokens.forEach(async (tokenInfo) => {
    await revokeCachedToken(tokenInfo.token, tokenInfo.scope)
  })

  await prisma.accessToken.updateMany({
    where: {
      userId,
      scope
    },
    data: {
      isRevoked: true,
    },
  })
}