---
title: "hermes claw migrate 大更新：之前跑完却没迁移成功？重新跑一遍"
date: 2026-04-12
description: "如果你之前用 hermes claw migrate 从 OpenClaw 迁移过来，但发现记忆丢了、API key 没带过来、频道 token 不见了，不是你操作错了，是工具本身有 bug。"
author: aatrox
---


如果你之前用 `hermes claw migrate` 从 OpenClaw 迁移过来，但发现记忆丢了、API key 没带过来、频道 token 不见了，不是你操作错了，是工具本身有 bug。

这次更新修了。

**为什么会跑完了但没迁移成功**

OpenClaw 在过去几个月里悄悄改了一堆内部路径和配置结构。迁移工具还在读旧位置，什么都找不到，但它不报错，就这样静默地成功退出了。

你以为迁移完了，其实什么都没带过来。

**这次修了哪些坑**

**记忆和 persona 丢失**
OpenClaw 把 `workspace/` 改名成了 `workspace-main/`。工具现在会自动检查两个路径。这是反馈量最高的问题，排第一。

**API key 找不到**
之前只读 `.env` 文件。现在也会检查 `openclaw.json` 里 `env` 子对象里的 key ，还有 `auth-profiles.json`。

**Telegram/Discord 等平台的 token 丢失**
OpenClaw 把 token 路径从 `channels.telegram.botToken` 挪到了 `channels.telegram.accounts.default.botToken`。现在对 Telegram、Discord、Slack、WhatsApp、Signal、Matrix、Mattermost 都兼容两种路径结构。

**TTS 配置丢失**
OpenClaw 把 edge TTS provider 改名成了 `microsoft`，两个名字现在都认。

**Provider 配置对不上**
带连字符的 API 类型（`openai-completions`、`anthropic-messages`、`google-generative-ai`）、新的 `thinkingDefault` 值（`minimal`、`xhigh`、`adaptive`）、Matrix 的 `accessToken` 字段，全部处理了。

**静默跳过变成了明确提示**
file/exec 类型的 SecretRef 之前会静默跳过，现在会警告你。迁移完还会告诉你：哪些 skill 需要重启 session 才能生效， WhatsApp 需要重新扫码。

**新交互：先预览再执行**

这次还改了操作流程。现在跑迁移会先完整展示预览，让你确认之后再真正执行。不会再出现不知道它做了什么的情况。

```
hermes claw migrate          # 预览，确认，执行
hermes claw migrate --dry-run   # 只预览，不执行
hermes claw migrate --yes    # 跳过确认，直接执行（适合脚本/CI 环境）
```

在非交互式环境下也能正常用，会显示预览，并提示你加 `--yes` 来执行。

**已经迁移过的人怎么办**

直接重新跑一遍。

工具会跳过已经存在的内容，不会重复导入。之前静默跳过的那些会被补上。

完整迁移文档： https://hermes-agent.nousresearch.com/docs/guides/migrate-from-openclaw