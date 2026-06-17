---
title: "Hermes Desktop 安装及界面功能速览"
date: 2026-06-09
description: "Hermes 出桌面端有几天的时间了，但是 0.16.0 以前 bug 实在是略多。比如，聊天框内的内容无法回车发送（也没有发送按钮）；点击更新按钮重启，无法正常更新，也不会重启。"
author: user
---


Hermes 出桌面端有几天的时间了，但是 0.16.0 以前 bug 实在是略多。比如，聊天框内的内容无法回车发送（也没有发送按钮）；点击更新按钮重启，无法正常更新，也不会重启。

**有点使用 OpenClaw 的阴影了**

在`0.16.0`版本，加入了简体中文，以及修复了大量的 bug ，算是可以正常使用了，这篇文章带大家**速览一下桌面端的配置，方便你判断一下该不该安装它**。

## 下载和安装

### **Linux / macOS / WSL2 / Android (Termux)**

```
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash

```

### **Windows (native)**

在 powershell 运行:

```
iex (irm https://hermes-agent.nousresearch.com/install.ps1) 

```

如果你已经使用了 Hermes Cli 了，只需要运行这个命令

```
hermes desktop
```

Hermes 的桌面端是本地编译的，安装 Electron 和 node\_modules 相当慢，还要下载 Chromium、Playwright 等等。所以网络失败的可能非常大，开 TUN 模式后重试几次应该就可以了。

## 界面介绍

安装后，界面长这样，目前看起来所有的 desktop 都在朝着 Codex 的方向发展了，看起来就像是换了个皮肤一样

![1.00](https://img.nezus.cn/nezus/a41666a0-4588-493a-9ce5-3d34fcf5dd3f/notes/66c6eb88-7d7a-42ff-a820-8eeccd5671a2/2026068_Hermes%202026-06-08%2009.43.12.png "Hermes Agent Desktop")

点击右上角的设置按钮，可以先修改语言为简体中文。如果没有显示语言选项，说明版本太低，建议直接重新安装最新的

![1.00](https://img.nezus.cn/nezus/a41666a0-4588-493a-9ce5-3d34fcf5dd3f/notes/66c6eb88-7d7a-42ff-a820-8eeccd5671a2/2026068_image.png)

修改模型，有两处，分别对应默认设置和临时会话设置

![1.00](https://img.nezus.cn/nezus/a41666a0-4588-493a-9ce5-3d34fcf5dd3f/notes/66c6eb88-7d7a-42ff-a820-8eeccd5671a2/2026068_Hermes%202026-06-08%2010.29.51.png "设置默认模型")

<br />

![1.00](https://img.nezus.cn/nezus/a41666a0-4588-493a-9ce5-3d34fcf5dd3f/notes/66c6eb88-7d7a-42ff-a820-8eeccd5671a2/2026068_image.png "设置临时（当前会话）模型")

配置聊天平台也方便不少，直接去对应的平台设置自己的 Bot ，然后再回来填写表单

![1.00](https://img.nezus.cn/nezus/a41666a0-4588-493a-9ce5-3d34fcf5dd3f/notes/66c6eb88-7d7a-42ff-a820-8eeccd5671a2/2026068_Hermes%202026-06-08%2010.32.11.png "以 QQ Bot 为例")

输入框右侧已经是**支持语音对话、语音转写**了，但要到「设置」-「语音」页面去**设置自己的 TTS 模型**

在桌面端直接**设置人格**

![1.00](https://img.nezus.cn/nezus/a41666a0-4588-493a-9ce5-3d34fcf5dd3f/notes/66c6eb88-7d7a-42ff-a820-8eeccd5671a2/2026068_Nezus%202026-06-08%2010.38.18.png)

直接**设置各种消息平台**，但是对应的消息平台侧的一些权限配置还是要自己设置的

![1.00](https://img.nezus.cn/nezus/a41666a0-4588-493a-9ce5-3d34fcf5dd3f/notes/66c6eb88-7d7a-42ff-a820-8eeccd5671a2/2026068_Nezus%202026-06-08%2010.53.06.png "主界面-消息平台-飞书为例")

如果要**管理会话、查看 token 消耗**，可以点击左下角按钮

![1.00](https://img.nezus.cn/nezus/a41666a0-4588-493a-9ce5-3d34fcf5dd3f/notes/66c6eb88-7d7a-42ff-a820-8eeccd5671a2/2026068_Nezus%202026-06-08%2011.01.50.png "会话、用量管理")

最后，输入框中有快捷的选择自己本机文件、文件夹、图片等常规操作，有个**提示词片段**，**但是还不能自定义**，估计后续会加的。

右上角向右展开是当前目录的文件

左下角（ 2 ）处，是 Hermes 的多 Agent ，点击第二个按钮就可以看到其他 Agent 的会话

![1.00](https://img.nezus.cn/nezus/a41666a0-4588-493a-9ce5-3d34fcf5dd3f/notes/66c6eb88-7d7a-42ff-a820-8eeccd5671a2/2026068_Hermes%202026-06-08%2011.09.19.png "多 Agent 切换入口、聊天功能")

同时可以看到右下角 **版本号#hash** 如果是高亮色了，表示可以更新了。

点击就能立即更新，会出现一个更新界面，**rebuild hermes desktop app**，最后自动重启。

对于普通玩家更新的建议就是，能更就更， bug 太多了，根本改不完。更的慢了，隔几个版本就怕破坏性更新太大，直接抢救不回来了。

对于已经稳定在跑业务的，还是停在某个版本比较好。哪怕是后面想更，但是崩了，这些配置也仅仅是对应一些配置文件，没有 AI 抢救不回来的。

## 总结

桌面端就是把 CLI 的功能全部实现一遍，但是因为 CLI 只是开发者的玩具，再便利再好看也天然存在跨行业的壁垒，真实的用户基本上是用不了的。

所以日常使用想要真的提效的，还是需要 GUI ，或者说是从有 GUI 以来，普通用户就被训练成 GUI 的形状了。

不过目前界面同质化非常严重，基本各家做的都是一个样。等到谁家又出来好用的交互方式，大家再跟着对标。

但是不管用哪家，**你的核心资产只有 SKILL 和提示词**

越是依赖某个 Agent 也有的记忆能力、插件、钩子，越难以搬家，并且一旦有什么创新性更新，会对自己的工作流影响比较大

现阶段，没有最佳范式，也不必定义。

没有业务就是玩具。有业务，能降本增效就是好东西。