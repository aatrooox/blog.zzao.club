# Markdown 规范化 - 学习记录

## 任务概述
检查 `content/` 目录下所有 markdown 文件，找出 tags 或 versions 超过 3 个的文件，保留最重要的 3 个。

## 执行成果
- ✓ 完成 100%
- 扫描 132 个有效文件
- 修复 1 个文件
- 成功率 100%

## 关键发现

### 1. 现状分析
- 总共 149 个 markdown 文件
- 其中 17 个草稿文件（以 `-` 开头）
- 132 个有效文件需要检查
- 只有 1 个文件违规（versions 超过 3 个）

### 2. 规范化标准

#### 版本优先级规则（已成功应用）
**高优先级**（主框架）
- Web 框架：nuxt, vue, react, next, angular, svelte
- 后端框架：nest, express, koa, fastify, django, flask, rails

**中优先级**（核心工具）
- 运行时：node, deno, bun
- 语言：typescript, javascript
- 构建工具：vite, webpack, rollup

**低优先级**（其他库）
- 版本管理工具、Shell、操作系统等

### 3. 修复案例详解

**文件**：`content/tech-tips/migrate-macos-to-windows-wsl.md`

**修复前 versions**（8 个）：
```
WSL@2, Ubuntu@22.04, bun@1.3.7, fnm@1.38.1, 
node@20.19.5, zsh@5.8.1, oh-my-zsh, powerlevel10k
```

**修复后 versions**（3 个）：
```
WSL@2, node@20.19.5, bun@1.3.7
```

**决策逻辑**：
1. 保留 `WSL@2` - 文章的核心主题
2. 保留 `node@20.19.5` - 中优先级，前端核心工具
3. 保留 `bun@1.3.7` - 中优先级，现代工具
4. 删除其他 5 个低优先级工具

## 技术细节

### 检查流程
1. glob 找出所有 `.md` 文件
2. 跳过以 `-` 开头的草稿文件
3. 正则提取 frontmatter
4. 解析 tags 和 versions 数组
5. 对比限制规则
6. 进行修复
7. 全量验证

### 正则表达式模式
```python
# 提取 tags
tags_match = re.search(r'tags:\s*\[(.*?)\]', fm_text, re.DOTALL)

# 提取 versions
versions_match = re.search(r'versions:\s*\[(.*?)\]', fm_text, re.DOTALL)

# 解析数组元素
re.findall(r'"([^"]*)"', array_content)
```

## 验证方式

### 检查清单
- ✓ tags 字段数量 ≤ 3
- ✓ versions 字段数量 ≤ 3
- ✓ 文章正文无修改
- ✓ 其他 frontmatter 字段完整
- ✓ 草稿文件被正确跳过

### 最终验证结果
```
总文件数: 149
检查文件: 132
草稿文件: 17

✓ 所有文件均符合规范!
```

## 代码质量检查

- 无 ESLint 错误
- 无 Prettier 格式问题
- 所有约束条件满足
- Git commit 成功

## 后续建议

1. **自动化检查**
   - 在 CI/CD 流程中加入预提交 hook
   - 检查所有新增/修改的 markdown 文件

2. **文档完善**
   - 更新贡献指南，说明 tags/versions 限制
   - 补充优先级规则说明

3. **开发者体验**
   - 创建模板文件，在注释中提示限制
   - 建立 .pre-commit-config.yaml 钩子

## 执行时间
- 总耗时：< 1 分钟
- 检查时间：快速（正则表达式）
- 修复时间：实时
- 验证时间：< 5 秒
