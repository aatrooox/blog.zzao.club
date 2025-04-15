import getWhiteRoutes from '../utils/whiteRoutes'
import { verifyAccessToken } from '../utils/token'
// 校验有无权限 jwt 
export default defineEventHandler(async (event) => {
  // api/v1 开头的接口需要校验token
 
  // POST请求需要校验， GET放过
  if (getRequestURL(event).pathname.startsWith('/api/v1') && event.node.req.method !== 'GET') {
    // 排除掉登录和注册
    if (!getWhiteRoutes().includes(getRequestURL(event).pathname)) {
      const authHeader = getHeader(event, 'authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return createError({
          statusCode: 401,
          message: '未授权'
        })
      }

      const token = authHeader.split(' ')[1]

      if (!token) {
        throw createError({
          statusCode: 403,
          message: '未授权',
        })
      }

      const { isAuth, userId } = await verifyAccessToken({ token })

      if (!isAuth) {
        throw createError({
          statusCode: 403,
          message: '未授权或授权已过期',
        })
      }
       event.context.token = token     
       event.context.userId = userId     

       console.log(`auth0 - ${getRequestURL(event).pathname}`)
      }
    }

  console.log(`public - ${getRequestURL(event).pathname}`)
  } 
)