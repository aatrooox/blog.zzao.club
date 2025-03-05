export default defineEventHandler(async (event) => {
  // 获取请求路径
  const path = event.node.req.url
  
  // 定义不同路径的限流规则
  const rateLimitRules = [
    { path: '/api/auth/login', maxRequests: 5, windowMs: 5 * 60 * 1000 }, // 登录接口5分钟5次
    { path: '/api/auth/register', maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 注册接口1小时3次
    { path: '/api/comments', maxRequests: 20, windowMs: 5 * 60 * 1000 }, // 评论接口5分钟20次
    { path: '/api/likes', maxRequests: 30, windowMs: 5 * 60 * 1000 }, // 点赞接口5分钟30次
    // 默认规则
    { path: '/api/', maxRequests: 60, windowMs: 5 * 60 * 1000 }
  ]
  
  // 查找匹配的规则
  const rule = rateLimitRules.find(rule => path?.startsWith(rule.path))
  if (!rule) return // 没有匹配的规则，不限流
  
  // 获取请求标识
  const user = event.context.user
  const identifier = user?.id || getRequestIP(event, { xForwardedFor: true })
  
  if (!identifier) return
  
  // 使用MySQL记录持久化的限流违规记录（可选）
  if (path?.includes('/api/auth/')) {
    // 对于敏感操作，可以记录到MySQL中进行长期分析
    // 这里可以添加MySQL记录代码
  }
  
  // Redis限流逻辑
  const storage = useStorage('redis')
  const key = `ratelimit:${identifier}:${rule.path}`
  
  const currentData: any = await storage.getItem(key) || { count: 0, timestamp: Date.now() }
  
  const now = Date.now()
  if (now - currentData.timestamp > rule.windowMs) {
    await storage.setItem(key, { count: 1, timestamp: now })
    await storage.setItemRaw(`${key}:ttl`, '', { ttl: Math.ceil(rule.windowMs / 1000) })
    return
  }
  
  currentData.count++
  
  if (currentData.count > rule.maxRequests) {
    const resetTime = currentData.timestamp + rule.windowMs
    const remainingTime = Math.ceil((resetTime - now) / 1000)
    
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      data: {
        message: `请求过于频繁，请在${remainingTime}秒后再试`,
        remainingTime
      }
    })
  }
  console.log(`rate limit`, key, currentData)
  await storage.setItem(key, currentData)
})