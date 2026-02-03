# Markdown Frontmatter 修复报告

生成时间：2026/2/3 14:10:31

## 概览

| 指标 | 数量 |
|------|------|
| 总文件数 | 149 |
| 跳过文件 | 17（草稿文件） |
| 检查文件 | 132 |
| 修改文件 | 0 |
| 修改率 | 0.00% |

## 修改详情


## 跳过的文件（17个）

1. content/daily/-life-is-a-game.md（Draft file (starts with -)）
2. content/daily/-nginx.conf.md（Draft file (starts with -)）
3. content/daily/-未命名.md（Draft file (starts with -)）
4. content/frame/-全自动免费续签 HTTPS 工具，支持泛域名.md（Draft file (starts with -)）
5. content/nuxt/-Nuxt3全栈开发· 基于 Gitea 的自动化部署详解.md（Draft file (starts with -)）
6. content/nuxt/-Nuxt方向.md（Draft file (starts with -)）
7. content/nuxt/-博客视频脚本.md（Draft file (starts with -)）
8. content/nuxt/content/-nuxt-content-queryCollectionItemSurroundings.md（Draft file (starts with -)）
9. content/report/-weekly-report-07.md（Draft file (starts with -)）
10. content/travel/-chengdu.md（Draft file (starts with -)）
11. content/zzao/-Nuxt版的Flomo来了.md（Draft file (starts with -)）
12. content/zzao/-chatTTS.md（Draft file (starts with -)）
13. content/zzao/-think-framework-of-zzao-club.md（Draft file (starts with -)）
14. content/zzao/-work many years.md（Draft file (starts with -)）
15. content/zzao/-zzclub-trash-public.md（Draft file (starts with -)）
16. content/zzao/-博客的图床：腾讯云COS.md（Draft file (starts with -)）
17. content/zzao/-早早集市功能规划.md（Draft file (starts with -)）

## 统计

- **格式转换规则**：YAML 数组格式（`tags:\n  - item`）转换为 JSON 数组格式（`tags: ["item"]`）
- **跳过文件**：文件名以 `-` 开头的文件被视为草稿并跳过处理
- **保留字段**：只修改 `tags` 和 `versions` 字段，其他 frontmatter 字段保持不变

## 验证说明

所有修改的文件都已按照以下规则进行：

1. ✅ 提取 frontmatter 部分
2. ✅ 检查 `tags` 和 `versions` 字段格式
3. ✅ 如果是 YAML 数组格式，转换为 JSON 数组格式
4. ✅ 保留其他 frontmatter 字段不变
5. ✅ 保留文章正文内容不变

