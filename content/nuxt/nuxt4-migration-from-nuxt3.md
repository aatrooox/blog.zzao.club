---
title: Nuxt 4 迁移清单：从 Nuxt 3 升级到 Nuxt 4（最少踩坑版）
date: 2026-02-13
lastmod: 2026-02-13
tags: ["Nuxt"]
versions: ["nuxt@4.x"]
showTitle: Nuxt 4 迁移清单：从 Nuxt 3 升级到 Nuxt 4（最少踩坑版）
---

> 目标读者：已经有 Nuxt 3 项目、准备升级 Nuxt 4 的开发者。
> 
> 这篇不是“新特性介绍”，而是“迁移时按清单做就能跑起来”的最短路径。

## 0. 迁移策略（先选一条路）

你升级 Nuxt 4 时，最容易翻车的不是语法，而是**结构/约定变了**。

建议按项目复杂度选策略：

- **策略 A：先升级版本，再慢慢迁移结构**（推荐）
  - 先把 `nuxt` 升到 4.x，让 CI / 本地能跑。
  - 结构迁移（`app/`）可以后做，因为 Nuxt 4 有向后兼容检测。

- **策略 B：升级版本 + 立刻迁移到新目录结构**
  - 适合：项目刚起步、目录还不复杂。

官方 Upgrade Guide（Nuxt 4）在这里：
- https://nuxt.com/docs/4.x/getting-started/upgrade

## 1) 升级到 Nuxt 4

两种方式：

- 升级到最新稳定：

```bash
npx nuxt upgrade
```

- 或者手动指定 Nuxt 4：

```bash
pnpm add nuxt@^4.0.0
```

> 先别急着改一堆配置：第一目标是**能启动**。

## 2) 迁移重点 1：新目录结构（app/）

### 2.1 Nuxt 4 的默认变化
Nuxt 4 默认启用新的目录结构（但有向后兼容：如果 Nuxt 检测你在用旧结构，会继续按旧结构跑）。官方要点：

- 默认 `srcDir` 变为 `app/`，多数内容从 `app/` 解析
- `serverDir` 默认变为 `<rootDir>/server`（而不是 `<srcDir>/server`）
- `layers/`、`modules/`、`public/` 相对于 `<rootDir>` 解析
- 使用 Nuxt Content v2.13+ 时，`content/` 相对于 `<rootDir>` 解析

### 2.2 迁移清单（照做就行）

1）创建 `app/` 目录

2）把这些目录/文件移动到 `app/` 下：
- `assets/`
- `components/`
- `composables/`
- `layouts/`
- `middleware/`
- `pages/`
- `plugins/`
- `utils/`
- `app.vue`、`error.vue`、`app.config.ts`

3）这些保持在根目录（不要放进 app/）：
- `nuxt.config.ts`
- `content/`
- `layers/`
- `modules/`
- `public/`
- `server/`

4）检查第三方配置
- tailwind / eslint / typescript 路径引用是否写死了旧目录

### 2.3 如果你不想迁移（也能跑）

Nuxt 4 通常能自动识别旧结构。

但有一个例外你要留意：如果你自定义过 `srcDir`，那 Nuxt 4 的解析基准会让 `modules/public/server` 的解析行为与 Nuxt 3 不同。

这时用配置显式覆盖即可：
- `dir.modules`
- `dir.public`
- `serverDir`

（官方文档里也给了“强制 v3 结构”的配置思路。）

## 3) 迁移重点 2：useFetch / useAsyncData 的“同 key 共享”

Nuxt 4 对数据获取层做了整理（官方称：Singleton Data Fetching Layer）。核心变化一句话：

> **同一个 key 的 `useAsyncData/useFetch` 会共享 data/error/status refs。**

这会带来两个迁移点：

### 3.1 同 key 但 options 不一致 → 会冲突

以前你可能在多个组件里写：

```ts
useAsyncData('users', () => $fetch('/api/users'), { deep: false })
useAsyncData('users', () => $fetch('/api/users'), { deep: true })
```

Nuxt 4 下这会产生警告/不一致，因为它们共享同一份 refs。

**迁移建议：**把“带自定义 options 的同 key 调用”抽成一个 composable，确保所有地方统一。

### 3.2 getCachedData 行为变化

`getCachedData` 现在触发更频繁（包括 watcher/refresh），并且多了 `ctx` 参数用于判断触发原因（initial / refresh / watch…）。

如果你之前实现过缓存逻辑，需要按官方提示调整签名。

## 4) 迁移工具：Codemods（能省很多手工活）

Nuxt 官方提到可以用 Codemod 自动化一部分迁移步骤，并提供了 Nuxt 4 迁移 recipe。

我建议的用法：
- 先在干净分支上跑一次 codemod
- 然后 review diff，再合并到主分支

## 5) 常见“你以为是 bug，实际上是迁移遗漏”的症状

- Dev 启动变慢 / watch 报错：很多时候与目录结构（根目录包含大量文件）有关
- 同 key 的数据请求状态互相影响：本质是 singleton 行为
- server 目录解析位置变化导致路径不对：检查 `serverDir` 与 `srcDir`

## 6) 最短迁移验收标准（建议你按这个过一遍）

- [ ] `pnpm dev` 可以启动并打开首页
- [ ] `pnpm build` 可以通过
- [ ] 核心页面的 `useFetch/useAsyncData` 没有“同 key 不一致 options”警告
- [ ] 如果用了 content：文章都能被正确解析（frontmatter YAML 无报错）

## 参考
- Nuxt Upgrade Guide（Nuxt 4）：https://nuxt.com/docs/4.x/getting-started/upgrade

