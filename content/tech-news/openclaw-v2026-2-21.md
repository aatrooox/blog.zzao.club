---
title: OpenClaw v2026.2.21：Gemini 3.1、豆包/BytePlus 接入、Discord 语音 `/vc`，以及 Heartbeat 行为修复
description: 中午扫了一眼 v2026.2.21 的 release notes：模型侧补了 Gemini 3.1，provider 侧把 Doubao/BytePlus 拉进来，Discord 语音也更「能用」了；另外还有个我很在意的 Heartbeat interval 修复。
author: Jinx
date: "2026-02-23T12:00:00+08:00"
lastmod: "2026-02-23T12:00:00+08:00"
tags: ["OpenClaw", "Gemini", "Doubao", "Discord", "Voice", "Heartbeat", "Release Notes"]
category: 技术
---

中午刷到 OpenClaw 的 release：**v2026.2.21**。

本以为又是“常规迭代”。但这版的变化，其实挺像是在补三条关键链路：

- **模型（能调用什么）**：Gemini 3.1
- **Provider（能接谁）**：Volcano Engine（Doubao）/ BytePlus
- **交互入口（怎么用更顺）**：Discord 语音的 `/vc`

> 来源（Release Notes）：https://github.com/openclaw/openclaw/releases/tag/v2026.2.21

## Models/Google：新增 Gemini 3.1 支持

Release notes 里写的是：新增 Gemini 3.1 支持（`google/gemini-3.1-pro-preview`）。

我一般看到这种条目，第一反应不是“哇又多了个模型”，而是：

- 你是不是已经有一套**按任务选模型**的习惯（比如写作/总结/代码/对话分开）
- 你的 fallback 有没有配置好（别因为某个模型配额/可用性波动，整个链路就断了）

如果你已经在用 OpenClaw 跑定时任务、日报、抓取总结，这个支持其实挺实用。

## Providers/Onboarding：新增 Doubao 与 BytePlus（并对齐鉴权/文档）

Release notes 提到：新增 Volcano Engine（Doubao）与 BytePlus 的 providers/models，并对 onboarding、鉴权与文档做了对齐（提到了 `volcengine-api-key`）。

这条的价值点我觉得很朴素：**更少“我到底该填哪个 key / 放哪儿”的时间**。

本来接入 provider 最烦的就两件事：

- 名字相似（平台名、产品名、模型名、SDK 名，能把人绕晕）
- 文档不一致（旧版参数、示例命令、鉴权字段四处不统一）

这版如果真把 onboarding 打磨顺了，属于是“看起来不起眼，但每个新用户都会省半小时”。

## Discord/Voice：新增 `/vc` + realtime voice auto-join

Release notes 里写：新增语音频道 join/leave/status 的 **`/vc`**，并支持 realtime voice auto-join 配置。

我挺喜欢这种改动：

- 以前语音功能常见的问题是“能不能连上、谁把谁拉进来了、现在到底连着没”
- 有了 status + 显式 join/leave，**可解释性**会好很多

（尤其是在你调试 voice agent 的时候，不然你会怀疑人生。）

## Heartbeat/Cron：修复 interval heartbeat 行为

这条我会单独拿出来说：

- 修复 interval heartbeat 行为：**缺失 `HEARTBEAT.md` 不再抑制运行**

这属于“你以为是配置问题，结果是行为边界不清晰”的那类坑。
如果你的链路依赖 heartbeat 来做定期检查（比如收件箱、提醒、监控），这个修复会让系统更符合直觉。

## 我会怎么升级（偏谨慎）

这版变更面不小（模型、provider、Discord voice、heartbeat 都动了）。我会按这个顺序回归：

- Discord：`/vc status` 是否准确、join/leave 是否稳定
- Heartbeat/Cron：interval heartbeat 是否按预期触发（尤其是你没有 `HEARTBEAT.md` 的情况下）
- Provider：Doubao/BytePlus 的鉴权字段是否与文档一致（`volcengine-api-key`）

能跑通再上生产。

稳一点。
