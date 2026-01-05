---
title: Nuxt3中使用prisma binaryTargets多环境配置
date: 2024-11-15
lastmod: 2025-04-09
tags:
  - 博客
  - Nuxt
versions:
  - nuxt@3.14.0
  - "@prisma/client@5.22.0"
description: Nuxt3中使用prisma binaryTargets多环境配置
---
**场景： 本地使用macos开发，服务器是Debian12，打包时需要本地打包再上传**

`schema.prisma` 配置 `binaryTargets` 字段，本地正常使用，打包后会自动区分环境

```shell
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "debian-openssl-3.0.x"]
}
```

可以看到 `generate` 时生成的目录下有俩 `.node` 二进制包，分别对应 `binaryTargets` 两个环境

另外：不要把output指定到node_modules外面，**使用默认配置即可**，这样打包后的文件里使用了 `__dirname` 导致会报错。 此条解决办法来自`github issues` ，有更好的办法，欢迎留言
 
```shell
[nuxt] [request error] [unhandled] [500] __dirname is not defined in ES module scope
```

