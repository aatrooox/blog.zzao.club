import { visitorRoutes } from '../utils/whiteRoutes'
// 校验有无权限 jwt 
export default defineEventHandler(async (event) => {
  // 所有接口都尝试获取 token
  // 使用 oauth 登录后
  if (getRequestURL(event).pathname.startsWith('/api/v1')) {
    const headers = getHeaders(event)
    let authHeader = headers['authorization']
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      if (token) {
        event.context.token = token
      }
    }
    
  }
}
)