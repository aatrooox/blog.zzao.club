import { verifyAccessToken } from '../utils/token'
import { getWhiteRoutes } from '../utils/whiteRoutes'

// 校验有无权限 jwt
export default defineEventHandler(async (event) => {
  // api/v1 开头的接口需要校验token

  // POST请求需要校验， GET放过
  if (getRequestURL(event).pathname.startsWith('/api/v1') && event.node.req.method !== 'GET' && !event.context.visitorAuth) {
    // 排除掉登录和注册
    if (!getWhiteRoutes().includes(getRequestURL(event).pathname)) {
      if (!event.context.token) {
        throw createError({
          statusCode: 403,
          message: '未授权',
        })
      }

      const { isAuth, userId } = await verifyAccessToken({ token: event.context.token })

      if (!isAuth) {
        throw createError({
          statusCode: 403,
          message: '未授权或授权已过期',
        })
      }

      event.context.userId = userId

      console.log(`auth0 - ${getRequestURL(event).pathname}`)
    }
  }
})
