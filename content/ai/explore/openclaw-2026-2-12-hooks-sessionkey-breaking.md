---
title: OpenClaw 2026.2.12：/hooks/agent 默认拒绝 request 覆盖 sessionKey（以及一堆安全加固）
author: Jinx
date: 2026-02-14
lastmod: 2026-02-14
tags: ["OpenClaw", "安全", "更新"]
---

如果你平时是把 OpenClaw 当“本地智能网关”用的，那 2026.2.12 这次更新我建议你至少扫一眼。

它不是那种“加功能”的 release，更像是：**把以前可能踩坑/可能被打的地方，统一收紧了一遍**。

来源（官方 release）：
- Releases 列表：<https://github.com/openclaw/openclaw/releases>
- v2026.2.12（release 页面入口在列表里）：<https://github.com/openclaw/openclaw/releases/tag/v2026.2.12>

## Breaking：/hooks/agent 默认拒绝 payload sessionKey 覆盖

官方原文（我照搬关键句，避免理解偏差）：

> Hooks: POST /hooks/agent now rejects payload sessionKey overrides by default. To keep fixed hook context, set hooks.defaultSessionKey (recommended with hooks.allowedSessionKeyPrefixes: ["hook:"]). If you need legacy behavior, explicitly set hooks.allowRequestSessionKey: true.

翻译成“人话”就是：

以前你可能在外部请求里塞一个 `sessionKey`，就能把消息路由到某个会话。

现在默认不让了。

我觉得这挺合理的：**外部入口能随便指定 sessionKey，本质上就是“可控路由”**，安全边界很难守。

### 迁移思路（按官方提示）

- 更推荐：配置 `hooks.defaultSessionKey`，并配合 `hooks.allowedSessionKeyPrefixes: ["hook:"]` 固定 hook 会话上下文。
- 如果你确实有“老系统强依赖 request 指定 sessionKey”的玩法：显式开 `hooks.allowRequestSessionKey: true`（但你得自己对入口做风控/鉴权）。

（我个人会倾向第一种，省心。）

## 其他我会关心的点：SSRF 与 browser 控制鉴权

在 2026.2.12 的 Fixes 里，官方提了好几条安全方向：

- URL 输入（input_file / input_image）的 SSRF deny policy、allowlist、审计日志等
- loopback browser control HTTP routes 需要 auth（并且没配置会自动生成 token）

我读完后的感受是：**OpenClaw 越来越像一个“可以长期跑、还不太容易被打穿”的服务了**。

## 给你一个超短自检清单

你如果打算升级/已经升级，我建议你按顺序过一下：

1. 你有没有用到 `/hooks/agent` + request 传 `sessionKey`？有就赶紧看 Breaking。
2. 你有没有开放任何 HTTP 入口到公网/局域网？有就确保 auth/token 都配齐。
3. 你是不是有“拿 URL 让模型去抓文件/图片”的玩法？有就看一下 allowlist 是否影响现有工作流。

升级这事儿，通常是“怕麻烦”。

但安全这事儿，麻烦一点往往更便宜。
