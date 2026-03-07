---
title: OpenClaw 安装入门（macOS）
date: 2026-03-07
tags: [OpenClaw, macOS, 安装教程]
slug: openclaw-install-macos
author: 阿康
description: 把 OpenClaw 在 macOS 上装起来，并跑通最基本的配置。少废话，照着做就行。
---

# OpenClaw 安装入门（macOS）

这篇只讲一件事。
把 `OpenClaw` 在 `macOS` 上装起来。

如果你用的是 `Windows`，去看另一篇。

这篇基于 `OpenClaw 2026.3.2`。

## 你需要准备什么

- 一台 `macOS`
- 能开的终端
- 网络能访问 `GitHub`、`npm`
- 如果你平时靠代理上网，那就先把代理配好

先别急着装。
先确认网络是不是通的。

```bash
curl -I https://google.com
```

如果这里不通，后面大概率也会卡。

如果你需要手动给终端加代理，可以先执行：

```bash
export https_proxy=http://127.0.0.1:7890
export http_proxy=http://127.0.0.1:7890
export all_proxy=socks5://127.0.0.1:7890
```

端口按你自己的代理工具改。

## 先装依赖

### 安装 Homebrew

如果你还没装 `Homebrew`，先跑：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

装完先确认：

```bash
brew --version
```

如果这里就报错，先别往下走。
先把 `brew` 这一步处理干净。

### 安装 Node 和 bun

```bash
brew install node bun
```

装完马上检查：

```bash
node -v
npm -v
bun --version
```

这里有个小坑。

刚装完如果命令找不到，很多时候不是没装上。
只是当前终端还没刷新环境变量。
先关掉终端，再开一个新的。

## 安装 OpenClaw

```bash
npm install -g openclaw
```

装完确认：

```bash
openclaw --version
```

如果这里报权限问题，不要上来就 `sudo`。
先看你自己的 `npm` 全局目录配置是不是正常。

## 初始化 OpenClaw

第一次装，推荐先走这条：

```bash
openclaw setup --wizard
```

如果你想一次把更多东西配掉，也可以试：

```bash
openclaw onboard
```

但第一次上手，我还是建议 `setup --wizard`。
简单一点。

## 启动 Gateway

```bash
openclaw gateway start
```

然后检查：

```bash
openclaw gateway status
```

如果这里没起来，后面的 Agent、飞书、消息路由都不用谈。

## 做一遍基本检查

至少跑这几条：

```bash
openclaw status
openclaw gateway status
openclaw config file
openclaw config validate
```

主配置通常在：

```bash
~/.openclaw/openclaw.json
```

## 最基本的配置文件

`OpenClaw` 本质上就是：
CLI + workspace + 一堆配置文件。

先认这几个：

- `SOUL.md`：Agent 的人格、语气、角色定位
- `USER.md`：你是谁、偏好什么
- `MEMORY.md`：长期稳定记忆
- `memory/*.md`：每天的短期记录
- `AGENTS.md`：分工和工作规则

默认主 Agent 的 workspace 通常在：

```bash
~/.openclaw/agents/main/workspace
```

## 模型怎么查，怎么改

先看当前模型：

```bash
openclaw models status --plain
```

再看可用模型：

```bash
openclaw models list
```

如果你要切默认模型：

```bash
openclaw models set github-copilot/gpt-5.2
```

这里先提醒一句。

**先配认证，再切模型。**
不然你切过去也可能不能用。

先看：

```bash
openclaw models auth --help
```

## Agent 怎么看，怎么加

先看现有 Agent：

```bash
openclaw agents list
```

如果你要新建一个：

```bash
openclaw agents add writer
```

如果你想顺手指定模型和目录：

```bash
openclaw agents add writer --workspace ~/.openclaw/agents/writer/workspace --model github-copilot/claude-sonnet-4.6
```

建完之后，重点不是命令。
是去它自己的 workspace 里改：

- `SOUL.md`
- `USER.md`
- `MEMORY.md`

## 如果你下一步要接飞书

完整教程在这里：

[给 OpenClaw 新增一个 Agent（以飞书机器人为例）](/zzao/openclaw-new-agent-feishu)

这里只说最关键的。

### 飞书后台权限怎么配

这里不要按我给你列几个权限名就机械地搜。
因为 `im:message` 在飞书后台是一整组消息权限，不是一个点。

更稳的做法是：

在飞书开放平台里，围绕这几类能力去开：

- 机器人收消息
- 机器人发消息
- 单聊消息
- 群聊消息 / 被 @ 消息
- 用户 ID 读取

也就是你在权限后台里，至少要把和下面这些关键词相关的消息权限开出来：

- `im:message`
- `im:message:send_as_bot`
- `contact:user.id:readonly`

然后把 `im:message` 下面那组和收消息相关的权限一起确认一遍。
别只开一个名字最短的就以为结束了。

### 事件订阅怎么配

在飞书开放平台里：

- 进入你的 App
- 打开「事件与回调」
- 选择 **长连接**
- 开启它
- 订阅事件：`im.message.receive_v1`

这里有个顺序坑。

**先启动 `Gateway`，再去飞书后台开长连接。**
顺序反了，飞书那边经常会报没检测到连接。

### OpenClaw 这边怎么配

你至少要配两块。

#### `channels.feishu.accounts`

```json
"writer": {
  "appId": "cli_xxxxxxxx",
  "appSecret": "xxxxxxxxxxxxxxxx",
  "domain": "feishu",
  "enabled": true,
  "dmPolicy": "open",
  "groupPolicy": "open",
  "allowFrom": ["*"]
}
```

#### 顶层 `bindings`

```json
{
  "agentId": "writer",
  "match": {
    "channel": "feishu",
    "accountId": "writer"
  }
}
```

这里不要漏。

很多人只加了账号，或者只加了 Agent。
结果就是飞书消息根本路由不过去。

### 配完后重启

```bash
openclaw gateway restart
openclaw channels status --probe
```

如果状态正常，你应该能看到类似：

- `enabled`
- `configured`
- `running`
- `works`

## 建议你按这个顺序走

1. 先装 `Homebrew`
2. 再装 `Node` 和 `bun`
3. 安装 `OpenClaw`
4. 跑 `openclaw setup --wizard`
5. 启动 `Gateway`
6. 跑 `status` / `config validate`
7. 再改 `SOUL.md` 和模型
8. 最后再接飞书

别一上来就飞书。
先把本地跑通。
这样后面会省很多事。
