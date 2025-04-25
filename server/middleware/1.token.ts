import { visitorRoutes } from '../utils/whiteRoutes'
// 校验有无权限 jwt 
export default defineEventHandler(async (event) => {
  // POST请求需要校验， GET放过
  if (getRequestURL(event).pathname.startsWith('/api/v1') && event.node.req.method !== 'GET') {
    const headers = getHeaders(event)
    let authHeader = headers['authorization']
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      if (token) {
        event.context.token = token
      }
    }
    // 如果是游客一定条件下可使用的接口 并且也没有 token
    // if (visitorRoutes.includes(getRequestURL(event).pathname) && !event.context.token) {
    //   let isAuth = false
    //   // 至少包含这些字段
    //   const body = await useSafeValidatedBody(event, z.object({
    //     visitorName: z.string(),
    //     visitorEmail: z.string().email(),
    //     visitorWebsite: z.string().optional(),
    //   }).passthrough())

    //   if (!body.success) {
    //     throw createError({
    //       statusCode: 400,
    //       message: JSON.stringify(body.error)
    //     })
    //   }

    //   isAuth = true;

    //   event.context.visitorAuth = isAuth
    // }
  }

  // console.log(`public - ${getRequestURL(event).pathname}`)
}
)