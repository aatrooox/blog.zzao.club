// 退出登录, 获取jwt token
export default defineStandardResponseHandler(async (event) => {
  // 将此key加入到payload中 请求时校验有无此key及user信息
  // deleteCookie(event, "token");
  revokeAccessToken({ token: event.context.token, userId: event.context.userId })

  return '已退出登录'
})
