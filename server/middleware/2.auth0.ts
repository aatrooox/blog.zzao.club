// 校验有无权限 jwt
export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const pathname = url.pathname

  // 1. 仅拦截 /api/v1 开头的接口
  if (!pathname.startsWith('/api/v1')) {
    return
  }

  // 2. 白名单检查 (登录、注册、刷新Token等无需鉴权)
  const whiteRoutes = [...getWhiteRoutes(), '/api/v1/auth/refresh']
  if (whiteRoutes.includes(pathname)) {
    return
  }

  // 3. 尝试获取 Token (由 1.token.ts 中间件解析)
  const token = event.context.token

  // 4. 鉴权逻辑
  if (token) {
    // A. 如果携带了 Token，必须验证其有效性 (无论 GET 还是 POST)
    let isAuth = false
    let userId: string | undefined
    let scope: string | undefined

    // 优先尝试 JWT 验证
    const jwtResult = verifyJWTAccessToken(token)
    if (jwtResult.isAuth) {
      isAuth = true
      userId = jwtResult.userId
      scope = 'all' // JWT 拥有全部权限
    }
    else {
      // JWT 验证失败，尝试 PAT 验证
      const patResult = await verifyPAT(token)
      if (patResult.isAuth) {
        isAuth = true
        userId = patResult.userId
        scope = patResult.scope
      }
    }

    if (isAuth && userId) {
      // PAT scope 校验
      if (scope && !isPathAllowedByScope(scope, pathname)) {
        setResponseStatus(event, 200)
        return {
          code: API_CODES.PERMISSION_DENIED,
          message: '该 Token 无权访问此接口',
          data: null,
          timestamp: Date.now(),
        }
      }

      // 验证成功，注入用户身份
      event.context.userId = userId
      event.context.scope = scope
      // console.log(`[Auth] User ${userId} accessed ${pathname}`)
    }
    else {
      // 验证失败 (Token 过期或无效)
      setResponseStatus(event, 200)
      return {
        code: API_CODES.TOKEN_EXPIRED, // 或 TOKEN_INVALID
        message: '登录已过期，请重新登录',
        data: null,
        timestamp: Date.now(),
      }
    }
  }
  else {
    // B. 未携带 Token
    if (event.node.req.method !== 'GET' && !event.context.visitorAuth) {
      // 非 GET 请求 (POST/PUT/DELETE) 必须鉴权
      setResponseStatus(event, 200)
      return {
        code: API_CODES.NO_TOKEN,
        message: '请先登录',
        data: null,
        timestamp: Date.now(),
      }
    }
    // GET 请求未带 Token -> 视为游客访问 (Guest Mode)，直接放行
  }
})
