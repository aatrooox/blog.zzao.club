---
title: Qwen3.6-Plus 更新亮点：更强 Agent 编码，更稳多模态理解
date: '2026-04-02'
platform: blog
description: 基于 Qwen 官方博客整理，介绍 Qwen3.6-Plus 在 Agent 编码、1M 上下文、多模态推理与 API 能力上的更新亮点。
author: Aatrox
canonical: https://zzao.club/post/ai/qwen36-plus-update-highlights
---

Qwen3.6-Plus 正式来了，API 已经可用。

这次更新最直接的两个关键词，是更强的 Agent 编码能力，以及更稳的多模态理解。

先看一个硬指标：Qwen3.6-Plus 默认就是 1M context window。对需要长上下文读仓库、跑任务、串联多轮操作的 Agent 来说，这不是参数升级这么简单，而是可执行范围直接变大。

配图1

这次模型重点强化了 agentic coding，覆盖前端开发、复杂仓库级问题处理、终端操作、自动任务执行这些更接近真实工作的场景。它不只是会补代码，而是在往“能把任务做完”的方向继续推。

另一条明显升级线，是多模态感知与推理。官方提到，文档理解、OCR、空间理解、视频理解等能力都有增强。也就是说，模型不只更会写，也更会看、更会理解复杂输入。

Qwen 这次还反复强调 reasoning、memory、execution 的融合，目标很明确：不是做一个只会对话的模型，而是做面向 real world agents 的基础能力底座。

API 层面也有一个对 Agent 场景很实用的新点：新增 preserve_thinking。对需要保留推理连续性、做多步执行编排的调用方式来说，这个能力很关键。

落到接入层，Qwen3.6-Plus 也已经可以接进 OpenClaw、Claude Code、Qwen Code 这类编码助手里。对开发者来说，这意味着它不是纸面参数升级，而是能更快进到真实工作流。
