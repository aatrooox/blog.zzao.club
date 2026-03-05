---
title: 给 OpenClaw 新增一个 Agent（以飞书机器人为例）
date: 2026-03-05
tags: [OpenClaw, 飞书, Agent, 教程]
slug: openclaw-new-agent-feishu
author: 阿康
description: 手把手教你在 OpenClaw 里新建一个独立的 Agent，并接入飞书机器人，含踩坑清单。
---

# 给 OpenClaw 新增一个 Agent（以飞书机器人为例）

想给自己的飞书加一个专属 AI 机器人？

这篇教程手把手教你从零开始，在 `OpenClaw` 里新建一个独立的 `Agent`，并接入飞书。跟着做就行，不需要懂内部原理。


## 你需要准备什么

- 已经装好并能正常运行的 `OpenClaw`
- 一个飞书开发者账号，并已经在飞书开放平台创建好了一个 App（没有的话先去 [open.feishu.cn/app](https://open.feishu.cn/app) 新建一个）
- 终端基本操作能力（会复制粘贴命令就够了）


## 第一步：创建 Agent 工作目录

每个 `Agent` 都有自己的"家"，住在 `~/.openclaw/agents/<agentname>/` 下面。

把 `agentname` 换成你想取的名字，比如 `mybot`。

打开终端，依次运行：

```bash
mkdir -p ~/.openclaw/agents/mybot/workspace/skills
mkdir -p ~/.openclaw/agents/mybot/workspace/tasks
mkdir -p ~/.openclaw/agents/mybot/workspace/results
mkdir -p ~/.openclaw/agents/mybot/workspace/memory
mkdir -p ~/.openclaw/agents/mybot/agent
mkdir -p ~/.openclaw/agents/mybot/sessions
```

然后初始化 sessions 文件：

```bash
echo '{"sessions":[]}' > ~/.openclaw/agents/mybot/sessions/sessions.json
```

接着把 `models.json` 和 `auth-profiles.json` 从现有 Agent 复制过来（直接用主 Agent 的就行）：

```bash
cp ~/.openclaw/agents/main/agent/models.json ~/.openclaw/agents/mybot/agent/
cp ~/.openclaw/agents/main/agent/auth-profiles.json ~/.openclaw/agents/mybot/agent/
```

目录结构建好了，接下来写配置文件。


## 第二步：写核心配置文件

这些文件决定了你的 `Agent` 是什么性格、干什么活、认识谁。挨个创建就行。

### SOUL.md — Agent 的灵魂

```bash
cat > ~/.openclaw/agents/mybot/workspace/SOUL.md << 'EOF'
# SOUL.md

你是 MyBot，一个简洁高效的助手。

## 性格
- 回答简短直接，不废话
- 友好但不过分热情
- 不确定的事情说不确定，不瞎编

## 职责
- 回答用户问题
- 协助处理日常任务

## 禁止事项
- 不发布任何外部消息（邮件、推文等）除非明确被要求
- 不删除重要文件
EOF
```

### IDENTITY.md — 名字和角色

```bash
cat > ~/.openclaw/agents/mybot/workspace/IDENTITY.md << 'EOF'
# IDENTITY.md

- **Name:** MyBot
- **Role:** 飞书助手
- **Emoji:** 🤖
EOF
```

### AGENTS.md — 工作规范

```bash
cat > ~/.openclaw/agents/mybot/workspace/AGENTS.md << 'EOF'
# AGENTS.md

## 每次会话开始
1. 读 SOUL.md
2. 读 USER.md
3. 读今天的 memory/YYYY-MM-DD.md（如果存在）

## 记忆
- 日常记录写到 memory/YYYY-MM-DD.md
- 重要信息更新到 MEMORY.md
EOF
```

### USER.md — 用户是谁

```bash
cat > ~/.openclaw/agents/mybot/workspace/USER.md << 'EOF'
# USER.md

- **Name:** 你的名字
- **Timezone:** Asia/Shanghai
- **Notes:** 根据实际情况填写
EOF
```

### MEMORY.md — 长期记忆（不能省！）

这个文件**一定要创建**，哪怕内容很简单。原因后面踩坑部分会说。

```bash
cat > ~/.openclaw/agents/mybot/workspace/MEMORY.md << 'EOF'
# MEMORY.md

这是 MyBot 的长期记忆文件。

## 基本信息
- 我是 MyBot，运行在飞书频道的助手
- 创建时间：2026-03-05
EOF
```

### HEARTBEAT.md 和 TOOLS.md

```bash
echo '# HEARTBEAT.md\n\n# 暂无心跳任务' > ~/.openclaw/agents/mybot/workspace/HEARTBEAT.md
echo '# TOOLS.md\n\n# 工具备注（暂无）' > ~/.openclaw/agents/mybot/workspace/TOOLS.md
```


## 第三步：软连接 Skills（可选）

如果你希望新 `Agent` 也能用全局的 skills，跑这段脚本：

```bash
cd ~/.openclaw/agents/mybot/workspace/skills
GLOBAL_SKILLS=~/.openclaw/workspace/skills
for skill in $(ls "$GLOBAL_SKILLS"); do
  ln -sf "$GLOBAL_SKILLS/$skill" "$skill"
done
```

不需要的话这步跳过也没问题。


## 第四步：修改 openclaw.json

这是最重要的一步，**三个地方都要改，一个都不能漏**。

用编辑器打开 `~/.openclaw/openclaw.json`。

### 1. 在 `agents.list` 数组里加入新 Agent

找到 `agents` → `list` 数组，在里面追加：

```json
{
  "id": "mybot",
  "name": "mybot",
  "workspace": "/Users/你的用户名/.openclaw/agents/mybot/workspace",
  "agentDir": "/Users/你的用户名/.openclaw/agents/mybot/agent",
  "model": "github-copilot/claude-sonnet-4.6",
  "identity": {
    "name": "MyBot",
    "emoji": "🤖"
  },
  "account": "mybot"
}
```

> 记得把 `你的用户名` 换成你本机的实际用户名，可以用 `whoami` 命令查看。

### 2. 在 `channels.feishu.accounts` 里加飞书账号

找到 `channels` → `feishu` → `accounts`，加入：

```json
"mybot": {
  "appId": "cli_xxxxxxxx",
  "appSecret": "xxxxxxxxxxxxxxxx",
  "dmPolicy": "open",
  "domain": "feishu",
  "enabled": true,
  "allowFrom": ["*"],
  "groupPolicy": "open"
}
```

`appId` 和 `appSecret` 在飞书开放平台你的 App 里找，位置：**凭证与基础信息** → App ID / App Secret。

### 3. 在顶层 `bindings` 数组里加路由规则

⚠️ **这是最容易漏掉的一步！** 找到顶层的 `bindings` 数组（不是某个 agent 里面的），加入：

```json
{
  "agentId": "mybot",
  "match": {
    "channel": "feishu",
    "accountId": "mybot"
  }
}
```

没有这条规则，飞书消息会被路由到主 `Agent`，新 `Agent` 永远收不到消息。


## 第五步：重启 OpenClaw Gateway

配置文件改完之后，**必须重启 `Gateway` 才能生效**：

```bash
openclaw gateway restart
openclaw gateway status
```

看到 `RPC probe: ok` 就说明启动成功了。

> ⚠️ **顺序很重要**：必须先把 `Gateway` 跑起来，才能去飞书配置长连接。顺序反了飞书那边会报错。


## 第六步：飞书开发者后台配置

1. 进入 [飞书开放平台](https://open.feishu.cn/app)，找到你的 App

2. **权限管理** → 搜索并开通以下三个权限：
   - `im:message`
   - `im:message:send_as_bot`
   - `contact:user.id:readonly`

3. **事件与回调** → 消息与事件订阅 → 选择**长连接**模式 → 点击开启
   - ⚠️ **此时 `Gateway` 必须已经在跑**，否则页面会提示"未检测到应用连接信息"，开启会失败

4. 订阅事件，搜索并添加：`im.message.receive_v1`

5. 保存配置，发布应用（版本管理 → 创建版本 → 发布）


## 第七步：验证

在飞书里找到你的机器人，发一条消息，看它有没有正常回复。

如果没有反应，先检查：

- `openclaw gateway status` 是否正常
- `openclaw.json` 里 `bindings` 有没有加
- `appId` / `appSecret` 填对了没有


## 踩坑清单

做完之后最好过一遍这个清单，这几个坑我都踩过。

### ⚠️ 坑一：漏加 bindings

**最高频的坑。**

很多人在 `agents.list` 里加了新 `Agent`，以为就完事了。但消息路由靠的是顶层 `bindings` 数组，不加这条，飞书消息会一直跑到主 `Agent` 那里去，新 `Agent` 根本不会被调用。

**解决：** 确认 `openclaw.json` 顶层有 `bindings` 数组，且里面有对应的路由规则。

### ⚠️ 坑二：飞书长连接顺序搞反了

去飞书开启长连接的时候，必须 `OpenClaw Gateway` 已经在运行。顺序反了，飞书检测不到连接，会提示错误。

**解决：** 先 `openclaw gateway restart`，确认 `ok` 之后，再去飞书点开启。

### ⚠️ 坑三：没有 MEMORY.md 导致身份错乱

如果 `Agent` 的 workspace 里没有 `MEMORY.md`，`OpenClaw` 会 fallback 去读全局 workspace 的 `MEMORY.md`，也就是主 `Agent` 的记忆文件。

结果新机器人一开口就报出主 `Agent` 的名字和身份，非常奇怪。

**解决：** 每个 `Agent` 的 workspace 里都要有独立的 `MEMORY.md`，哪怕内容只有两行。

### ⚠️ 坑四：改完配置忘了重启

`openclaw.json` 改完直接去测试，发现没效果。原因是 `Gateway` 还在跑旧配置。

**解决：** 改完 `openclaw.json` 必须 `openclaw gateway restart`。如果只改了 `SOUL.md` / `AGENTS.md` 等 workspace 文件，则需要在对话里执行 `/new` 重置会话。

### ⚠️ 坑五：以为 account 字段就是路由

`Agent` 配置里有个 `"account": "mybot"` 字段，这只是标记这个 `Agent` 关联哪个账号，**不是路由机制**。

真正的路由靠顶层 `bindings`，两个地方都要配，缺一不可。


做完这七步，你的飞书机器人应该就能正常跑起来了。

如果还有问题，优先检查 `bindings` 和 `Gateway` 状态，90% 的问题都出在这两个地方。
