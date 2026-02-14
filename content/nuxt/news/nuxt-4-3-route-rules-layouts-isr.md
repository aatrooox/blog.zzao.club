---
title: Nuxt 4.3 发布：routeRules 终于能管布局了（还顺手把 ISR/SWR payload 补齐）
author: Jinx
date: 2026-02-14
lastmod: 2026-02-14
tags: ["新闻", "Nuxt"]
---

我每次看 Nuxt 的更新，都有一种感觉：

本以为只是“又一个小版本”，结果它总能塞进来几个特别顺手的小能力。

Nuxt 4.3 这次最戳我的点有三个：**routeRules 直接指定布局**、**ISR/SWR 的 payload extraction**、以及一堆“开发体验和性能”的暗改。

来源（官方）：
- Nuxt 4.3 博客：<https://nuxt.com/blog/v4-3>

## 1) routeRules 直接指定布局：更像“配置”，少一点“到处写 meta”

以前你想把 `/admin/**` 全都套一个 layout，通常是散落在页面里：`definePageMeta({ layout: 'admin' })`。

4.3 现在可以在 `nuxt.config.ts` 里集中配置：

```ts
export default defineNuxtConfig({
  routeRules: {
    '/admin/**': { appLayout: 'admin' },
    '/dashboard/**': { appLayout: 'dashboard' },
    '/auth/**': { appLayout: 'minimal' }
  }
})
```

这玩意的好处很简单：**你不需要去翻一堆页面文件，才能知道某个路由群到底用啥布局**。

另外 `setPageLayout` 也能传 layout props 了（官方原文就有例子）。

## 2) ISR/SWR 终于也能抽 payload：导航时少打点 API

官方这次明确说了：payload extraction 现在支持 **ISR / SWR / cache routeRules**。

我理解就是：
- 不只是 prerender 页面能出 `_payload.json`
- ISR/SWR 的页面也能生成/缓存 payload
- **客户端路由切换**时可以直接用缓存 payload，减少重复请求

这对“内容站 + 列表页”其实挺实用的。

## 3) 细节里的 DX：#server alias + 可拖拽错误浮层

- 新增 `#server` alias：服务端目录里 import 不再地狱级相对路径（而且还带 import protection）。
- 错误浮层可以拖动/最小化：属于那种你用一天就回不去的优化。

## 我会怎么用它（给自己留个升级 checklist）

如果你要评估 3→4 或者 4.x 小步升级，我会按这个顺序做：

1. 先看项目有没有“路径全靠 meta 管布局”的情况 → 有的话，routeRules 收一下。
2. 站点如果有 ISR/SWR → 去确认是否能让 payload 缓存命中（CDN 配置、缓存策略）。
3. 搜一下 `createError({ statusCode, statusMessage })` 这种写法 → 官方已经开始 deprecate，准备对齐 Web API 命名（`status/statusText`）。

总之，4.3 不是那种“非升不可”的大版本。

但它确实是那种——你升了会舒服一点的版本。
