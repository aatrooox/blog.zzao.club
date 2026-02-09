# SEO 全站审计报告

## 当前状态总览

SEO 基础设施有骨架但不完整。title/description 覆盖了大部分页面，sitemap 和 RSS 存在，但缺失几个对搜索引擎非常重要的信号：OG/Twitter 社交标签、JSON-LD 结构化数据、以及一个需要立即清理的死代码问题。

## 各页面 SEO 覆盖矩阵

| 页面 | `useHead`/`useSeoMeta` | title | description | canonical | OG tags | JSON-LD |
|------|----------------------|-------|-------------|-----------|---------|---------|
| `index.vue` | ✅ `useHead` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `article.vue` | ✅ `useHead` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `post/[...slug].vue` | ✅ `useSeoMeta` + `useHead` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `memo.vue` | ✅ `useSeoMeta` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `about.vue` | ✅ `useHead` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `links.vue` | ✅ `useHead` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `news.vue` | ✅ `useHead` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `imgx.vue` | ✅ `useHead` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `product/index.vue` | ❌ **无** | ❌ | ❌ | ❌ | ❌ | ❌ |
| `product/zotepad.vue` | ❌ **无** | ❌ | ❌ | ❌ | ❌ | ❌ |
| `settings.vue` | N/A（管理页） | — | — | — | — | — |
| `error.vue` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

## 全局 Head 现状（`nuxt.config.ts` 76-113行）

- ✅ Google Analytics: `G-6WVZHT91DH`（async gtag）
- ❌ **死掉的 Umami 脚本**仍在加载（91-96行）：`https://umami.zzao.club/script.js` — 每次页面加载发起失败请求
- ✅ 百度站长验证: `codeva-wbD6D2XuzG`
- ✅ Bing Webmaster 验证: `A7FB0FAB6DCCC738B8B3D60179F1496C`
- ❌ **无 Google Search Console** 验证 meta
- ✅ 全局 keywords meta（但包含过时的 "Obsidian"）
- ❌ **无 preconnect** 资源提示
- ❌ **无默认 OG/Twitter meta**

## 基础设施现状

- ✅ Sitemap: `server/routes/sitemap.xml.ts` — 动态生成，但**仅包含文章**，缺少静态页面
- ✅ RSS Feed: `server/routes/feed.xml.ts` — 完整
- ✅ robots.txt: `public/_robots.txt` — Disallow `/api/`, `/admin/`
- ✅ `@nuxtjs/robots` 模块已启用
- ✅ Nuxt Image: ipx provider, webp, quality 80, lazy loading
- ❌ **全站无 JSON-LD / 结构化数据**
- ❌ **全站无 OG/Twitter 标签**
- ❌ **无面包屑**
- ⚠️ 部分图片 alt 属性为通用值 "image"
- ⚠️ `runtimeConfig` 仍有 `umamiHost/umamiUser/umamiPass` 残留（195-197行）

---

## 任务清单

### P0 — 必须立即修复（直接影响 SEO/性能）

- [ ] **P0-1: 删除死掉的 Umami 脚本**
  - 文件: `nuxt.config.ts` 第91-96行
  - 操作: 删除 Umami script 配置项（3行对象）
  - 原因: 服务已弃用，每次页面加载发起失败的外部请求，拖慢性能

- [ ] **P0-2: 清理 runtimeConfig 中的 Umami 残留**
  - 文件: `nuxt.config.ts` 第195-197行
  - 操作: 删除 `umamiHost`, `umamiUser`, `umamiPass` 三行
  - 连带: 同步清理 README.md 中 `.env` 模板里的 Umami 相关环境变量

- [ ] **P0-3: 给 product 页面添加 SEO meta**
  - 文件: `app/pages/product/index.vue`, `app/pages/product/zotepad.vue`
  - 操作: 添加 `useHead` 或 `useSeoMeta`，包含 title + description + canonical
  - 原因: 产品页是未来付费转化的入口，完全没有 SEO 信号

### P1 — 高优先级（显著提升搜索表现）

- [ ] **P1-1: 全站添加 OG/Twitter 社交标签**
  - 文件: `nuxt.config.ts`（全局默认）+ `app/pages/post/[...slug].vue`（文章覆盖）
  - 操作:
    - 全局: 在 `app.head.meta` 中添加默认 `og:site_name`, `og:type`, `og:locale`, `twitter:card`, `twitter:site`
    - 建议新建 `app/composables/useSeoDefaults.ts` 统一管理
    - 文章页: 在现有 `useSeoMeta` 中补充 `ogTitle`, `ogDescription`, `ogImage`, `ogUrl`, `twitterCard`
  - 原因: 分享到社交平台无预览卡片，影响点击率和传播

- [ ] **P1-2: 添加 Google Search Console 验证 meta**
  - 文件: `nuxt.config.ts` `app.head.meta`
  - 前置: 需要站长在 Google Search Console 注册并获取验证码
  - 操作: 添加 `{ name: 'google-site-verification', content: '<验证码>' }`
  - 原因: Google 是主要收入来源（Google Ads），必须有 GSC

- [ ] **P1-3: 文章页添加 JSON-LD Article 结构化数据**
  - 文件: `app/pages/post/[...slug].vue`
  - 操作: 使用 `useHead` 注入 `application/ld+json` 脚本，Schema 类型 `Article`
  - 字段: `headline`, `datePublished`, `dateModified`, `author`, `publisher`, `description`, `mainEntityOfPage`
  - 原因: Google 搜索结果中显示发布时间、作者等富摘要（Rich Snippets）

- [ ] **P1-4: 添加 preconnect 资源提示**
  - 文件: `nuxt.config.ts` `app.head.link`
  - 操作: 添加 `<link rel="preconnect" href="https://img.zzao.club">` 和 `<link rel="preconnect" href="https://www.googletagmanager.com">`
  - 原因: 减少 DNS 查找 + TCP 握手延迟

### P2 — 中优先级（补全覆盖）

- [ ] **P2-1: 4个页面补充 canonical**
  - 文件: `app/pages/memo.vue`, `app/pages/about.vue`, `app/pages/links.vue`, `app/pages/imgx.vue`
  - 操作: 添加 `useHead({ link: [{ rel: 'canonical', href: 'https://zzao.club/xxx' }] })`

- [ ] **P2-2: Sitemap 补充静态页面**
  - 文件: `server/routes/sitemap.xml.ts`
  - 操作: 在文章列表之前，硬编码添加静态页面: `/`, `/article`, `/memo`, `/about`, `/links`, `/news`, `/imgx`, `/product`, `/product/zotepad`
  - 每个静态页设置合理的 `changefreq` 和 `priority`

- [ ] **P2-3: 更新全局 keywords**
  - 文件: `nuxt.config.ts` 第110行
  - 操作: 移除 `Obsidian`，根据当前内容方向调整关键词

- [ ] **P2-4: 清理 README 中的 Umami 引用**
  - 文件: `README.md`
  - 操作: 删除 `.env` 模板中 `NUXT_UMAMI_*` 相关行，删除排错部分的 Umami 提及

### P3 — 低优先级（锦上添花）

- [ ] **P3-1: 添加面包屑 BreadcrumbList JSON-LD**
  - 文件: 文章详情页或全局 layout
  - 操作: 注入 BreadcrumbList 结构化数据

- [ ] **P3-2: 改善图片 alt 文本**
  - 文件: `app/components/content/ProseImg.vue`, `app/components/common/AppImg.vue`
  - 操作: 将默认 alt="image" 改为从 src 文件名推断或要求传入

- [ ] **P3-3: 首页添加 WebSite/Organization JSON-LD**
  - 文件: `app/pages/index.vue` 或全局 layout
  - 操作: 添加 WebSite + Organization 结构化数据

- [ ] **P3-4: 评估启用 @nuxtjs/sitemap 模块**
  - 现状: package.json 有依赖但 modules 中已注释掉，当前用自定义 route
  - 操作: 评估官方模块是否能替代手写方案，减少维护负担

---

## 建议执行顺序

```
第一批（快速胜利，~1小时）：P0-1, P0-2, P0-3, P1-2, P1-4, P2-1, P2-3
第二批（核心 SEO，~2小时）：P1-1（OG全局+文章覆盖）, P1-3（JSON-LD Article）
第三批（补全，~1小时）：P2-2（Sitemap）, P2-4（README清理）
第四批（进阶，按需）：P3-1, P3-2, P3-3, P3-4
```

## 关键文件速查

| 文件 | 用途 | 关键行号 |
|------|------|---------|
| `nuxt.config.ts` | 全局 head、meta、scripts、runtimeConfig | 76-113, 188-207 |
| `app/pages/post/[...slug].vue` | 文章详情，最重要的 SEO 页面 | useSeoMeta ~183, useHead ~188 |
| `server/routes/sitemap.xml.ts` | Sitemap 生成 | 全文29行 |
| `server/routes/feed.xml.ts` | RSS Feed | 全文76行 |
| `public/_robots.txt` | robots.txt | — |
| `app/pages/product/index.vue` | 产品列表（无SEO） | — |
| `app/pages/product/zotepad.vue` | Zotepad 产品页（无SEO） | — |
| `app/components/content/ProseImg.vue` | MDC 图片组件（alt通用） | — |
| `app/components/common/AppImg.vue` | 通用图片组件（alt通用） | — |
