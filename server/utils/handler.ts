import type { EventHandler, EventHandlerRequest } from 'h3'

export const defineStandardResponseHandler = <T extends EventHandlerRequest, D> (
  handler: EventHandler<T, D>,
): EventHandler<T, D> =>
  defineEventHandler<T>(async (event) => {
    try {
      // do something before the route handler
      const response = await handler(event)
      // do something after the route handler
      return { data: response, message: 'ok' }
    }
    catch {
      // Error handling
      throw createError({
        statusCode: 500,
        message: '出错啦，请稍后再试～',
      })
    }
  })
