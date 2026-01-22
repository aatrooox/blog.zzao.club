# AGENTS.md - AI 编码助手指南

本指南为在 Nuxt 4 博客代码库中工作的 AI 编码助手提供关键信息。

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
- 来源: GitHub 仓库 (`aatrooox/Blog`)，通过 `CONTENT_REPO_TOKEN` 访问
- 路由前缀: `/post`（在 `app/pages/post/[...slug].vue` 中渲染）
- 过滤器: `**/*.md`（包含），排除 `-*.md` 和 `book/**/*.md`
- Schema: `date`、`lastmod`、`tags[]`、`versions[]`
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
5. **错误响应**: 始终返回 HTTP 200，使用 `code` 字段供客户端处理
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

**Note**: This is a personal blog project with relaxed conventions ("娱乐性质的个人空间，可不兴学啊！"). Prioritize functionality and readability over strict adherence to every rule.
