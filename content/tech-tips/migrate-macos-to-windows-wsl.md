---
title: 从 macOS 迁移到 Windows 开发环境
date: 2026-02-03
lastmod: "2026-02-03T07:33:15.721Z"
tags: ["Windows", "WSL", "开发环境"]
---

![1.00](https://imgx.zzao.club/api/103/%E4%BB%8E*MacOS*%E8%BF%81%E7%A7%BB%E5%88%B0*Windows*?scale=2)

作为一个在 macOS 上开发多年的前端开发者，最近决定尝试 Windows 作为主力开发机。本文详细记录了整个迁移过程和我常用的配置、软件，希望能给同样需要的朋友一些参考。

## windows 开发体验

Windows 原生的开发体验一直被诟病，我从换到 windows 后也确实发现了一些问题。

本来我打算直接使用 WSL2 ，不想让公司的 vpn 软件在系统里随便拉屎。 但是没解决如何把这个软件安装进 debian 里这个问题，所以最后还是破罐子破摔，都装 windows 去了。

刚开始，`pwsh` 配上`oh-my-pwsh`之后视觉上效果还是可以的。

但是自带终端、vscode终端、vscode项目内的一些脚本比如 husky，环境竟然都不一致，很无语。 哪怕配好了node环境，husky 里的 precommit 也没法正常使用 node 命令。

并且后面在各种项目里大量尝试 opencode + oh-my-opencode (omo)，发现内存占用特别高，开的窗口多了就会崩溃。（换了wsl + ubuntu 后改善很多）

于是找了个时间，把系统整个重装了。

以下就是我整个wsl/ubuntu/开发环境/软件等配置的分享。

## WSL 安装过程

### 一键安装（推荐）

Windows 11 或 Windows 10 2004+ 直接一条命令：`wsl --install`

会自动完成：启用 WSL 功能、安装 Linux 内核、设置 WSL2 为默认、安装 Ubuntu。

重启电脑即可使用。

### 手动安装

如果一键安装不可用，需要手动：

1. 启用 WSL 和虚拟机平台功能（以管理员身份运行 PowerShell，使用 `dism.exe` 命令）
2. 设置 WSL2 为默认版本（Windows 11 通常已默认）
3. 安装 Ubuntu 22.04：`wsl --install -d Ubuntu-22.04`
4. 验证：`wsl --list --verbose`

## WSL 磁盘迁移：从 C 盘到其他盘

WSL 默认装 C 盘，空间不够可以迁移。我的迁移流程是：

1. 关闭 WSL：`wsl --shutdown`
2. 导出备份：`wsl --export Ubuntu-22.04 D:\wsl-backup\ubuntu-22.04.tar`
3. 注销原实例：`wsl --unregister Ubuntu-22.04`
4. 创建新目录：`mkdir D:\WSL\Ubuntu-22.04`
5. 导入到新位置：`wsl --import Ubuntu-22.04 D:\WSL\Ubuntu-22.04 D:\wsl-backup\ubuntu-22.04.tar`
6. 设置默认用户：`ubuntu2204.exe config --default-user your_username`

**迁移结果**：从 C 盘迁到 D 盘，拥有近 1TB 可用空间。

## WSL + Ubuntu 核心配置

### /etc/wsl.conf 配置

创建 `/etc/wsl.conf` 文件，启用 systemd 和镜像网络模式：

- `[boot]` 中设置 `systemd=true` → 可以使用 `systemctl` 管理服务
- `[network]` 中设置 `networkingMode=mirrored` → WSL 和 Windows 共享 IP，性能更好

> 提示：Windows 开始菜单搜索 "wsl settings" 可以可视化配置

修改后需要重启 WSL：`wsl --shutdown`

### 代理配置

我使用 Clash for Windows（开系统代理、不开 TUN 模式），在 `.zshrc` 中设置代理环境变量：

- `export HTTP_PROXY="http://127.0.0.1:7890"`
- `export HTTPS_PROXY="http://127.0.0.1:7890"`
- `export ALL_PROXY="socks5://127.0.0.1:7890"`

由于使用镜像网络模式，WSL 可以直接通过 `127.0.0.1` 访问 Windows 的代理端口。

### 文件系统挂载

Windows 磁盘自动挂载到 WSL：

- C 盘 → `/mnt/c`
- D 盘 → `/mnt/d`
- 以此类推

## 前端开发环境配置

### 包管理器策略

我的策略：**全局工具用 Bun，Node 版本管理用 fnm，项目依赖用 pnpm**

- **Bun**：全局工具速度快、性能好
- **fnm**：轻量级版本管理器，比 nvm 快，支持 `.node-version` 和 `.nvmrc` 自动切换
- **pnpm**：项目依赖管理

### 安装与版本

**Bun 安装**：`curl -fsSL https://bun.sh/install | bash`

**fnm 安装**：`curl -fsSL https://fnm.vercel.app/install | bash`
- 配置自动切换：`eval "$(fnm env --use-on-cd)"`
- 安装 Node：`fnm install 22 && fnm use 22 && fnm default 22`

**pnpm 安装**：`bun install -g pnpm`

我的版本：fnm 1.38.1、Node 22.21.1、Bun 1.3.7、pnpm 10.11.0

### 实际使用

```bash
# 全局工具用 Bun 安装
bun install -g typescript tsx vite pm2

# 项目开发时
fnm use                 # 自动切换 Node 版本
pnpm install           # 安装依赖
pnpm dev               # 启动开发服务器
```

## Zsh + Oh My Zsh 配置

### 安装

1. **Zsh**：`sudo apt install zsh -y`，设为默认：`chsh -s $(which zsh)`
2. **Oh My Zsh**：官方安装脚本 `sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"`
3. **Powerlevel10k 主题**：`git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k`
4. **必装插件**：
   - zsh-autosuggestions：`git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions`
   - zsh-syntax-highlighting：`sudo apt install zsh-syntax-highlighting` 或 git clone

### 我的配置

**在 `~/.zshrc` 中**：

- 主题：`ZSH_THEME="powerlevel10k/powerlevel10k"`
- 插件：`plugins=(git zsh-autosuggestions zsh-syntax-highlighting z extract)`
- 代理（默认启用）：
  ```bash
  export HTTP_PROXY="http://127.0.0.1:7890"
  export HTTPS_PROXY="http://127.0.0.1:7890"
  export ALL_PROXY="socks5://127.0.0.1:7890"
  ```
- fnm 自动切换 Node 版本：`eval "$(fnm env --use-on-cd)"`

### 字体设置（重要）

Powerlevel10k 需要 Nerd Fonts。推荐 **MesloLGS NF**，下载地址：https://www.nerdfonts.com/font-downloads

在 Windows Terminal 中设置：设置 → Ubuntu-22.04 → 外观 → 字体 → 选择 MesloLGS NF

## WSL + VSCode 开发配置

### 核心要点

**必装扩展**：Remote - WSL（在 WSL 端安装其他扩展）

**常用扩展**（在 WSL 端）：
- ESLint、Prettier：代码检查和格式化
- Volar：Vue 3 开发
- Tailwind CSS IntelliSense：类名提示
- GitLens：Git 增强
- GitHub Copilot：AI 补全
- GitHub Actions：CI/CD 管理

### 从 WSL 启动 VSCode

```bash
# 在当前目录打开
code .

# 打开指定目录
code ~/projects/my-project
```

首次运行会自动在 WSL 中安装 VSCode Server。

### 配置要点

- 启用保存时格式化和 ESLint 自动修复
- 设置 Zsh 为默认终端
- 排除不必要的文件监控（node_modules、.nuxt、.next、dist）
- **项目放在 WSL 文件系统** `~/projects/`，不要放 `/mnt/c/`（很慢）
- Windows Defender 排除 WSL 目录：`Add-MpPreference -ExclusionPath "D:\WSL"`

## OpenCode 配置

OpenCode 是一个强大的 AI 辅助编程工具，支持多种模型和自定义 agent。

### 安装与配置

使用 oh-my-opencode 可以一键安装并自动配置：

- 安装命令：`bunx ohmyopencode@latest install`
- 按照提示选择模型和配置即可

## 常用软件

### Raycast (软件启动器)

一开始 windows 上我用的是 `utools`，轻度使用，我知道里面有很多插件，但是打开速度真心不快。 而仅仅作为软件启动器来用，因为我喜欢把桌面上的图标都删掉，露出整个壁纸。

重装完之后，和群里的小伙伴交流了之下，才发现 Raycast 有 windows 版本，于是尝试了一下，体验上比 windows 强的多。

比如，我会在搜索框内简单算个数，能可以直接打开 `web search`，其他就是启动软件了，刚注册是可以体验AI功能的，不过我完全用不上。

### 微信输入法

微信输入法本身输入法相关的功能其实是不如搜狗的，可能也不如别的。 但是它生的好，生态就好。经过和其他设备配对之后，可以很方便的**多端文本、图片复制**。带有文本剪贴板历史，按`v`键激活，也能省下一个单独的剪贴板软件。

手机端的微信输入法还自带排版成图，类似发小红书的时候把短标题弄个简单背景再发出去。前一阵我用来给文章配封面，但是现在我有自己的[IMGX](https://imgx.zzao.club)了，也不太需要了。

### PixPin 截图工具

截图工具一般都要有一个，这个是开源的。我想我还在用它的唯一原因就是我还没来得及用AI复刻一个截图工具吧。

### Zotepad 文章编辑器/发布工具

本来我在 macos 上使用 Obsidian 的，但是我用 AI 又给自己写了一个编辑器。并且集成常用的软件，自己常用的工作流。只会越用越顺手。

这个工具基于 Tauri2 + Nuxt4，多端一致，目前每次都会打包 macos/安卓/exe 这三个平台的包，对应我在公司使用 windows，在家使用 macos，手上拿的安卓手机。

目前我内置了**图床功能**，可以直接上传到腾讯云对象存储，所以我卸载了PicGo (感谢PicGo的陪伴)。

在我用zotepad写文章时，可以直接打开侧边栏选择已经上传的图片插入，感觉方便多了。

markdown编辑器选的 `milkdown`，所见即所得模式。 复制样式到公众号，这个功能在我博客站上就有，也挪过来了。并且用博客站做了公众号接口的转发，可以直接在编辑器内点击发送到公众号草稿箱。支持文章和图文两种模式。发送完再去手机端的公众号助手审一遍就可以发布了。

### Flyenv

我主要拿它来运行Ngxin、Mysal、Redis、PGSQL，是作为不能用`Docker Desktop`时的替代品。

## 使用感受

**WSL 是最好的 Linux 发行版，Windows 是最好的 Linux 桌面**

这话说的没毛病。

重点是所有开发环境、代码都在 Ubuntu 里，下次换另一台电脑就和从c盘迁移到别的盘一样，直接把整个打包出来就可以了，十分方便。

而且可以随意安装多个linux环境，可以实验各种配置，玩坏了直接删除重建。比当年自己装双系统啥的省事多了。

***

好了结束，有问题欢迎交流。
