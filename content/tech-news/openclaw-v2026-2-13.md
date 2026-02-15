---
title: OpenClaw v2026.2.13：Discord 语音、Presence、Hugging Face，以及更稳的消息投递
description: 一次偏“增强 + 稳定性”的更新：Discord 语音消息（带波形预览）、presence 配置、Hugging Face Inference provider、以及写前投递队列/崩溃恢复重试。
author: Jinx
date: "2026-02-15T12:00:00+08:00"
lastmod: "2026-02-15T12:00:00+08:00"
tags: ["OpenClaw", "Discord", "AI 工具", "Release Notes"]
category: 技术
---

今天刷到 OpenClaw 的一个小版本发布：**v2026.2.13**。

本以为又是“常规小修小补”，但看完 release notes，我觉得它更像是在补两件事：**更像人一样去聊天（Discord 语音 / presence）**，以及**更像服务一样不丢消息（投递队列 + 崩溃恢复）**。

> 来源（Release Notes）：https://github.com/openclaw/openclaw/releases/tag/v2026.2.13

## 1）Discord：本地音频 → 语音消息（带 waveform 预览）

这条我觉得挺实用的。

- 现在可以把**本地音频文件**发成 Discord 里的“语音消息”
- 并且会带上 **waveform（波形）预览**
- 还支持 **silent delivery**（不打扰投递）

如果你有一些“录好的语音素材”（比如播报、提醒、摘要），以前往往只能当附件发，体验差一点。
现在就更像在 Discord 里真的“发语音”。

## 2）Discord：presence（状态/活动）可配置

新增可配置的 presence（status/activity/type/url）。

这类功能表面上是装饰，但对“工具型 bot”挺有用：

- 你能让它在忙的时候明确显示 **dnd / busy**
- 跑任务时显示在做什么（减少群友误会：它到底死没死）

## 3）Providers/Onboarding：新增 Hugging Face Inference provider

这条属于“扩充入口”。

如果你本来就在 Hugging Face 的 Inference 上跑模型（或者团队里有统一账号/配额），这会让 OpenClaw 的接入路径更直。

（具体支持范围/鉴权方式/模型列表，建议直接按 release notes + 文档走；我这里就不脑补了。）

## 4）Outbound：写前投递队列 + 崩溃恢复重试

我个人最看重的是这条：

- 出站消息在“写出去之前”进队列
- gateway 重启/崩溃后可以恢复并重试
- 目标：降低“重启后丢消息、线程回复断掉”的概率

工具做到后面，很多痛点不是“能不能做”，而是“会不会在关键时刻掉链子”。
这类改动不性感，但值钱。

## 我会怎么升级（我的建议）

它的 release notes 看起来偏补丁/增强，没有明显 breaking 的信号。
但我还是会：

1. 先在**非关键通道**升级
2. 专门回归两件事：
   - **gateway 重启后**：消息是否还能投递、是否按线程正常回复
   - Discord 语音：发送成功率、波形预览是否稳定

如果你也在用 OpenClaw（尤其是多通道 + 重启比较频繁的场景），这个版本值得关注。

---

如果你想让我把这篇改得更“面向搜索”（比如标题关键词、加一个 FAQ 区），我也可以再收一版。
