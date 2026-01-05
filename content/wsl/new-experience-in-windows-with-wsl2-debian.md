---
title: 在 windows 上使用 wsl2 + debian 进行前端开发
date: 2025-11-04
lastmod: 2025-11-05
---

时隔多年，开发机准备切换到 **windows** 环境下！

三年前 `1w3` 的 `mac m2 air` 现在大概只值 `4k` 。因为新的 `m4 air` 才 `7k+`。

_这篇文章先占个坑，用来记录最近的 WSL2 配置，还没有真正进入开发状态_

----

## WSL 相关

### 1. 启动 / 关闭 / 重启命令

```shell
# 启动默认发行版
wsl

# 启动指定发行版（名字用 wsl -l -v 看）
wsl -d Ubuntu-22.04

# 立即关机（所有发行版全部停掉，内存瞬间归还）
wsl --shutdown

# 重启某个发行版（先停再启）
wsl -t Ubuntu-22.04 && wsl -d Ubuntu-22.04
```

### 2. 状态与列表

```shell
# 看装了哪些发行版 + 当前状态（Running/Stopped）
wsl -l -v
# 简写：wsl -l -v

# 只看正在跑的实例
wsl -l --running

# 查看当前默认发行版
wsl -l --quiet
```

### 3. 资源占用（CPU / 内存 / 磁盘）

```shell
# 实时看虚拟内存占用（任务管理器里叫 VmmemWSL）
get-process -Name "vmmemWSL" | Select-Object CPU, WorkingSet, PagedMemorySize

# 更详细：用 Windows 性能计数器（每秒刷新）
typeperf "\Process(vmmemWSL)\Working Set" -si 1

# 查 WSL2 虚拟磁盘实际大小
wsl -d Ubuntu-22.04 -e du -h /mnt/wslg/distro
# 或直接进入 ext4.vhdx 所在目录
Get-ChildItem "$env:LOCALAPPDATA\Packages\CanonicalGroupLimited.UbuntuonWindows_*\LocalState\ext4.vhdx" | Select-Object Name, Length, LastWriteTime
```

### 4. 导出 / 导入 / 备份（整机镜像）

```shell
# 备份整个发行版为 tar（系统重装前用）
wsl --export Ubuntu-22.04 D:\backup\ubuntu2204.tar

# 以后在新机器还原
wsl --import Ubuntu-2204-New D:\WSL\Ubuntu2204-New D:\backup\ubuntu2204.tar --version 2

# 把导入的实例设为默认（可选）
wsl --set-default Ubuntu-2204-New
```

### 5. 内存 & 处理器上限控制

```shell
# 在用户目录新建/编辑 .wslconfig（全局生效）
notepad "$env:USERPROFILE\.wslconfig"
# 示例内容：
[wsl2]
memory=4GB          # 最大内存
processors=2        # 逻辑核数
swap=1GB            # 交换文件大小
localhostForwarding=true
```

### 6. 升级

```shell
# 升级 WSL 内核和 GUI 支持（需管理员）
wsl --update

# 查看当前内核版本
wsl --version
```

## 安装Docker

安装 `docker engine` (在公司开发，不符合 Docker Desktop的许可证要求，所以这里只用纯命令行)

```shell
# 1. 卸载旧版本（若之前装过 docker-ce 或 docker.io）
sudo apt-get remove -y docker.io docker-doc docker-compose podman-docker containerd runc

# 2. 装依赖
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# 3. 添加 Docker 官方 GPG key & 仓库（Debian 12 bookworm）
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 4. 安装最新版 Engine + CLI + containerd + compose 插件
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 5. 把当前用户加入 docker 组，免 sudo
sudo usermod -aG docker $USER
newgrp docker

# 6. 验证
docker run hello-world
```