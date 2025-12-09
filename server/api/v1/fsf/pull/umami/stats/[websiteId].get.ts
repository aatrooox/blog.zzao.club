// 获取网站访问数据 缓存 1 小时
export default defineCachedEventHandler(async (event) => {
  // websiteid 站点ID
  const websiteId = getRouterParam(event, 'websiteId')
  const schema = z.object({
    url: z.string().optional(),
    startAt: z.string().transform((str: string) => Number(str)).optional(), // ms
    endAt: z.string().transform((str: string) => Number(str)).optional(), // ms
  })
  const query = await useSafeValidatedQuery(event, schema)

  if (!query.success) {
    throw createError({
      statusCode: 400,
      statusMessage: (query as any).message ?? '参数错误',
    })
  }

  const { umamiUser, umamiPass, umamiHost } = useRuntimeConfig()
  const redis = useStorage('redis')

  async function loginUmami() {
    const res = await $fetch<{ token: string, user: Record<string, string> }>(`${umamiHost}/api/auth/login`, { method: 'POST', body: { username: umamiUser, password: umamiPass } })
    if (res.token) {
      const createdAt = +new Date(res.user.createdAt)
      await redis.setItem('umamiToken', res.token, { ttl: 60 * 60 * 24 * 7 })
      await redis.setItem('umamiCreatedAt', createdAt, { ttl: 60 * 60 * 24 * 7 })
      return { token: res.token, createdAt }
    }
    throw createError({ statusCode: 500, message: 'Umami 登录失败，未返回 token' })
  }

  let umamiToken = await redis.getItem<string>('umamiToken')
  let umamiCreatedAt = await redis.getItem<number>('umamiCreatedAt')
  if (!umamiToken || !umamiCreatedAt) {
    const loginRes = await loginUmami()
    umamiToken = loginRes.token
    umamiCreatedAt = loginRes.createdAt
  }

  async function fetchMetrics(token: string, createdAt: number) {
    return await $fetch<any[]>(`${umamiHost}/api/websites/${websiteId}/metrics`, {
      method: 'GET',
      query: {
        startAt: createdAt,
        endAt: +new Date(),
        type: 'path',
        // timezone: 'Asia/Shanghai',
      },
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  let data: any[]
  try {
    data = await fetchMetrics(umamiToken, umamiCreatedAt)
  }
  catch (error: any) {
    const status = error?.response?.status || error?.statusCode || error?.status
    if (status === 401) {
      // Token 失效，清理缓存并重新获取
      await redis.removeItem('umamiToken')
      await redis.removeItem('umamiCreatedAt')
      const loginRes = await loginUmami()
      data = await fetchMetrics(loginRes.token, loginRes.createdAt)
    }
    else {
      throw error
    }
  }

  const filteredData = data.filter(item => item.x.startsWith('/post'))
  const dataMap: Record<string, number> = {}
  filteredData.forEach((item) => {
    dataMap[item.x] = item.y
  })
  return {
    data: dataMap,
    message: 'ok',
  }
}, { maxAge: 60 * 60 * 1 })
