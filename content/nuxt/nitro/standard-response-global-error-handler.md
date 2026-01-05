---
title: Nuxt 全栈开发·自定义响应和全局错误处理
date: 2025-06-24
lastmod: 2025-06-24
tags:
  - Nuxt
  - Nitro
versions:
  - nuxt@3.17.2
  - nitro@2.11.12
description: 使用 Nuxt 全栈开发时，如何像NestJS 一样优雅的设置统一的响应体，以及如何捕获全局 Error
---
使用 `Nuxt` 全栈开发时，如何像 `NestJS` 一样优雅的设置统一的响应体，以及如何捕获全局 Error
## 自定义 Handler

[官方文档](https://nuxt.com/docs/4.x/guide/directory-structure/server#server-utilities)

```typescript [server/utils/handler.ts]
import type { EventHandler, EventHandlerRequest } from 'h3'

export const defineWrappedResponseHandler = <T extends EventHandlerRequest, D> (
  handler: EventHandler<T, D>
): EventHandler<T, D> =>
  defineEventHandler<T>(async event => {
    try {
      // 拿到接口文件里返回的响应值
      const response = await handler(event)
      // 自定义统一的结构
      // 自定义code，自定义 message
      return { code: 200, data: response, message: 'ok' }
    } catch (err) {
      // 自定义错误响应体
      return { code: 500, message: 'error' + err }
      // 或直接抛出错误
	  // throw createError({
      //  statusCode: 500,
      //  message: '出错啦，请稍后再试～',
      //})
    }
  })
```

使用时将 `defineEventHandler` 替换为 `defineWrappedResponseHandler` ，同时直接 `return data` 。

```typescript [server/api/demo.ts]
export default defineWrappedResponseHandler(async (event) => {
  const schema = z.object({
    id: z.string(),
    user_id: z.string().optional(),
  })
  const query = await useSafeValidatedQuery(event, schema)

  if (!query.success) {
    throw createError({
      statusCode: 400,
      statusMessage: (query as any).message ?? '参数错误',
    })
  }

  // 伪代码
  const data =  await prisma.findMany()
  
  return data
})
```

## 在 plugins 中使用 hook

[官方文档](https://nitro.build/guide/plugins#request-and-response-lifecycle)

`nitro` 中有多个生命周期钩子可供自定义，可自行设置标准响应体，打印日志等

```typescript [server/plugins/response.ts]
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("request", (event) => {
    console.log("on request", event.path);
  });

  nitroApp.hooks.hook("beforeResponse", (event, { body }) => {
    console.log("on response", event.path, { body });
  });

  nitroApp.hooks.hook("afterResponse", (event, { body }) => {
    console.log("on after response", event.path, { body });
  });
});
```

使用 `beforeResponse` 实现自定义响应体

```typescript [server/plugins/response.ts]
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("beforeResponse", (event, { body }) => {
    if (t?.body) {
	    t.body = {
		    code: 200,
		    data: t.body,
		    message: 'ok'
	    }
    }
  });
});
```

以上就是两种设置统一响应体的方式
## errorHandler 

[官方文档](https://nitro.build/config#errorhandler)

> Path to a custom runtime error handler. Replacing nitro's built-in error page. The error handler is given an `H3Error` and `H3Event`. If the handler returns a promise it is awaited. The handler is expected to send a response of its own. Below is an example where a plain-text response is returned using h3's functions.

`nitro` 中有一个默认的错误页面，你可以自定义自己的 `errorHandler` 用来和统一响应体

```typescript [nuxt.config.ts]
export default defineNuxtConfig({
	future: {
	    compatibilityVersion: 4,
	},
	nitro: {
		errorHandler: '~~/server/error'
	}
})
```


```typescript [server/error.ts]
export default defineNitroErrorHandler((error, event) => {
  setResponseHeader(event, 'Content-Type', 'application/json')
  console.log(`[${new Date().toLocaleDateString()}]-[nitro error]: `, error)
  return send(event, { data: null, message: '服务器异常' })
})
```

以上就是群里小伙伴们各自实践中得到的经验！

希望对你有所帮助☺️