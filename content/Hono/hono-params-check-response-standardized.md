---
title: 【Hono】完善：参数校验+响应标准化
date: 2025-02-10
lastmod: 2025-02-12
tags:
  - Hono
versions:
  - hono@4.5.11
showTitle: 【Hono】完善：参数校验+响应标准化
---
<br />

上一章我们完成了基于`Hono`的web项目的搭建工作，并实现了路由分组，错误处理等逻辑。

这一章来继续完善项目，让它变的健壮起来💪。

## 参数校验

平时我们写前端的时候，最希望后端把校验做的越全越好，提示信息越详细越友好越好，那现在就轮到我们自己实现后端了。

`hono` 官方比较推荐的是`zod`作为校验库，并提供了`@hono/zod-validator`，封装了一下中间件，让我们可以直接放在请求路径后面用。

并且官方并不推荐路由第二个参数再写个 handler 封装，然后再传进来

这种写法在其他node框架中十分常见，如Koa、Nest

```typescript
// 🙁
// A RoR-like Controller
const booksList = (c: Context) => {
  return c.json('list books')
}

app.get('/books', booksList)
```

下面是官方推荐的写法

```typescript
// 😃
app.get('/books/:id', (c) => {
  const id = c.req.param('id') // Can infer the path param
  return c.json(`get ${id}`)
})
```

上述写法的原因和类型有关，如果不写复杂的泛型，就无法在Controller中推断出路径参数。

**这样也好，在业务真正复杂前来之前，保持程序的简洁。**

回到参数校验部分，`@hono/zod-validator`使用比较简单，就是在路由第二个参数插入这个中间件

```typescript
import { zValidator } from '@hono/zod-validator'

const route = app.post(
  '/posts',
  zValidator(
    'form',
    z.object({
      body: z.string(),
    })
  ),
  (c) => {
    const validated = c.req.valid('form')
    // ... use your validated data
  }
)
```

如果需要多个验证器

```typescript
app.post(
  '/posts/:id',
  validator('param', ...),
  validator('query', ...),
  validator('json', ...),
  (c) => {
    //...
  }
```

加入校验后，来使用 apifox 测试一下，可以看到 zod 返回如下的校验结果

```json
{
    "success": false,
    "error": {
        "issues": [
            {
                "code": "invalid_type",
                "expected": "number",
                "received": "undefined",
                "path": [
                    "page"
                ],
                "message": "Required"
            },
            {
                "code": "invalid_type",
                "expected": "number",
                "received": "undefined",
                "path": [
                    "size"
                ],
                "message": "Required"
            }
        ],
        "name": "ZodError"
    },
    "_error": {
        "issues": [
            {
                "code": "invalid_type",
                "expected": "number",
                "received": "undefined",
                "path": [
                    "page"
                ],
                "message": "Required"
            },
            {
                "code": "invalid_type",
                "expected": "number",
                "received": "undefined",
                "path": [
                    "size"
                ],
                "message": "Required"
            }
        ],
        "name": "ZodError"
    }
}
```

可以看到返回了详细的校验信息，但美中不足的就是这个中间件**会以自己的结构直接返回**给前端，这显然不合理，我们要的是标准化的返回。

所以这个中间件还可以**传入第三个参数作为回调**，然后自己手动抛出错误

```typescript
zValidator(source, schema, (result, c: Context) => {
    if (!result.success) {
      const errMsg = result.error.errors.map((e: any) => `field:${e.path[0]} - ${e.message}`).join(', ')
      throw new HTTPException(400, { message: errMsg })
    }
  })
```

抛出错误后我们在 `errorHandler` 中就可以接收到错误信息了，再经过处理一下，返回固定的格式（此处代码只是演示）

```typescript
export const errorHandler = async (err: Error, c: Context) => {
  // 错误处理
  const errorMsg = "出错了"
  if (err instanceof HTTPException) {
     return err.getResponse()
  }
  const response = {
    code: 50001,
    data: null,
    message: errorMsg,
  };
  return c.json(response, status)
}
```

现在`errorHandler` 已经处理了好几种错误：**jwt、zod、系统错误**等等

我们总不能每次想起一种错误来，就来这个写个 `if else` 处理一下，所以我们可以定义一组通用的 `errorCode`和`errorMsg` map结构，并且让每个抛出错误的**中间件把相关信息写入到上下文中**，**由于上下文仅在当前的请求链路有效**，所以也不用担心污染。

在上下文中传递信息

```typescript
app.use(async (c, next) => {
  c.set('message', 'Hono is cool!!')
  await next()
})

app.get('/', (c) => {
  const message = c.get('message')
  return c.text(`The message is "${message}"`)
})
```

在errorHandler中就可以这样接受错误信息

```typescript
export const errorHandler = async (err: Error, c: Context) => {
  // 错误处理
  // 任何请求， http status 返回200， 错误码在返回体自定义
  const status = 200;
  // TODO 记录原始的错误， 返回给前端的是友好的信息
  // 从上下文拿错误码, 优先取自定义的msg => 错误码对应信息  => 未知错误
  let errorCode = c.get('errCode')
  if (!errorCode) {
    // 抛出了HTTPException， 视为权限不错
    if (err instanceof HTTPException) {
      errorCode = ErrorCode.UNAUTHORIZED
    }
  }
  let errorMsg = c.get('errMsg') || ErrorCodeMsg[errorCode] || ErrorCodeMsg[ErrorCode.UNKOWN_ERROR]

  const response = {
    code: errorCode || ErrorCode.UNKOWN_ERROR,
    data: null,
    message: errorMsg,
  };
  return c.json(response, status)
}
```

这样每个抛出错误的中间价，可以写入详细的错误信息，而一组自定义的 `errorcode` 也可以应付更多的业务场景，如果增加了一个场景，我们\*\*只需要去map结构中再加一组key-value，\*\*如果没有自定义错误信息，则使用 `code` 对应的默认 `msg` 进行返回。

抛出错误时，自定义错误信息。 这一块可以进行一个封装，因为每个接口都要写这么一大串，明显不合理，所以**提取到公共的文件夹下面去**。

```typescript
// 封装自定义的zvalidator
export const zvalidator = (source: any, schema: any) => {
  return zValidator(source, schema, (result, c: Context) => {
    if (!result.success) {
      const errMsg = result.error.errors.map((e: any) => `field:${e.path[0]} - ${e.message}`).join(', ')
      c.set('errMsg', errMsg)
      c.set('errCode', ErrorCode.VALIDATION_ERROR)
      throw new HTTPException(400, { message: errMsg })
    }
  })
};
```

## 响应标准化

完成了参数的校验，并顺着问题一步步封装了关于错误信息的处理。接下来就开始让接口能正常的返回数据了。

然而虽然错误信息我们已经标准化，但正常的返回**不方便用中间件直接去拦截。**

原因是 `c.json` 直接就是一个 `Response`，虽然会走到我们的全局中间件里去，但没法再二次加工 `Response` 了，官方给出了一个例子，可以把 `res` 设置为`undefined`，然后重新 `new Response`

我觉得破坏性太大了，也不优雅，所以**暂时没找到**类似 `nest` 那样，在 `response` 之后拦截的钩子。

但这都是小问题，以后有看到更好的处理方式再进行优化就行，这里我们就简单的封装一下对象，塞到 c.json 中返回就好了

```typescript
export const standardRes = (data: any) => {
  return {
    code: 200,
    data,
    message: 'success'
  }
}
// case
user.post("/list", zvalidator('json', pageSchema), (c) => {
  const params = c.req.valid('json')
  // do something
  const list = userModal.getList(params)
  return c.json(standardRes(list))
})
```

有细节没优化不是什么大问题，重要的是把流程先打通

## JWT TOKEN

现在路由也分组了，错误也捕捉了，正常响应也处理了，参数也进行了校验。那就到了接口权限这一步上。

虽然你的网站可能只需要给用户展示信息，但有时也需要一个平台去写入数据，修改数据或删除数据才行。

这种敏感操作不可能让普通用户去做，一般都是管理员，甚至只有自己去操作，所以才需要一个登录操作，以便确认用户身份。

而登录操作，是为了拿到一个令牌，好让这个用户在后续的操作中畅通无阻。这里我们是用 jwt 来给用户发放令牌，jwt 的使用 hono 官方也有说明。

**具体流程就是：用户登录 - 拿到令牌 - 后续操作携带令牌 - 校验令牌是否有效 - 有效就允许用户继续操作 - 无效则返回相关错误信息 - 前端提示用户或引导进入登录页**

而我们的用户有很多个，所以一般 jwt 的 **payload 会和用户信息挂钩**，每个登录的用户通过 `sign` 拿到一个 `token`，并在后续操作中把 `token` 放在 `header` 中，接口则是在中间件中通过 `c.get('jwtPayload')`拿到令牌中包含的用户信息，去进行相关的校验。比如数据库中有无此用户，此用户的权限等级够不够等情况，如果校验不通过就 `throw new HTTPException(code)`， 并把 `errorMsg` 写入上下文 让 `errorHanlder` 去处理。校验通过则继续后续的业务逻辑。

这里我演示一个登录接口，来生成token

```typescript
user.post("/login", async (c) => {
  const user = { id: 1, name: 'zzao.club' };  // 假设这是经过验证的用户信息
  const payload = {
    id: user.id,
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 检查令牌不会过期 in 60 minutes
  }
  const token = await sign(payload, JWT_SECRET);
  console.log(`token`, token)
  return c.json(standardRes(token));
})
```

其中如果 `exp`在payload中，则jwt会检查token是否过期了，payload还可以传入其他参数：

* `nbf` : 检查token在指定时间之前没有被使用

* `iat` : 检查token没有使用未来的时间进行签发。意思是，设置一个未来时间使自己的token一直有效（I guess） （The token is checked to ensure it is not issued in the future.）

这里我只使用了`exp`设置token 60min后过期就可以了。

当然，还有一种需求。

作为一个用户，我每天都在你的网站上使用，不想隔几天登录就失效，还要重新登录。

所以我们还可以再设置 `refresh  token`，这个 `token` 专门用来更新 `access token` （也就是上边例子里的token）的有效期。比如 `refresh token` 3 天过期，`access token` 7 天过期，在 `refresh token` 过期时，前端就调用一个**刷新 token 的接口去生成一个新的**`access token` ，前端拿到新token后再在之后的请求中带上新的token即可。

**这样用户登录过一次后，只要平时在一直使用，就可以一直保持登录状态。**

下面是一个为user模块使用jwt中间件的中间件case

```typescript
import { jwt } from 'hono/jwt'

const jwtMiddware = jwt({
  secret: 'your secret!!!!',
})

user.use('/*', async (c, next) => {
  // 检查当前请求路径是否在排除列表中
  if (NoAuthPaths.includes(c.req.path)) {
    await next();
    return;
  }
  // 如果不在排除列表中，则进行JWT验证
  await jwtMiddware(c, async () => {
    const user = c.get('jwtPayload')
    // 获取payload中的user信息
    // 这些信息由登录接口提供
    if (!user) {
      c.set('errMsg', '用户未登录')
      c.set('errCode', ErrorCode.UNAUTHORIZED)
      throw new HTTPException(401)
    }

    if (user.id !== 1) {
      c.set('errMsg', '用户无权限')
      c.set('errCode', ErrorCode.PERMISSION_DENIED)
      throw new HTTPException(401)
    }

    await next()
  })

})
```

其中 `const user = c.get('jwtPayload')` 这个写法也是官方文档中的写法，也是把`jwtPayload`写入到了上下文中，然后在后续的中间件中就可以拿到这个`payload`。

每个模块的中间件处理逻辑可能相同也可能不同，后续我们再看情况， 把它抽离到根路由下或者写成一个单独的中间件，需要的模块自己去引入。

## 总结

目前对项目模块进行了分组，如：用户，商品等等。 每个模块可以写自己的`errorHandler`，也可以去设置自定义中间件。而像 `csrf` `cors`等共同的中间件则放在根路由下

针对接口能否被请求，使用了`hono/jwt`，并为了让某些接口跳过校验以及不通过时返回自定义的错误信息，又封装装了一层。

接口可以请求之后，来到参数校验的中间件`@hono/zod-validator`，由于每个接口schema可能比较多，以及为了让`errorHandler`来处理zod校验不通过的情况，又自定义了一个中间件在内部抛出错误。schema则是被提取到公共的文件夹（如`common`）下

请求成功时，使用一个`standardRes`函数简单包装一下，统一返回值。

请求失败时，在上下文中使用`c.set/get`注入错误信息，在`errorHandler`中间件中取出错误信息，并返回和成功时一致的json结构。

这样看起来就又完善了一些\~\~

**下一章为日志、数据库操作、配置文件相关逻辑**

\*\*欢迎点赞催更(¯▽¯)\*\*👍
