---
title: 【Hono】Bun竟然能这么快？搭配HonoJS的入门指南
date: 2025-02-10
lastmod: 2025-04-02
showTitle: 【Hono】Bun竟然能这么快？搭配HonoJS的入门指南
tags: ["Hono"]

---
<br />

![1.00](https://img.zzao.club/article/202411191444086.png)

最近我用bun+hono搭建了一个web服务，并尝试用docker打包部署。

在没有缓存的情况下，`docker build` **打包仅用了30s**，如果是项目修改后再重新打包，更是**连5s都用不了**。

而这个小服务虽然只是刚起步，但已经具备了**日志、响应和错误标准化返回、数据库连接（sqlite）、路由分组、环境变量配置、jwt鉴权**这几项，可以说当成个人的小玩具已经够格了。

## Bun和Node到底是什么关系

> Bun is an all-in-one JavaScript runtime & toolkit designed for speed, complete with a
> bundler, test runner, and Node.js-compatible package manager.

Bun 是一款专为提高速度而设计的一体化 JavaScript **运行时**和**工具包**，配有捆绑器、测试运行器和与 Node.js 兼容的包管理器。

Node.js 是一个免费、开源、跨平台的 JavaScript **运行时**环境。

通过他们官方的一句话介绍，可以清晰的看到，他们都是为了**让JavaScript脱离浏览器**环境而创造的一个运行时环境。只不过Node使用`C艹`编写，而Bun使用`Zig`。Node基于`V8引擎`(Goggle Chrome)，而Bun使用`JavaScriptCore`(Apple Safari)

以前我们用JavaScript都是和html配合写前端代码，写完后需要打开浏览器才能看到效果，而有了其他的运行时环境后，就可以像其他Python/Go语言一样直接在命令行执行JavaScript脚本，所以其功能也从操作Dom变为了操作系统级Api，如：文件IO、数据库等等。

在只有Node一家独大的时候，我们甚至可以在（某些）面试官问：「你会什么后端语言」的时候，说：「我会NodeJS」,而现在有了`Deno`和`Bun`，我岂不是会了三门后端语言？（🤫bushi

截止到当前，Node已经发布到了`22.8.0`，庞大的开源module支撑起了整个社群的，而他的官方包管理器`npm`有点让人一言难尽

![1.00](https://img.zzao.club/article/202411191444087.png)

于是又出现了`yarn`、`pnpm`，**老外写这些东西可能真的是在解决需求，到了咱这边真的也就是给面试官多提供了一些出题思路。** 而Bun本身就自带包管理器。

另外，现在要想写一个“时髦的”前端项目，还必须有一个打包器，因为在不同的运行环境中，不同的浏览器中，对JavaScript的支持标准大不相同，所以需要把新版本的JavaScript降级，或者把TypeScript转换为JavaScript。或者是把JavaScript文件大小进行压缩。

而Node生态下光打包器就有：Webpack、Rollup、Vite等等，更不要说Rust开始被大厂卷起来之后，又用Rust对以前打包速度、运行速度有上限的打包器进行重构。**面试官的出题角度还在增加**。
而Bun本身也是一个打包器。

另外还有测试运行器..  ` Vitest/Jest`

所以现在可以明白，在2022年才发布的Bun究竟是想要做什么了

## Hono简介

Hono🔥是一个基于 Web 标准构建的小型、简单且超快的 Web 框架。可以运行在所有JavaScript运行时，当然也包括了`Bun`，所以作为尝鲜，就图个鲜上加鲜。

**在使用任何框架前，我都习惯先通读一遍官方文档**，这大概会花费我2-4小时的时候。

在读完一遍官方文档后，如果使用过其他框架完成过类似的项目，就会大概知道这个框架哪些是自带的，哪些需要借助第三方。

如果框架本身过于精简（比如Koa），你就不得不去研究一些官方插件或是第三方插件，或者说去拜读一些开源项目，或者去找一些快速启动模板，以便自己快速上手。

Hono则是在文档里提供了很多官方的插件（Helper），无需翻看其他文档就能实现功能

## 搭建项目

按照官方文档开始搭建，因为我这里使用的是Bun，所以需要先下载好Bun

Macos/Linux

```shell
curl -fsSL https://bun.sh/install | bash
```

然后创建项目

```shell
bun create hono@latest my-app
```

创建项目后会有一个入口`index.ts`，在Bun中TS是一等公民，无需进行编译就能直接运行，所以速度非常快。

然后我们需要添加一些常用的中间件，如`cors`、`csrf`，然后给自己配置一下喜欢的端口号

```typescript
import { Hono } from 'hono'
import { showRoutes } from 'hono/dev'
import { cors } from 'hono/cors'
import { csrf } from 'hono/csrf'

const app = new Hono()
// 统一的前缀
const api = app.basePath('/api')

// 预防csrf攻击
api.use(csrf())
// 所有接口设置cors， 也可以分别设置cors， 如user相关接口只允许指定ip访问
api.use('*', cors())

app.get('/', (c) => { return c.text('Hello Hono!') })
app.post('/', (c) => c.text('POST /')) 
app.put('/', (c) => c.text('PUT /')) 
app.delete('/', (c) => c.text('DELETE /'))

// 每个实例的err要自己监听
// api.onError(errorHandler)

// verbose 会显示详情信息， 如： 是否使用了中间件
// showRoutes(api, { verbose: false })

export default {
  port: Bun.env.PORT,
  fetch: app.fetch,
}
```

这样就完成了一个简单的服务，可以打开`localhost:port`，看一下是否返回了`Hello Hono`!

设置统一的前缀可以用`basePath`，设置环境变量可以在`.env` 、`.env.development`、`.env.production` 中配置（在bun的官方文档中），并使用`Bun.env.XXXX`读取。

## User模块路由

只有一个接口，我们可以写在`index.ts`里，那如果有一堆接口呢，肯定要进行分组的

Hono中路由分组也比较简单，只要再用一次`new Hono()`

```typescript

// user模块
const user = new Hono()

user.get('/list', (c) => c.text('List users')) // GET /user
user.get('/:id', (c) => {
  // GET /user/:id
  const id = c.req.param('id')
  return c.text('Get user: ' + id)
})
user.post('/', (c) => c.text('Create user')) // POST /user

// indext.ts
const app = new Hono()

// 使用user路由组
app.route('/user', user)
```

所以，要想给路由分组，只需要在src下再新建一个user文件夹，里面实现user的路由，在从`index.ts`里使用`app.route('/user', user)`就可以了。

由于我们使用了`basePath`，所以此时的user接口为`/api/user/list` 、`/api/user/:id`

我们在使用公司后端接口或者其他网站的开放接口接口时，经常会看到这样的结构`/api/v1/user/a/b/c`

在Hono中可以这样实现

```typescript
user.get('/list', (c) => c.text('我是 user/list'))
v1.route('/user', user)
app.route('/v1', v1)

export default app
```

它会这样响应

```
GET /api/v1/user/list ---> `我是 user/list`
```

注意，如果上述代码中，route注册的顺序出错，则不会正常响应

## 错误捕捉

当发生一些致命错误时，为了不让服务挂掉，我们需要catch住，并且返回给前端一些友好的提示。不然我们那些年骂过的xx后端就变成了自己。

在Hono中使用也很简单，不需要自己单独写个中间件

```typescript
import { HTTPException } from 'hono/http-exception'

// ...

app.onError((err, c) => {
  // 任何请求， http status 返回200， 错误码在返回体自定义
  const status = 200;
  // 记录原始的错误， 返回给前端的是友好的信息
  // TODO Logger
  const errorCode = 40001
  const errorMsg = '不是我的错，想想前端的问题！'
  if (err instanceof HTTPException) {
    errorCode = ErrorCode.UNAUTHORIZED
  }

  const response = {
    code: errorCode,
    data: null,
    message: errorMsg,
  };
  return c.json(response, status)
})
```

这样，在后端有任何错误的时候，我们都会以http status 200的状态码返回，并且可以在返回体中定义好固定的结果，并且返回出一个自定义的`errorCode`，外加一个友好的前端能看得懂的`errorMsg`

随着项目的复杂度增加，可以把这个handler单独拆分出去，已达到精简入口文件的目的。

比如新建一个`common` 文件夹，里面写一个`errorHandler.ts`，在`index.ts`中或者在user模块`src/user/index.ts`中，都可以分别使用`app.onError()` 和  `user.onError()`具体处理通用的或者是自定义的错误处理逻辑！

## 总结

这篇文章是一个入门篇，主要目的是讲述一下Node和Bun的区别，以及使用Bun+Hono的一个入门项目。

路由分组、错误捕捉这些功能很简单的就可以实现了，因为篇幅原因，我就把其他功能拆分成多篇教程了。后续教程会涉及：数据库、响应标准化、日志、jwt鉴权、docker/docker-compose打包部署等等，是一个完整闭环的小项目，代码也会开源分享出来，感兴趣的可以关注起来\~

欢迎点赞催更👍
