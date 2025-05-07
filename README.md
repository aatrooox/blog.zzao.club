# 博客站

一个基于 [Nuxt@3.16.2](https://nuxt.com/)、[NuxtContent@3.4.0](https://content.nuxt.com/)、[shadcn/vue](https://www.shadcn-vue.com/)、[inspira-ui](https://inspira-ui.com/components) 的全栈站点

## 功能

- 登录注册(用户名+密码)
- 点赞
- 评论
- mysql
- redis
- umami数据统计
- 亮暗色切换
- 一键复制HTML到公众号(保留所有样式)
- 基于Github仓库的md文件生成文章
- useFetch 最佳实践
- Sitemap
- Rss
- robots.txt
- [ ] IMGX
- [ ] Github登录

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
      // TODO 替换为你的仓库地址  不能使用组织仓库
      repository: 'https://github.com/aatrooox/Blog',
      // TODO 替换为你的token 在 github > settings > developers settings > personal access tokens 
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

mysql 、redis 环境，具体操作可以参考[这篇文章](https://zzao.club/post/nuxt/local-init-mysql-by-docker)

redis 没有配置，默认链接 localhost 6379端口，本地同生产 （单体数据库服务，不对外开放端口）

```
DATABASE_URL=mysql://root:root@127.0.0.1:3306/blog
NUXT_FEISHU_WEBHOOK=
NUXT_FEISHU_USER_ID=
```
先启动 mysql、redis

## 初始化数据库和表结构

```bash
npx prisma migrate dev
```

## 启动项目

先copy 环境变量
copy  `.env.example` to `.env`，把环境变量填上
```bash
NUXT_AUTH_SECTRET和 NUXT_JWT_SECRET 随便填
CONTENT_REPO_TOKEN 需要到 github setting > developer settings > personal access tokens 生产一个Fine-grained 精细token 只需要打开content这个权限就好
```
初始化数据库和表结构 
```bash
pnpm run prisma:migrate
```

启动
```bash
pnpm dev
```


## 部署

这里有个很简单的方法，fock项目使用vercel 来构建
```js
https://vercel.com/ 进入这个网站，开始导入项目

1. 点击导入项目
2. 选择 Git Repository
3. 选择你的项目

一共用的的命令
nuxt build
root directory
#output directory
dist
#install command
pnpm i
#输入环境变量
...

最后点击部署即可
```


想起来再写

```bash
pnpm build
```

## 发布

> 注意 0.x 版本会有不同

```bash
# 1.0.0 => 1.0.1  0.1.0 => 0.1.1
pnpm release:patch 
# 1.0.0 => 1.1.0  0.1.0 => 0.1.1
pnpm release:minor
# 1.0.0 => 2.0.0  0.1.0 => 0.2.0
pnpm release:major
```
