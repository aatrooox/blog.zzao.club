# 博客站

2025年01月10日16:18:15 迁移到新仓库, 历史 commit 丢弃

## 功能

- [x] 简约
- [x] 基于 `app.config.ts` 配置基本信息
- [x] 文章与本项目解耦, 不需要复制进项目里, 通过Github仓库拉取markdown文件
- [x] 配置忽略(文章)规则 
- [x] 全文检索
- [x] 按目录生成小册
- [x] tailwindcss
- [x] rss
- [x] sitemap
- [x] robots.txt
- [ ] 友链
- [ ] 非开发者友好的配置页面
- [ ] 静态化

## 安装依赖

`git clone` 克隆或下载本仓库到本地

`.nvmrc` 和 `.node-version` 中标识了node版本

安装

```bash
npm i 
```


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

复制 .env.example 文件为 .env，并填写你的 token。

其他环境变量**目前没用到**, 后续可能会用到, 会慢慢删除

## 启动项目

```bash
npm run dev
```

## 部署

想起来再写

```bash
npm run build
```
