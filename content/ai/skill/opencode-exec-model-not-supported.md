---
title: "opencode：exec 环境 model_not_supported 排查"
date: 2026-02-25
tags:
  - OpenClaw
  - opencode
  - Shell
  - GitHub Copilot
slug: "opencode-exec-model-not-supported"
author: "Aatrox"
---

## 背景

在同一台 macOS 机器上使用 opencode（GitHub Copilot provider），希望在自动化执行（OpenClaw 的 `exec`）里调用：

- `opencode run -m github-copilot/claude-sonnet-4.6 'Reply with OK'`

目标是让 opencode 在自动化任务中稳定使用 Claude Sonnet 4.6。

## 现象

- 在本机终端（交互环境）运行同一条命令：返回 `OK`，模型显示为 `claude-sonnet-4.6`。
- 在 OpenClaw 的 `exec` 环境运行同一条命令：报错：

```text
Error: The requested model is not supported.
code: model_not_supported
param: model
model: claude-sonnet-4.6
```

同时，在 TUI 会话中可以看到模型显示为 `Claude Sonnet 4.6 · GitHub Copilot`。

## 排查过程（最小化）

1) 对齐命令本身  
确认两边调用的都是：

```bash
opencode run -m github-copilot/claude-sonnet-4.6 'Reply with OK'
```

2) 打印 run 模式日志  
在 `exec` 环境中开启日志后可以确认请求被拒绝发生在 Copilot API 层（HTTP 400，`model_not_supported`）。

3) 识别执行环境差异  
OpenClaw 的 `exec` 由后台进程启动，常见特征是：

- 非交互 shell（non-interactive）
- 非登录 shell（non-login）
- 不会加载用户终端中的 `~/.zprofile` / `~/.zshrc`（取决于系统与启动方式）

因此 `exec` 环境的 PATH/环境变量与本机终端可能不一致，进而导致 opencode 在运行时出现行为差异。

（在本次机器上，`openclaw gateway status` 也提示 Gateway service PATH 缺少多处目录，符合“服务进程环境更干净”的特征。）

## 结论

问题不是 Copilot 套餐不支持该模型，而是 **OpenClaw exec 的非 login / 非交互环境** 与本机终端环境不一致，导致 opencode 在该环境下无法正常使用 `claude-sonnet-4.6`（表现为 `model_not_supported`）。

## 解决方法

在自动化执行时，将 opencode 调用包裹在 zsh login + interactive 环境中：

```bash
zsh -lic "cd <repo> && opencode run -m github-copilot/claude-sonnet-4.6 'Reply with OK'"
```

说明：

- `-l`：login shell（加载登录相关配置）
- `-i`：interactive（加载交互相关配置）
- `-c`：执行命令

采用该方式后，在 `exec` 环境中同样能得到 `OK`，并使用 `claude-sonnet-4.6`。
