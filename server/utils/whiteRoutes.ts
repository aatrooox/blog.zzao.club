export function getWhiteRoutes() {
  return [
    '/api/v1/user/login',
    '/api/v1/user/logout',
    '/api/v1/user/regist',
    '/api/v1/user/visitor/regist',
    '/api/v1/auth/connect/github',
    '/api/v1/link/add',
  ]
}

// 游客在一定校验下可使用的接口
export const visitorRoutes = [
  '/api/v1/comment/create',
  '/api/v1/comment/sub/create',
]
