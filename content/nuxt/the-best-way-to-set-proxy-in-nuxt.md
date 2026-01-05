---
title: Nuxt 中设置代理的正确姿势
date: 2025-03-20
lastmod: 2025-08-19
tags:
  - Nuxt
---
通常在一个前端项目中，后端接口可能不是和前端 `Nuxt` 集成在一起的（`Nitro`)

而前端**从浏览器发出**请求时又会遇到跨域问题，为了解决浏览器跨域问题

除了能直接设置代理服务器的`CORS`，就需要用代理服务器转发的方式解决

代理的原理很简单：**把当前域下的前端往目标服务发送请求，改为向当前域下的代理服务器发送请求**，代理服务器直接转发前端请求到目标服务并把 `response` 返回给前端

这样，同一个域下不会产生跨域，而服务端之间的请求又不存在跨域问题，就解决了问题。

在 `Nuxt` 中有四种方式可以设置代理，而最后一种则是**终极解决方案**
## 一、Vite sever proxy

在 `nuxt.config.ts` 可以设置 `vite` 配置，就和 Vue3项目一样

```typescript
vite : {
	server: {
      proxy: {
        '/api/v1': {
          target: 'http://localhost:5770',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/v1/, '')
        }
      }
    }
}
```

此时项目内请求 `/api/v1/user/list` 时，会被转发到 `http://localhost:5770/user/list`

`/api/v1` 在此处被重写了，所以实际请求到 5770 时是不携带这个前缀的

使用 `vite server` 代理时，和 `Vue3` 项目一样，**仅对本地开发时有效**，适合项目**部署**到时和**实际后端服务的服务器、域名、端口一致**的情况下使用
## 二、Nitro devProxy

在 `nuxt.config.ts` 可以设置 `nitro.devProxy` 进行代理

```typescript
 nitro: {
	devProxy: {
      '/api/v1': {
        target: 'http://localhost:5770',
        changeOrigin: true
      },
      '/api/v2': 'http://localhost:5771'
    }
 }
```

这样可以借助 `Nitro` **在开发时**进行代理 ，原理和 `Vite server` 没有区别

这个选项使用 [unjs/httpxy](https://github.com/unjs/httpxy) 实现，可以在[官方文档](https://nitro.build/config#devproxy)查看

以上两种方式，在使用 `useFetch` 可以通过开启 `server` 选项来测试是否在 `SSR` 下生效。
## 三、Nitro routeRules proxy

比起 `devProxy` ，`routeRules` 配置是更好的选择

```typescript
nitro: {
	routeRules: {
      '/api/v1/**': {
        proxy: 'http://localhost:5770/api/v1/**'
      }
    },
}
```

既可以在客户端请求时生效， 也可以在 SSR 期间生效

唯一的问题是在**运行时**设置环境变量不太方便

因为就算把 proxy 换成环境变量里的值

```typescript
proxy: process.env.YOUR_SEVER_URL
```

也只会在**构建时**生效，这个值会被硬编码进应用中。

和直接写在proxy里唯一的区别是：你可以在不同的服务器中构建，再针对不同的构建环境设置不同的环境变量

所以，`Nuxt` 中如何在**运行时**读取环境变量？`runtimeConfig` !

代理只是一个 `node` 服务，我们当然也可以使用  `Nitro` 自己实现代理行为
## 四、Nitro proxtRequest()

在 `Nuxt` 中，`runtimeConfig` 是个比较特殊的配置

`Nuxt` 不在生产环境（运行时）中读取  `env` 文件，只在开发、构建、生成（generate）时读取（因为不同部署环境的兼容性，比如无服务器平台、cloudflare workers 等）

所以才有了 `runtimeConfig` 这个配置，用于在**运行时读取特定的环境变量**。

不同的平台有不同的环境变量设置方式， 在 `Nuxt` 中通过读取 `NUXT_` 前缀的环境变量来和 `runtimeConfig` 里的 `key` 对应起来

比如：

```typescript
runtimeConfig: {
    proxyUrl: 'http://localhost:5770',
},
```

在运行时，使用 `useRuntimeConfig` 读取 `proxyUrl` 时，会优先去读 `NUXT_PROXY_URL` 这个环境变量，如果没取到就会使用当前字符串

所以如果要切换服务，只需要在对应的部署环境中修改 `NUXT_PROXY_URL` 即可，无需再重新构建

理解了这一点，接下来就是借助 `Nitro` 来实现代理行为。

首先需要在 `server` 目录下的新建 `api/[...].ts`，然后实现以下内容：

```typescript
import { joinURL } from 'ufo'
export default defineEventHandler(async (event) => {
  const proxyUrl = useRuntimeConfig().proxyUrl
  
  const targetApiPrefix = event.path.replace('xxx', '') 
  const targetUrl = joinURL(proxyUrl, targetApiPrefix)

  return proxyRequest(event, targetUrl)
})
```

思路和配置代理的思路是一样的，因为核心部分 `proxyRequest` 已经实现了

我们要做的就是：

1. 拿到实际的服务地址。通过 `runtimeConfig` 可以拿到任意动态的地址
2. 根据前缀和实际服务地址对应起来。类似配置时的 `/api/v1: 'http://localhost:5770'` 和 `pathRewrite`
3. proxyRequest

其中第二条对应的就是 `targetApiPrefix` 的逻辑，假设 `Nuxt` 应用发出的请求是`/api/imgx/xxxx` ，对应 `imgx` 服务中的 `/api/v1/xxxx`

则这样实现：

```typescript
const targetApiPrefix = event.path.replace(/^\/api\/imgx\//, '/api/v1') 
```

此时在 Nuxt 中发出请求是这样的

```typescript
$fetch('/api/imgx/img/001/001/哈哈哈')
```

Nitro 转发时就会变成 `http://localhost:5770/api/v1/img/001/001/哈哈哈`

由于这个接口我们拥有完全的可控性，所以能做的不只是**代理**

在**隐藏了实际请求地址**的同时

还能通过proxyRequest的第三个参数传入 `{ headers: { Authorization: 'your token'} }`向目标服务添加身份验证信息

如果拥有**多个后端服务**，还可以自己选择转发到何处，达到类似负载均衡的作用

如果想对请求到的数据做进一步处理，又**何必纠结于代理**？

只需要自己使用 `$fetch` 请求明确的地址 `targetUrl`，然后对拿到的数据进行处理，再返回给前端即可！

_注意：借助 `Nitro` 实现代理，前提就是你得有 `Nitro` ，如果 `Nuxt` 完全**静态化**了，就无法动态读取环境变量了 _
## 总结

以上就是 `Nuxt` 中设置代理的四种方式

其中第一种和 `Vue3` 项目没有区别，是基于本地服务实现

如果你**只需要在本地开发时使用代理**来解决跨域问题，**在生产环境中没有这个问题**，那你可以选择**前两种**

如果你的**代理地址比较固定**，也没有很多不同环境的后端服务可用，那你可以选择第三种 `Nitro routeRules proxy` , 只需要配置，即可实现这个简单的需求

如果你的环境比较多，或是需要调用的服务也比较多，或是有很多特殊需求需要实现，那我推荐你使用**第四种**终极方案

当然，这只是基于 `Nuxt` 中的实现，利用 `Nginx` 也能轻松实现代理，可以根据自己的实际情况来抉择

希望对你有所帮助~




