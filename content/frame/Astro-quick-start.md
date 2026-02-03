---
title: Astro建站入门指南
description: Astro初体验
tags: ["Astro"]
category: 技术
published: 2023-12-11 00:00:00
date: 2024-02-05
lastmod: 2025-08-19
showTitle: Astro建站入门指南
---
**为什么要自己建站呢？**

我想到了几个原因：

一、快感：建站类似做产品，也是一种学习后的实践。有一种刚看了一个做面包的视频之后，马上自己动手做出来一个面包，然后竟然还不错的快感。

二、正式感：相比于投稿到各大平台，自己建站不用考虑文章的字数、内容、题材等问题，减少了一部分焦虑感，但也是正儿八经的发布到网上给别人看，比起写在自己笔记软件里的碎碎念，发出来更有正式感。

三、信念感：建了站后，相当于画了一个自己的地盘。往里面发文章，那叫充实自己。网站名称，那叫个人品牌。网站 LOGO ，那叫个人形象。网站内容，那叫个人 IP。想想就有一种无比充盈的信念感，让人忍不住就往下跟着建站了。

说起信念，正好啊，快新年了，提前给大年拜个年，祝大家新年快乐👏👏👏

## 框架选择

建站有非常多的选择，如：WordPress、Hugo、Hexo、vuepress、jekyll、halo等等，我用过其中的部分，但今天选择的是 Astro。也不要问我为什么，想选哪个选哪个。

一般建的都是博客站，用来放一些自己的文章之类的。但作为一个程序员，还是多少希望他能玩点花样，但也希望他可以开箱即用，开箱即用基本上大部分框架都能做到，但是每个框架的花样确是不同。

Astro 开创的群岛架构，可以很好的满足我的需求，在不想折腾的时候，我就找个好用的模板开箱即用。想自定义的时候，就直接现代前端框架 Vue、React 、SolidJS、Svelte都整上。

以下是群岛架构的官方解释：

```typescript
“群岛” 架构的总体思想看似简单：
在服务器上渲染 HTML 页面，并在高度动态的区域周围注入占位符或插槽 […] 
这些区域随后可以在客户端 “激活” 成为小型独立的小部件，
重用它们服务器渲染的初始 HTML。 
— Jason Miller, Preact 的创造者
```

**在 Astro 中，“岛屿”指的是页面上的任何交互式 UI 组件，知道这一点即可。

在 Astro 中，每个岛屿都是一个`.astro 文件`，有很多模板可以使用，而且官方文档支持中文，且很详细。所以这里我直接跳过了新建项目部分，可以去[官网](https://docs.astro.build/zh-cn/getting-started/ "官网")👈上了解Astro

## 模版选择

使用 Astro 需要 Node 环境支持，这一部分也需要自己去下手准备！！！

由于我们想要的是搭建起一个博客站，如果起步过于繁琐，很容易劝退，所以我们优先找一个好用的模板来快速启动，毕竟不是每个人都是开发者。

官网上列举了全部的 [Theme](https://astro.build/themes/ "Theme") 👈，大概有一两百个。我没有全部看下来，因为如果全看下来之后再选一个好看的，大概一天的摸鱼时间都不一定够，那第二天还会不会接着搞都不一定了。

于是我从免费的第一页里挑一个中意的，原则就是 ：简洁，但该有的都要有，也不能太简洁。

最后我选择了[AstroWind](https://astro.build/themes/details/astrowind/ "AstroWind")👈 这个模板。由于语法上有一些差别，再加上全英文内容，还是要花一点时间改造一下。

## 模版修改

#### 全局配置

全局相关的配置都在 `src/config.yaml` 里，分为了几个部分，还都挺有用的，挨个来看一下。

-   site：主要是用来设置你的站点名称、地址
-   metadata：SEO相关的
-   i18n： language需要改成zh
-   apps：是关于 blog 也就是文章渲染相关的，不改动也可以用，后续可以自己微调。
-   ui：主题可以切换 light or dark，主题的颜色变量也可以自己配置。直接拿来使用的话，可以不改。

#### 导航栏

跑起来项目肯定第一时间是点一点导航栏，看看都有什么内容。配置文件在`src/navigation.js` 里，

配置内容我已经改成了中文，这样看起来会比较好理解。

![](https://img.zzstudio.cn/image_tx6oa4Qrms.png)

这里的扩展下拉菜单的配置位置，会对 `src/pages/landing `产生影响，原因是landing 里的页面是通过 `src/layouts/LandingLayout.astro` 渲染出来的，这个页面打开后会有一个新的导航栏，下拉菜单作者默认取的索引为 `2 `的菜单，所以需要手动改一下

![](https://img.zzstudio.cn/image_2thqa4jFcg.png)

#### 底部Footer

底部的修改主要集中在 `src/components/widgets/Footer.astro `中，比如也许不需要很多 links，看起来像是企业的官网似的，就可以打开这个页面自己注释一下。

![](https://img.zzstudio.cn/image_YZjpteEe-v.png)

#### 文章内容

文章放在`  src/content/post  `下，一般是 md ，也支持 mdx。

md 文件中顶部会在三个横线中声明一些元信息，这些信息会在网站中用到，并渲染出来。下边是我复制的项目里的 md 文件的元信息。

```markdown
---
publishDate: 2023-07-17T00:00:00Z
author: 枣把儿
title: AstroWin123131
excerpt: While easy to get started, Astrowind is quite complex internally.  This page provides documentation on some of the more intricate parts.
image: https://images.unsplash.com/photo-1534307671554-9a6d81f4d629?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1651&q=80
category: Vue
tags:
  - astro
  - tailwind css
  - front-end
---
```

其中`publishDate`会用作排序，因为首页有一个功能，会展示最近的几篇文章，是取的这个时间。

作者会显示在文章列表和文章详情页，分类和标签也同样会显示。

#### 文章分类

在文章内使用category可以给文章分类，同时在导航栏中可以直接选择某一个分类进行展示

在 `src/navigation.js` 里可以配置导航栏，比如想配置一个页面，放全部的和 Vue 相关的文章

![](https://img.zzstudio.cn/image_uFdvBw8lR3.png)

点击此下拉选项后，就可以打开一个只有 Vue 分类的文章列表页

![](https://img.zzstudio.cn/image_sGqeY9QHVp.png)

同样的，上上图中的  `href: getPermalink('astro', 'tag')` 就是打开一个 tag 为 astro 的文章列表页。

有了分类和标签功能，这个网站承载文章基本就足够了。

#### 使用图标

这个项目的[图标库](https://icon-sets.iconify.design/tabler/ "图标库")👈，使用的是`@iconify-json/tabler`，是安装依赖时已经下载好的。

使用时可以在 `pages/index.astro`里找到一个 Icon的注释。 name 就从图标库里复制出来直接使用，class 支持 `tailwindcss` 控制大小，color 控制颜色。如：

```markdown
<Icon name="tabler:alert-square-filled" color="blue" class="text-md" />
```

如果需要其他图标库的，也可以自己加装。

#### 其他

其他配置，比如右上角的按钮、底部的版权声明等，我也都在代码中用了 `TODO注释`。

大家可以打开在源码，再借助 Vscode的TODO tree插件，快速查看所有标注点，根据自己的喜好进行修改。

![](https://img.zzstudio.cn/image_X7uMvU0Gix.png)

## 打包和部署

打包命令和其他前端项目一样

```shell
pnpm build
```

打包后会生成一个 dist 文件夹，里面是打包后的静态文件。页面被编译成了单独的 html 文件，图片文件已经被转成了 `webp` 格式。

可以扔进自己任意服务器里，也可以选择其他免费的托管服务。

比如Readme 里的 `Netlify`和 `Vercel`，或者 `Github` 本身，这部分内容就不展开讲了。

## 源码地址

[模板](https://github.com/zzdaddy/astro-onwidget-zz "模板")自取👈 源码中有部分中文标注，可以帮助你理解项目结构。

另外对模板的自定义程度有限，可以理解为本土化注释了一遍，因为再继续改造也不一定所有人都喜欢了。如果你也正在使用 Astro 建站，有困难的话可以在文末联系我。

以上就是全部内容啦👏

## 小结

本文是对 Astro 建站的一个不入门指南，相当于推荐了一下Astro，以及我自己在用的模板，目的是为了方便非前端出身的朋友快速上手。

如果对你有帮助的话，欢迎点赞和关注我～

我是枣把儿，一个正在扩充全栈知识库「早早集市」的开发者。欢迎在公众号「早早集市」找我交流～
 
