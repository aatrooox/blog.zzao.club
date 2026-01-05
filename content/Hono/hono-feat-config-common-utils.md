---
title: 【Hono】优化：提取配置项及公共函数
date: 2025-02-10
lastmod: 2025-02-12
tags:
  - Hono
versions:
  - hono@4.5.11
showTitle: 【Hono】优化：提取配置项及公共函数
---
# 【Hono】优化：提取配置项及公共函数
项目完成的七七八八了，代码也慢慢多了起来，有些基本的优化工作必须要做了。

不然等再加一些业务逻辑，就会变得非常臃肿，然后就又免不了被抛弃的命运。

写自己的玩具就是这样的，总是在不停的造玩具。

## 优化点1：ErrorHandler

目前的目录是这样的

```shell
.
├── Dockerfile
├── README.md
├── bun.lockb
├── bunfig.toml
├── db
│   └── zzaoclub.db
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── docker-compose.yml
├── logs
├── out
│   └── index.js
├── package.json
├── src
│   ├── common
│   ├── database
│   ├── index.ts
│   ├── salt
│   └── user
└── tsconfig.json
```

目前只关注`src`下的结构即可。

`index.ts`作为入口文件，加载了一些全局中间价，以及去挂载子路由，拦截全局的`error`。

这里能抽出去一个`errorHandler`，我把它放在`common`下。

它的功能也很简单：

1. 拦截到错误后，把**Http状态码**设置为`200`

2. 在控制台/日志文件中打印/记录请求时间+方式+url+原始错误信息

3. 在上下文中使用`c.get('errCode')`取出在某处抛出的自定义错误，然后把**自定义的错误码和错误信息或默认的错误信息**返回给前端

4. 统一返回标准如:`{ code: 40001, data: xxx, msg: '1123131' }` 

拆好后重新引入测试，然后就已经出现了下一个优化点

## 优化点2：ErrorCode

刚才拆处errorHandler后，发现会取一些默认的错误信息，以及有一套自定义的错误嘛。

所以要提前定义好一套，不然随手就写个`40001`、`40002`、`40003`，时间长了鬼知道这是什么意思。

所以再从`common`下新建一个`errorCode.ts` ，我只是举个例子，错误码和信息要自己看着来。

```typescript
export const ErrorCode = {
  PERMISSION_DENIED: 40001, // 权限问题
  VALIDATION_ERROR: 40002, // 参数问题
  UNAUTHORIZED: 40003, // 未登录
  LOGIN_EXPIRED: 40004, // 登录已过期
  NOT_FOUND: 40005, // 不存在的接口
  INTERNAL_SERVER_ERROR: 50000, // 服务器内部错误
  UNKOWN_ERROR: 50001 // 未知错误
}

export const ErrorCodeMsg = {
  [ErrorCode.PERMISSION_DENIED]: '权限问题',
  [ErrorCode.VALIDATION_ERROR]: '参数问题',
  [ErrorCode.UNAUTHORIZED]: '未登录',
  [ErrorCode.LOGIN_EXPIRED]: '登录已过期',
  [ErrorCode.NOT_FOUND]: '不存在的接口',
  [ErrorCode.INTERNAL_SERVER_ERROR]: '服务器内部错误',
  [ErrorCode.UNKOWN_ERROR]: '未知错误'
}
```

这样在某个路由抛出错误时，应该是这样的

```typescript
 c.set('errCode', ErrorCode.UNAUTHORIZED)
```

然后接下来再去看看已有逻辑里，哪里需要抛出错误，把这些自定义的错误码给用上。

## 优化点3：JWT相关

刚才在替换错误码时，发现JWT和Zod的相关逻辑里需要抛出一些异常。而有了两个模块后，也会发现他们有一些重复代码。

比如`user`中的**jwt中间件**和`salt`模块中是一样的，没必要写两份，可以把jwt中间件的逻辑抽出，放在`index.ts`中，目前来看，jwt只是校验一下用户有没有登录，以及跳过一些`路由白名单`。

所以可以先把jwt逻辑抽出来，以下是一个参考

```typescript
const JWT_SECRET = Bun.env.JWT_SECRET || ''
const jwtMiddware = jwt({
  secret: JWT_SECRET,
})

salt.use('/*', async (c, next) => {
  if (NoAuthPaths.includes(c.req.path)) {
    await next();
    return;
  }
  await jwtMiddware(c, async () => {
    const user = c.get('jwtPayload')
    
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

把后面函数单独抽离出去即可，同时我在每个模块下如`src/user`、`src/salt`下再放一个`common.ts`，把路由白名单（NoAuthPaths）放进去，每个模块在使用jwt中间件时，再把这个白名单传进去。

## 优化点4：Zod相关

看到路由的参数校验那一串，就知道不得不优化一下，因为不可能每个接口直接写那么一大串schame。

抽离分两部分，一部分是validator函数，一部分是schame的定义。

先来validator，在`common`下再新建个`validator.ts`，封装一个zvalidator函数，传参就按zValidator需要什么就行，主要是为了抛出错误。

以下也只是个示例：

```typescript
import { zValidator } from "@hono/zod-validator"
import { Context, Next } from "hono"
import { ErrorCode, ErrorCodeMsg } from "./errorCode";
import { HTTPException } from "hono/http-exception";
// 自定义校验, 在校验失败时抛出异常, 由errorHanlder统一处理
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

然后再把schame抽出去，在**模块目录**下新建一个`schame.ts`，因为这块不是公共的，是每个模块每个接口都有可能不一样。就类似路由白名单也样，我也没把它放在`common`下，而是都放在了**模块目录下。**

```typescript
// 对象
export const userSchema = z.object({
  name: z.string(),
  desc: z.string().optional().default(''),
  desc2: z.string().default(''),
})

// 列表
export const usersSchema = z.array(userSchema)

// 修改
export const sauceUpdateSchema = userSchema.extend({
  id: z.string().min(1)
})
```

我目前用的语法就这几个，一个普通对象，一个数据对象，一个继承方法用来抽离一些公共的schame。

抽出一部分逻辑后，目录现在是这样的，清晰了很多，目前除了要完善具体逻辑，应该没有目录上的改动了

```shell
.
├── Dockerfile
├── README.md
├── bun.lockb
├── bunfig.toml
├── db
│   └── zzaoclub.db
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── docker-compose.yml
├── logs
├── out
│   └── index.js
├── package.json
├── src
│   ├── common
│   │   ├── errorCode.ts
│   │   ├── logger.ts
│   │   ├── responseFormatter.ts
│   │   └── validator.ts
│   ├── database
│   │   └── sqlite.ts
│   ├── index.ts
│   ├── salt
│   │   ├── config.ts
│   │   ├── crud.ts
│   │   ├── index.ts
│   │   ├── readme.md
│   │   └── schema.ts
│   └── user
│       ├── crud.ts
│       ├── index.ts
│       └── schema.ts
└── tsconfig.json
```

## 优化点5： Env

在开发项目时，可能会随手写一些变量，这些变量在开发和正式环境下是肯定不一样的，所以我要把它放在`.env`中，以便后续部署后也能正常使用。

最典型的就是`winston`，本地日志文件的路径和正式服务器上分别配置好

`.env.production`

```typescript
LOG_DIR=/usr/src/app/prod-logs
```

`.env.development`

```typescript
LOG_DIR=logs2/
```

然后在`common/logger.ts`中替换成对应的`env变量`

```typescript
const LOG_DIR = Bun.env.LOG_DIR || 'logs/';
...
transports: [
    new DailyRotateFile({
            filename: path.join(LOG_DIR, 'info-%DATE%.log'),
  ...
```

后面等开始部署时，再来验证配置是否生效。

然后`index.ts`中的`port`，也可以配置一下，开发和正式没必要一样，尤其是选择开源的话。

```typescript
export default {
  port: Bun.env.PORT,
  fetch: app.fetch,
}
```

然后就是JWT的`secret`

```typescript
const JWT_SECRET = Bun.env.JWT_SECRET || '1234567'
```

修改并替换好后，还要记得在`.gitignore`中把`.env.production`加上，就不要提交到仓库里去了。

还有日志文件，也没必要提交上去

## 总结

虽然代码没多少，但是基本的封装和目录划分还是要提前思考一下。

总体的思路就是：

一、整个项目公用的提取到`src/common`，每个模块公用的放在`src/模块/`下就近管理，不出现重复代码

二、代码中不要出现不清不楚的常量，每个常量要定义好语意化的枚举、Map等变量引入的方式使用

三、区分环境的配置进一步提取到`env`文件或其他配置中心服务

ok，就这样。 以后的问题碰到再解决即可（比如现在TS用了很多`any`）。





