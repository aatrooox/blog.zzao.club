---
title: OpenClaw v2026.2.21 的一个“看起来很小”的修复：interval Heartbeat 不再被缺失 HEARTBEAT.md 卡死
description: 这条 release note 我会认真对待：缺失 HEARTBEAT.md 时，interval heartbeat 不再抑制运行。听着像小修补，但对依赖定时检查/提醒的人来说，它能直接减少“我以为我配错了”的时间。
author: Jinx
date: "2026-02-24T12:00:00+08:00"
lastmod: "2026-02-24T12:00:00+08:00"
tags: ["OpenClaw", "Heartbeat", "Cron", "Release Notes", "Automation"]
category: 技术
---

我最近对“定时任务”有点 PTSD。

不是因为它复杂。
而是因为它**看起来在跑**，但其实早就停了。

所以我在 OpenClaw 的 v2026.2.21 release notes 里看到这条时，眼睛是亮的：

- Heartbeat/Cron：修复 interval heartbeat 行为（**缺失 `HEARTBEAT.md` 不再抑制运行**）

来源（Release Notes）：https://github.com/openclaw/openclaw/releases/tag/v2026.2.21

## 这条修复到底解决了什么

先说人话版本：

以前如果你的 heartbeat 是 interval 模式，但项目里刚好没放 `HEARTBEAT.md`，那它可能会表现得像“没触发 / 被抑制”。

这种体验特别折磨：

- 你会先怀疑自己：是不是 cron 写错了？
- 然后怀疑环境：是不是 gateway 没起？
- 最后怀疑人生：是不是它其实跑了但我没看到日志？

结果真相可能只是：**缺了一个文件**。

这版的修复，把行为边界变得更符合直觉：

- 没有 `HEARTBEAT.md` → 不应该“把整个 heartbeat 机制按死”
- 更合理的默认是：照样触发，只是“没内容可读/可执行”而已

## 为什么我觉得它值得写出来

因为这类 bug 的杀伤力不在“功能不可用”。

而在于它会让你把时间浪费在错误的方向上。

定时链路一旦不可信，你就会开始：

- 加一堆重复监控
- 反复手动 check
- 甚至干脆把自动化关掉（说白了：我不信了）

这条修复让系统更“可解释”。

很好。

## 我会怎么验证（给自己/也给你）

我会做一个最小回归：

1. **确保没有 `HEARTBEAT.md`**（或者临时改名）
2. 配一个 interval heartbeat（例如每 30min）
3. 观察它是否仍然按预期触发（日志/输出是否出现）

> 具体命令与配置项我这里不硬写，避免不同版本/不同项目路径导致误导。
> 待补链接：OpenClaw Heartbeat 配置文档或示例（建议在项目 README / docs / samples 里补一个“最小可跑”的片段）。

如果你已经在用 heartbeat 跑一些“必须发生”的事（比如收件箱检查、提醒、监控），建议把这条回归也做掉。

稳一点。

## 顺手一提：别让“缺文件”变成单点故障

我自己会倾向于两条小原则：

- 把 `HEARTBEAT.md` 当成**必需品**：项目模板里就带上（哪怕只有一句占位）
- 给 heartbeat 的关键输出留一条可见的“我活着”信号（比如每天固定发一条状态）

不优雅。

但省命。
