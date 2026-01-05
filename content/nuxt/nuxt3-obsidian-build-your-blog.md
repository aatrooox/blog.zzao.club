---
title: 基于 Nuxt3 + Obsidian 搭建个人博客
date: 2024-11-06
lastmod: 2025-08-19
tags:
  - 博客
  - Nuxt
versions:
  - nuxt@3.14.0
  - nitro@2.10.2
describtion: NuxtContent 非常适合把已有的md数据源搭建为个人博客，本文介绍如何使用Obsidian来写文章，Nuxt3来自动部署个人博客
---
`Nuxt`是一个用Vue来编写的，可用来创建类型安全、高性能和生产级全栈 Web 应用程序和网站的全栈框架。后端是 `Nitro`，一个可以被单独使用的Web服务端框架。

作为一个全栈框架，不仅具备了比使用Vue开发SPA客户端**更好的开发体验**，还能享受服务端渲染带来的**SEO优化**，同时Node服务可以实现帮你实现**更多的可能性**。

之所以基于Nuxt从零搭建，一是为了选全栈，二是发现了`nuxt/content`可以读取本地的`markdown`文件，三是选的模板达不到想要的效果，四是过程可以作为写文章的素材。

## 初始化Nuxt项目


使用`nuxt/content`初始化项目，因为这个插件是博客的核心插件，所以初始化时直接装上就可以

```shell
npx nuxi@latest init content-app -t content
```

选择`npm`、`pnpm`、`yarn`作为包管理器后，会生成项目目录，下载依赖，我选了`npm`

![](https://img.zzao.club/1-img-20241106171162.png)



此时直接运行 `npm run dev` 就可以启动项目了

启动后会有如下页面：

![](https://img.zzao.club/1-img-20241106171191.png)
`app.vue`作为页面的入口文件，里面只有一个简单对的 `NuxtPage` ，作用类似于 `Vue` 中的 `RouterView` ，实际上它就是 `RouterView` 的包装。

同样的包装还有：`NuxtLink` 、`NuxtImg` 等等。 更多 [Nuxt Component](https://nuxt.com/docs/api/components/client-only)

```vue
<template>
  <div>
    <NuxtPage />
  </div>
</template>
```

它用来显示 `pages/` 下的页面

`pages/` 是Nuxt生成路由的一个约定目录，其内的文件会自动生成路由。

如 `pages/a.vue` 会生成 `/a` 路由

如果想接收url参数可以这样写： `/pages/a/[id].vue` 或 `/pages/a-[group]/[id].vue`

在文件内使用这种方式来获取参数，总之 `[xxx]` 是它的路由规则

```typescript
<script setup lang="ts">
const route = useRoute()
console.log(route.params.id, route.params.group)
</script>

```

如果想匹配改路径下的所有路由，可以这样写：`/pages/a/[...slug].vue`，此时可以再去看一下
`route.params.slug` 的值是什么。

查看更多关于 [Nuxt Pages](https://nuxt.com/docs/guide/directory-structure/pages) 👈

使用`Pages`不仅仅是简化了`Router`的配置，也是为了服务端渲染，更好的SEO。做博客的话，当然希望别人搜索某些关键字可以直接搜到自己的文章页面。而不是全部内容都在一个单页面内，由浏览器渲染。

所以自带的两个页面是怎么渲染的就清楚了。

你可以看到上面我并没有引入`useRoute`，但也可以在`vue`文件中直接使用，因为Nuxt提前做好了`自动import` 的配置，它自动导入组件、可组合项、辅助函数和 `Vue API`。

项目根目录下的  [`components/`](https://nuxt.com/docs/guide/directory-structure/components), [`composables/`](https://nuxt.com/docs/guide/directory-structure/composables) , [`utils/`](https://nuxt.com/docs/guide/directory-structure/utils) 都可以直接使用，无需手动导入。

如果你想手动导入此类API，可以使用`#imports`， 如 `import { ref, computed } from '#imports'`

如果使用了第三方的包，也想支持自动导入，可以在 `nuxt.config.ts` 中配置。

```typescript
export default defineNuxtConfig({
  imports: {
    presets: [
      {
        from: 'vue-i18n',
        imports: ['useI18n']
      }
    ]
  }
})

```

同时，`nuxt.config.ts`还可以配置 `sourcemap` ，全局css引入：`css` ，`tailwindcss` ，以及 `nuxt/content` 等等。

Nuxt的文档和Vue的类似，都非常全面，读过一遍后会对这个框架有比较清晰的了解，所以起步阶段还是**建议先读文档**。
## NuxtContent

项目搭建好了，它默认加载了两个页面，也就是两个md文件，是`/content`目录下的 `index.md` 和 `about.md` 。

这不是重点，因为我也不会在这个项目目录下管理我的文章。

[NuxtContent](https://content.nuxt.com/get-started/configuration#sources) 支持配置多种文件的来源，看一下官方的配置

```typescript
import { resolve } from "node:path";

export default defineNuxtConfig({
  content: {
    sources: {
      // overwrite default source AKA `content` directory
      content: {
        driver: 'fs',
        prefix: '/docs', // All contents inside this source will be prefixed with `/docs`
        base: resolve(__dirname, 'content')
      },
      // Additional sources
      fa: {
        prefix: '/fa', // All contents inside this source will be prefixed with `/fa`
        driver: 'fs',
        // ...driverOptions
        base: resolve(__dirname, 'content-fa') // Path for source directory
      },
      github: {
        prefix: '/blog', // Prefix for routes used to query contents
        driver: 'github', // Driver used to fetch contents (view unstorage documentation)
        repo: "<owner>/<repo>",
        branch: "main",
        dir: "content", // Directory where contents are located. It could be a subdirectory of the repository.
        // Imagine you have a blog inside your content folder. You can set this option to `content/blog` with the prefix option to `/blog` to avoid conflicts with local files.
      },
    }
  }
})

```

可以看到不仅能用`content`目录，还能用`content-fa`目录，还能用`github`拉取。

而目录下`base`配置传入的是一个文件夹路径，所以我们这里**直接写上自己经常用来写文章的一个目录绝对路径**就可以了。

在目录下所有文章的**改动会被监听**，也就是在写文章时有什么改动会实时更新在本地服务的页面上，非常方便。

我建议在一个比较高级别的目录下分出几个单独的文件夹，往博客上发的全都放在一个比如`blog`的目录下，其他可能不是文章的，就还是该咋写咋写。

`blog`下的文章，有时候也不一定都能当天写完，`nuxt/content`支持使用 `.` 和 `-` 作为文件的前缀时**忽略此文章**，不会被处理。`Obsidian`不支持使用`.`作为前缀，所以我用的`-`。

在`blog`下的文章可以随意划分文件夹，`blog`上不受影响，因为博客上的文章其实还是要根据`tag`或`category`用代码逻辑划分，和本地的文件夹没什么关系。

所以此时我的配置就是这样的：

```typescript
content: {
	sources: {
		obsidian: {
        prefix: '/obsidian', // All contents inside this source will be prefixed with `/fa`
        driver: 'fs',
        // ...driverOptions
        base: `/xxx/xxx/notion/blog` // Path for source directory
      },
	}
}
```

要想正常的使用本地文件，还需要做一些改动。

之前在Obsidian写东西，文件都是中文名，而content在处理中文名时会自动忽略，`我搜了下各种issue` 其他语言也存在这种问题。好在content处理前后分别给了一个钩子函数，不然这博客直接夭折了

在这里写一个处理函数 `/server/plugins/content.ts` （没有的目录要手动新建）

```typescript
// @ts-ignore
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('content:file:beforeParse', (file: { body: string }) => {
    // 匹配markdown文件内的元信息
    const match = file.body.match(/---\n([\s\S]+?)\n---\n([\s\S]*)/);
    if (match) {
      let frontMatter = match[1];
      const mainContent = match[2];
      // 如果不包含_path字段, 则使用title字段和一个前缀来生成_path
      if (!frontMatter.includes('_path:')) {
        // 提取 title 字段的值
        const titleMatch = frontMatter.match(/title:\s*(.+)/);
        if (titleMatch && titleMatch.length > 1) {
            const titleValue = titleMatch[1].trim();
            const pathValue = `/post/${titleValue}`;
            // 将 _path 插入到 front-matter 中
            frontMatter = `_path: ${pathValue}\n` + frontMatter;
        } else {
          return;
        }
    }
    // 重新组合文件内容
    const newContent = `---\n${frontMatter}\n---\n${mainContent}`;
    file.body = newContent;
    }
    // 如果页面内没有 _path 属性, 则自动添加为 /blog/ + 文件名
    
  });
})
```

在`content`拿到本地文件后，会编译一遍，然后放在 `.nuxt` 缓存，其处理后的文件内容，带有一个 `_path` 属性，这个属性就是页面上对应的文章的地址。

前面说中文地址会丢掉，也是这个`_path`出了问题，因为它默认是自己根据文件名生成的。

所以这里处理逻辑就是，处理原始内容前，给原始内容加上一个`_path`。当原始内容里带了`_path`，它就会优先用设置好的，不自动生成。

**所以你如果愿意手动给自己的每个md文件都手动加上一个`_path`的话，也可以不用这个钩子。**

以前还要注意一个问题：`const pathValue = /post` 这行代码，相当于写死了每篇文章的前缀是 `/post` 。

所以说 `pages/` 下必须要有这样的结构 `/pages/post/[...slug].vue` 。

**如果你想更改前缀，请手动同步更新这两处**

这样，我们无需在项目中增加文章目录，就实现了从本地直接拉取文章文件。

用`Obsidian`的小伙伴，可以用`Linter`这个插件格式化`YAML属性` ，如`date`、`lastmod`、`title`，这三个是自动生成而且都是必用的。`tags`、`category` 会用作分类和筛选。

![](https://img.zzao.club/1-img-20241106181119.png)

那文章有了，在哪里点进去呢？

`content` 提供了 `queryContent` 来查询内容， 你可以这样来查询：

```typescript
const contentQuery = queryContent('post')
// 总文章数 去除了被忽略的文章
const count = await queryContent('post').count()

const contentQuery2 = queryContent('post')
// 按时间倒序以及分页后的数据
const pages await contentQuery2.sort({ date: -1 }).skip(skip).limit(pageSize.value).find()

```

`skip` `limit` `sort` 用这几个就能完成大部分操作，同时还支持 `where` 过滤内容，实现更多的分类查询功能。

关于`queryContent`的[更多API](https://content.nuxt.com/composables/query-content)👈

到这里，基于本地文件有了，也没破坏本地的写作流程，各种分类、搜索功能有了，作为一个最简博客已经五脏俱全。

后续我会继续分享我自己的博客建设过程。

最后一步就是发布到服务器
## 打包和部署

如果此时你没有初始化git，可以先初始化一下。

然后我要先说一个Nuxt和其他Node服务的不同点：

**它打包后的文件内已经包含了`node_modules`** ，也就是说打包后的output文件就是它的完全体，不需要再 `npm install` 。

而博客的文章，是本地某个目录下写的，用的别的软件如`Obsidian` 来管理。

这样就有三个问题：

1️⃣：打包要在本地打。因为博客文件在本地，其实也是在`.nuxt`内，但我们也不会把`.nuxt` 传到git上去。所以只能在本地打完了再传上去。

2️⃣：要修改`.gitignore`。这里要去掉两个 一个是 `node_modules` 一个是 `dist`。

我前期因为只去了 `node_modules` 落下了 `dist`，还让我一度怀疑是Nuxt的重大bug。因为我在服务器配了`gitea`的`action`，git push上去时，**需要把output整个都扔上去**。

而扔上去之后因为某些`node_module`插件少了dist目录，会导致有些导出引用不到，我在排查pm2日志时懒得cat整个errlog，直接用的`pm2 logs Blog --lines 30`，恰好没发现dist丢了的问题。

然后还去github不停的搜问题，还真被我搜出一些 `vite` 和 `nuxt` 的早期bug，误以为现在还存在。于是就用重新`npm install`的方式暂时解决了问题。

直到我近几天才发现报错路径上有个dist，然后猛然想起 `.gitignore`里忽略里dist。我滴个老天爷。

3️⃣：要配个软件来写`markdown`。如果已经有了还好，但是可能有人用的`vscode`之类的东西来写md，我不确定方不方便管理 `front matter`。

有了以上几点，基本就是本地写文章，写完跑一下`build`，然后push上去就完成部署了

是不是还挺丝滑的？比项目内管理MD文件要舒服很多吧

## 结语

以上就是用`Nuxt`搭建一个可以集成本地文件的博客的最简起手流程了

其中我也是踩了不少的坑，这里分享给大家！

后续关于个人博客的建设也会一直更新，欢迎关注～～

有任何问题也欢迎私信交流

👏👏

