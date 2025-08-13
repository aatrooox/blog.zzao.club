export default defineNitroErrorHandler((error, event) => {
  setResponseHeader(event, 'Content-Type', 'application/json')
  console.log(`[${new Date().toLocaleDateString()}]-[nitro error]: `, error)

  // 如果是 createError 创建的错误，保持原有的状态码和消息
  if (error.statusCode) {
    setResponseStatus(event, error.statusCode)
    return send(event, JSON.stringify({
      data: null,
      message: error.message || error.statusMessage || '请求失败',
    }))
  }

  // 其他未知错误使用通用处理
  setResponseStatus(event, 500)
  return send(event, JSON.stringify({ data: null, message: '服务器异常' }))
})
