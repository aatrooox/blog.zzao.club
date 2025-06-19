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
  let umamiToken = await useStorage('redis').getItem(`umamiToken`)
  let umamiCreatedAt = await useStorage('redis').getItem(`umamiCreatedAt`)
  if (!umamiToken) {
    const res = await $fetch<{ token: string, user: Record<string, string> }>(`${umamiHost}/api/auth/login`, { method: 'POST', body: { username: umamiUser, password: umamiPass } })
    if (res.token) {
      await useStorage('redis').setItem(`umamiToken`, res.token, { ttl: 60 * 60 * 24 * 7 })
      await useStorage('redis').setItem(`umamiCreatedAt`, +new Date(res.user.createdAt), { ttl: 60 * 60 * 24 * 7 })
      umamiToken = res.token
      umamiCreatedAt = +res.user.createdAt
    }
  }
  const data = await $fetch<any[]>(`${umamiHost}/api/websites/${websiteId}/metrics`, { method: 'GET', query: {
    startAt: umamiCreatedAt,
    endAt: +new Date(),
    type: 'url',
    // timezone: 'Asia/Shanghai',
  }, headers: { Authorization: `Bearer ${umamiToken}` } })

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
