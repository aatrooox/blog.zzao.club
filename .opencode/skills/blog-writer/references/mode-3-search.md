# 模式三：搜索写作模式

搜索最新内容，生成科普/新闻/介绍类文章。

## 触发条件

- 用户说"搜一下最新的xx"、"写个科普"、"写个介绍"、"新闻稿"
- 用户说"整理@某人最近的发言"、"看看xx最近在X上说了什么"

---

## 核心特点

- ❌ **不进行写作点评**：此模式只确保信息准确 + 语气一致
- 信息准确性第一
- 应用用户语气（参考 [user-profile.md](user-profile.md)）
- 标注信息来源

---

## 两个子模式

### 3A. 普通信息搜索

使用搜索引擎获取最新信息。

### 3B. X.com 用户帖子整理

使用 x-scraper skill 抓取 X.com 帖子。

---

## 3A. 普通信息搜索

### 工作流程

#### 1. 使用搜索工具

使用 `websearch` 或 `google_search` 工具获取最新信息。

**搜索策略**：
- 使用多个关键词组合
- 限定时间范围（如：最近一周、最近一个月）
- 优先选择权威来源（官方文档、技术博客、新闻媒体）

**示例**：
```
用户："搜一下最新的 Nuxt 4 更新"

搜索关键词：
- "Nuxt 4 release notes"
- "Nuxt 4 新功能"
- "Nuxt 4 migration guide"
```

---

#### 2. 交叉验证

多个信息源确认事实准确性。

**验证原则**：
- 至少 2-3 个独立来源确认
- 优先官方信息（官网、官方博客、官方文档）
- 区分事实与观点（事实需验证，观点可保留）
- 注意时效性（信息是否过时）

**示例**：
```
信息："Nuxt 4 默认使用 Vite 5"

验证步骤：
1. 查看 Nuxt 官方发布说明 ✓
2. 查看 Nuxt GitHub repository ✓
3. 查看技术博客报道 ✓

结论：信息准确，可以使用
```

---

#### 3. 应用用户语气

参考 [user-profile.md](user-profile.md) 中的"语气模仿指南"调整表达。

**查阅语气指南**：
写作前必须查阅 user-profile.md，确保：
- 口语化表达（不要过度正式）
- 短句落点（营造节奏感）
- 轻度自嘲（适当使用）
- 反转对比（增强表达力）

**示例转换**：
```markdown
❌ AI 正式腔：
"Nuxt 4 带来了诸多改进，包括性能优化、开发体验提升等方面的增强。"

✅ 用户语气：
"Nuxt 4 来了。速度更快，开发更爽，迁移成本还不高。"
```

---

#### 4. 标注来源

重要信息注明出处，方便读者查证。

**标注方式**：

**方式一：内联引用**
```markdown
根据 [Nuxt 官方博客](https://nuxt.com/blog/v4)，Nuxt 4 默认使用 Vite 5。
```

**方式二：脚注**
```markdown
Nuxt 4 默认使用 Vite 5[^1]。

[^1]: https://nuxt.com/blog/v4
```

**方式三：参考资料章节**
```markdown
## 参考资料

- [Nuxt 4 Release Notes](https://nuxt.com/blog/v4)
- [Nuxt 4 Migration Guide](https://nuxt.com/docs/getting-started/upgrade)
```

---

#### 5. 不进行写作点评

此模式下，**只确保**：
- ✅ 信息准确
- ✅ 语气一致（符合 user-profile.md）
- ✅ 来源标注

**不做**：
- ❌ 批评表达方式
- ❌ 指出修辞问题
- ❌ 引用名家技法

---

## 3B. X.com 用户帖子整理

使用 x-scraper skill 抓取 X.com 用户的帖子，整理成文章。

### 使用场景

- 整理某个 X.com 用户（通常是大V）最近的发言
- 用户提到具体的 X.com 用户名
- 用户说"看看xx最近在X/Twitter上说了什么"

---

### 前置条件检查

x-scraper 需要以下环境才能工作。如果不满足，引导用户配置。

#### 检查清单

| 检查项 | 命令 | 说明 |
|--------|------|------|
| Python 3.11+ | `python3 --version` | 检查版本 |
| Playwright | `python3 -c "import playwright"` | 检查是否安装 |
| Cookie 文件 | `ls -lh /tmp/x_cookies_pw.json` | 检查是否存在 |

---

#### 如果环境不满足

**引导用户配置**：

```
⚠️ x-scraper 需要完成环境配置才能使用。

请参考：.opencode/skills/x-scraper/SKILL.md

快速检查：
1. Python 3.11+: python3 --version
2. Playwright: python3 -c "import playwright; print('✓')"
3. Cookie 文件: ls -lh /tmp/x_cookies_pw.json

如果任何一项不满足，请查看 x-scraper/SKILL.md 的 Prerequisites 部分。

Cookie 导出步骤：
1. 安装 Cookie-Editor 扩展（Chrome）
   https://chromewebstore.google.com/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm

2. 访问 https://x.com（确保已登录）

3. 点击 Cookie-Editor 扩展图标 🍪 → Export → JSON
   保存到任意位置（如 /tmp/x_cookies.json）

4. 转换格式：
   cd .opencode/skills/x-scraper/scripts
   python3 convert_cookies.py <你保存的cookie文件> /tmp/x_cookies_pw.json

详见: .opencode/skills/x-scraper/SKILL.md
```

---

### 执行步骤

#### 1. 使用 x-scraper skill

```bash
cd .opencode/skills/x-scraper/scripts
python3 scraper.py <username> [count] [--cookie-file <path>]
```

**参数说明**：
- `username`: X.com 用户名（不带 @）
- `count`: 抓取帖子数量（建议 10-20 条，默认 10）
- `--cookie-file`: 可选，自定义 Cookie 文件路径（默认 `/tmp/x_cookies_pw.json`）

**示例**：
```bash
# 抓取用户最近 15 条帖子
python3 scraper.py example_user 15

# 使用自定义 Cookie 文件
python3 scraper.py example_user 10 --cookie-file ~/my_cookies.json
```

---

#### 2. 解析 JSON 输出

**输出文件位置**：`/tmp/x_{username}_posts.json`

**JSON 结构**：
```json
[
  {
    "index": 1,
    "username": "example_user",
    "postId": "1234567890123456789",
    "publishTime": "2025-12-03T18:28:32.000Z",
    "postLink": "https://x.com/example_user/status/1234567890123456789",
    "textContent": "Post text content...",
    "views": "471K",
    "likes": "1.1K",
    "retweets": "153",
    "replies": "44"
  }
]
```

**字段说明**：
- `index` - 序号
- `username` - 用户名
- `postId` - 帖子 ID
- `publishTime` - 发布时间（ISO 8601 格式）
- `postLink` - 帖子直接链接
- `textContent` - 帖子文本内容
- `views` - 浏览量（K/M 缩写）
- `likes` - 点赞数
- `retweets` - 转发数
- `replies` - 回复数

---

#### 3. 整理成文章

**整理原则**：

##### a. 按时间或主题分组

根据内容特点选择组织方式：

**按时间分组**（适合记录式整理）：
```markdown
## 本周观点（2月1日-2月5日）

### 关于技术选型
【相关帖子内容】

### 关于团队管理
【相关帖子内容】
```

**按主题分组**（适合深度整理）：
```markdown
## 关于 AI 的思考

【帖子 1】
【帖子 3】
【帖子 7】

## 关于创业的观点

【帖子 2】
【帖子 5】
```

---

##### b. 保留原文内容

**X.com 原作者帖子原文不要改写。**

**DO**：
```markdown
> 稳定就是最大的牢笼。你以为自己在享受安全感，其实是在慢性自杀。
>
> —— [@example_user](https://x.com/example_user/status/1234567890123456789)
```

**DON'T**：
```markdown
改写成："作者认为，稳定可能会限制个人发展，长期来看不利于成长。"
❌ 不要改写原作者的话！
```

---

##### c. 附上帖子链接

每条帖子都附上直接链接，方便读者查证。

**格式建议**：
```markdown
> 【帖子原文】
>
> —— [@username](https://x.com/username/status/1234567890123456789) · 2025-12-03

或者：

【帖子原文】（[链接](https://x.com/username/status/1234567890123456789)）
```

---

##### d. 用用户语气串联评论

在不同帖子之间，用**你的语气**（用户语气，参考 user-profile.md）串联评论。

**查阅语气指南**：
写评论前必须查阅 [user-profile.md](user-profile.md)。

**示例**：
```markdown
## 关于稳定的思考

@example_user 最近连发了几条关于"稳定"的思考。

> 稳定就是最大的牢笼。你以为自己在享受安全感，其实是在慢性自杀。
> —— [@example_user](链接) · 2025-12-03

这话说得狠，但确实。很多人把稳定当护城河，其实是在给自己挖坟。

> 不做选择本身就是一种选择，而且往往是最贵的那种。
> —— [@example_user](链接) · 2025-12-04

这条更绝。不选择看起来没成本,其实是最大的成本。

【你的总结评论】
```

**评论部分应用用户语气**：
- 口语化（"这话说得狠"）
- 短句落点（"确实。"）
- 轻度自嘲（如适用）
- 不要变成 AI 鸡汤文

---

#### 4. 不进行写作点评

此模式下，**只确保**：
- ✅ 原作者帖子原文不改写
- ✅ 串联评论符合用户语气（查阅 user-profile.md）
- ✅ 附上帖子链接

**不做**：
- ❌ 批评用户的串联评论写得如何
- ❌ 指出修辞问题
- ❌ 引用名家技法

---

### 整理输出格式建议

```markdown
---
title: 【标题：如"@example_user 最近关于稳定的思考"】
date: 2026-02-05
lastmod: 2026-02-05
tags: ["X.com", "观点整理"]
---

【开头：简短介绍为什么整理这些帖子】

## 【主题 1】

【你的引导语（用户语气）】

> 【原帖内容】
> —— [@username](链接) · 日期

【你的评论（用户语气）】

> 【原帖内容】
> —— [@username](链接) · 日期

【你的评论（用户语气）】

## 【主题 2】

...

---

## 总结

【你的总结（用户语气）】
```

---

## 注意事项

### ✅ DO

**3A（普通搜索）**：
- 使用搜索工具获取信息
- 交叉验证事实准确性
- 应用用户语气
- 标注信息来源

**3B（X.com 整理）**：
- 检查前置条件（Python、Playwright、Cookie）
- 保留原作者帖子原文
- 附上帖子链接
- 用用户语气串联评论（查阅 user-profile.md）

### ❌ DON'T

**两个子模式都禁止**：
- 批评写作技巧
- 指出修辞问题
- 引用名家技法点评

**3B 特别禁止**：
- 改写原作者帖子内容
- 把串联评论写成 AI 鸡汤文

---

## 参考文档

- **[user-profile.md](user-profile.md)** - 写作前必看，确保语气一致
- **[frontmatter-guide.md](frontmatter-guide.md)** - 添加正确的 frontmatter
- **[x-scraper SKILL.md](../../x-scraper/SKILL.md)** - x-scraper 使用文档
- **[x-scraper setup.md](../../x-scraper/references/setup.md)** - x-scraper 环境配置
- **[x-scraper troubleshooting.md](../../x-scraper/references/troubleshooting.md)** - x-scraper 问题排查
