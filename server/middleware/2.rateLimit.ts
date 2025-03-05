// 定义限流规则类型
interface RateLimitRule {
  path: string;
  maxRequests: number;
  windowMs: number;
}

// 定义请求记录类型
interface RequestRecord {
  count: number;
  timestamp: number;
}

export default defineEventHandler(async (event) => {
  // 获取请求路径
  const path = event.node.req.url || '';
  console.log(`limie: path ${path}`, )
  // 定义不同路径的限流规则
  const rateLimitRules: RateLimitRule[] = [
    // 对于同一 id/userid 3 分钟内 最多请求 3 次
    { path: '/api/v1/user/login', maxRequests: 3, windowMs: 3 * 60 * 1000 }, 
    { path: '/api/v1/user/regist', maxRequests: 1, windowMs: 1 * 60 * 1000 }, 
    { path: '/api/v1/comment/create', maxRequests: 3, windowMs: 1 * 60 * 1000 }, 
    { path: '/api/v1/comment/sub/create', maxRequests: 10, windowMs: 5 * 60 * 1000 }
  ]
  
  // 查找匹配的规则
  const rule = rateLimitRules.find(rule => path.startsWith(rule.path));
  if (!rule) {
    // console.log(` 无匹配规则 `, )
    // 没有匹配的规则，不限流，继续执行
    return;
  }
  
  // 获取请求标识
  const userId = event.context.userId;
  const identifier = userId || getRequestIP(event, { xForwardedFor: true });
  
  if (!identifier) {
    // console.log(` 无法识别来源 `, )
    // 无法识别请求来源，继续执行
    return;
  }
  
  // Redis限流逻辑
  const storage = useStorage('redis');
  const key = `ratelimit:${identifier}:${rule.path}`;
  
  const currentData = await storage.getItem<RequestRecord>(key) || { count: 0, timestamp: Date.now() };
  const now = Date.now();
  if (now - currentData.timestamp > rule.windowMs) {
    // 重置计数
    await storage.setItem(key, { count: 1, timestamp: now });
    // 设置过期时间
    await storage.setItemRaw(`${key}:ttl`, '', { ttl: Math.ceil(rule.windowMs / 1000) });
    // 继续执行
    return;
  }
  
  currentData.count++;
  
  if (currentData.count > rule.maxRequests) {
    const resetTime = currentData.timestamp + rule.windowMs;
    const remainingTime = Math.ceil((resetTime - now) / 1000);
    
    // 超出限制，抛出错误
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      data: {
        message: `请求过于频繁，请在${remainingTime}秒后再试`,
        remainingTime
      }
    });
  }
  
  // 更新请求记录
  await storage.setItem(key, currentData);
  // 不返回任何内容，继续执行
});