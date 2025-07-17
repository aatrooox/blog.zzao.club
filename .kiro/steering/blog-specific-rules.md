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
