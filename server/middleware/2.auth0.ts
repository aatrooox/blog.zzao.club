// 校验有无权限 jwt
export default defineEventHandler(async (event) => {
  // api/v1 开头的接口需要校验token
  // POST请求需要校验， GET放过
  // 排除掉登录和注册
  if (!getWhiteRoutes().includes(getRequestURL(event).pathname)) {
    // 需要校验的请求类型和路径
    if (getRequestURL(event).pathname.startsWith('/api/v1') && event.node.req.method !== 'GET' && !event.context.visitorAuth) {
      // 排除掉登录、注册和refresh token
      const whiteRoutes = getWhiteRoutes()
      whiteRoutes.push('/api/v1/auth/refresh') // 添加refresh端点到白名单

      if (!whiteRoutes.includes(getRequestURL(event).pathname)) {
        if (!event.context.token) {
          // 中间件直接返回标准格式的错误响应，状态码 200
          setResponseStatus(event, 200)
          return {
            code: API_CODES.NO_TOKEN,
            message: API_ERROR_MESSAGES[API_CODES.NO_TOKEN],
            data: null,
            timestamp: Date.now(),
          }
        }

        // 使用JWT验证（无状态）
        const { isAuth, userId, error } = verifyJWTAccessToken(event.context.token)
        console.log(`${getRequestURL(event).pathname} - jwt: ${isAuth}, 用户ID: ${userId}, 错误信息: ${error}`)

        if (!isAuth) {
          // 根据JWT错误类型返回不同的错误代码
          let errorCode: number = API_CODES.AUTH_FAILED
          if (error?.includes('expired')) {
            errorCode = API_CODES.TOKEN_EXPIRED
          }
          else if (error?.includes('invalid') || error?.includes('malformed')) {
            errorCode = API_CODES.TOKEN_INVALID
          }

          // 中间件直接返回标准格式的错误响应，状态码 200
          setResponseStatus(event, 200)
          return {
            code: errorCode,
            message: API_ERROR_MESSAGES[errorCode as keyof typeof API_ERROR_MESSAGES],
            data: null,
            timestamp: Date.now(),
          }
        }

        event.context.userId = userId
        console.log(`auth0 - ${getRequestURL(event).pathname}`)
      }
    }
  }
})
