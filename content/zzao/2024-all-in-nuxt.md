---
title: 2025 年，我打算 All in Nuxt
date: 2025-01-02
lastmod: 2025-08-19
showTitle: 2024-all-in-nuxt
tags:
  - Nuxt
---
最近用 Nuxt 搭建了一个博客站，把 `Obsidian` 的文章无痛搬过去，可算是收了个小尾。

展示一下成果😎

首页，展示个人信息、最近文章

![](https://img.zzao.club/article/202501021923577.png)

当然，也必须支持暗色

![](https://img.zzao.club/article/202501021923578.png)

文章页，主要是支持分类查询和分页

![](https://img.zzao.club/article/202501021923579.png)

小册，顾名思义：把文章整理成册就是小册，适合系统的整理某些资料

![](https://img.zzao.club/article/202501021923580.png)

小册内根据 Obsidian 的目录结构来展示

![](https://img.zzao.club/article/202501021923581.png)

![](https://img.zzao.club/article/202501021923582.png)

也做了移动端适配

![](https://img.zzao.club/article/202501021923583.png)

当然，审美这块儿，见仁见智....

**然后再说一下，目前关于写文章的相关工作流。**

目前使用 `Chrome` 的 lighthouse 测试，性能 `98` ，SEO `100`

数据统计使用 `Google Analytics`，手动插入 `scripts` 即可。

首先 `Obsidian` 的文章通过 `Github` 进行多端同步，插件是 `Obsidian Git`，设置定时 commit 定时 pull  定时 push。

使用 `Obsidian` 插件 `Linter` 进行格式化 YAML 信息，自动添加 标题、描述、创建时间、修改时间等。

使用 `Obsidian` 插件 `image auto upload plugin` 上传插入的图片到腾讯云 COS，上传后删除源文件，一般我的图片都是从本地复制过来的，留在仓库里也没什么用。

腾讯云对象存储设置私有读写，套 CDN 和设置个人域名+SSL证书进行访问，CDN 设置流量上限，开启防盗链等，避免被人刷太多。

写完就不用管了，自动上传到 Github，但是还没自动触发部署操作，这个后续再加吧～

有“家”了之后，新的一年就好好整理一下屋里的东西（文章）吧

**最后**

最近的所有开发都围绕 Nuxt 展开，2025 年也打算深入投入到上面。但学习和开发过程中，发现可搜到的文章、视频都非常少（主要是看核心开发人员自己发的 youtube 视频），可交流的小伙伴也不多。

所以，文章和视频部分，我准备自己发布一些。

交流场所的话，就建个交流群吧。

如果你也是 Vue / Nuxt 的使用者，想了解和使用 Nuxt ，欢迎加我好友👏。

博客地址在消息菜单里可以找到


