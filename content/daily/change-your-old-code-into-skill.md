---
title: 没用的旧代码不要丢，放到SKILL里继续用
date: "2026-01-15T19:31:33.000Z"
lastmod: "2026-01-16T07:11:29.554Z"
tags: ["AI"]
---

## 前言

没用的旧代码不要丢，也不要放在转转上回收😄

放到`SKILL`里当做一个脚本来用说不定会更合适。

## SKILL

> `SKILL`是AI编程助手（如OpenCode）中的一种可复用工作流机制。它诞生的背景是：传统的Prompt工程中，开发者需要反复编写相似的指令和上下文说明，既低效又容易遗漏细节。SKILL将"意图描述 + 详细要求 + 工具脚本"打包成一个可被AGENT智能识别和调用的单元，让过往积累的代码、脚本和工作流程得以在AI时代继续发挥价值。

![SKILL 概念图](/illustrations/skill-reuse-old-code/illustration-skill-concept.png)

`SKILL`从前端的概念上来理解，类似于一个`composable`。

它可以是一段写好的Prompt，也可以有单个脚本（函数），也可以是多个脚本，所以比单纯的**函数复用**要更灵活和多变一些。

![SKILL 像 Composable](/illustrations/skill-reuse-old-code/illustration-composable-concept.png)

那它和`MCP`（MCP只是协议，但下文MCP同时指代背后的服务）有什么区别呢

MCP就类似于一张「入场券」，仅仅是提供给**Agent**调用此服务的接口。

在调用`MCP`时，往往需要你先写一段`Prompt`，交待背景、角色、要做什么，然后AGENT再去调用MCP，拿到结果，按你说的要求整理和执行下一步动作。

SKILL好就好在，它可以记住你这一套操作，是真正的复用。

![MCP vs SKILL 流程对比](/illustrations/skill-reuse-old-code/illustration-mcp-vs-skill.png)

在执行一项任务前，你的**意图**就是这个`SKILL`的`description`。你的**要求**就是它的`SKILL.md`。你的**MCP**，也就是那个**输出结果明确的服务或脚本**，同样可以用在`SKILL/scripts`里。

所以，以前对自己有用的服务、脚本，到今天依然可用。仅仅是换了一种调用方式

## 职能细化

在 `opencode`/`claudecode` 中`SKILL`的调用方式，类比传统的服务/古法编程，从明确的函数调用、接口请求，变成了AGENT语义理解并调用`SKILL`。

**传统：后端提供接口 => https\://api.example.com/get/xxx**

**SKILLS: SKILL/description**

当给`AGENT/Primary`阐述我们的要求时，它会理解和规划你的要求，并且查看SKILLS里的**description**是否在你的要求内，如果有SKILL符合，则使用SKILL来完成。

> **所以Description就是给AGENT的接口文档**

![Description 就是接口文档](/illustrations/skill-reuse-old-code/illustration-description-as-api.png)

此时SKILL里的SKILL.md刚刚被加载到上下文，它就会开始执行这个SKILL里的任务，所以你在这个SKILL.md才是你最详细的要求，以及完成后要做什么。而不是一开始就发一大段`Prompt`，发现有问题之后，再说你哪里哪里理解的不对，是这样那样。

多个SKILL之间可以在其内部的任务要求中达到串联协作，或者通过一个SKILL把其他SKILL串联。注意，**串联的前提是AGENT能够从你的任务描述中理解应该使用哪个具体的SKILL。。**

在`Vscode`中用`Github Copilot`编程时，大模型经常会犯一些无语的错误。

比如，总是要生成文档。写个东西，二话不说文档先写一长串，或者是做完用文档总结一下。当然，这只是某些模型的特点。

再比如，写完代码，格式乱了、错行了，TS类型错了。这种错误经常出现。它不知道用项目自带的`lint`命令修复，哪怕你写到某个它默认会携带到上下文里的md文档里。因为一个窗口做的任务太多了，不知道哪次对话就把某个要求给丢了。

这些错误在我使用了`opencode` + `ohmyopencode` 之后就很少出现了。原因应该也是职能的细化，使其大模型工作效率提高了不少。工具的进化也让上下文问题优化了许多。

**所以，学的慢学的晚也不是坏事了，眼一闭一睁，问题已经在源头被解决了。**

## 能力扩展

`SKILL`放在代码里仅仅是提高准确性和复用率，（个人感觉）放在非编程领域可能会更好使一些。

在`SKILL`之前，普遍用`workflow`来编排自己的各种任务，（比如n8n）以达到自动化的效果。这让原本就有赚钱业务的人更加赚钱。

SKILL的能力不在workflow之下。

假如发一篇文章原本的模式是这样的：

先让A开发一个脚本、服务，完成抓取数据、处理数据等需求。然后由A把数据发给B，B负责润色文案，交给C去处理文章配图，最后交给D勘误和审核，然后再进行多平台发布。

有个AI之后，A肯定是不要了，大模型写出来的更快更好。B也不要了，AI自己润色。C也不要了，AI生图。D也不要了，AI勘误。多平台发布，以前就是聚合平台，现在还继续用。

所以只需要你一个人，把ABCD之间的调度（使用自然语言）粘合在一起。ABCD要做什么是固定的，产出也是固定的。你也不必把他们所有的工作职能都放在自己这，只需要明确：\*\*进行到哪一步，去找谁解决。\*\*最后再配个监理，持续敲打。

![工作流简化对比](/illustrations/skill-reuse-old-code/illustration-workflow-simplified.png)

你看，非编程领域是不是可以先一步下岗了。😄

***

一点SKILL的小思考

🔚
