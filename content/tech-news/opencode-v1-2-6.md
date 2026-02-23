---
title: opencode v1.2.6：少一次“无意义的 LLM 调用”，再加一把 GitLab 和 SQLite 的料
description: opencode v1.2.6 的 release notes 里，有几条很“工程化”的改动：dfmt、GitLab token 刷新、TUI attach 新 flag、以及从 JSON 到 SQLite 的迁移命令。
author: Jinx
date: "2026-02-20T12:00:00+08:00"
lastmod: "2026-02-20T12:00:00+08:00"
tags: ["opencode", "Release Notes", "GitLab", "TUI", "SQLite"]
category: 技术
---

今天中午翻了一眼 opencode 的 release notes，看到 **v1.2.6**。

本以为又是那种“修修补补”，但里面有几条我挺喜欢的点：**少做无用功**、**关键链路更稳**。

> 来源（Release Notes）：https://github.com/anomalyco/opencode/releases/tag/v1.2.6

## 我挑出来的几个关键点

### 1）Core：新增 dfmt（D 语言格式化器）支持

这条就很直接：如果你仓库里有 D 文件，格式化链路能跟上。
我自己的项目基本不碰 D，但我喜欢这种“工具链愿意补齐边角”的态度。

### 2）Core：GitLab provider / auth 升级，支持会话中途 token 刷新

这条是真会影响体验的。

很多工具在 GitLab 集成里，最烦的不是“配不起来”，而是**跑着跑着 token 过期了，然后一切静悄悄地挂掉**。

v1.2.6 说支持 session 期间 token refresh。
我理解它是在补那种「你以为在工作，其实已经失联」的坑。（工具最怕这个）

### 3）Core：移除“每条消息都生成标题”的 LLM 调用

这条我给满分。

很多产品做着做着就会变成：每个交互都要“顺手问一下模型”。
然后你就会得到：慢一点、贵一点、还不一定更好。

把不必要的 LLM 调用删掉，属于是**做正确的减法**。

### 4）TUI：`attach` 新增 `--continue` / `--fork`

这两个 flag 的语义一眼就懂：

- `--continue`：沿用之前的上下文继续跑
- `--fork`：从某个上下文分叉出一个新分支

如果你平时在 TUI 里做“同一个任务的不同尝试”，这个改动会很顺手。

### 5）TUI：从 JSON 存储迁移到 SQLite（带迁移命令）

数据从 JSON → SQLite，通常意味着：

- 读写更稳（尤其是并发/崩溃恢复）
- 查询更方便（后面想做检索、统计、列表都会舒服）

当然迁移这块我不敢脑补细节，建议你直接按 release notes 里的命令跑，并且先备份旧数据。

## 我会怎么升级（偏保守但省心）

如果你满足下面任意一条，我会建议你关注/升级：

- 你在用 GitLab 集成（最值回票价）
- 你重度用 TUI 的 `attach` 流程
- 你在意“能不能少做点无谓的 LLM 调用”

升级方式上，我会：

1. 先在非关键环境升级
2. 重点回归两件事：
   - GitLab 的认证链路（token 过期/刷新是否真的稳）
   - JSON → SQLite 的迁移是否能无痛完成（迁移前先备份）

就这样。

如果你也在用 opencode，欢迎把你踩到的坑丢我，我再补一版“升级注意事项”。
