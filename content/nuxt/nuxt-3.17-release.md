---
title: Nuxt 3.17 发布，对比3.16有一个重大改变
date: 2025-06-24 16:04:08
lastmod: 2025-08-15 22:56:19
tags: ["Nuxt"]

---
今天逛 `Github` ，发现 `Nuxt` 又发新版了： `3.17.0`
## 更新日志
### 数据获取改进

- **数据一致性**：所有使用相同键的 `useAsyncData` 或 `useFetch` 调用现在共享底层引用，确保应用中数据状态一致。
- **响应式键**：支持使用计算引用、普通引用或 getter 函数作为键，当键值变化时会自动触发数据重新获取。
- **优化数据重新获取**：多个组件监听同一数据源时，依赖项变化只会触发一次数据获取。

### 新增内置组件
- **`<NuxtTime>`**：用于安全显示时间的组件，解决了在服务器端渲染和客户端渲染中处理日期时的水合不匹配问题，支持多种时间格式。
- **`<NuxtErrorBoundary>`**：转换为单文件组件，暴露 `error` 和 `clearError`，便于在模板中处理错误。

### 路由改进
- `<NuxtLink>` 新增 `trailingSlash` 属性，用于控制 URL 格式，添加尾部斜杠。

### 加载指示器自定义
- 新增 `hideDelay` 和 `resetDelay` 属性，用于控制加载指示器的隐藏延迟和重置延迟。

### 文档作为包
- Nuxt 文档现可作为 npm 包 `@nuxt/docs` 安装，提供构建文档网站的原始 Markdown 和 YAML 内容。

### 开发体验改进
- 新增多个警告，帮助开发者避免常见错误，例如：
  - 服务器组件缺少根元素时发出警告。
  - 使用保留的 `runtimeConfig.app` 命名空间时发出警告。
  - 核心自动导入预设被覆盖时发出警告。
  - 同一文件中多次使用 `definePageMeta` 时发出错误提示。

### 模块开发增强
- 新增 `experimental.enforceModuleCompatibility`，允许 Nuxt 在加载不兼容模块时抛出错误。
- 新增 `addComponentExports`，可自动注册文件中通过命名导出的组件。

### 性能改进
- 使用 `tinyglobby` 提升文件 glob 操作速度。
- 排除 `.data` 目录的类型检查，加快构建速度。
- 通过提升 `purgeCachedData` 检查来优化树摇优化。

### 其他改进
- 提供升级命令 `npx nuxi@latest upgrade --dedupe`，用于刷新锁文件并拉取最新依赖。
- 修复了多个问题，包括错误处理、路由解析、类型检查等。
- 文档更新，包括对自动导入、SEO 等内容的改进。
- 测试和 CI 流程的改进。

## 主要影响点

### useAsyncData、useFetch

以前写 `watch` 时，每次 `watch` 的值发生改变，回调函数会再次执行一次。

**现在不会了！**

```typescript
// In multiple components:
const { data } = useAsyncData(
  'users', 
  () => $fetch(`/api/users?page=${route.query.page}`),
  { watch: [() => route.query.page] }
)

// When route.query.page changes, only one fetch operation will occur
// All components using this key will update simultaneously
```

取而代之的是增加了一个响应式键

可以直接用 computed 作为键，里面的响应式对象发生改变时，回调函数会再次执行

```typescript
const userId = ref('123')
const { data: user } = useAsyncData(
  computed(() => `user-${userId.value}`),
  () => fetchUser(userId.value)
)

// Changing the userId will automatically trigger a new data fetch
// and clean up the old data if no other components are using it
userId.value = '456'
```

这也是对我的博客站有影响的一点。 之前文章页的几个 `tab` 切换靠的是 `watch`

不过依然没让我失望，升级之后火速发现了奇怪的bug。

**然后又从 `3.17` 退回了`3.16.2`。。。**

### 2025年05月06日09:33:34 更新

五一结束了，`nuxt` 更到了`3.17.2`，解决了客户端组件 `useAsyncData` 的问题

本地升级后，在 `useAsyncData` 里使用 `响应式key`，看起来表现正常了

---- 

之前说好的 `3.11` 是最后一个小版本，现在愣是发到了 `3.17`

虽然实际上更新的内容已经在向 `Nuxt4` 过渡，但是不知道为什么 `Nitro` 为什么不发 `3.0` (之前提到不发4.0是因为Nitro不发3.0)

