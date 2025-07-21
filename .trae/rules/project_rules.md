# 博客项目特定规则

## 动画效果实现

- 优先使用 css 实现动画效果
- 如果 css 无法实现，优先使用 gsap 实现动画

## 内容处理规范

### Markdown 文件处理

- 支持中文文件名和路径
- 使用 `showTitle` 字段作为显示标题，`title` 用于 URL 生成
- 过滤规则：排除以 `-` 开头的草稿文件
- 支持 Obsidian 双链语法 `[[文章名]]` 自动转换为链接

### 文章元数据结构

```typescript
schema: z.object({
  date: z.date(),
  showTitle: z.string(),
  lastmod: z.date(),
  tags: z.array(z.string()),
  versions: z.array(z.string()),
  rawbody: z.string(),
});
```

## 用户认证系统

### 认证方式

- 支持用户名密码登录
- 支持 GitHub OAuth 登录
- 使用 JWT 进行会话管理
- 使用 `nuxt-auth-utils` 模块

### 数据库设计

- 使用 Prisma ORM
- MySQL 作为主数据库
- Redis 用于缓存和会话存储

## UI/UX 规范

### 主题系统

- 使用浅色主题
- 已移除亮暗模式切换功能
- 样式统一使用亮色主题实现

### 字体配置

- 主字体：LXGWS（霞鹜文楷）
- 代码字体：使用系统默认等宽字体
- 响应式断点：xs(480px), sm(640px), md(768px), lg(1024px), pc(1140px)

## SEO 和分析

### 搜索引擎优化

- 配置百度站长验证
- 配置必应站长验证
- 自动生成 sitemap.xml 和 robots.txt
- 预渲染重要页面提升 SEO

### 数据统计

- Google Analytics (gtag)
- Umami 自建统计
- 飞书 Webhook 通知集成

## 开发和部署

### 环境配置

- 开发端口：4775
- 支持 PM2 部署配置
- 使用 Docker 容器化部署
- 区分开发和生产环境配置

### 版本管理

- 使用语义化版本控制
- 自动生成 CHANGELOG
- 支持 patch/minor/major 版本发布
- Git hooks 确保代码质量

## 性能优化

### 构建优化

- 生产环境移除 console 和 debugger
- 启用 Gzip 和 Brotli 压缩
- 图标客户端打包减少网络请求
- 代码分割和懒加载

### 缓存策略

- 静态资源长期缓存
- API 响应适当缓存
- Redis 缓存热点数据
- CDN 加速静态资源

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

### Vue 文件
- 所有函数使用 function 定义，不要使用 const
- script 必须使用 setup 模式，lang 为 ts

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
# 路径引用规则

## 路径别名规范

### 基本规则

- `~/` - 指向 `app/` 目录（Nuxt 4 应用目录）
- `~~/` - 指向项目根目录

### 具体使用场景

#### app/ 目录下的文件引用

```typescript
// 正确：引用 app/ 下的文件使用 ~/
import { useUserStore } from "~/stores/user";
import type { User } from "~/types/user";
import MyComponent from "~/components/MyComponent.vue";
import { myUtil } from "~/utils/helper";

// 错误：不要使用相对路径
import { useUserStore } from "../stores/user";
import type { User } from "./types/user";
```

#### 项目根目录下的文件引用

```typescript
// 正确：引用根目录下的文件使用 ~~/
import type { GlobalType } from "~~/types/global";
import { rootConfig } from "~~/config/app";
import prisma from "~~/lib/prisma";

// 错误：不要使用 ~/
import type { GlobalType } from "~/types/global";
```

### 常见目录引用示例

#### app/ 目录内的引用

- `~/components/` - 组件
- `~/composables/` - 组合式函数
- `~/stores/` - 状态管理
- `~/utils/` - 工具函数
- `~/types/` - 类型定义（如果在 app/types）
- `~/assets/` - 资源文件
- `~/plugins/` - 插件
- `~/middleware/` - 中间件

#### 根目录的引用

- `~~/types/` - 全局类型定义
- `~~/lib/` - 库文件
- `~~/server/` - 服务端代码
- `~~/prisma/` - 数据库相关
- `~~/config/` - 配置文件

### 注意事项

1. **类型导入**

   ```typescript
   // 正确
   import type { User } from "~/types/user";
   import type { ApiResponse } from "~~/types/api";

   // 使用 type 关键字进行类型导入
   ```

2. **组件导入**

   ```typescript
   // 正确
   import MyComponent from "~/components/MyComponent.vue";

   // 在 <script setup> 中
   const MyComponent = defineAsyncComponent(
     () => import("~/components/MyComponent.vue")
   );
   ```

3. **服务端代码引用**

   ```typescript
   // 在 server/ 目录中
   import { someUtil } from "~~/server/utils/helper";
   import type { ServerType } from "~~/types/server";
   ```

4. **避免混用**
   - 不要在同一个文件中混用 `~/` 和 `~~/` 来引用同一层级的文件
   - 保持引用路径的一致性和可读性

### 特殊情况

#### Nuxt 自动导入

- 对于 Nuxt 自动导入的内容（如 composables、components），通常不需要显式导入
- 但在类型定义中仍需要正确的路径引用

#### 第三方库

```typescript
// 第三方库正常导入
import { ref, computed } from "vue";
import axios from "axios";

// 项目内部使用别名
import { myHelper } from "~/utils/helper";
```

# 通用组件库 (app/components/common)

## 可用组件列表

### 用户相关组件

- **UserAvatar** - 用户头像组件，支持用户信息显示
- **AppUserMenu** - 用户菜单组件
- **AppLoginDialog** - 登录对话框
- **AppRegisterDialog** - 注册对话框
- **UserConfigDrawer** - 用户配置抽屉

### 导航和菜单组件

- **AppMenuBar** - 主菜单栏组件
- **AppMenu** - 菜单组件
- **AppNavDrawer** - 导航抽屉
- **AppToc** - 目录组件 (Table of Contents)

### 内容展示组件

- **AppImg** - 图片组件，可能包含懒加载等功能
- **AppOverflowContent** - 溢出内容处理组件
- **PagePanel** - 页面面板组件
- **MemoPanel** - 备忘录面板组件

### 评论系统组件

- **CommentViewPanel** - 评论查看面板
- **SubCommentsViewPanel** - 子评论查看面板
- **QuoteComment** - 引用评论组件
- **AppCommentInput** - 评论输入组件

### 搜索和输入组件

- **AppSearchDialog** - 搜索对话框
- **ResourceSearchDialog** - 资源搜索对话框
- **AppTagInput** - 标签输入组件

### 视觉效果组件

- **AuroraBackground** - 极光背景效果组件
- **InteractiveGridPattern** - 交互式网格图案组件

### 其他功能组件

- **AppMsgFlow** - 消息流组件

## 使用规范

### 组件引用

- 这些组件已通过 Nuxt 自动导入配置，可直接在模板中使用
- 组件名称无前缀，直接使用如 `<UserAvatar />` 而不是 `<AppUserAvatar />`

### 组件特性

- 所有组件使用统一的亮色主题
- 组件设计遵循项目的 UI 规范
- 大部分组件支持响应式设计

### 常用组件组合

- 用户相关：`UserAvatar` + `AppUserMenu`
- 导航相关：`AppMenuBar` + `AppNavDrawer`
- 评论系统：`CommentViewPanel` + `AppCommentInput`
- 搜索功能：`AppSearchDialog` + `ResourceSearchDialog`

## 注意事项

- 使用组件前请确认其 props 和 events 接口
- 某些组件可能依赖特定的 store 或 composable
- 组件可能包含内部状态管理，使用时注意数据流向
