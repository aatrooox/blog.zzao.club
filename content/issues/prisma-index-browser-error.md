---
title: nuxt + prisma 编译时报错
date: 2025-02-28
lastmod: 2025-08-19
tags:
  - issue
---
浏览器控制台报错：

```shell
Uncaught TypeError: Failed to resolve module specifier ".prisma/client/index-browser". Relative references must start with either "/", "./", or "../".
```

同时页面某些功能异常，比如的 `primevue` 的 `Button` 组件 `as="a"` 属性失效，某些点击事件也失效。

不过这是我的问题，因为我设置了 `nitro.prerender.failOnError: false`  导致我忽略了很多错误信息。直到加入了 `prisma` 之后才暴漏出来

关于这个问题，[Prisma 官方文档](https://www.prisma.io/docs/orm/more/help-and-troubleshooting/prisma-nuxt-module#resolving-typeerror-failed-to-resolve-module-specifier-prismaclientindex-browser)上有提到，但给出的不是最终解决方案

对于 pnpm 来说可以参考这个[回答](https://github.com/prisma/prisma/issues/12504#issuecomment-1827097530)

`nuxt.config.ts`

```typescript
import { createRequire } from 'module'
import { defineConfig } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
// @ts-ignore
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const { resolve } = createRequire(import.meta.url)

const prismaClient = `prisma${path.sep}client`

const prismaClientIndexBrowser = resolve('@prisma/client/index-browser').replace(`@${prismaClient}`, `.${prismaClient}`)

export default defineNuxtConfig({

vite: {
	resolve: {
      alias: {
        ".prisma/client/index-browser": path.relative(__dirname, prismaClientIndexBrowser)
      }
    }
}

})
```

对于 `npm` 来说，可以参考这个[回答](https://github.com/prisma/prisma/issues/12504#issuecomment-1285883083)，（我没试）

```typescript
export default defineNuxtConfig({

vite: {
	resolve: {
      alias: {
        ".prisma/client/index-browser": "./node_modules/.prisma/client/index-browser.js"
      }
    }
}

})
```

而这个问题，是 2022 年就存在的，今年已经是 2025 年😀


