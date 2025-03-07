# 博客站

一个基于 Nuxt、NuxtContent、PrimeVue 的博客站

## 功能

- 登录注册
- 评论
- mysql
- umami数据统计


## 安装依赖

`git clone` 克隆或下载本仓库到本地

`.nvmrc` 和 `.node-version` 中标识了node版本

安装

```bash
npm i 

pnpm i 

```

视报错信息而定:

涉及从 npm 切换到 pnpm 时，可能需要重新 `pnpm add better-sqlite3` 和 `pnpm rebuild better-sqlite3`


## 运行前配置

`content.config.ts`

```ts
// content 可以随意更改, 对应的是 queryCollection 的第一个参数
content: defineCollection({
    //  page 表示 会一对一生成路由
    type: 'page',
    source: {
      // 过滤 md 文件, 因为一个ob库里可能什么文件都有
      include: '**/*.md',
      // 过滤掉某些文件, 如没写完的 或者不想给人看的
      // book 是我的ob根目录下的一个文件夹名称 , 视情况修改
      exclude: ['**/-*.md', 'book/**/*.md'],
      // 路由前缀 /post ,因为渲染文章的vue文件位于 app/pages/post/[...slug].vue
      // 所以为了匹配这个路径要加这个路由前缀
      prefix: '/post',
      // cwd: process.env.CONTENT_FS_PATH,
      // TODO 替换为你的仓库地址
      repository: 'https://github.com/aatrooox/Blog',
      // TODO 替换为你的token
      authToken: process.env.CONTENT_REPO_TOKEN
    },
    // md文件的元信息, 根据自己的实际情况来, 这些字段会用作数据库中的表头
    schema: z.object({
      date: z.date(),
      lastmod: z.date(),
      tags: z.array(z.string()),
      versions: z.array(z.string()),
    })
  }),
```

`env`

mysql 、redis 环境，具体操作可以参考[这篇文章](https://blog.zzao.club/post/nuxt/local-init-mysql-by-docker)

redis 没有配置，默认链接 localhost 6379端口，本地同生产 （单体数据库服务，不对外开放端口）

```
DATABASE_URL=mysql://root:root@127.0.0.1:3306/blog
```
先启动 mysql、redis

## 启动项目

```bash
npm run dev
```

## 部署

想起来再写

```bash
npm run build
```
## 扩展层（Layer）(开发中)

- auth layer： 用于权限校验，登录和放行其他 layer
- admin layer: 可视化操作配置文件。【必须先继承 license layer】

## 注意

- 继承了 auth Layer 后，不再支持 `nuxi generate`