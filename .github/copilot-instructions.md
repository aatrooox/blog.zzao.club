# Copilot 指南

- **项目定位**：站长 Aatrox（`aatrooox`）的个人 IP 具象化平台（`zzao.club`），所有知识产出、付费产品、内容都在此发布。全栈单体应用，**刻意不拆微服务**。
- **双核心业务**：(1) 博客内容平台 — 生产文章 → SEO → 自然流量 → Google Ads 收入；内容来源为本地 content/ 目录的 Markdown 文件 → Nuxt Content 自动渲染；SEO 基础设施含百度站长/Bing Webmaster/sitemap/RSS（网站数据统计工具待接入，Umami 已因 NextJS 安全漏洞弃用）。(2) API 服务中枢 — 完整 MySQL+Redis+Nitro 后端，外部项目通过 PAT scope 接入（微信公众号、飞书等）。
- **角色分工**：站长负责架构决策，AI 负责编写代码。AI 不要自行做架构级决策（拆服务、换数据库等），应主动建议架构内的改进。
- **开发优先级**：SEO > 花哨功能；稳定性 > 新功能；可读性 > 严格规范；快速迭代 > 完美设计。
- **架构决策**：单体是刻意选择；API 版本化（`/api/v1/`）为了不破坏外部 PAT 消费者；错误返回语义化 HTTP 状态码（400/401/500 等）+ 标准响应体（含 `code` 字段）；Redis 仅用于 token/限流。
- **技术栈与配置**：Nuxt 4 + Content、Pinia、VueUse、shadcn-nuxt、Nuxt Image/Icon/Color Mode、PrimeVue 部分组件、Tailwind（Vite 插件）；后端 Nitro API，MySQL 用 Drizzle ORM，Redis 负责 token/限流。关键文件：`nuxt.config.ts`、`lib/drizzle/schema.ts`、`content.config.ts`。
- **本地运行**：`docker compose -f docker-compose.local.yml up -d` 启 MySQL/Redis；按 README 示例写 `.env`（`DATABASE_URL`、`REDIS_*`、`CONTENT_REPO_TOKEN`、`NUXT_SESSION_PASSWORD`、`NUXT_JWT_SECRET`），然后 `pnpm dev -p 4775`。数据库相关：`pnpm db:migrate|push|generate|studio|drop`。
- **构建/发布**：`pnpm build` 生成产物；`pnpm release:patch|minor|major`（changelogen）触发发布，PM2 用 `pm2.config.json` + `pm2.preload.cjs`（4571）并在部署时跑 Drizzle migrate；`pm2.canary.json`（4572）可做灰度。
- **内容来源**：本地 `content/` 目录中的 Markdown 文件，Nuxt Content 自动渲染；路由前缀 `/post`，schema 含 `date/showTitle/lastmod/tags/group/versions/rawbody`，过滤器排除 `-*.md`、`book/**/*.md`、`news/**/*.*`、`Excalidraw/**/*.*`。
- **API 中间件链**：`server/middleware/1.token.ts` 抽取 Bearer token 到 `event.context.token`；`2.auth0.ts` 保护 `/api/v1/**`（白名单见 `server/utils/whiteRoutes.ts`，refresh 也放行），验证 JWT 或 PAT，注入 `context.userId/scope`，错误返回对应 HTTP 状态码（如 401）搭配 API 码；`3.rateLimit.ts` 基于 Redis 按路径/用户/IP 限流。
- **API 响应规范**：用 `defineStandardResponseHandler`（`server/utils/handler.ts`）统一 `{ code, message, data, timestamp }`，错误返回语义化 HTTP 状态码（如 400/401/500）并带 `shared/utils/apiCodes.ts` 的 code。校验用 `useSafeValidatedBody/Query` + zod，失败抛 `createError` 并写 `data.code`。
- **认证模型**：`server/utils/token.ts` 生成 JWT access（15 分）+ Redis refresh（7 天）；`server/api/v1/auth/refresh.post.ts` 轮换 refresh。PAT 支持 scope（wx/memo/comment/upload/user/all），入库存哈希；`isPathAllowedByScope` 做路径校验。默认 JWT 密钥是占位，记得设 `NUXT_JWT_SECRET`。
- **权限约定**：`server/utils/user.ts` 提供 `assertSuperAdmin` 等；多处改写/删除接口需超级管理员（memo/tag/comment 删除、上传 cos 等）。
- **数据库结构**：`lib/drizzle/schema.ts` 定义用户、token、OAuth、评论/子评/点赞、备忘录+标签等表和关系；用 Drizzle `db`，主键 UUID，优先复用 relations。
- **接口示例**：`server/api/v1/user/login.post.ts`（zod 校验、首个用户自动 superAdmin、bcrypt 升级、`generateTokenPair`）、`server/api/v1/memo/create.post.ts`（鉴权+superAdmin、插入 memo、标签关联）可作模板。
- **前端结构**：页面在 `app/pages/**`，布局 `app/layouts/**`，组件在 `app/components/{common,ui,animate,memo,vue-bits,content}`；Tailwind 入口 `app/assets/css/tailwind.css`；MDC 组件映射见 `nuxt.config.ts -> mdc.components.map`。
- **运行时配置**：`nuxt.config.ts` 的 runtimeConfig 配置公开 imgHost/ContentVersion，私有项覆盖 Feishu/COS/Nodemailer/JWT；路由规则预渲染 `/`、`/article`、`/post/**`，`/settings`、`/admin/**` 动态。
- **观测与分析**：`@nuxtjs/robots` 与 `server/routes/{feed.xml.ts,sitemap.xml.ts}` 负责 robots/sitemap；网站数据统计工具待接入。
- **代码规范**：ESLint（`@nuxt/eslint` + `@antfu/eslint-config`），常用 `pnpm lint` / `pnpm lint:fix`，未强制 Stylelint/Prettier。
- **上传/存储**：`/api/v1/upload` 有 Redis 限流；启用 COS 需 `NUXT_COS_*`。
- **Token 返回**：中间件出错返回对应 HTTP 状态码（如 401），客户端需检查状态码和响应体 `code/message`；JWT/PAT 通过 `Authorization: Bearer <token>`。
- **新增功能指引**：新 API 放 `server/api/v1/**`，默认挂中间件，包 `defineStandardResponseHandler`，用 zod 校验并返回 API 码；高风险接口调整限流，新增路径族要扩展 PAT scope。

如需补充或有新约定，请告知同步。
