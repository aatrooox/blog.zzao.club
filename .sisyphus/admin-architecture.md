# Admin 后台管理系统架构提案

## 现状分析

- `app/pages/settings.vue`（560行）是唯一的管理界面，4个 tab（基本信息、用户设置、安全设置、开发者设置/PAT）
- 使用 `localStorage.getItem('blog/tokenInfo')` 做客户端鉴权，不安全
- 没有 `app/pages/admin/` 目录
- 没有 admin 专用 layout
- `@nuxt/ui` **未安装**，当前 UI 栈是 shadcn-nuxt + reka-ui + PrimeVue（部分，实际未使用）
- `routeRules: '/admin/**': { prerender: false }` **已配置** ✅
- 后端 superAdmin API 已完备 ✅

### 安全问题发现（Gap Analysis）

> 以下问题需在 Phase 1 优先修复

1. **settings.vue 权限检查不完整**
   - 当前: 只检查 token 存在性，不检查用户角色
   - 问题: 非 superAdmin 用户看到 superAdmin-only 表单（PUT /user/:id, POST /user/config）
   - 修复: 使用 `useUser().isSuperAdmin` 隐藏敏感 UI 控件

2. **PAT scope 验证漏洞**
   - 文件: `server/utils/token.ts` → `isPathAllowedByScope()`
   - 问题: 对未知 scope 格式默认返回 `true`（许可）
   - 修复: 改为默认拒绝（`return false`）

3. **双重用户状态系统**
   - `useUserSession()` (nuxt-auth-utils) vs `useUser()` (自定义 composable)
   - 建议: Admin 模块统一使用 `useUser()`，它已有 `isSuperAdmin` 计算属性

### API 清单遗漏（Gap Analysis）

| 遗漏项 | 说明 | 处理建议 |
|--------|------|----------|
| `GET /api/v1/user/me` | 返回当前用户信息+角色 | ✅ 已列入 A1-2，需确保返回 `role` 字段 |
| `explain` 模块 | POST/GET/DELETE /api/v1/explain/* | 如需管理，新增 A3-4: admin/explains.vue |
| FSF 模块 | /api/v1/fsf/push/* 和 pull/* | 可选：考虑是否需要管理界面 |
| OAuth 绑定管理 | GitHub 连接迁移 | 新增 A2-4: 从 settings.vue 迁移 OAuth 绑定 UI |

---

## 架构决策（已确认）

### 决策 1：UI 库策略 ✅ 已决定

**选择: 方案 A — Admin 用 @nuxt/ui v3，前台保持 shadcn-nuxt**

配置要点:
- @nuxt/ui v3 与 Tailwind CSS 4 完全兼容
- 配置 `ui: { prefix: 'U' }` 避免与 shadcn 冲突（UButton, UCard 等）
- shadcn 保持无前缀（Button, Card 用于前台）
- **需先做兼容性验证分支**（A1-0）

附注: PrimeVue 包已安装但代码中未使用，可在 Phase 1 清理（A1-0.5）

### 决策 2：鉴权方案 ✅ 已决定

**选择: 独立登录页 `/admin/login`**

```
用户访问 /admin/**
  → admin.ts middleware 拦截
  → 检查 token（composable 缓存 or localStorage）
  → 无 token → 重定向到 /admin/login?redirect=<原路径>
  → 有 token → 调用 GET /api/v1/user/me
    → 成功且 role === 'superAdmin' → 放行
    → 失败或角色不对 → 重定向到首页 + toast 提示
```

### 决策 3：用户自助更新 ✅ 已决定

**选择: 仅 superAdmin 可修改用户资料**

- 无需新建 `PUT /api/v1/user/me` 端点
- 修复 settings.vue：对非 superAdmin 用户隐藏编辑控件
- 使用 `useUser().isSuperAdmin` 进行 UI 条件渲染

---

## 目标架构

### 目录结构

```
app/
  pages/
    admin/
      index.vue          # Dashboard 首页（统计概览）
      memos.vue          # Memo 管理（CRUD + 标签关联）
      comments.vue       # 评论管理（审核/删除）
      tags.vue           # 标签管理
      users.vue          # 用户管理
      tokens.vue         # PAT 管理（从 settings.vue 迁移）
      settings.vue       # 站点设置（从 settings.vue 迁移）
      uploads.vue        # 上传管理（可选）
  layouts/
    admin.vue            # Admin 专用 layout（侧边栏导航）
  middleware/
    admin.ts             # Admin 路由守卫
  composables/
    useAdminAuth.ts      # Admin 鉴权 composable

server/
  api/v1/
    user/
      me.get.ts          # 新建：返回当前用户信息+角色（供前端鉴权）
```

### Admin Layout 设计

```
┌─────────────────────────────────────────────┐
│  Logo / 站点名                    用户头像   │
├──────────┬──────────────────────────────────┤
│          │                                  │
│ 📊 概览   │         主内容区域                │
│ 📝 动态   │                                  │
│ 💬 评论   │                                  │
│ 🏷️ 标签   │                                  │
│ 👥 用户   │                                  │
│ 🔑 令牌   │                                  │
│ ⚙️ 设置   │                                  │
│ 📁 上传   │                                  │
│          │                                  │
├──────────┴──────────────────────────────────┤
│  v2.10.4                                    │
└─────────────────────────────────────────────┘
```

如果选方案 A（@nuxt/ui），可直接使用其 `UDashboardLayout` + `UDashboardSidebar` 组件。

### 鉴权流程

```
用户访问 /admin/**
  → admin.ts middleware 拦截
  → 检查 token 是否存在（composable 缓存 or localStorage）
  → 无 token → 重定向到登录页
  → 有 token → 调用 GET /api/v1/user/me
    → 成功且 role === 'superAdmin' → 放行
    → 失败或角色不对 → 重定向到首页
```

### 后端已有 API 清单（可直接对接）

| 管理功能 | 已有端点 | 权限 |
|---------|---------|------|
| Memo CRUD | `memo/create.post`, `memo/update.post`, `memo/del.post` | superAdmin |
| Tag CRUD | `memo/tag/create.post`, `memo/tag/update.post`, `memo/tag/delete.post` | superAdmin |
| 评论删除 | `comment/del.post`, `comment/sub/del.post` | superAdmin |
| 文件上传 | `upload/cos.post` | superAdmin |
| 用户配置 | `user/config/index.post`, `user/[id].put` | superAdmin |
| PAT 管理 | `token/generate.post`, `token/list.get`, `token/[id].delete` | 用户级 |
| 需新建 → | `user/me.get` | 已登录 |

### 从 settings.vue 迁移映射

| settings.vue 中的 Tab | 迁移目标 |
|----------------------|---------|
| 基本信息 | `admin/settings.vue` |
| 用户设置 | `admin/settings.vue` |
| 安全设置 | `admin/settings.vue` |
| 开发者设置/PAT | `admin/tokens.vue` |

迁移完成后，原 `settings.vue` 改为重定向到 `/admin/settings`。

---

## 任务清单

### Phase 1 — 基础设施

- [ ] **A1-0: @nuxt/ui 兼容性验证分支**（前置任务）
  - 新建 `feat/nuxt-ui-compat` 分支
  - 安装 @nuxt/ui v3: `pnpm add @nuxt/ui@next`
  - 配置 `nuxt.config.ts`:
    ```ts
    modules: ['@nuxt/ui', ...],
    ui: { prefix: 'U' }  // UButton, UCard, UDashboardLayout...
    ```
  - 验证: 前台页面样式无破坏，shadcn 组件正常工作
  - 验证通过后合并到 main

- [ ] **A1-0.5: 清理未使用的 PrimeVue 依赖**（可选）
  - 移除 `primevue`, `@primevue/*` 相关包（代码中未实际使用）
  - 节省 bundle 体积

- [ ] **A1-1: 安装 @nuxt/ui**（A1-0 验证通过后）
  - 正式合并兼容性分支
  - 确认 prefix 配置生效

- [ ] **A1-2: 新建 GET /api/v1/user/me 端点**
  - 文件: `server/api/v1/user/me.get.ts`
  - 返回当前登录用户信息（**必须包含 role 字段**）:
    ```ts
    { id, username, role, avatar, email, createdAt }
    ```
  - 使用 `defineStandardResponseHandler`，依赖现有 auth 中间件
  - 不加入白名单（需要 token 才能访问）

- [ ] **A1-3: 创建 admin 路由中间件**
  - 文件: `app/middleware/admin.ts`
  - 逻辑:
    1. 检查 token（从 localStorage 或 composable 缓存）
    2. 无 token → 重定向到 `/admin/login?redirect=<原路径>`
    3. 有 token → 调用 GET /api/v1/user/me
    4. role === 'superAdmin' → 放行
    5. 否则 → 重定向到 `/` + toast 提示"权限不足"

- [ ] **A1-4: 创建 useAdminAuth composable**
  - 文件: `app/composables/useAdminAuth.ts`
  - 缓存用户信息，提供 `user`, `isAdmin`, `logout` 等
  - 复用 `useUser()` 的逻辑，避免重复

- [ ] **A1-5: 创建 admin layout**
  - 文件: `app/layouts/admin.vue`
  - 侧边栏导航 + 主内容区域 + 用户信息栏
  - 使用 @nuxt/ui 的 `UDashboardLayout` + `UDashboardSidebar` 组件

- [ ] **A1-6: 创建 admin/index.vue（Dashboard 空壳）**
  - 文件: `app/pages/admin/index.vue`
  - `definePageMeta({ layout: 'admin', middleware: ['admin'] })`
  - 初始内容: 欢迎信息 + 后续接入统计数据的占位

- [ ] **A1-7: 创建 admin/login.vue（登录页）**
  - 文件: `app/pages/admin/login.vue`
  - 使用 @nuxt/ui 的表单组件
  - 登录成功后 → 重定向到 `?redirect` 参数或 `/admin`
  - 不使用 admin layout（独立页面）

- [ ] **A1-8: 修复 settings.vue UX 问题**（安全修复）
  - 对非 superAdmin 用户隐藏编辑控件
  - 使用 `useUser().isSuperAdmin` 进行条件渲染
  - 影响范围: 基本信息 tab 中的 PUT /user/:id 表单

- [ ] **A1-9: 修复 PAT scope 安全漏洞**（安全修复）
  - 文件: `server/utils/token.ts` → `isPathAllowedByScope()`
  - 修改: 对未知 scope 格式默认返回 `false`（拒绝）
  - 当前行为: 默认返回 `true`（许可）— 危险

### Phase 2 — 迁移 settings.vue

- [ ] **A2-1: 迁移站点设置到 admin/settings.vue**
  - 从 `settings.vue` 提取「基本信息」「用户设置」「安全设置」tab
  - 保留 AutoForm + zod schema 模式
  - 使用 admin layout + middleware

- [ ] **A2-2: 迁移 PAT 管理到 admin/tokens.vue**
  - 从 `settings.vue` 提取「开发者设置」tab
  - PAT 列表、生成、删除功能

- [ ] **A2-3: 原 settings.vue 改为重定向**
  - 将 `app/pages/settings.vue` 内容替换为重定向到 `/admin/settings`
  - 或保留一段时间做兼容

- [ ] **A2-4: 迁移 OAuth 绑定管理**（新增）
  - 从 `settings.vue` 提取 GitHub 连接/断开功能
  - 目标: `admin/settings.vue` 的安全设置 tab
  - 对接: 现有 OAuth 相关 API

### Phase 3 — 新增管理页面

- [ ] **A3-1: admin/memos.vue — Memo 管理**
  - 列表展示（分页）+ 创建/编辑/删除
  - 标签关联管理
  - 对接: `memo/create.post`, `memo/update.post`, `memo/del.post`

- [ ] **A3-2: admin/comments.vue — 评论管理**
  - 评论列表 + 审核/删除
  - 子评论管理
  - 对接: `comment/del.post`, `comment/sub/del.post`

- [ ] **A3-3: admin/tags.vue — 标签管理**
  - 标签 CRUD
  - 对接: `memo/tag/create.post`, `memo/tag/update.post`, `memo/tag/delete.post`

- [ ] **A3-4: admin/explains.vue — Explain 管理**（新增，可选）
  - 如需管理 explain 模块内容
  - 对接: `explain/create.post`, `explain/index.get`, `explain/[id].delete`

### Phase 4 — 增强

- [ ] **A4-1: admin/users.vue — 用户管理**
  - 用户列表、角色管理
  - 对接: `user/[id].put`
  - 需新建: `GET /api/v1/user/list`（用户列表 API）

- [ ] **A4-2: Dashboard 统计数据**
  - 文章数、评论数、用户数、访问量等
  - 可能需要新建统计 API

- [ ] **A4-3: 全局搜索（CommandPalette）**
  - 使用 @nuxt/ui 的 `UCommandPalette` 组件
  - 快速跳转到各管理页面

- [ ] **A4-4: admin/uploads.vue — 上传管理（可选）**
  - 文件列表、COS 管理
  - 对接: `upload/cos.post`

- [ ] **A4-5: 实现 revokeAllRefreshTokens**（安全增强）
  - 用户修改密码或主动登出时，吊销所有 refresh token
  - 需扩展 Redis key 结构支持按用户批量删除

---

## 关键文件速查

| 文件 | 用途 |
|------|------|
| `app/pages/settings.vue` | 当前管理界面（560行），迁移源 |
| `app/composables/useUser.ts` | 用户状态 composable，已有 `isSuperAdmin` |
| `nuxt.config.ts` 209-215行 | routeRules，`/admin/**` 已配置 prerender: false |
| `server/middleware/2.auth0.ts` | 核心鉴权中间件 |
| `server/utils/user.ts` | `assertSuperAdmin()` 函数 |
| `server/utils/token.ts` | `PAT_SCOPES` 定义，JWT 工具函数，**含安全漏洞待修复** |
| `server/utils/whiteRoutes.ts` | API 白名单路由 |
| `shared/utils/apiCodes.ts` | API 错误码定义 |
| `server/utils/handler.ts` | `defineStandardResponseHandler` |
| `package.json` | 确认 @nuxt/ui 安装状态 |
| `components.json` | shadcn-nuxt 配置（无前缀） |
| `tailwind.config.js` | Tailwind 4 配置 |

## 注意事项

- @nuxt/ui v3 基于 Tailwind CSS 4 和 Reka UI — 项目已使用 Tailwind 4 + Reka UI，**兼容性已确认** ✅
- 配置 `ui: { prefix: 'U' }` 使 @nuxt/ui 组件使用 U 前缀，与 shadcn 共存
- settings.vue 中的 AutoForm 组件来自 shadcn，迁移到 admin 时可保留使用
- 后端 API 已全部受 superAdmin 保护，前端 middleware 是额外的 UX 层，不是安全层
- PrimeVue 依赖可安全移除（代码中未使用）

---

## 变更日志

### 2025-02-10 Gap Analysis 更新

**架构决策确认**:
- UI 库: 方案 A（@nuxt/ui v3 for Admin，配置 prefix: 'U'）
- 登录策略: 独立登录页 `/admin/login`
- 用户更新: 仅 superAdmin 可改（无需新建 /user/me PUT）

**安全问题发现**:
- A1-8: settings.vue 需隐藏非 superAdmin 用户的编辑控件
- A1-9: PAT scope 验证需改为默认拒绝

**API 遗漏补充**:
- A1-2: /user/me 必须返回 role 字段
- A2-4: OAuth 绑定管理迁移
- A3-4: explain 模块管理页面（可选）
- A4-1: 需新建 GET /user/list API
- A4-5: revokeAllRefreshTokens 安全增强

**任务新增**:
- A1-0: @nuxt/ui 兼容性验证分支（前置任务）
- A1-0.5: 清理 PrimeVue 依赖
- A1-7: admin/login.vue 登录页
