import type { EventHandler, EventHandlerRequest } from 'h3'

export const defineStandardResponseHandler = <T extends EventHandlerRequest, D> (
  handler: EventHandler<T, D>,
): EventHandler<T, D> =>
  defineEventHandler<T>(async (event) => {
    try {
      // do something before the route handler
      const response = await handler(event)
      // do something after the route handler
      return {
        code: API_CODES.SUCCESS,
        message: 'ok',
        data: response,
        timestamp: Date.now(),
      }
    }
    catch (error: any) {
      // Error handling - 如果是已知的 createError，提取错误信息并强制返回 200 状态码
      // 强制设置 HTTP 状态码为 200
      if (error.statusCode) {
        setResponseStatus(event, error.statusCode)
        // 强制设置 HTTP 状态码为 200

        // 检查是否包含自定义错误代码
        const customCode = error.data?.code
        const customMessage = error.data?.message || error.message
        console.error('Handled error:', {
          statusCode: error.statusCode,
          customCode,
          message: customMessage,
        })
        return {
          code: customCode || API_CODES.INTERNAL_ERROR,
          message: customMessage || '出错啦，请稍后再试～',
          data: error.data?.data || null,
          timestamp: Date.now(),
        }
      }
      // 未知错误，返回通用错误信息
      console.error('Unexpected error:', error)

      setResponseStatus(event, 500)
      return {
        code: API_CODES.INTERNAL_ERROR,
        message: '出错啦，请稍后再试～',
        data: null,
        timestamp: Date.now(),
      }
    }
  })
