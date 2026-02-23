---
title: OpenCode v1.2.10：别再多起一个 sidecar 了（以及 SDK 打包目录的小改动）
description: 这版更新不大，但两个点都很「工程味」：Desktop 端默认连 localhost 时不再额外 spawn sidecar；SDK 构建产物目录也更符合直觉。
author: Jinx
date: "2026-02-22T12:00:00+08:00"
lastmod: "2026-02-22T12:00:00+08:00"
tags: ["OpenCode", "Desktop", "SDK", "Release Notes"]
category: 技术
---

我中午刷 release 的时候看到 OpenCode 更新到 **v1.2.10**。

本以为又是那种“修修补补没啥感觉”的版本，但看完两条 notes，我反而觉得挺舒服：**它们都在处理「默认行为」和「产物结构」这种会长期影响体验的小细节**。

> 来源（Release Notes）：https://github.com/anomalyco/opencode/releases/tag/v1.2.10

## Desktop：默认是 localhost server 的时候，不再 spawn sidecar

Release notes 原话是：

- **Don't spawn sidecar if default is localhost server**

我自己的理解是：如果你默认就连的是本机的 server，那么 Desktop 端就没必要再“顺手”拉起一个 sidecar。

这种改动看起来很小，但对日常使用其实挺关键：

- 少一个进程，少一层状态（也少一点莫名其妙的“它怎么又起来了”）
- 排查问题的时候更直观：你连的就是那个 localhost 服务

本来以为 sidecar 是“贴心”，结果有时候它反而是“多余”。

## SDK：构建产物改到 dist/，而不是 dist/src

第二条是：

- **Build SDK to dist/ instead of dist/src**

这属于典型的“打包目录卫生”。

把最终产物放到 `dist/`，而不是 `dist/src`，会让很多东西更顺：

- 对使用者：import 路径更一致，找文件更符合直觉
- 对发布者：包内容更清晰，少一点「我到底该 publish 哪个目录」的疑惑

（当然，具体是否会影响你的项目，还要看你是不是写了非常依赖路径的脚本/工具链。这个点建议升级后跑一遍 CI/构建再放心。）

## 贡献者

Release notes 里还提到：

- Thank you to 1 community contributor: **@rmk40**

能被点名感谢的贡献，通常都是那种“看起来不大，但你会一直受益”的改动。

## 我会怎么升级

如果你只是普通使用者，我会偏向：

- 直接升级（改动集中、风险看起来不大）

如果你在 CI/发布脚本里对 SDK 产物目录有硬编码，那我会稳一点：

- 先升级到测试环境
- 跑一遍 `build`/`typecheck`/`lint`（你项目里有啥就跑啥）
- 再确认 SDK 的产物路径没有破坏你现有的引用

小版本也别掉以轻心。
不过这版看起来，挺靠谱。