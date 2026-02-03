---
title: 从 macOS 迁移到 Windows 开发环境
date: 2026-02-03
lastmod: 2026-02-03
tags: ["Windows", "WSL", "开发环境"]
versions: ["WSL@2", "node@20.19.5", "bun@1.3.7"]
description: 完整记录从 macOS 迁移到 Windows 开发环境的全过程，包括 WSL 安装、磁盘迁移、前端环境配置、zsh 美化以及 OpenCode 开发工具配置
---

作为一个在 macOS 上开发多年的前端开发者，最近因为某些原因决定尝试 Windows 作为主力开发机。本文详细记录了整个迁移过程，希望能给同样需要迁移的朋友一些参考。

## 为什么选择 WSL？

Windows 原生的开发体验一直被诟病，但 WSL2（Windows Subsystem for Linux 2）的出现彻底改变了这个局面。WSL2 提供了接近原生 Linux 的开发体验，同时又能享受 Windows 的生态和硬件兼容性。

## WSL 安装过程

### 1. 启用 WSL 功能

以管理员身份打开 PowerShell，执行：

```powershell
# 启用 WSL 功能
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# 启用虚拟机平台（WSL2 必需）
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# 重启电脑
Restart-Computer
```

### 2. 设置 WSL2 为默认版本

重启后，继续在 PowerShell 中执行：

```powershell
wsl --set-default-version 2
```

### 3. 安装 Ubuntu 22.04

```powershell
# 列出可用的发行版
wsl --list --online

# 安装 Ubuntu 22.04
wsl --install -d Ubuntu-22.04
```

安装过程中会提示你创建 Linux 用户名和密码。

### 4. 验证安装

```bash
wsl --list --verbose
```

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

修改后需要重启 WSL：

```powershell
wsl --shutdown
```

### 网络配置

WSL2 默认会设置 NAT 网络，通常不需要额外配置。挂载点：

- C 盘：`/mnt/c`
- D 盘：`/mnt/d`
- 以此类推...

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

验证安装：

```bash
bun --version
# 1.3.7
```

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
fnm install 20
fnm use 20
fnm default 20
```

验证：

```bash
fnm --version  # 1.38.1
node --version # v20.19.5
```

### 安装 pnpm

```bash
# 用 Bun 安装全局 pnpm
bun install -g pnpm

# 或者用 npm
npm install -g pnpm
```

验证：

```bash
pnpm --version # 10.11.0
```

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

验证安装：

```bash
zsh --version
# zsh 5.8.1 (x86_64-ubuntu-linux-gnu)
```

### 设置 Zsh 为默认 Shell

```bash
chsh -s $(which zsh)
```

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

首次启动会自动运行配置向导：

```bash
exec zsh
```

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

# 代理函数（根据需要取消注释）
# 默认启用代理
export HTTP_PROXY="http://127.0.0.1:7890"
export HTTPS_PROXY="http://127.0.0.1:7890"
export ALL_PROXY="socks5://127.0.0.1:7890"

unproxy() {
    unset HTTP_PROXY
    unset HTTPS_PROXY
    unset ALL_PROXY
    echo "Proxy disabled"
}

# 语法高亮（放在配置文件最后）
source /usr/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

# Powerlevel10k 配置
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
```

### 插件使用技巧

| 插件 | 功能 | 使用示例 |
|------|------|---------|
| **git** | Git 命令简化 | `gst`（git status）、`gco`（git checkout）、`gp`（git push） |
| **zsh-autosuggestions** | 根据历史自动建议命令 | 输入 `cd pro`，自动提示之前输入过的 `cd projects/` |
| **z** | 智能目录跳转 | `z blog` 会跳转到常用的 blog 目录 |
| **extract** | 万能解压 | `extract file.tar.gz`、`extract file.zip` 都能识别 |

### 终端字体配置（重要！）

Powerlevel10k 需要支持 Nerd Fonts 的字体才能正常显示图标。

推荐字体：
- **MesloLGS NF**（Powerlevel10k 推荐）
- **JetBrains Mono Nerd Font**
- **Fira Code Nerd Font**

下载地址：https://www.nerdfonts.com/font-downloads

在 Windows Terminal 中设置字体：
1. 打开设置（`Ctrl + ,`）
2. 找到 Ubuntu-22.04 配置
3. 外观 → 字体 → 选择 MesloLGS NF

## WSL + VSCode 开发配置

VSCode 对 WSL 的支持非常完善，通过 Remote - WSL 扩展可以获得接近原生 Linux 的开发体验。

### 安装 VSCode（Windows 端）

下载安装：https://code.visualstudio.com/

### 安装 Remote - WSL 扩展

在 VSCode 中安装：
- **Remote - WSL**（必装）

### 从 WSL 启动 VSCode

在 WSL 终端中：

```bash
# 在当前目录打开 VSCode
code .

# 打开指定目录
code ~/projects/my-project
```

首次运行会自动在 WSL 中安装 VSCode Server。

### WSL 端必装扩展

我的 WSL Ubuntu-22.04 扩展列表：

```bash
code --list-extensions
```

输出：

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

| 扩展 | 用途 | 必要性 |
|------|------|--------|
| **ESLint** | 代码规范检查，配合项目 `.eslintrc` | ⭐⭐⭐⭐⭐ |
| **Prettier** | 代码格式化（虽然项目用 ESLint 格式化，但某些场景还是需要） | ⭐⭐⭐⭐ |
| **Volar** | Vue 3 开发必备，类型检查、智能提示 | ⭐⭐⭐⭐⭐ |
| **Tailwind CSS IntelliSense** | Tailwind 类名提示，开发效率翻倍 | ⭐⭐⭐⭐⭐ |
| **GitLens** | 查看代码修改历史、作者、blame 信息 | ⭐⭐⭐⭐ |
| **GitHub Copilot** | AI 代码补全，显著提升开发效率 | ⭐⭐⭐⭐⭐ |
| **GitHub Actions** | 在 VSCode 中管理 CI/CD 工作流 | ⭐⭐⭐ |

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

2. **项目放在 WSL 文件系统中**：不要把项目放在 `/mnt/c/`，会很慢！应该放在 `~/projects/`。

3. **关闭 Windows Defender 实时保护（针对 WSL 目录）**：

```powershell
# 以管理员身份运行 PowerShell
Add-MpPreference -ExclusionPath "D:\WSL"
```

## OpenCode 配置

OpenCode 是一个强大的 AI 辅助编程工具，支持多种模型和自定义 agent。

### 安装 OpenCode

```bash
# 通过 Bun 安装（推荐）
bun install -g opencode

# 或通过 npm
npm install -g opencode
```

验证安装：

```bash
opencode --version
```

### 配置目录结构

OpenCode 配置文件位于 `~/.config/opencode/`：

```
~/.config/opencode/
├── opencode.json           # 主配置文件
├── oh-my-opencode.json     # Agent 和分类配置
├── skills/                 # 自定义技能
└── node_modules/           # 插件依赖
```

### opencode.json 配置

我的配置使用了两个插件：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    "oh-my-opencode@3.2.1",
    "opencode-antigravity-auth@1.4.3"
  ],
  "provider": {
    "google": {
      "name": "Google",
      "models": {
        "antigravity-gemini-3-pro": { ... },
        "antigravity-gemini-3-flash": { ... },
        "antigravity-claude-sonnet-4-5": { ... },
        "antigravity-claude-sonnet-4-5-thinking": { ... },
        "antigravity-claude-opus-4-5-thinking": { ... }
      }
    }
  }
}
```

#### 插件说明

1. **oh-my-opencode**：增强 OpenCode 功能，支持自定义 agent 和分类
2. **opencode-antigravity-auth**：反重力认证插件，连接多个 AI 模型提供商

### oh-my-opencode.json 配置

这是核心配置文件，定义了各个 agent 使用的模型：

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  "agents": {
    "sisyphus": {
      "model": "github-copilot/claude-sonnet-4.5"
    },
    "oracle": {
      "model": "github-copilot/gpt-5.2",
      "variant": "high"
    },
    "librarian": {
      "model": "github-copilot/claude-sonnet-4.5"
    },
    "explore": {
      "model": "github-copilot/gpt-5-mini"
    },
    "multimodal-looker": {
      "model": "google/gemini-3-flash"
    },
    "prometheus": {
      "model": "github-copilot/claude-opus-4.5",
      "variant": "max"
    },
    "metis": {
      "model": "github-copilot/claude-opus-4.5",
      "variant": "max"
    },
    "momus": {
      "model": "github-copilot/gpt-5.2",
      "variant": "medium"
    },
    "atlas": {
      "model": "github-copilot/claude-sonnet-4.5"
    }
  },
  "categories": {
    "visual-engineering": {
      "model": "google/gemini-3-pro"
    },
    "ultrabrain": {
      "model": "github-copilot/gpt-5.2-codex",
      "variant": "xhigh"
    },
    "artistry": {
      "model": "google/gemini-3-pro",
      "variant": "max"
    },
    "quick": {
      "model": "github-copilot/claude-haiku-4.5"
    },
    "unspecified-low": {
      "model": "github-copilot/claude-sonnet-4.5"
    },
    "unspecified-high": {
      "model": "github-copilot/claude-sonnet-4.5"
    },
    "writing": {
      "model": "google/gemini-3-flash"
    }
  }
}
```

### Agent 角色说明

| Agent | 角色 | 使用场景 |
|-------|------|---------|
| **sisyphus** | 主执行者 | 日常编码、bug 修复 |
| **oracle** | 智囊咨询 | 架构设计、技术选型 |
| **librarian** | 文档检索 | 查找 API 文档、代码示例 |
| **explore** | 代码探索 | 理解现有代码库 |
| **prometheus** | 规划者 | 制定开发计划 |
| **metis** | 需求分析 | 理解模糊需求、识别潜在问题 |
| **atlas** | 协调者 | 管理多个 agent 协作 |

### 分类（Category）说明

| Category | 优化方向 | 适用场景 |
|----------|---------|---------|
| **visual-engineering** | UI/UX | 前端界面开发、动画实现 |
| **ultrabrain** | 逻辑推理 | 复杂算法、架构设计 |
| **artistry** | 创新思维 | 需要创造性解决方案的问题 |
| **quick** | 快速响应 | 简单修改、快速问答 |
| **writing** | 文本生成 | 文档编写、注释生成 |

### 使用示例

```bash
# 启动交互式会话
opencode

# 指定 agent
opencode --agent oracle

# 指定分类
opencode --category ultrabrain

# 一次性问题
opencode "如何实现深拷贝？"
```

### 自定义技能（Skills）

在 `~/.config/opencode/skills/` 目录下可以创建自定义技能：

```bash
# 列出可用技能
opencode skills list

# 创建新技能
opencode skills create my-skill
```

每个技能是一个包含 `AGENTS.md` 和相关提示词文件的目录。

## 使用感受

<!-- 这部分由你自己来写 -->

### 性能对比

在日常开发中，WSL2 的性能表现...

### 工作流变化

从 macOS 切换到 Windows + WSL 后，我的工作流...

### 遇到的问题和解决方案

#### 问题1：文件系统性能

...

#### 问题2：Git 凭证管理

...

### 总结

经过一段时间的使用，我认为...

## 常见问题（FAQ）

### Q1: WSL 和虚拟机有什么区别？

A: WSL2 基于轻量级虚拟化，启动速度快，资源占用低，与 Windows 文件系统集成度高。传统虚拟机（如 VirtualBox）资源占用大，文件共享复杂。

### Q2: WSL 可以运行 GUI 应用吗？

A: WSL2 支持运行 Linux GUI 应用（WSLg），需要 Windows 11 或 Windows 10 最新版本。

### Q3: 如何在 Windows 和 WSL 之间传文件？

A: 
- Windows 访问 WSL：在文件资源管理器输入 `\\wsl$\Ubuntu-22.04`
- WSL 访问 Windows：挂载点为 `/mnt/c`、`/mnt/d` 等

### Q4: 代理如何设置？

A: 在 `.zshrc` 中配置代理，WSL 通过 `127.0.0.1` 访问 Windows 代理软件（需开启 LAN 访问）。

### Q5: Docker 怎么用？

A: 安装 Docker Desktop for Windows，在设置中启用 "Use the WSL 2 based engine"，然后在 WSL 中直接使用 `docker` 命令。

## 参考资源

- [WSL 官方文档](https://docs.microsoft.com/zh-cn/windows/wsl/)
- [Oh My Zsh GitHub](https://github.com/ohmyzsh/ohmyzsh)
- [Powerlevel10k](https://github.com/romkatv/powerlevel10k)
- [fnm - Fast Node Manager](https://github.com/Schniz/fnm)
- [Bun 官网](https://bun.sh/)
- [OpenCode 文档](https://opencode.ai/)

---

最后更新：2026-02-03
