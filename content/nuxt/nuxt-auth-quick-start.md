---
title: Nuxt4 中使用 NuxtAuth 实现 Github 登录
date: 2025-02-21
lastmod: 2025-08-19
tags:
  - Nuxt
description: NuxtAuth 使用指南，快速实现Github登录
---

大家都知道 `Next` 有个 `NextAuth` 非常好用，其实 `Nuxt` 也有配套的 `Auth Module`

而且 `NuxtAuth` 还依赖于 `NextAuth`，这为 `Nuxt` 生态提供了非常多可靠性和便利性。

`NextAuth` 里能用的，在 `NuxtAuth` 里同样支持

并且还针对Nuxt 提供了特定功能，比如登录、注销、身份验证中间件和插件等

使用 NuxtAuth 时需要注意，它包装了  `next-auth@4.21.1` ，因为更高的版本中更改了包导出。

所以使用时，安装指定版本就可以了。

这里我先以 **Github登录** 为例演示其用法

_本系列在博客站上会持续更新，直到覆盖NuxtAuth的所有用法_
## 初始化和安装依赖

我在一个 `layer` 中演示其使用方法，因为这部分功能相对独立，使用的地方继承就行。

[新建](https://nuxt.new/)项目

```shell
npx nuxi init -t layer zz-auth-layer
```

然后来到项目根目录下，安装依赖

注：这里有两种 `Provider` 可选，一个是 `authjs(next-auth)` ，一个是 `local` ，所谓 `local` 就是你已经自己写好了一套登录逻辑，他可以帮你接管一下。

```shell
pnpm exec nuxi module add sidebase-auth
// 因为我们使用github登录，所以要安装这个包
pnpm add next-auth@4.21.1
```

给此项目开启 `Nuxt4` 的特性，`Nuxt4` 的目录结构更合理，更适合拓展。

```typescript
export default defineNuxtConfig({
	future: {
	    compatibilityVersion: 4
	},
})
```

然后把根目录下的内容改造成 v4 的结构

```shell
.
├── .editorconfig
├── .env
├── .gitignore
├── .npmignore
├── .npmrc
├── .nuxtrc
├── README.md
├── app
│   ├── app.config.ts
│   ├── app.vue
│   └── components
│       └── AuthView.vue
├── nuxt.config.ts
├── package.json
├── pnpm-lock.yaml
├── server
│   ├── api
│   │   └── auth
│   └── tsconfig.json
└── tsconfig.json
```

组件 `AuthView` 里什么也没有，随便写点东西就行

## 配置 NuxtAuth

然后再把刚才安装的 `nuxt-auth` 配置一下。这里的配置内容，来源于[官方文档](https://auth.sidebase.io/guide/application-side/configuration)。

```typescript
export default defineNuxtConfig({
	future: {
	    compatibilityVersion: 4
	},
	auth: {
	    isEnabled: true,
	    disableServerSideAuth: false,
	    originEnvKey: 'NUXT_AUTH_ORIGIN',
	    // baseURL: 'http://localhost:3000/api/auth',
	    provider: {
	      type: 'authjs',
	      trustHost: false,
	      defaultProvider: 'github',
	      addDefaultCallbackUrl: true,
	    },
	    sessionRefresh: {
	      enablePeriodically: 1000 * 60 * 5, // 5 分钟刷新一次
	      enableOnWindowFocus: true,
	    }
	},
})
```

如果你此时是按照官方文档一步步的来的，那这里的 `provider` 就是后面配上的

然后在 `app.config.ts` 里增加一些信息

```typescript
export default defineAppConfig({
  authLayer: {
    name: 'Hello from Auth layer (playground)',
    enabled: true,
  }
})

```

当这个 `auth-layer` 层被其他模块 `extend` 时，这个 `authLayer` 对象就会被合并过去

所以也可以直接在其他模块中使用 `useAppConfig().authLayer?.enabled` 来判断当前是否开启了鉴权的层

然后再来配置环境变量

刚才已经配置了一个 `originEnvKey` 为 `NUXT_AUTH_ORIGIN` ，所以需要在 .env 中增加这个环境变量

```env
NUXT_AUTH_ORIGIN=http://localhost:3000/api/auth
```

此时配置的这个路径，需要我们自己定义出来，所以先新增这个接口`server/api/auth/[...].ts`

这个接口是一个 `NuxtAuthHandler` ，是从 `NextAuthHandler` 基础上改编来的，我们需要在这个 `Handler` 中定义我们的 `Provider`，也就是 `Github`

```typescript
import GithubProvider from 'next-auth/providers/github'
import { NuxtAuthHandler } from '#auth'

export default NuxtAuthHandler({
  // A secret string you define, to ensure correct encryption
  secret: 'your-secret-here',
  providers: [
    // @ts-expect-error Use .default here for it to work during SSR.
    GithubProvider.default({
      clientId: 'your-client-id',
      clientSecret: 'your-client-secret'
    })
  ]
})
```

定义好后需要再定义一下 `secret`，以及`Github` 需要的 **id** 和 **secret**

先在 `nuxt.config.ts` 中定义 `runtimeConfig`

```typescript
runtimeConfig: {
    authSecret: 'your_secret',
    authOrigin: 'your_secret',
    githubClientId: 'your_secret',
    githubClientSecret: 'your_secret',
  }
```

`runtimeConfig` 里的 `authSecret` 会被 `.env` 里的 `NUXT_AUTH_SECRET` 所覆盖

所以我们把真实的 `authSecret` 写在 `.env` ,然后在 `git` 中忽略即可

此时已经定义好了需要的四个环境变量

```env
NUXT_AUTH_ORIGIN=http://localhost:3000/api/auth
NUXT_AUTH_SECTRET=123131231231
NUXT_GITHUB_CLIENT_ID=xxxxx
NUXT_GITHUB_CLIENT_SECRET=xxxxxx
```

但是 Github 的 id 和 secret 还需要自己去申请

先打开 Github ，登录后，点击**头像** -> Settings -> 左侧菜单拉到最下边的 **developer settings** -> **OAuth Apps** -> **New OAuth App** 

然后填写如下表单即可

![](https://img.zzao.club/article/202502241606759.png)

因为请求 `Github` 之后，`Github` 需要再跳过来，需要 `callback URL` 需要填你本地项目的一个页面地址

等待上线后，**再把此处的`OAuth App` 以及 `.env`（看部署方式而定） 里配置的本地路径改为线上路径**

注册后就会给你一个 id 和 secret ，把它写在 `.env` 里


## 在 Playground 中使用

配置好后，我们就可以使用 `NuxtAuth` 提供的 `composable` 来管理鉴权的逻辑了

为什么不在根目录下直接写，而是在 `.playground` 中写呢？

因为根目录下相当于一个独立的npm包，是要给其他项目使用的，而`.playground`就相当于是模拟了其他项目

所以在 `layer` 部分，只需要完成通用的配置、页面、接口即可，具体使用时都在 `.playground` 里操作

`playground` 里已经写好了 `extends: ['..']`，所以我们直接新建一个页面来测试一下如何使用 `Github` 登录

```typescript
const {
  status,
  data,
  lastRefreshedAt,
  getCsrfToken,
  getProviders,
  getSession,
  signIn,
  signOut
} = useAuth()
```

```vue
<button @click="signIn('github')"> 使用 Github 登录</button>
```

当点击按钮时，就会跳转到 `Github`，授权登录后就能拿到 `Github` 提供的用户信息

**在此之后的逻辑就和Github无关了**

`NuxtAuth` 会帮我们做一整套的逻辑，我们只需要拿到用户信息后，和自行注册的用户做一个关联即可

`status` 表示当前登录状态

`data` 表示当前会话中的数据，这个 `sessionData` 也可以在 `NuxtAuthHandler` 的 `callback` 中插入一些用户信息

登出时，使用 `signOut` 即可

如果是使用自己写的逻辑，也就是 `local Provider` ，还可以配置 refreshToken 的接口等等

## 部署

部署时，只需要注意一下 `.env` 文件，因为 Nuxt 打包后不会再动态读取 `.env` 

所以这些环境变量如何配置，和你使用的部署工具有关

比如你用的 `pm2`，在 `ecosystem.config.cjs`，就可以配置 `NODE_ENV`，但是我不推荐这样搞，因为如果代码要放在 `github` 上，就不要在任何一次提交中包含敏感的 `token` 

除非你的 `ecosystem.config.cjs` 不在你的项目里，而是直接写在服务器上对应的文件夹里，每次打包时只覆盖 Nuxt 的部分

如果是用 `Gitea` 来自动化部署，就在 `Gitea` 的仓库设置中配置变量

![](https://img.zzao.club/article/202502241606761.png)

正常情况只需要配置一次，因为正式环境没有需要经常改变的变量

以上就是如何使用 `Github` 的小 `Demo`

**未完待续**