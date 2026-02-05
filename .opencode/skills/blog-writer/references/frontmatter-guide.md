# Frontmatter 规范指南

每篇文章的 frontmatter 元数据规范。

---

## 必需字段 (REQUIRED)

每篇文章必须包含以下字段：

### title (string)

**中文标题**，用于页面显示。

**规则**：
- ✅ 必须是中文
- ✅ 简洁明确
- ✅ 不超过 30 字

**示例**：
```yaml
title: 从 macOS 迁移到 Windows 开发环境
```

**常见错误**：
```yaml
❌ title: migrate-macos-to-windows  # 应该用中文
❌ title: 关于如何从 macOS 系统迁移到 Windows 系统并配置开发环境的完整指南  # 太长
```

---

### date (YYYY-MM-DD)

首次发布日期。

**规则**：
- ✅ 格式必须是 `YYYY-MM-DD`
- ✅ 使用实际发布日期

**示例**：
```yaml
date: 2026-02-05
```

**常见错误**：
```yaml
❌ date: 2026/02/05  # 错误格式，应该用短横线
❌ date: 2026-2-5    # 错误格式，月日必须是两位数
```

---

### lastmod (YYYY-MM-DD)

最后修改日期。

**规则**：
- ✅ 格式必须是 `YYYY-MM-DD`
- ✅ 初次发布时与 `date` 相同
- ✅ 后续修改时更新此字段

**示例**：
```yaml
date: 2026-02-05
lastmod: 2026-02-05  # 初次发布
```

更新后：
```yaml
date: 2026-02-05
lastmod: 2026-02-10  # 修改后更新
```

---

### tags (array)

文章标签。

**规则**：
- ✅ 最多 3 个标签
- ✅ 精选最核心的标签
- ✅ 优先使用已有标签（保持一致性）
- ✅ 使用中文或英文专有名词

**示例**：
```yaml
tags: ["Windows", "WSL", "开发环境"]
tags: ["认知", "职场"]
tags: ["Nuxt", "路由"]
```

**常见错误**：
```yaml
❌ tags: ["Windows", "WSL", "开发环境", "配置", "迁移"]  # 超过 3 个
❌ tags: ["windows", "wsl"]  # 应该保持首字母大写一致性
```

**标签选择建议**：
- 技术文章：框架/工具名 + 功能点
- 认知文章：主题 + 领域
- 生活文章：主题 + 感悟类型

---

## 可选字段 (OPTIONAL)

根据文章类型选择性添加。

### versions (array)

**技术文章必须有**，标注框架/库的版本。

**规则**：
- ✅ 技术文章必须添加
- ✅ 最多 3 个
- ✅ 格式：`["工具名@版本号"]` 或 `["工具名"]`
- ✅ 只列最核心的技术栈

**示例**：
```yaml
versions: ["WSL@2", "Ubuntu@22.04", "Node@20"]
versions: ["nuxt@4.0.3"]
versions: ["Vite", "TypeScript"]  # 通用工具可不加版本号
```

**何时添加**：
- ✅ 涉及具体框架/库的文章
- ✅ 涉及操作系统/环境的文章
- ✅ 涉及工具配置的文章

**何时不添加**：
- ❌ 认知/感悟类文章
- ❌ 生活日常类文章
- ❌ 纯概念讨论（不涉及具体工具）

---

### group (string)

系列文章分组。

**规则**：
- ✅ 用于组织系列文章
- ✅ 同系列文章使用相同 group 值

**示例**：
```yaml
group: "Nuxt 实战"
group: "面试题:前端"
group: "从零开始学 Docker"
```

**何时添加**：
- ✅ 文章是某个系列的一部分
- ✅ 计划写多篇相关主题的文章

**何时不添加**：
- ❌ 独立主题的文章
- ❌ 不打算写成系列的文章

---

### description (string)

SEO 描述。

**规则**：
- ✅ 一句话概括文章内容
- ✅ 50-160 字符为宜
- ✅ 包含关键词

**示例**：
```yaml
description: "完整记录从 macOS 迁移到 Windows 开发环境的全过程，包括 WSL2 配置、工具安装和常见问题解决。"
```

**何时添加**：
- ✅ 希望优化 SEO 时
- ✅ 文章标题不够清晰时
- ✅ 需要在社交媒体分享时

**何时不添加**：
- ❌ 日常随笔（SEO 不重要）
- ❌ 标题已经很清晰了

---

## 完整示例

### 示例一：技术文章

```yaml
---
title: 从 macOS 迁移到 Windows 开发环境
date: 2026-02-03
lastmod: 2026-02-03
tags: ["Windows", "WSL", "开发环境"]
versions: ["WSL@2", "Ubuntu@22.04", "Node@20"]
description: "完整记录从 macOS 迁移到 Windows 开发环境的全过程"
---
```

---

### 示例二：认知/感悟类文章

```yaml
---
title: 稳定是最大的牢笼
date: 2026-02-02
lastmod: 2026-02-02
tags: ["认知", "职场"]
---
```

**说明**：认知类文章不需要 `versions` 字段。

---

### 示例三：系列文章

```yaml
---
title: Nuxt 4 路由最佳实践
date: 2026-02-03
lastmod: 2026-02-03
tags: ["Nuxt", "路由"]
versions: ["nuxt@4.0.3"]
group: "Nuxt 实战"
---
```

---

### 示例四：日常随笔

```yaml
---
title: 2026年2月周记
date: 2026-02-10
lastmod: 2026-02-10
tags: ["日常", "周记"]
---
```

**说明**：日常文章只需要基本字段。

---

## 重要规则 (CRITICAL)

### 规则一：title 是中文，文件名是英文

**title 字段用中文**（显示用）：
```yaml
title: 从 macOS 迁移到 Windows 开发环境
```

**文件名用英文**（URL 用）：
```
migrate-macos-to-windows.md
```

**两者不需要一致**：
- title 是给人看的，要清晰易懂（中文）
- 文件名是给 URL 用的，要简洁友好（英文）

---

### 规则二：不要添加 showTitle 字段

页面会自动从 frontmatter 的 `title` 获取标题。

**错误示例**：
```yaml
❌ showTitle: 从 macOS 迁移到 Windows 开发环境
```

**正确做法**：
```yaml
✅ title: 从 macOS 迁移到 Windows 开发环境
   # 不需要 showTitle
```

---

### 规则三：技术文章必须有 versions 字段

任何涉及框架、库、工具的文章都要标注版本。

**示例判断**：

| 文章主题 | 是否需要 versions | 示例 |
|---------|-----------------|------|
| Nuxt 4 路由配置 | ✅ 需要 | `versions: ["nuxt@4.0.3"]` |
| WSL2 环境搭建 | ✅ 需要 | `versions: ["WSL@2", "Ubuntu@22.04"]` |
| 如何做技术选型 | ❌ 不需要 | 概念讨论，不涉及具体工具 |
| 2026年技术趋势 | ❌ 不需要 | 趋势文章，不涉及具体版本 |
| 稳定是最大的牢笼 | ❌ 不需要 | 认知类文章 |

---

### 规则四：tags 最多 3 个

精选最核心的标签，不要贪多。

**如何选择标签**：

1. **列出所有可能的标签**
   ```
   候选：Windows, macOS, WSL, 开发环境, 配置, 迁移, 工具, 教程
   ```

2. **选出最核心的 3 个**
   ```
   最核心：Windows, WSL, 开发环境
   ```

3. **删除不够核心的**
   ```
   删除：macOS（次要）, 配置（太泛）, 迁移（包含在"开发环境"中）
   ```

**最终**：
```yaml
tags: ["Windows", "WSL", "开发环境"]
```

---

### 规则五：必须使用中文标点

文章正文所有标点符号必须是中文标点。

**中文标点**：
```
✅ ，。：？！「」《》
```

**英文标点**（禁止在正文中使用）：
```
❌ ,.:?!"<>
```

**例外**：
- 代码块中的标点（保持代码语法）
- 英文专有名词内部的标点（如 `don't`、`it's`）
- URL 和文件路径中的标点

**示例**：
```markdown
✅ Nuxt 4 带来了很多改进，包括性能优化、开发体验提升等。

❌ Nuxt 4 带来了很多改进,包括性能优化,开发体验提升等.
```

---

## 文件存放位置

根据文章内容选择目录：

| 目录 | 内容类型 | 示例 |
|-----|---------|------|
| `content/daily/` | 日常随笔、生活感悟、复盘 | 周记、月度总结 |
| `content/nuxt/` | Nuxt 相关技术文章 | Nuxt 路由配置 |
| `content/ai/` | AI 相关内容 | AI 工具使用 |
| `content/zzao/` | 早早集市项目相关 | 项目开发记录 |
| `content/imgx/` | IMGX 项目相关 | 功能实现 |
| `content/knows/` | 知识性科普文章 | 技术概念解释 |
| `content/tech-news/` | 技术新闻 | 新技术发布 |
| `content/tips/` | 小技巧 | 快捷命令 |

---

## 文件命名规则

### 规则一：全小写英文单词，用连字符分隔

**正确**：
```
✅ migrate-macos-to-windows.md
✅ nuxt-4-routing-best-practices.md
✅ stability-is-the-biggest-cage.md
```

**错误**：
```
❌ Migrate-MacOS-To-Windows.md  # 不要用大驼峰
❌ migrate_macos_to_windows.md  # 不要用下划线
❌ 从macOS迁移到Windows.md     # 不要用中文
```

---

### 规则二：文件名用英文，title 用中文

文件名和 title 不需要一致。

**示例**：
```
文件名：migrate-macos-to-windows.md
title：从 macOS 迁移到 Windows 开发环境
```

**原因**：
- 文件名用于生成 URL（英文友好）
- title 用于页面显示（中文友好）

---

### 规则三：草稿文件以 `-` 开头

文件名以 `-` 开头会被排除，不会发布。

**示例**：
```
-draft-post.md  # 草稿，不会发布
draft-post.md   # 会发布
```

---

## 检查清单

写完文章后，检查 frontmatter 是否符合规范：

- [ ] ✅ 有 `title` 字段（中文）
- [ ] ✅ 有 `date` 字段（YYYY-MM-DD 格式）
- [ ] ✅ 有 `lastmod` 字段（YYYY-MM-DD 格式）
- [ ] ✅ 有 `tags` 字段（最多 3 个）
- [ ] ✅ 技术文章有 `versions` 字段（最多 3 个）
- [ ] ❌ 没有 `showTitle` 字段（不需要）
- [ ] ✅ 文件名是英文（小写+连字符）
- [ ] ✅ 正文使用中文标点（代码块除外）
- [ ] ✅ 存放在正确的目录下

---

## 常见错误汇总

| 错误 | 正确 |
|-----|------|
| `title: migrate-macos-to-windows` | `title: 从 macOS 迁移到 Windows 开发环境` |
| `date: 2026/02/05` | `date: 2026-02-05` |
| `tags: ["a", "b", "c", "d"]` | `tags: ["a", "b", "c"]` (最多3个) |
| 技术文章缺少 `versions` | 必须添加 `versions` 字段 |
| 添加了 `showTitle` 字段 | 删除，只需要 `title` |
| 文件名：`从macOS迁移.md` | `migrate-macos.md` |
| 正文中用英文标点 | 必须用中文标点 |

---

## 参考示例

查看项目中已有文章的 frontmatter，作为参考：

```bash
# 查看 daily 目录下的文章
ls content/daily/

# 查看某篇文章的 frontmatter
head -n 10 content/daily/stability-is-the-biggest-cage.md
```

保持与已有文章风格一致。
