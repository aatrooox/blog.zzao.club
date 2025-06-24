export default defineNitroErrorHandler((error, event) => {
  setResponseHeader(event, 'Content-Type', 'application/json')
  console.log(`[${new Date().toLocaleDateString()}]-[nitro error]: `, error)
  return send(event, { data: null, message: '服务器异常' })
})
