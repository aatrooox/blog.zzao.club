# AGENTS.md

本文件只保留 `blog.zzao.club` 这个仓库本身需要的说明。

## 仓库定位

这是一个 Nuxt 单体项目，兼顾两条主线：

1. 内容站点：文章、Memo、SEO、RSS、站点页面
2. API 中枢：用户鉴权、PAT、微信接口、上传凭证、外部集成

不要把它重构成微服务，也不要擅自改变“内容站点 + API 中枢”并存的单体结构。

## 业务优先级

默认按下面顺序取舍：

1. SEO 与内容稳定性
2. API 兼容性与鉴权安全
3. 可读性
4. 新功能

如果需求会影响现有流量入口、文章渲染、PAT 消费方或微信发布链路，优先保守处理。

## 必须保持的约束

### 1. API 仍然使用 `/api/v1/`

新增接口默认放在 `server/api/v1/`。

不要无故跳过版本前缀，也不要随意改已有路径语义。

### 2. 认证模型不要擅改

当前仓库依赖这套模型：

- JWT access token
- Refresh token
- PAT(scope)
- 中间件链：
  - `server/middleware/1.token.ts`
  - `server/middleware/2.auth0.ts`
  - `server/middleware/3.rateLimit.ts`

如果改认证逻辑，必须同时检查：

1. Bearer token 解析是否仍正常
2. JWT / PAT 校验是否仍兼容
3. PAT scope 是否仍按路径限制
4. `/api/v1/**` 默认保护规则是否被破坏

### 3. API 返回结构保持一致

API 默认返回：

```ts
{
  code: number,
  message: string,
  data: any | null,
  timestamp: number
}
```

相关基础设施：

- `server/utils/handler.ts`
- `shared/utils/apiCodes.ts`

新增 API 时优先沿用：

- `defineStandardResponseHandler`
- `useSafeValidatedBody` / `useSafeValidatedQuery`
- `createError({ statusCode, data: { code, message } })`

### 4. 内容渲染基于 Nuxt Content

文章内容来自 `content/`，展示依赖：

- `app/pages/post/[...slug].vue`
- `app/composables/usePages.ts`
- `app/components/mdc/*`
- `nuxt.config.ts`
- `content.config.ts`

如果改 Markdown / MDC 渲染，必须评估：

1. 文章详情页是否仍正常
2. RSS / sitemap 是否受影响
3. 现有 prose 组件是否被破坏

### 5. 微信与上传链路保持可用

当前仓库已有一条实际在用的发布链：

- `server/api/v1/upload/cos.post.ts`
- `server/api/v1/wx/cgi-bin/token.post.ts`
- `server/api/v1/wx/cgi-bin/material/add_material.post.ts`
- `server/api/v1/wx/cgi-bin/draft/add.post.ts`

这部分优先考虑兼容性，不要随意改请求字段、角色限制和返回格式。

## 目录职责

- `app/`
  - 前端页面、布局、组件、composables

- `content/`
  - Markdown 内容源

- `server/api/v1/`
  - 版本化 API

- `server/middleware/`
  - token、auth、rate limit 链路

- `server/utils/`
  - 鉴权、响应、PAT、分页等服务端工具

- `server/routes/`
  - feed、sitemap 等特殊路由

- `lib/drizzle/`
  - schema 与迁移

- `shared/utils/`
  - 前后端共享常量

## 可以主动做的改进

- 加强参数校验和错误信息
- 优化 SEO 相关页面或元信息
- 改进 API 兼容性与边界处理
- 提升文章渲染稳定性
- 补充文档

## 需要谨慎的改动

- 改动认证与 PAT scope 语义
- 改动 API 返回结构
- 改动 `/post/**` 渲染路径
- 改动 Nuxt Content / MDC 组件映射
- 改动微信接口和上传接口的契约
- 改动数据库 schema 且不附带迁移

这些改动都可能直接影响线上功能或下游调用方。

## 最少验证

改动后至少按影响范围验证：

### 前端 / 内容改动

- `pnpm lint`
- 相关页面能正常打开
- 文章页或内容页未破坏

### API / 鉴权改动

- `pnpm lint`
- 相关接口输入输出路径至少跑一遍
- 如果涉及 token / PAT，至少验证登录、鉴权或 scope 路径

### 数据库改动

- 更新 `lib/drizzle/schema.ts`
- 生成并提交迁移


- 不要自行做架构级决策；涉及拆分服务、更换鉴权模型、更换数据库等，先问用户
