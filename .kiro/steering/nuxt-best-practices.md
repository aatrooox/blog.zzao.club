# Nuxt 项目最佳实践

## 项目结构规范

### 组件组织
- 使用 `components/` 目录下的子目录来组织组件：
  - `components/common/` - 通用组件，无前缀
  - `components/ui/` - UI 组件库组件，无前缀  
  - `components/content/` - 内容相关组件，全局注册
  - 特定功能组件使用有意义的前缀

### 配置管理
- 使用 `runtimeConfig` 管理环境变量
- 敏感信息放在服务端配置中
- 公共配置使用 `public` 字段
- 开发和生产环境区分处理

## 性能优化

### 预渲染策略
```typescript
routeRules: {
  '/': { prerender: true },
  '/article': { prerender: true }, 
  '/post/**': { prerender: true },
  '/settings': { prerender: false },
}
```

### 资源优化
- 启用 Gzip 和 Brotli 压缩
- 图标客户端打包减少请求
- 开发环境启用 sourcemap，生产环境关闭

## 代码规范

### TypeScript 配置
- 继承 `.nuxt/tsconfig.json`
- 启用 `inlineSources` 和 `sourceMap` 用于调试
- 根据项目需要调整严格模式

### ESLint 配置
- 使用 `@nuxt/eslint` 模块
- 启用 stylistic 规则
- 配置适合 Vue 的规则集

## 内容管理

### Nuxt Content 配置
- 使用 Collection 定义内容结构
- 配置代码高亮主题
- 设置合适的 slugify 选项保留中文字符
- 使用 Zod schema 验证内容结构

### MDC 组件映射
```typescript
mdc: {
  components: {
    map: {
      a: 'ProseA',
      p: 'ProseP', 
      h1: 'ProseH1',
      // ... 其他组件映射
    }
  }
}
```

## 开发工具

### 包管理
- 优先使用 pnpm
- 配置 `.npmrc` 和 `pnpm-workspace.yaml`
- 使用 `.nvmrc` 和 `.node-version` 锁定 Node 版本

### Git 工作流
- 配置 Husky pre-commit hooks
- 使用 changelogen 自动化版本发布
- 区分 patch/minor/major 版本发布

## 部署配置

### Nitro 配置
- 配置错误处理器
- 启用 OpenAPI 文档生成
- 设置存储驱动（Redis 等）
- 配置预渲染路由

### 环境变量
- 开发环境使用 `.env` 文件
- 生产环境根据平台设置环境变量
- 不要在代码中硬编码敏感信息