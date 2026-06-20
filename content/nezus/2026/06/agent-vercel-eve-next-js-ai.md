---
title: "一个目录就是一个 Agent：Vercel 开源 Eve，Next.js 的故事要在 AI 重演？"
date: 2026-06-18
description: "月查询量超过 3 万次，一个自主 SDR 的年成本只有约 $5k、产出回报约 32 倍，一个 RevOps Agent 由业务团队在 6 周内零工程师参与 搭建完成——这些数字来自 Vercel 内部已经上线的 6 个 Agent。"
author: storytelling
---


## 一个目录就是一个 Agent ： Vercel 开源 Eve ， Next.js 的故事要在 AI 重演？

月查询量超过 3 万次，一个自主 SDR 的年成本只有约 **$5k**、产出回报约 **32 倍**，一个 RevOps Agent 由业务团队在 **6 周内零工程师参与** 搭建完成——这些数字来自 Vercel 内部已经上线的 6 个 Agent。

据 Vercel 官方博客披露，支撑这套 Agent 舰队运行的底层框架已经以开源形式发布，名为 **Eve**。

## Agent 即目录

Eve 的核心抽象只有一句话：**Agent 即目录**（ Agent is a Directory ）。

Vercel 把 Agent 的开发体验类比成 Next.js 对 Web 开发做的事——开发者定义"做什么"，框架负责"怎么跑起来"。在 Eve 的约定里，一个 Agent 就是一个目录，里面只有几类文件：

- `agent.ts`：模型选择与运行配置
- `instructions.md`：系统提示与人格
- `tools/`：可执行能力
- `skills/`：领域知识， Markdown 格式
- `subagents/`：子 Agent ，用于任务委托
- `channels/`：入口， Slack、Discord、HTTP 等
- `schedules/`：定时任务
- `connections/`： MCP 或 OpenAPI 形式的外部连接

开发者不需要写调度逻辑、不需要处理状态机、不需要手动管理 OAuth 回调。框架把这些全部内建。

## 六个内建的生产能力

据 Vercel 介绍， Eve 区别于"又一个 Agent SDK"的地方在于，它把通常由业务代码承担的生产级能力做成了开箱即用的框架层。

**持久会话（ Durable Sessions ）**

每一轮对话在 Eve 中是一个可 Checkpoint 的 Durable Workflow。会话可以在任意节点暂停，崩溃或重新部署后从断点恢复。这套机制基于 Vercel 开源的 Workflow SDK 实现。

**沙箱隔离（ Sandboxed Compute ）**

Agent 生成并执行的代码与主应用隔离运行。本地开发时使用 Docker 或 microsandbox ，部署到 Vercel 时切换到 Vercel Sandbox。切换通过 adapter 完成，业务代码不变。

**Human-in-the-loop 审批**

工具可以声明 `needsApproval`。当流程执行到需要人工确认的步骤，会话暂停，不占用算力；审批通过后从断点继续。

**Connections 安全连接**

MCP 或 OpenAPI 形式的连接以文件声明。鉴权由框架代理，模型本身不接触 URL 和凭证。OAuth 流程由 Vercel Connect 处理。

**多 Channel 支持**

同一个 Agent 可以同时服务 HTTP、Slack、Discord、Teams、Telegram、Twilio 等多个入口。Channel 之间还支持 handoff。

**追踪与评估**

Eve 采用 OpenTelemetry 标准输出 trace。内置的 `eve eval` 命令可以本地运行，也可以接入 CI 作为部署门禁。

## 内部已经跑了 6 个 Agent

在开源之前， Eve 已经在 Vercel 内部验证过一轮。据官方博客披露，目前至少有 6 个项目基于该框架运行：

- **d0**：内部知识问答系统，月查询量超过 **3 万次**
- **Lead Agent**：自主 SDR ，年运行成本约 **$5k**，产出回报约 **32 倍**
- **Athena**： RevOps Agent ，由业务团队在 **6 周内零工程师参与** 搭建完成，接入 Snowflake 与 Salesforce
- **Vertex**：客服工单处理 Agent ，约 **92%** 工单自动解决
- **draft0**：内容审阅流水线
- **V**：路由 Agent ，作为统一入口，将请求分发到内部百级规模的 Agent 舰队

其中 Athena 和 Vertex 的数据尤其说明问题——前者证明非工程角色也可以基于 Eve 搭建生产级 Agent ，后者证明在客服场景下框架的自动化上限已经接近实用阈值。

## 开发与部署

本地开发时，`eve dev` 命令启动一个 TUI 界面，实时展示 `load_skill`、tool call、子 Agent 委托等每一步的执行过程。

部署时， Agent 就是一个普通 Vercel 项目，运行 `vercel deploy` 即可。据 Vercel 介绍，部署不会中断进行中的会话——老会话会继续在启动它的版本上运行，直到自然结束。

沙箱、Channel、Connection 等基础设施通过 adapter 切换。同一份 Agent 代码在本地和云端的行为差异被收敛到配置层。

## 框架化的代价与机会

把 Agent 开发框架化意味着 Vercel 在押注一件事：**Agent 的架构模式已经稳定到可以被抽象的程度**。

文件系统优先的约定让团队协作、代码审查、版本管理都能直接复用现有工具链；内建的 Durable Workflow 和沙箱则把通常需要在业务层反复实现的生产能力下沉到框架。

代价是，一旦选择 Eve ， Agent 的结构、Channel 的接入方式、Connection 的鉴权流程都会与 Vercel 的部署栈深度绑定。

Vercel 显然认为这个交换值得。Next.js 的故事已经证明，当一个领域出现足够好的框架约定，开发效率的提升会反过来扩大整个生态的规模。

Eve 是否能复制这条路径，取决于它能否在 Vercel 生态之外找到足够多的真实生产场景。