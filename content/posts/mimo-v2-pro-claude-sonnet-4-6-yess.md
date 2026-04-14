---
title: "Mimo-v2-pro (满血版) 可以用来替换Claude Sonnet 4.6！小米yess"
date: 2026-04-14
description: "基于 Hermes 最新版本，来测试我精心打磨好的创作辅助流程：从搜索总结、写作、润色、Markdown 排版、生成封面图、生成贴图的多图、贴图图片中插入插图、发布。"
author: aatrox
---


基于 Hermes 最新版本，来测试我精心打磨好的创作辅助流程：从搜索总结、写作、润色、Markdown 排版、生成封面图、生成贴图的多图、贴图图片中插入插图、发布。

本来是非常想买智谱的 Coding Plan 或者阿里百炼的，但是实在是抢不到，只好来白嫖小米辣。

整套流程是完全编排好的，该补的坑都补得差不多了。

除了前三步（搜索总结、写作/润色）是 sub-agent （ mimo-v2-pro ），从 markdown 排版往后全是 CLI ，纯代码生成，只考验 LLM 能否正确理解我的状态机。

## 流程状态机

状态比较多。

当新任务开始时：

- 生成封面图时需要拿到 sub-agent 给出的高亮建议
- 贴图 1 ：内容过长自动分页排版出图
- 贴图 2 ：短内容但强制分页
- 贴图 3 ：分页中插入插图（会和文字自动绕排）

如果是中途开始：

需要使用 pipeline 拿到当前所有活跃状态的任务（一个或多个），然后判断目前任务处于哪一步，开始自动补齐所有要素（此时该向用户要图的就通过聊天索要，没写由用户提供的就可能回去自己搜索），要素齐全等于可以发布。

## 调用链实测

下边是发文章和贴图的用户指令以及 Hermes 完整调用链。

发文章：

![发文章调用链](https://img.zzao.club/blog/01955151-643c-7920-a170-4e908fc0ae20/blog/mimo-v2-pro-claude-sonnet-4-6-yess/20260414_img1.jpg)

发贴图：

![发贴图调用链](https://img.zzao.club/blog/01955151-643c-7920-a170-4e908fc0ae20/blog/mimo-v2-pro-claude-sonnet-4-6-yess/20260414_img2.jpg)

主要看它有没有绕路，本来一行命令就能解决的，它如果去读 cli 的源码，就说明有地方写的不清晰或它本身理解有问题。这一点可以直接拿 Sonnet 4.6 来做对比测试， Sonnet 完全没去碰源码，直接执行完了，证明提示词是全的（哪怕不合理）。

草稿箱里最终效果：

![草稿箱最终效果](https://img.zzao.club/blog/01955151-643c-7920-a170-4e908fc0ae20/blog/mimo-v2-pro-claude-sonnet-4-6-yess/20260414_img3.jpg)

**唯一缺点就是我的 pipeline 里的排版算法有点问题，没有很优雅地占满整个图（基于 pretext ），所以和大模型能力关系不大了。**

这几种场景，大概测了十几遍。

**白天的 Mimo 是没问题的，从晚上 7 点左右开始变慢变傻了。**

## 小米模型定价

下边是小米官方目前的 Token Plan ，没有售罄和排队。

![小米 Token Plan 定价](https://img.zzao.club/blog/01955151-643c-7920-a170-4e908fc0ae20/blog/mimo-v2-pro-claude-sonnet-4-6-yess/20260414_img4.jpg)

然后解释一下它这个 credits 是啥意思：统一 Credit 点数体系，按 Token 使用量换算 Credit 消耗量。

- MiMo-V2-Omni 256k 上下文： 1x （消耗 1 Token = 1 Credit ）
- MiMo-V2-Pro 256k 上下文： 2x （消耗 1 Token = 2 Credits ）
- MiMo-V2-Pro 256k~1M 上下文： 4x （消耗 1 Token = 4 Credits ）
- MiMo-V2-TTS ： 0x （限时免费，不消耗 Credit ）

所以你可以按自己一天的用量，和大概的上下文估算一下一个月需要多少 Credits。

## Hermes 免费模型的门槛

免费模型是用的它自己家的 Nous ，在 Hermes 里是一个单独的 Provider ，走 setup 可以授权。

进入 Nous Portal 后， 0 元套餐要绑定一个 Visa 信用卡，地区我选的中国香港，付了 0.1$。

其次 Api key 生成时，账户里不能没有钱。

![Nous Portal API Key](https://img.zzao.club/blog/01955151-643c-7920-a170-4e908fc0ae20/blog/mimo-v2-pro-claude-sonnet-4-6-yess/20260414_img5.png)

充一次最少 10$。

![充值弹窗](https://img.zzao.club/blog/01955151-643c-7920-a170-4e908fc0ae20/blog/mimo-v2-pro-claude-sonnet-4-6-yess/20260414_img6.png)

他们的套餐里有 344 个可用模型， OpenAI、Anthropic、Google （ Gemma 4 Free ）、智谱（有 5.1 ）、Minimax、Kimi 等等，挺全的。

还有他们自家的俩个模型：

**Hermes-4-70B**
- 128k tokens ctx
- $0.05/1M prompt tokens
- $0.20/1M completion tokens

**Hermes-4-405B**
- $0.09/1M prompt tokens
- $0.37/1M completion tokens

别的国产模型，等买到后，也会测的！
