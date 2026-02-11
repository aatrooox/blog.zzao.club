# AGENTS.md - AI 编码助手指南

本指南为 AI 编码助手提供项目背景、业务目标和技术规范，使 AI 能在理解「为什么」的基础上编写更有效的代码。

## 项目定位与愿景

本项目是站长 Aatrox（GitHub: `aatrooox`）的**个人 IP 具象化平台**。所有知识产出、付费产品和内容都在此发布。

- **域名**: `zzao.club`（主站）、`img.zzao.club`（图床）
- **当前版本**: 2.10.4，从 v0.x 持续迭代至今
- **项目性质**: 全栈单体应用，不是微服务，这是**有意为之**（详见「架构决策记录」）

## 双核心业务

### 核心一: 博客内容平台

生产文章 → SEO 优化 → 获取自然流量 → Google Ads 收入。

- 内容来源: 本地 `content/` 目录中的 Markdown 文件 → Nuxt Content 自动渲染
- 内容页面: `/article`（文章列表）、`/post/**`（文章详情）、`/memo`（动态/短内容）
- SEO 基础设施:
  - 百度站长、Bing Webmaster 验证
  - `sitemap.xml`、`feed.xml`（RSS）、`robots.txt`
  - 网站数据统计工具待接入（Umami 已因 NextJS 安全漏洞弃用）
- 未来方向: 接入支付系统（产品页面已存在: `/product`、`/product/zotepad`）

### 核心二: API 服务中枢

完整的 MySQL + Redis + NitroJS 后端，具备完整的账户和鉴权机制。

- **为什么重要**: 当站长启动新项目/实验时，不需要新建 Node 服务，直接在本项目集成，通过 PAT 授权给外部项目
- **外部项目认证**: 通过 PAT（Personal Access Token）+ 范围权限（scope）控制 API 访问
- 已接入的外部服务:
  - 微信公众号: `/api/v1/wx/`（素材上传、创建草稿）
  - 飞书 Webhook: 消息推送通知
  - Umami 数据代理: `/api/v1/fsf/pull/umami/`（已弃用，路由文件仍存在）
  - FSF 推送: `/api/v1/fsf/push/`（向外部服务发送消息）

## 角色分工

| 角色 | 负责人 | 职责范围 |
|------|--------|---------|
| **架构师** | 站长（Aatrox） | 所有架构决策、需求定义、系统设计、技术选型 |
| **实现者** | AI 编码助手 | 编写代码、实现功能、修复 Bug、遵循既有模式 |

**AI 行为准则**:
- 不要自行做架构级决策（如拆分服务、更换认证模型、切换数据库），先问
- 应该主动建议既有架构内的改进（更好的错误处理、性能优化、代码质量提升）
- 有疑问时优先查看已有代码的实现模式，保持一致性

**AI 语言辅助**:
- 你的回答应该始终为**中文**，直到用户要求使用英文。
- 当用户使用中文、中英混合或英文发送消息时，AI 应在回复开头提供美式英文翻译版本
- 翻译应简洁明了，并附带极简的语法提示（如有必要）
- 目标: 帮助用户碎片化学习英文词汇并纠正语法错误
- 格式示例:
  ```
  **Translation**: "[American English translation]"
  *Grammar note: [Brief correction if needed]*
  ```

## 架构决策记录

### 为什么是单体？
这是**刻意选择**，不是技术债。作为个人 IP 平台，所有产品、内容、服务应当共存。好处: 共享认证系统、单次部署、统一数据库、低维护成本。**不要建议拆分为微服务。**

### 为什么 API 版本化？
`/api/v1/` 前缀允许未来进行破坏性变更而不影响已授权的外部 PAT 消费者。

### API 错误响应规范
所有 API 响应都使用标准化格式（`{ code, message, data, timestamp }`），同时返回**语义化的 HTTP 状态码**（如 400 表示参数错误，401 表示未授权，500 表示服务器错误）。客户端应同时检查 HTTP 状态码和响应体中的 `code` 字段。

### 为什么用 Redis？
Token 刷新存储 + 速率限制。目前不作为通用缓存使用。

## 开发优先级指南

1. **SEO > 花哨功能** — SEO 驱动自然流量，流量带来收入。在花哨功能和 SEO 改进之间，优先选 SEO。
2. **稳定性 > 新功能** — 外部项目依赖 API 中枢，破坏性变更会影响下游服务。
3. **可读性 > 严格规范** — 个人项目，约定宽松。代码应可读且功能完备，不必教条化。
4. **快速迭代 > 完美设计** — 先发布，再优化。项目处于活跃迭代中。

## 外部集成模式

外部项目通过 PAT 令牌认证，接入本项目的 API 服务:

1. 外部项目生成 PAT（通过 `/api/v1/token/generate`），选择所需权限范围
2. PAT 令牌通过 `Authorization: Bearer pat_xxx` 请求 API
3. 中间件 `2.auth0.ts` 验证 PAT 并通过 `isPathAllowedByScope()` 检查路径权限

**可用权限范围**（定义在 `server/utils/token.ts` 的 `PAT_SCOPES`）:

| Scope | 标签 | 允许路径 |
|-------|------|---------|
| `all` | 全部权限 | `/api/v1/` |
| `wx` | 微信接口 | `/api/v1/wx/` |
| `memo` | 动态管理 | `/api/v1/memo/` |
| `comment` | 评论管理 | `/api/v1/comment/` |
| `upload` | 文件上传 | `/api/v1/upload/` |
| `user` | 用户信息 | `/api/v1/user/` |

**FSF（Forward Service Framework）模式**:
- `/api/v1/fsf/push/` — 向外部服务推送（如飞书 Webhook）
- `/api/v1/fsf/pull/` — 代理拉取外部服务数据（如曾用于 Umami 统计，现已弃用）
- 新增外部集成时，评估是否需要注册新的 PAT scope

## 技术栈

- **前端**: Nuxt 4.0.3, Vue 3, Nuxt Content 3.6.3, Pinia, VueUse, shadcn-nuxt, Tailwind CSS 4.x (Vite 插件)
- **后端**: Nitro (Nuxt 服务器), MySQL + Drizzle ORM, Redis (token/限流)
- **核心库**: PrimeVue 组件, reka-ui, zod 校验, bcrypt, jsonwebtoken, dayjs
- **包管理器**: pnpm 10.11.0
- **Node 版本**: 20+ (见 `.nvmrc` 和 `.node-version`)

## 构建/检查/测试命令

### 开发
```bash
pnpm dev              # 在 4775 端口启动开发服务器
pnpm dev -p <PORT>    # 在自定义端口启动
```

### 构建与生产
```bash
pnpm build            # 生产构建
pnpm preview          # 预览生产构建
```

### 代码检查
```bash
pnpm lint             # 运行 ESLint
pnpm lint:fix         # 自动修复 ESLint 问题
```

### 数据库操作
```bash
pnpm db:generate      # 生成 Drizzle 迁移
pnpm db:migrate       # 运行迁移
pnpm db:push          # 直接推送 schema（无迁移文件）
pnpm db:studio        # 打开 Drizzle Studio
pnpm db:drop          # 删除 schema
```

### 发布管理
```bash
pnpm release:patch    # 升级补丁版本 (1.0.0 -> 1.0.1)
pnpm release:minor    # 升级次版本 (1.0.0 -> 1.1.0)
pnpm release:major    # 升级主版本 (1.0.0 -> 2.0.0)
pnpm publish:post     # 快速提交+推送内容更新
```

### 运行单个测试
本项目当前未配置测试套件。未来添加测试时，在此记录测试命令。

## 代码风格指南

### ESLint 配置
- 使用 `@antfu/eslint-config` 并包含 Vue 无障碍检查
- 自动格式化已启用 CSS、HTML（markdown 已禁用）
- 忽略: `app/components/ui/**`, `**/*.md`, `lib/**`
- 特殊规则:
  - `ts/no-explicit-any`: OFF（允许使用 any）
  - `no-console`: OFF（允许 console.log）
  - `antfu/top-level-function`: OFF
  - Vue a11y 规则大部分已禁用以保持灵活性

### 导入约定
- Vue、Nuxt 和 composables 启用自动导入
- 外部库使用显式导入
- 服务器工具从 `server/utils` 自动导入
- 导入顺序: Node 内置模块 → 外部包 → 内部别名 → 相对导入

### 格式化
- **格式化工具**: ESLint（不是 Prettier）
- **缩进**: 2 空格
- **行长度**: 无严格限制，但要保持可读性
- **引号**: 优先单引号
- **分号**: 非必需（遵循 ESLint 规则）

### TypeScript 指南
- tsconfig 中 `strict: false`（宽松模式）
- `noImplicitAny: false`（允许 any 类型）
- 不要求显式返回类型
- 使用 zod schemas 进行运行时校验

### 命名约定
- **组件**: PascalCase（如 `AppTopNav.vue`、`UserAvatar.vue`）
- **组件前缀**:
  - `App*` - 通用布局/导航组件
  - `Prose*` - MDC/markdown 渲染组件
  - `Memo*` - Memo 相关组件
  - `Animate*` - 动画组件
  - `VB*` - vue-bits 组件（使用 `pathPrefix: false` 导入）
- **Composables**: camelCase，带 `use` 前缀（如 `useMemos`、`useUserSession`）
- **API 路由**: RESTful 结构，位于 `server/api/v1/` 下
- **变量**: camelCase
- **常量**: UPPER_SNAKE_CASE（如 `API_CODES`）
- **数据库表**: snake_case，带 `blog_` 前缀（如 `blog_user`、`blog_memo`）
- **数据库字段**: schema 中使用 camelCase，数据库中使用 snake_case

### 文件组织结构
```
app/
  ├── pages/           # 路由页面
  ├── layouts/         # 布局组件
  ├── components/
  │   ├── common/      # 共享组件（无前缀）
  │   ├── ui/          # shadcn 组件（无前缀）
  │   ├── animate/     # 动画组件（Animate 前缀）
  │   ├── memo/        # Memo 组件（Memo 前缀）
  │   ├── vue-bits/    # 第三方 vue-bits（VB 前缀）
  │   ├── content/     # 全局 MDC 覆盖
  │   └── mdc/         # MDC prose 组件
  ├── assets/css/      # 全局 CSS（Tailwind 入口）
  └── composables/     # Composables
server/
  ├── api/v1/          # API 端点（版本化）
  ├── middleware/      # 服务器中间件（按数字顺序）
  ├── utils/           # 服务器工具（自动导入）
  ├── routes/          # 特殊路由（sitemap、RSS）
  ├── plugins/         # 服务器插件
  └── tasks/           # 定时任务
lib/drizzle/          # 数据库 schema 和迁移
shared/utils/         # 共享常量（apiCodes）
content/              # Markdown 内容（或 GitHub 源）
```

### Vue 组件风格
- 使用 `<script setup>` 语法
- Props: `defineProps<{ propName: Type }>()`
- Emits: `defineEmits<{ eventName: [payload: Type] }>()`
- 保持模板逻辑最小化；提取到 composables/computed
- 在有益的地方使用 TypeScript 进行类型安全

### 错误处理

#### API 响应
所有 API 端点返回标准化响应:
```ts
{
  code: number,        // 来自 API_CODES (shared/utils/apiCodes.ts)
  message: string,
  data: any | null,
  timestamp: number
}
```

#### API 错误码
- `0` - 成功
- `1001-1999` - 认证错误 (NO_TOKEN, TOKEN_EXPIRED, TOKEN_INVALID, AUTH_FAILED)
- `2001-2999` - 权限错误 (PERMISSION_DENIED, FORBIDDEN)
- `3001-3999` - 业务逻辑错误 (VALIDATION_ERROR, RESOURCE_NOT_FOUND, DUPLICATE_ERROR)
- `9001-9999` - 系统错误 (INTERNAL_ERROR, NETWORK_ERROR)

#### 创建 API 端点
1. 使用 `defineStandardResponseHandler` 包装器
2. 使用 `useSafeValidatedBody/Query` + zod schema 校验输入
3. 使用 `createError()` 抛出错误，并包含来自 `API_CODES` 的 `data.code`
4. 返回原始数据（处理器自动包装为标准格式）

示例:
```ts
export const schema = z.object({ username: z.string() })

export default defineStandardResponseHandler(async (event) => {
  const body = await useSafeValidatedBody(event, schema)
  
  if (!body.success) {
    throw createError({
      statusCode: 400,
      data: {
        code: API_CODES.VALIDATION_ERROR,
        message: '参数验证失败',
        data: body.error,
      },
    })
  }
  
  // ... 业务逻辑
  return { result: 'data' }  // 处理器自动包装
})
```

## 认证与授权

### Token 系统
- **JWT Access Token**: 15 分钟有效期，全部权限
- **Refresh Token**: 7 天有效期，存储在 Redis
- **PAT (Personal Access Token)**: 范围权限 (wx/memo/comment/upload/user/all)

### 中间件链
1. `1.token.ts` - 提取 Bearer token 到 `event.context.token`
2. `2.auth0.ts` - 验证 JWT/PAT，注入 `context.userId` 和 `context.scope`
3. `3.rateLimit.ts` - 基于 Redis 的按路径/用户/IP 限流

### 路由保护
- `/api/v1/**` 路由默认受保护
- 白名单: 在 `server/utils/whiteRoutes.ts` 中定义 + `/api/v1/auth/refresh`
- 无 token 的 GET 请求 = 访客访问（允许）
- 非 GET 请求需要有效 token
- PAT 范围验证通过 `isPathAllowedByScope()`

### 用户角色
- `superAdmin` - 完全访问权限（首个注册用户自动成为 superAdmin）
- `user` - 普通用户
- 在 `server/utils/user.ts` 中使用 `assertSuperAdmin()` 检查角色

## 数据库架构

### 核心表 (lib/drizzle/schema.ts)
- `blog_user` - 用户（UUID 主键，bcrypt 密码）
- `blog_user_config` - 用户偏好设置
- `blog_access_token` - 个人访问令牌（哈希存储）
- `blog_oauth` - OAuth 提供商链接（GitHub）
- `blog_comment` / `blog_sub_comment` - 评论系统
- `blog_like` - 点赞（文章、评论、备忘录）
- `blog_memos` - 备忘录/帖子（带图片）
- `blog_memo_tag` / `blog_memo_tag_relations` - 备忘录标签

### 数据库访问
- 使用 `lib/drizzle` 中的 `db`（在 server 中自动导入）
- 优先使用 Drizzle relations 而非手动 join
- 主键: 通过 `crypto.randomUUID()` 生成 UUID
- 时间戳: `datetime` 类型，默认值为 `CURRENT_TIMESTAMP`

## 内容管理

### Nuxt Content 配置
- 来源: 本地 `content/` 目录中的 Markdown 文件
- 路由前缀: `/post`（在 `app/pages/post/[...slug].vue` 中渲染）
- 过滤器: `**/*.md`（包含），排除 `-*.md`、`book/**/*.md`、`news/**/*.*`、`Excalidraw/**/*.*`
- Schema: `date`、`showTitle`、`lastmod`、`tags[]`、`group`、`versions[]`、`rawbody`
- 自定义 MDC 组件映射在 `nuxt.config.ts -> mdc.components.map` 中

### 语法高亮
- 主题: `one-dark-pro`（亮色和暗色）
- 支持的语言: ts, js, vue, json, yml, yaml, sql, shell

## 部署

### 生产环境设置
- **端口**: 4571 (PM2 通过 `pm2.config.json`)
- **金丝雀**: 4572 (PM2 通过 `pm2.canary.json`)
- **环境变量**: 通过 `pm2.preload.cjs` 加载 `/root/envs/blog/.env`
- **部署**: GitHub Actions 在 `main` 分支上监听 `chore(release)` 提交
- **构建**: `pnpm build` → `.output` 目录
- **预渲染**: `/`、`/article`、`/post/**`（静态），`/settings`、`/admin/**`（动态）

### 必需的环境变量
```env
DATABASE_URL=mysql://user:pass@host:3306/blog
NUXT_SESSION_PASSWORD=<32-char-random-string>
NUXT_JWT_SECRET=<random-string>
REDIS_HOST=127.0.0.1  # 可选，默认为 localhost
REDIS_PORT=6379        # 可选，默认为 6379
CONTENT_REPO_TOKEN=    # 如果使用 GitHub 内容源
```

## 最佳实践

1. **API 中间件**: 所有 `/api/v1/**` 路由经过 token → auth → rate limit 中间件
2. **密码安全**: 首次登录时自动从明文升级到 bcrypt（见 `user/login.post.ts`）
3. **首个用户**: 自动成为 `superAdmin`
4. **Token 轮换**: Refresh 端点同时轮换 access 和 refresh token
5. **错误响应**: 返回语义化 HTTP 状态码（400/401/500 等）并使用标准响应体（含 `code` 字段）供客户端处理
6. **范围验证**: PAT token 受范围限制（检查 `isPathAllowedByScope`）
7. **速率限制**: 上传端点有基于 Redis 的限制
8. **Drizzle Relations**: 优先使用 relations 而非手动 join，查询更简洁

## 常见任务

### 添加新 API 端点
1. 在 `server/api/v1/<feature>/<action>.<method>.ts` 中创建文件
2. 使用 `defineStandardResponseHandler` 包装处理器
3. 定义 zod schema 进行校验
4. 使用 `useSafeValidatedBody/Query` 进行输入校验
5. 返回原始数据（自动包装）
6. 如果是公开端点，更新 `whiteRoutes.ts` 中的白名单
7. 如需要，添加到 PAT scope

### 添加新页面
1. 在 `app/pages/` 中创建 `.vue` 文件
2. 如需预渲染，更新 `nuxt.config.ts` 中的路由规则
3. 添加到 `routeRules`（prerender: true/false）

### 修改数据库 Schema
1. 编辑 `lib/drizzle/schema.ts`
2. 运行 `pnpm db:generate` 创建迁移
3. 运行 `pnpm db:migrate` 或 `pnpm db:push`
4. 提交迁移文件

---

AI 助手应该理解业务目标（SEO → 流量 → 收入），在此基础上做出更好的技术决策。
