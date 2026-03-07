---
title: OpenClaw 安装入门（Windows）
date: 2026-03-07
tags: [OpenClaw, Windows, 安装教程]
slug: openclaw-install-windows
author: 阿康
description: 把 OpenClaw 在 Windows 上装起来，并跑通最基本的配置。主推 winget，坑直接写在步骤里。
---

# OpenClaw 安装入门（Windows）

这篇只讲一件事。
把 `OpenClaw` 在 `Windows` 上装起来。

如果你用的是 `macOS`，去看另一篇。

这篇基于 `OpenClaw 2026.3.2`。

## 你需要准备什么

- 一台 `Windows`
- 能开的 `PowerShell` 或 `Windows Terminal`
- 网络能访问 `GitHub`、`npm`
- 如果你平时靠代理上网，那就先把代理配好

先确认网络是不是通的：

```powershell
curl https://google.com -I
```

如果你需要手动给终端加代理，可以先执行：

```powershell
$env:https_proxy="http://127.0.0.1:7890"
$env:http_proxy="http://127.0.0.1:7890"
$env:all_proxy="socks5://127.0.0.1:7890"
```

端口按你自己的代理工具改。

## 先确认 winget 能不能用

Windows 这篇主推 `winget`。

先跑：

```powershell
winget --version
```

如果这里都不通，再考虑手动下载安装。
不要一上来就怀疑 `OpenClaw`。

## 安装 Node.js

```powershell
winget install OpenJS.NodeJS.LTS
```

装完别急着往下走。
先立刻检查：

```powershell
node -v
npm -v
where.exe node
where.exe npm
```

这里有个很关键的坑。

**`winget` 装出来的 Node 正常是带 `npm` 的。**
如果你看到：

- `node` 有了
- `npm` 没有

大概率不是没装，而是：

- 当前终端还没刷新环境变量
- 或者 `C:\Program Files\nodejs` 还没进 PATH

先关掉终端，再开一个新的 PowerShell。
然后重新跑：

```powershell
node -v
npm -v
```

如果还不行，再检查目录里有没有 `npm.cmd`：

```powershell
dir "C:\Program Files\nodejs\npm*"
```

如果这里能看到 `npm.cmd`，那问题基本就是 PATH，不是 Node 没装上。

## 安装 bun

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

装完确认：

```powershell
bun --version
where.exe bun
```

如果这里找不到，大概率也是环境变量还没刷新。
先重开终端。

## 安装 OpenClaw

```powershell
npm install -g openclaw
```

装完确认：

```powershell
openclaw --version
where.exe openclaw
```

如果 `openclaw` 找不到，也别急。
先确认：

- `npm` 全局目录有没有进 PATH
- 当前终端是不是老会话

很多时候重开终端就好了。

## 初始化 OpenClaw

第一次装，推荐先走：

```powershell
openclaw setup --wizard
```

如果你想一次把更多东西配掉，也可以试：

```powershell
openclaw onboard
```

第一次上手，还是建议先走 `setup --wizard`。

## 启动 Gateway

```powershell
openclaw gateway start
```

然后检查：

```powershell
openclaw gateway status
```

这一步别跳。
如果 `Gateway` 没起来，后面飞书也接不上。

## 做一遍基本检查

至少跑这几条：

```powershell
openclaw status
openclaw gateway status
openclaw config file
openclaw config validate
```

主配置通常在：

```powershell
%USERPROFILE%\.openclaw\openclaw.json
```

主 Agent 的 workspace 通常在：

```powershell
%USERPROFILE%\.openclaw\agents\main\workspace
```

## 最基本的配置文件

先认这几个：

- `SOUL.md`：Agent 的人格、语气、角色定位
- `USER.md`：你是谁、偏好什么
- `MEMORY.md`：长期稳定记忆
- `memory/*.md`：每天的短期记录
- `AGENTS.md`：分工和工作规则

## 模型怎么查，怎么改

先看当前模型：

```powershell
openclaw models status --plain
```

再看可用模型：

```powershell
openclaw models list
```

如果你要切默认模型：

```powershell
openclaw models set github-copilot/gpt-5.2
```

这里先提醒一句。

**先做模型认证，再切模型。**

先看：

```powershell
openclaw models auth --help
```

不然你切过去，可能也跑不起来。

## Agent 怎么看，怎么加

先看现有 Agent：

```powershell
openclaw agents list
```

如果你要加一个新的：

```powershell
openclaw agents add writer
```

如果你想顺手指定模型和目录：

```powershell
openclaw agents add writer --workspace %USERPROFILE%\.openclaw\agents\writer\workspace --model github-copilot/claude-sonnet-4.6
```

建完之后，重点还是去它自己的 workspace 里改：

- `SOUL.md`
- `USER.md`
- `MEMORY.md`

## 如果你下一步要接飞书

完整教程在这里：

[给 OpenClaw 新增一个 Agent（以飞书机器人为例）](/post/zzao/openclaw-new-agent-feishu)

这里只说最关键的。

### 飞书后台权限怎么配

这里不要把 `im:message` 当成一个单独权限看。
它在飞书后台里是一整组消息权限，不是点一个就完了。

更稳的做法是：

在飞书开放平台里，围绕这几类能力去开：

- 机器人收消息
- 机器人发消息
- 单聊消息
- 群聊消息 / 被 @ 消息
- 用户 ID 读取

也就是你在权限后台里，至少要把和下面这些关键词相关的权限确认一遍：

- `im:message`
- `im:message:send_as_bot`
- `contact:user.id:readonly`

然后把 `im:message` 下面那组和收消息相关的权限一起开好。
别只开一个最短的名字就停。

### 事件订阅怎么配

在飞书开放平台里：

- 进入你的 App
- 打开「事件与回调」
- 选择 **长连接**
- 开启它
- 订阅事件：`im.message.receive_v1`

这里也有个顺序坑。

**先启动 `Gateway`，再去飞书后台开长连接。**
不然飞书经常检测不到连接。

### OpenClaw 这边怎么配

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

如果不配 `bindings`，飞书消息不会路由到你的新 Agent。

### 配完后重启

```powershell
openclaw gateway restart
openclaw channels status --probe
```

如果状态正常，你应该能看到类似：

- `enabled`
- `configured`
- `running`
- `works`

## 建议你按这个顺序走

1. 先确认 `winget`
2. 安装 `Node`
3. 检查 `npm`
4. 安装 `bun`
5. 安装 `OpenClaw`
6. 跑 `openclaw setup --wizard`
7. 启动 `Gateway`
8. 跑 `status` / `config validate`
9. 最后再接飞书

不要把安装、模型、飞书三件事糊在一起。
一步一步来，反而更快。
