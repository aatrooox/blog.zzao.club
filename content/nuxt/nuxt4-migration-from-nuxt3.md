---
title: Nuxt 4 迁移清单：从 Nuxt 3 升级到 Nuxt 4（最少踩坑版）
date: 2026-02-13
lastmod: 2026-02-13
tags: ["Nuxt"]
versions: ["nuxt@4.x"]
author: "阿Z"
showTitle: Nuxt 4 迁移清单：从 Nuxt 3 升级到 Nuxt 4（最少踩坑版）
---

我写这篇的出发点很简单：

> 本以为升级 Nuxt 4 就是把版本号改一下。
>
> 结果最容易翻车的，反而不是代码。

所以这篇不讲“新特性”，就给你一张**能照着做**的迁移清单。

官方升级文档在这（先收藏）：
- https://nuxt.com/docs/4.x/getting-started/upgrade

## 0. 先选迁移策略（别一上来就乱改）

我一般会把迁移分两种打法：

- **策略 A：先升级版本，让项目先跑起来**（推荐）
  - 先把 `nuxt` 升到 4.x，保证 CI / 本地能启动。
  - 然后再慢慢处理目录结构（`app/`）这些“大工程”。

- **策略 B：升级版本 + 立刻迁移到新目录结构**
  - 适合：项目刚起步、结构很干净，改动成本小。

一句话总结：

> 先跑起来。
>
> 再优雅。

## 1) 升级到 Nuxt 4

两种方式，选一种就行：

- 升级到最新稳定：

```bash
npx nuxt upgrade
```

- 或者手动指定 Nuxt 4：

```bash
pnpm add nuxt@^4.0.0
```

我会建议你先做一件很“程序员”的事：

> 先别急着改一堆配置。
>
> 第一目标是能启动。

## 2) 迁移重点 1：新目录结构（app/）

### 2.1 Nuxt 4 默认变了什么（重点看路径解析）

Nuxt 4 默认启用新的目录结构（但它有向后兼容：如果检测到你在用旧结构，会继续按旧结构跑）。官方要点我按“会影响你找不到文件”的方式翻译一下：

- 默认 `srcDir` 变成 `app/`，大部分东西从 `app/` 解析
- `serverDir` 默认变成 `<rootDir>/server`（不再跟着 `srcDir`）
- `layers/`、`modules/`、`public/` 默认按 `<rootDir>` 去找
- 如果你用了 Nuxt Content v2.13+，`content/` 也是按 `<rootDir>` 去找

### 2.2 你要迁移的话，照着这个搬（清单版）

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

3）这些保持在根目录（不要放进 `app/`）：
- `nuxt.config.ts`
- `content/`
- `layers/`
- `modules/`
- `public/`
- `server/`

4）顺手检查一下第三方配置
- tailwind / eslint / typescript 有没有写死旧目录路径（很容易被忽略）

### 2.3 我不想迁移结构行不行？

可以。

Nuxt 4 通常能自动识别旧结构。

但我想提醒你一个“看起来很无辜，其实很坑”的点：如果你自定义过 `srcDir`，那 Nuxt 4 的解析基准会让 `modules/public/server` 的解析行为跟 Nuxt 3 不一样。

这时候别硬扛，直接显式配置：
- `dir.modules`
- `dir.public`
- `serverDir`

（官方文档里也有“强制 v3 结构”的配置思路。）

## 3) 迁移重点 2：useFetch / useAsyncData 的“同 key 共享”

Nuxt 4 把数据获取层整理了一下（官方叫：Singleton Data Fetching Layer）。核心变化一句话：

> **同一个 key 的 `useAsyncData/useFetch` 会共享 data/error/status refs。**

听起来挺美好对吧？

但是它会带来两个实际迁移点。

### 3.1 同 key 但 options 不一致 → 会冲突

以前你可能在不同组件里这么写：

```ts
useAsyncData('users', () => $fetch('/api/users'), { deep: false })
useAsyncData('users', () => $fetch('/api/users'), { deep: true })
```

Nuxt 4 下会警告/不一致，因为它们共享同一份 refs。

我的建议很直接：
- **把这类“同 key + 自定义 options”的调用抽成一个 composable**
- 保证所有地方用同一份配置（不要各写各的）

### 3.2 getCachedData 行为变化

`getCachedData` 现在触发更频繁（包括 watcher / refresh），并且多了 `ctx` 参数让你判断触发原因（initial / refresh / watch…）。

如果你之前写过缓存逻辑，升级后记得按官方提示把签名改掉。

## 4) 迁移工具：Codemods（能省很多手工活）

Nuxt 官方提到可以用 Codemod 自动化一部分迁移步骤。

我自己的推荐姿势是：
- 开一个干净分支
- 跑 codemod
- review diff
- 再合到主分支

不然你会得到一个“我也不知道它改了啥，但反正能跑”的神秘提交。（我不想你这样。）

## 5) 常见症状：你以为是 bug，其实是迁移遗漏

- Dev 启动变慢 / watch 报错：很多时候与目录结构（根目录文件太多）有关
- 同 key 的请求状态互相影响：本质是 singleton 行为
- server 目录解析位置变化导致路径不对：重点检查 `serverDir` 与 `srcDir`

## 6) 最短验收清单（按这个过一遍就差不多了）

- [ ] `pnpm dev` 可以启动并打开首页
- [ ] `pnpm build` 可以通过
- [ ] 核心页面的 `useFetch/useAsyncData` 没有“同 key 不一致 options”警告
- [ ] 如果用了 content：文章都能被正确解析（frontmatter YAML 无报错）

## 参考
- Nuxt Upgrade Guide（Nuxt 4）：https://nuxt.com/docs/4.x/getting-started/upgrade
