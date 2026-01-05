---
title: nuxt/content运行或编译时报错unhandledRejection
date: 2024-12-27
lastmod: 2025-02-28
showTitle: TAR_BAD_ARCHIVE
tags:
  - issue
---

```shell
 ERROR  [unhandledRejection] TAR_BAD_ARCHIVE: Unrecognized archive format 09:45:32
```
 
此错误出现在使用了 nuxt/content 的 repository 配置。

原因是 一般是 github 仓库拉取失败

1. 检查是否是有效的 github 仓库地址
2. 检查该仓库是否配置了 accessToken
3. 检查 accessToken 的权限中是否包含`可读仓库`
4. 自身网络是否有问题

排查时，`npm install` 有时也会报此错误，基本是因为网络问题，可以尝试挂一下代理。