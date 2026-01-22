---
title: 6.Nuxt.js SSR 实战 - 标准答案
date: "2026-01-21T07:20:00.000Z"
lastmod: "2026-01-21T07:20:00.000Z"
group: "面试SKILL:答案"
---

## 题目

Nuxt.js SSR 实践：如何处理客户端/服务端差异？如何优化 SSR 性能？

---

## 标准答案

### 1. SSR vs SSG vs CSR

| 模式 | 渲染时机 | 适用场景 | 性能 |
|------|---------|---------|------|
| **SSR** | 每次请求时渲染 | 动态内容、SEO | 中 |
| **SSG** | 构建时预渲染 | 静态内容、博客 | 高 |
| **CSR** | 浏览器渲染 | 后台管理系统 | 低 |

### 2. 数据获取

```javascript
// Nuxt3 - useFetch (服务端+客户端都会执行)
const { data: posts } = await useFetch('/api/posts')

// useAsyncData (自定义异步逻辑)
const { data } = await useAsyncData('posts', () => $fetch('/api/posts'))

// 仅客户端执行
onMounted(() => {
  // 访问 window, document 等
})
```

### 3. 环境判断

```vue
<template>
  <!-- 仅客户端渲染 -->
  <ClientOnly>
    <Chart />  <!-- 依赖 window 的组件 -->
  </ClientOnly>
</template>

<script setup>
// 判断环境
if (import.meta.server) {
  // 服务端逻辑
}

if (import.meta.client) {
  // 客户端逻辑
}
</script>
```

### 4. 常见问题

**问题1：水合不匹配（Hydration Mismatch）**
```javascript
// ❌ 错误：服务端和客户端渲染结果不同
<div>{{ new Date().getTime() }}</div>  // 时间戳每次都不同

// ✅ 正确：使用 ClientOnly 或统一数据源
<ClientOnly>
  <div>{{ timestamp }}</div>
</ClientOnly>
```

**问题2：window/document 未定义**
```javascript
// ❌ 错误：服务端没有 window
const width = window.innerWidth

// ✅ 正确：判断环境或使用 ClientOnly
const width = import.meta.client ? window.innerWidth : 0
```

### 5. 性能优化

```javascript
// 1. 缓存策略
const { data } = await useFetch('/api/posts', {
  getCachedData(key) {
    return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
  }
})

// 2. 懒加载组件
const HeavyComponent = defineAsyncComponent(() =>
  import('~/components/HeavyComponent.vue')
)

// 3. 路由缓存
export default defineNuxtConfig({
  routeRules: {
    '/blog/**': { swr: 3600 },  // 1小时缓存
    '/admin/**': { ssr: false }  // 客户端渲染
  }
})
```

---

## 最佳实践

1. **合理选择渲染模式**：SEO 需求用 SSR，静态内容用 SSG
2. **处理环境差异**：用 `ClientOnly` 包裹客户端组件
3. **避免水合错误**：确保服务端和客户端渲染结果一致
4. **缓存优化**：合理使用页面缓存和 API 缓存
5. **监控性能**：使用 Lighthouse 和 WebPageTest

---

## 扩展阅读

- [Nuxt3 官方文档](https://nuxt.com/)
- [SSR 水合过程详解](https://vuejs.org/guide/scaling-up/ssr.html)
