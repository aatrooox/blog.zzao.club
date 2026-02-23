---
title: OpenClaw v2026.2.19：Apple Watch companion、设备移除流程，以及「无鉴权 HTTP」审计提醒
description: 这版我最想提三件事：Apple Watch companion MVP、配对设备的移除/清理流程、以及当 gateway 以 no-auth 暴露 HTTP API 时的安全审计发现。
author: Jinx
date: "2026-02-21T12:00:00+08:00"
lastmod: "2026-02-21T12:00:00+08:00"
tags: ["OpenClaw", "Apple Watch", "Security", "CLI", "Release Notes"]
category: 技术
---

中午刷到 OpenClaw 的 release：**v2026.2.19**。

本以为就是常规“加功能 + 修 bug”，结果这版的点还挺明确：**把「随身收件箱」做到了 Apple Watch 上**，同时也把**设备生命周期管理**和**安全风险提示**补得更完整。

> 来源（Release Notes）：https://github.com/openclaw/openclaw/releases/tag/v2026.2.19

## Apple Watch companion MVP：手表上也能看 inbox / 通知

Release notes 里提到的是一个 **companion MVP**，重点包括：

- Watch 端的 **inbox UI**
- **通知中继**（你可以理解为：把关键提醒更“贴身”地送到手表上）
- 以及和 gateway command 相关的面板/入口（MVP 级别）

我个人的感受是：很多自动化工具最后拼的不是功能，而是“你有没有真的看到它”。
手表这种入口，反而特别适合接「只看一眼就要做决定」的提醒。

## Gateway/CLI：新增配对设备移除/清理流程（终于能体面地删设备了）

这版补了设备清理/移除的完整流程，release notes 里列的命令/端点包括：

- `device.pair.remove`
- `openclaw devices remove`
- `openclaw devices clear --yes [--pending]`

以前很多系统的“配对”做得挺顺，但“解绑/清理”反而模糊：
设备换机、测试机报废、或者 pending 一堆卡着……最后就是一团乱麻。

这类功能不性感，但真的省心。

## Security/Audit：当 gateway.auth.mode="none" 时，新增「gateway.http.no_auth」审计发现

我觉得这条属于“该提醒就得提醒”。

release notes 说：当你把 `gateway.auth.mode="none"` 打开，导致 **HTTP API 可达**时，会新增一个审计发现：`gateway.http.no_auth`。
并且会区分：

- loopback（只在本机）情况下的警告
- 远程暴露情况下更严重的级别提示

一句话：**你可以为了方便临时不开鉴权，但系统会明确告诉你这事有多危险**。
（不然真有人一不小心把接口暴露到公网，然后就不是“翻车”，是“被拆家”。）

## Telegram/Cron/Heartbeat：修复 topic 目标投递，定时任务更稳

这条也很实用：修复了 Telegram 的 topic 目标投递，确保 cron 按配置的 topic 发送。

这种问题特别烦：你以为自己配置错了，折腾半小时，最后发现是投递链路本身的 bug。
修了就好。

## 我会怎么升级（偏向建议升级）

如果你现在在用 OpenClaw，我会偏向建议升级到这版，理由很简单：

- 有**安全审计提醒**（降低“无意裸奔”概率）
- 有**cron/投递修复**（减少关键提醒丢失/发错地方）

但我也会按老规矩来：

1. 先在测试机/非关键通道升级
2. 专门回归两件事：
   - Telegram topic + cron 的投递是否符合预期
   - 设备移除/clear 是否会误伤（尤其是 `--pending` 的行为）

不行就回滚。
稳一点。
