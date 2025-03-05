// 定义限流规则类型
interface RateLimitRule {
  path: string;
  limit: number;
  duration: number;
}

// 定义请求记录类型
interface RequestRecord {
  count: number;
  timestamp: number;
}

export default defineEventHandler(async (event) => {
  // 获取请求路径
  const path = event.node.req.url || '';
  // 定义不同路径的限流规则
  const rateLimitRules: RateLimitRule[] = [
    // 对于同一 id/userid 3 分钟内 最多请求 3 次
    { path: '/api/v1/user/login', limit: 2, duration: 1 * 60 * 1000 }, 
    { path: '/api/v1/user/regist', limit: 2, duration: 1 * 60 * 1000 }, 
    { path: '/api/v1/comment/create', limit: 4, duration: 1 * 60 * 1000 }, 
    { path: '/api/v1/comment/sub/create', limit: 10, duration: 5 * 60 * 1000 }
  ]
  
  // 查找匹配的规则
  const rule = rateLimitRules.find(rule => path.startsWith(rule.path));
  if (!rule) {
    // console.log(` 无匹配规则 `, )
    return;
  }
  
  // 获取请求标识
  const userId = event.context.userId;
  const identifier = userId || getRequestIP(event, { xForwardedFor: true });
  
  if (!identifier) {
    // console.log(` 无法识别来源 `, )
    return;
  }
  
  // Redis限流逻辑
  const storage = useStorage('redis');
  const key = `ratelimit:${identifier}:${rule.path}`;
  
  const currentData = await storage.getItem<RequestRecord>(key);
  const now = Date.now();
  if (!currentData) {
    // 初始化计数
    await storage.setItem(key, { count: 1, timestamp: now }, { ttl: Math.ceil(rule.duration / 1000) });
    return;
  }
  
  // 如何超出限制次数，抛出错误
  if (currentData.count > rule.limit) {
    const resetTime = currentData.timestamp + rule.duration;
    const remainingTime = Math.ceil((resetTime - now) / 1000);
    console.log(`Error: out of limit => ${key} - [${remainingTime}s后解锁]`, )
    // 超出限制，抛出错误
    throw createError({
      statusCode: 429,
      message: `请求过于频繁，请在${remainingTime}秒后再试`,
    });
  }

  // 正常范围内的请求，计数+1，更新过期时间
  await storage.setItem(key, {
    count: currentData.count + 1,
    timestamp: currentData.timestamp  // 保持原有时间戳
  }, {
    ttl: Math.ceil((currentData.timestamp + rule.duration - now) / 1000)  // 更新剩余过期时间
  });


});