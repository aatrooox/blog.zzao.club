# Admin 后台管理系统架构提案

## 现状分析

- `app/pages/settings.vue`（560行）是唯一的管理界面，4个 tab（基本信息、用户设置、安全设置、开发者设置/PAT）
- 使用 `localStorage.getItem('blog/tokenInfo')` 做客户端鉴权，不安全
- 没有 `app/pages/admin/` 目录
- 没有 admin 专用 layout
- `@nuxt/ui` **未安装**，当前 UI 栈是 shadcn-nuxt + reka-ui + PrimeVue（部分）
- `routeRules: '/admin/**': { prerender: false }` **已配置** ✅
- 后端 superAdmin API 已完备 ✅

## 待定架构决策（需站长拍板）

### 决策 1：UI 库策略

| 方案 | 优点 | 缺点 |
|------|------|------|
| **A) Admin 用 @nuxt/ui，前台保持 shadcn**（推荐） | 互不干扰；@nuxt/ui 自带 Dashboard 模板适合后台 | 两套 UI 库共存，需注意样式冲突 |
| **B) 全站迁移到 @nuxt/ui** | 统一技术栈，长期维护简单 | 工作量巨大，破坏性改动 |
| **C) Admin 也用 shadcn-nuxt** | 零新增依赖 | shadcn 没有现成 Dashboard 模板 |

**建议**: 方案 A。Admin 是内部工具，不需要和前台风格一致。

### 决策 2：鉴权方案

**当前问题**: `settings.vue` 用 localStorage 检查，纯客户端，不安全。

**建议方案**:
```
app/middleware/admin.ts（路由中间件）
  → 读取 token
  → 调用 /api/v1/user/me（需新建）验证角色
  → 非 superAdmin 重定向到首页
  → 在 composable 中缓存用户信息
```

### 决策 3：路由结构

站长确认以下页面结构是否满足需求，有无增减。

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

- [ ] **A1-1: 安装 @nuxt/ui**（如站长选方案A）
  - `pnpm add @nuxt/ui`
  - 在 `nuxt.config.ts` modules 中添加
  - 配置为仅 admin 路由加载（避免影响前台）或评估全局加载的影响

- [ ] **A1-2: 新建 GET /api/v1/user/me 端点**
  - 文件: `server/api/v1/user/me.get.ts`
  - 返回当前登录用户信息（id, username, role, avatar 等）
  - 使用 `defineStandardResponseHandler`，依赖现有 auth 中间件
  - 更新 `whiteRoutes.ts`（此端点需要 token，不应加白名单）

- [ ] **A1-3: 创建 admin 路由中间件**
  - 文件: `app/middleware/admin.ts`
  - 逻辑: 检查 token → 调用 /api/v1/user/me → 验证 superAdmin 角色
  - 非 superAdmin 重定向到 `/`

- [ ] **A1-4: 创建 useAdminAuth composable**
  - 文件: `app/composables/useAdminAuth.ts`
  - 缓存用户信息，提供 `user`, `isAdmin`, `logout` 等

- [ ] **A1-5: 创建 admin layout**
  - 文件: `app/layouts/admin.vue`
  - 侧边栏导航 + 主内容区域 + 用户信息栏
  - 使用 @nuxt/ui 的 Dashboard 组件（方案A）或 shadcn 手搭（方案C）

- [ ] **A1-6: 创建 admin/index.vue（Dashboard 空壳）**
  - 文件: `app/pages/admin/index.vue`
  - `definePageMeta({ layout: 'admin', middleware: ['admin'] })`
  - 初始内容: 欢迎信息 + 后续接入统计数据的占位

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

### Phase 4 — 增强

- [ ] **A4-1: admin/users.vue — 用户管理**
  - 用户列表、角色管理
  - 对接: `user/[id].put`

- [ ] **A4-2: Dashboard 统计数据**
  - 文章数、评论数、用户数、访问量等
  - 可能需要新建统计 API

- [ ] **A4-3: 全局搜索（CommandPalette）**
  - 如果用 @nuxt/ui，可直接使用 `UCommandPalette` 组件
  - 快速跳转到各管理页面

- [ ] **A4-4: admin/uploads.vue — 上传管理（可选）**
  - 文件列表、COS 管理
  - 对接: `upload/cos.post`

---

## 关键文件速查

| 文件 | 用途 |
|------|------|
| `app/pages/settings.vue` | 当前管理界面（560行），迁移源 |
| `nuxt.config.ts` 209-215行 | routeRules，`/admin/**` 已配置 prerender: false |
| `server/middleware/2.auth0.ts` | 核心鉴权中间件 |
| `server/utils/user.ts` | `assertSuperAdmin()` 函数 |
| `server/utils/token.ts` | `PAT_SCOPES` 定义，JWT 工具函数 |
| `server/utils/whiteRoutes.ts` | API 白名单路由 |
| `shared/utils/apiCodes.ts` | API 错误码定义 |
| `server/utils/handler.ts` | `defineStandardResponseHandler` |
| `package.json` | 确认 @nuxt/ui 安装状态 |

## 注意事项

- @nuxt/ui v3 基于 Tailwind CSS 4 和 Reka UI — 项目已使用 Tailwind 4 + Reka UI，兼容性应该没问题
- 如果选方案 A，需要测试 @nuxt/ui 的 Tailwind 配置是否和现有 `@tailwindcss/vite` 插件冲突
- settings.vue 中的 AutoForm 组件来自 shadcn，迁移到 @nuxt/ui 时需要对应替换或保留 shadcn 在 admin 中的使用
- 后端 API 已全部受 superAdmin 保护，前端 middleware 是额外的 UX 层，不是安全层
