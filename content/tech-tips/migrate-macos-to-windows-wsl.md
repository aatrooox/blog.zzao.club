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

### 安装方式选择

WSL 提供了两种安装方法：

**方法一：一键安装（推荐）**

如果你使用 **Windows 11** 或 **Windows 10 2004+** 版本，可以直接使用一键安装命令：

```powershell
# 以管理员身份打开 PowerShell，执行一条命令即可
wsl --install
```

这个命令会自动完成以下操作：

* 启用 WSL 和虚拟机平台功能

* 下载并安装 Linux 内核更新包

* 将 WSL 2 设置为默认版本

* 安装 Ubuntu 发行版（最新版本）

安装完成后重启电脑即可使用。**Windows 11 系统已经默认设置为 WSL2，无需手动设置版本。**

**方法二：手动安装**

如果你的系统版本较老，或者需要更精细的控制，可以使用手动安装方式。下面详细说明手动安装的每一步。

### 手动安装步骤

#### 1. 启用 WSL 和虚拟机平台功能

以管理员身份打开 PowerShell，执行：

```powershell
# 启用 WSL 功能
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# 启用虚拟机平台（WSL2 必需）
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# 重启电脑
Restart-Computer
```

#### 2. 设置 WSL2 为默认版本（可选）

重启后，继续在 PowerShell 中执行：

```powershell
wsl --set-default-version 2
```

> **注意**：如果你使用的是 Windows 11，系统通常已经默认设置为 WSL2，可以跳过这一步。

#### 3. 安装 Ubuntu 22.04

```powershell
# 列出可用的发行版
wsl --list --online

# 安装 Ubuntu 22.04
wsl --install -d Ubuntu-22.04
```

安装过程中会提示你创建 Linux 用户名和密码。

### 4. 验证安装

验证 WSL 安装：`wsl --list --verbose`

应该能看到 Ubuntu-22.04 的版本为 2，状态为 Running。

## WSL 磁盘迁移：从 C 盘到其他盘

WSL 默认安装在 C 盘，随着开发环境的膨胀，C 盘空间很容易不够用。好在 WSL 支持迁移到其他磁盘。

### 迁移步骤

#### 1. 导出当前的 WSL 发行版

```powershell
# 先关闭 WSL
wsl --shutdown

# 导出为 tar 文件（这个过程可能需要几分钟）
wsl --export Ubuntu-22.04 D:\wsl-backup\ubuntu-22.04.tar
```

#### 2. 注销原发行版

**⚠️ 警告：此操作会删除 C 盘上的 WSL 实例！请确保已导出备份。**

```powershell
wsl --unregister Ubuntu-22.04
```

#### 3. 在新位置导入

```powershell
# 在新磁盘创建目录
mkdir D:\WSL\Ubuntu-22.04

# 导入发行版到新位置
wsl --import Ubuntu-22.04 D:\WSL\Ubuntu-22.04 D:\wsl-backup\ubuntu-22.04.tar
```

#### 4. 设置默认用户

导入后默认会以 root 用户登录，需要设置回你的用户：

```powershell
# 方法1：通过配置文件
ubuntu2204.exe config --default-user your_username

# 方法2：修改 /etc/wsl.conf（在 WSL 内执行）
echo -e "[user]\ndefault=your_username" | sudo tee /etc/wsl.conf

# 重启 WSL
wsl --shutdown
```

#### 5. 验证迁移结果

```powershell
# 检查 WSL 位置
wsl --list --verbose

# 进入 WSL 检查磁盘空间
wsl -d Ubuntu-22.04
df -h
```

我的迁移结果：

```
Filesystem      Size  Used Avail Use% Mounted on
/dev/sdd       1007G   13G  944G   2% /
```

成功！从 C 盘迁移到了 D 盘，拥有了近 1TB 的可用空间。

## WSL + Ubuntu 核心配置

### /etc/wsl.conf 配置

创建 `/etc/wsl.conf` 文件，配置 WSL 行为：

```ini
[boot]
systemd=true
```

启用 systemd 后，可以使用 `systemctl` 管理服务，就像在真实的 Linux 系统中一样。

修改后需要重启 WSL：`wsl --shutdown`

### 网络配置

#### 使用镜像网络模式

WSL2 默认使用 NAT 网络，但镜像网络模式能提供更好的网络体验，让 WSL 和 Windows 共享同一个网络栈。

> 在开始目录直接搜索wsl settings也可以可视化的勾选这些配置

在 `/etc/wsl.conf` 中添加网络配置：

```ini
[boot]
systemd=true

[network]
# 启用镜像网络模式
networkingMode=mirrored
```

**镜像网络的优势**：

* WSL 和 Windows 共享相同的 IP 地址

* 更好的网络性能

* 简化端口转发配置

* 更接近原生 Linux 的网络体验

修改后需要重启 WSL：`wsl --shutdown`

#### 代理配置

如果你使用 Clash for Windows 等代理工具，需要在 WSL 中配置代理。我的配置是：

**Windows 端（Clash for Windows）**：

* ✅ 开启"系统代理"

* ❌ 不开启 TUN 模式

* 默认监听端口：7890（HTTP/HTTPS）、7891（SOCKS5）

**WSL 端配置**：在 `.zshrc` 中配置代理环境变量（见下文 Zsh 配置章节）。

由于使用镜像网络模式，WSL 可以直接通过 `127.0.0.1` 访问 Windows 的代理端口，无需获取 Windows 的 IP 地址。

#### 文件系统挂载

Windows 磁盘会自动挂载到 WSL：

* C 盘：`/mnt/c`

* D 盘：`/mnt/d`

* 以此类推...

可以在 Linux 中直接访问 Windows 文件系统。

## 前端开发环境配置

### 包管理器优先级策略

我的策略是：**全局工具优先用 Bun，Node 版本管理用 fnm**。

#### 为什么这样选择？

1. **Bun**：安装全局包速度快，运行时性能好，适合安装全局 CLI 工具
2. **fnm**：轻量级 Node 版本管理器，比 nvm 快，支持 `.node-version` 和 `.nvmrc` 自动切换
3. **项目内用 pnpm/npm**：根据项目配置使用对应的包管理器

### 安装 Bun

```bash
curl -fsSL https://bun.sh/install | bash
```

Bun 会自动安装到 `~/.bun`，并配置环境变量。

验证安装：`bun --version`（输出：`1.3.7`）

### 安装 fnm（Fast Node Manager）

```bash
curl -fsSL https://fnm.vercel.app/install | bash
```

配置 fnm（已在 `.zshrc` 中配置）：

```bash
# fnm
FNM_PATH="/root/.local/share/fnm"
if [ -d "$FNM_PATH" ]; then
  export PATH="$FNM_PATH:$PATH"
  eval "`fnm env`"
fi

# 自动根据项目切换 Node 版本
eval "$(fnm env --use-on-cd)"
```

安装 Node.js：

```bash
fnm install 22
fnm use 22
fnm default 22
```

验证安装：
- fnm 版本：`fnm --version`（输出：`1.38.1`）
- Node 版本：`node --version`（输出：`v22.21.1`）

### 安装 pnpm

```bash
# 用 Bun 安装全局 pnpm
bun install -g pnpm

# 或者用 npm
npm install -g pnpm
```

验证安装：`pnpm --version`（输出：`10.11.0`）

### 实际使用建议

```bash
# 全局工具用 Bun 安装（快！）
bun install -g typescript tsx vite pm2

# 项目开发时：
fnm use                 # 自动切换 Node 版本
pnpm install           # 安装依赖
pnpm dev               # 启动开发服务器
```

## Zsh + Oh My Zsh 配置

Ubuntu 默认使用 Bash，但 Zsh 提供了更强大的功能和更好的体验。

### 安装 Zsh

```bash
sudo apt update
sudo apt install zsh -y
```

验证安装：`zsh --version`（输出：`zsh 5.8.1 (x86_64-ubuntu-linux-gnu)`）

### 设置 Zsh 为默认 Shell

设置 Zsh 为默认 Shell：`chsh -s $(which zsh)`

重启终端生效。

### 安装 Oh My Zsh

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

### 安装 Powerlevel10k 主题

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
```

修改 `~/.zshrc`：

```bash
ZSH_THEME="powerlevel10k/powerlevel10k"
```

首次启动会自动运行配置向导：`exec zsh`

根据提示选择你喜欢的样式。我选择的是 **Powerline** 风格。

### 安装必备插件

#### 1. zsh-autosuggestions（命令自动建议）

```bash
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

#### 2. zsh-syntax-highlighting（语法高亮）

```bash
# 方法1：通过 apt 安装
sudo apt install zsh-syntax-highlighting

# 方法2：通过 git 安装
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

### 完整的 .zshrc 配置

我的 `~/.zshrc` 核心配置：

```bash
# Oh My Zsh 安装路径
export ZSH="$HOME/.oh-my-zsh"

# 主题
ZSH_THEME="powerlevel10k/powerlevel10k"

# 启用的插件
plugins=(
    git                    # Git 命令别名
    zsh-autosuggestions    # 命令自动建议
    z                      # 目录跳转（根据历史）
    extract                # 解压任意格式压缩包
)

source $ZSH/oh-my-zsh.sh

# fnm（Node 版本管理）
FNM_PATH="/root/.local/share/fnm"
if [ -d "$FNM_PATH" ]; then
  export PATH="$FNM_PATH:$PATH"
  eval "`fnm env`"
fi
eval "$(fnm env --use-on-cd)"

# Bun
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# 代理配置（默认启用）
# Clash for Windows 配置：开启系统代理，不开启 TUN 模式
# 镜像网络模式下，WSL 可直接通过 127.0.0.1 访问 Windows 代理
export HTTP_PROXY="http://127.0.0.1:7890"
export HTTPS_PROXY="http://127.0.0.1:7890"
export ALL_PROXY="socks5://127.0.0.1:7890"

# 关闭代理的函数
unproxy() {
    unset HTTP_PROXY
    unset HTTPS_PROXY
    unset ALL_PROXY
    echo "代理已关闭"
}

# 语法高亮（放在配置文件最后）
source /usr/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

# Powerlevel10k 配置
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
```

### 插件使用技巧

| 插件                      | 功能         | 使用示例                                                 |
| ----------------------- | ---------- | ---------------------------------------------------- |
| **git**                 | Git 命令简化   | `gst`（git status）、`gco`（git checkout）、`gp`（git push） |
| **zsh-autosuggestions** | 根据历史自动建议命令 | 输入 `cd pro`，自动提示之前输入过的 `cd projects/`                |
| **z**                   | 智能目录跳转     | `z blog` 会跳转到常用的 blog 目录                             |
| **extract**             | 万能解压       | `extract file.tar.gz`、`extract file.zip` 都能识别        |

### 终端字体配置（重要！）

Powerlevel10k 需要支持 Nerd Fonts 的字体才能正常显示图标。

推荐字体：

* **MesloLGS NF**（Powerlevel10k 推荐）

* **JetBrains Mono Nerd Font**

* **Fira Code Nerd Font**

下载地址：<https://www.nerdfonts.com/font-downloads>

在 Windows Terminal 中设置字体：

1. 打开设置（`Ctrl + ,`）
2. 找到 Ubuntu-22.04 配置
3. 外观 → 字体 → 选择 MesloLGS NF

## WSL + VSCode 开发配置

VSCode 对 WSL 的支持非常完善，通过 Remote - WSL 扩展可以获得接近原生 Linux 的开发体验。

### 安装 VSCode（Windows 端）

下载安装：<https://code.visualstudio.com/>

### 安装 Remote - WSL 扩展

在 VSCode 中安装：

* **Remote - WSL**（必装）

### 从 WSL 启动 VSCode

在 WSL 终端中使用以下命令：

- 在当前目录打开 VSCode：`code .`
- 打开指定目录：`code ~/projects/my-project`

首次运行会自动在 WSL 中安装 VSCode Server。

### WSL 端必装扩展

我的 WSL Ubuntu-22.04 扩展列表可通过以下命令查看：

```bash
code --list-extensions
```

输出如下（示例）：

```
bradlc.vscode-tailwindcss          # Tailwind CSS 智能提示
dbaeumer.vscode-eslint             # ESLint 代码检查
eamodio.gitlens                    # Git 增强工具
esbenp.prettier-vscode             # 代码格式化
github.copilot                     # GitHub Copilot AI 代码补全
github.copilot-chat                # Copilot 对话功能
github.vscode-github-actions       # GitHub Actions 支持
golang.go                          # Go 语言支持
ms-ceintl.vscode-language-pack-zh-hans  # 中文语言包
vue.volar                          # Vue 3 语言支持
```

### 扩展说明

| 扩展                            | 用途                                | 必要性   |
| ----------------------------- | --------------------------------- | ----- |
| **ESLint**                    | 代码规范检查，配合项目 `.eslintrc`           | ⭐⭐⭐⭐⭐ |
| **Prettier**                  | 代码格式化（虽然项目用 ESLint 格式化，但某些场景还是需要） | ⭐⭐⭐⭐  |
| **Volar**                     | Vue 3 开发必备，类型检查、智能提示              | ⭐⭐⭐⭐⭐ |
| **Tailwind CSS IntelliSense** | Tailwind 类名提示，开发效率翻倍              | ⭐⭐⭐⭐⭐ |
| **GitLens**                   | 查看代码修改历史、作者、blame 信息              | ⭐⭐⭐⭐  |
| **GitHub Copilot**            | AI 代码补全，显著提升开发效率                  | ⭐⭐⭐⭐⭐ |
| **GitHub Actions**            | 在 VSCode 中管理 CI/CD 工作流            | ⭐⭐⭐   |

### VSCode 配置建议

在 WSL 环境下，创建或修改 `~/.vscode-server/data/Machine/settings.json`：

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue"
  ],
  "editor.fontFamily": "'JetBrains Mono', 'Courier New', monospace",
  "editor.fontSize": 14,
  "editor.lineHeight": 1.6,
  "terminal.integrated.defaultProfile.linux": "zsh",
  "files.autoSave": "onFocusChange"
}
```

### 性能优化建议

1. **排除不必要的文件监控**：在 `settings.json` 中：

```json
{
  "files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/.git/subtree-cache/**": true,
    "**/node_modules/**": true,
    "**/.next/**": true,
    "**/.nuxt/**": true,
    "**/dist/**": true
  }
}
```

1. **项目放在 WSL 文件系统中**：不要把项目放在 `/mnt/c/`，会很慢！应该放在 `~/projects/`。

2. **关闭 Windows Defender 实时保护（针对 WSL 目录）**：

```powershell
# 以管理员身份运行 PowerShell
Add-MpPreference -ExclusionPath "D:\WSL"
```

## OpenCode 配置

OpenCode 是一个强大的 AI 辅助编程工具，支持多种模型和自定义 agent。

### 安装与配置

使用 oh-my-opencode 可以一键安装并自动配置：

- 安装命令：`bunx ohmyopencode@latest install`
- 按照提示选择模型和配置即可

### 使用示例

使用 OpenCode 的常见方式：

- 启动交互式会话：`opencode`
- 指定 agent：`opencode --agent oracle`
- 指定分类：`opencode --category ultrabrain`
- 一次性问题：`opencode "如何实现深拷贝？"`

### 自定义技能（Skills）

在 `~/.config/opencode/skills/` 目录下可以创建自定义技能，常用命令：

- 列出可用技能：`opencode skills list`
- 创建新技能：`opencode skills create my-skill`（实际使用时，大多让 AI 自己去创建，不会用这个命令去创建）

每个技能是一个包含 `AGENTS.md` 和相关提示词文件的目录。

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
