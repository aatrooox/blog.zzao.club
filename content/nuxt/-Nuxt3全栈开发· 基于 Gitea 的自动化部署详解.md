---
title: -Nuxt3全栈开发· 基于 Gitea 的自动化部署详解
date: 2025-02-15
lastmod: 2025-02-26
showTitle: -Nuxt3全栈开发· 基于 Gitea 的自动化部署详解
---
# -Nuxt3全栈开发· 基于 Gitea 的自动化部署详解

gitea安装

运行 runner 

nohup xxx &

/home/git/gitea# nohup ./act_runner daemon > output.log 2>&1 &

配置 `actions` 、`build.yaml`


配置actions 下的 变量、密钥

在 `commit msg` 中添加关键词来跳过部署

```yaml
jobs:
  Explore-Gitea-Actions:
    runs-on: debian
    if: "!contains(github.event.head_commit.message, 'no-ci') && !contains(github.event.head_commit.message, 'skip-ci')"
    steps:
```
配置环境变量

## 配置同步github

创建github token

配置仓库

注意，仓库代码内不允许存在github token，历史记录中都不允许，如何你曾经token提交上去过，可以手动把相关内容移除，但是需要你做好备份

比如我在 `ecosystem.config.cjs` 中曾经写过github token，所以运行命令把这个文件相关的历史记录都删除。但这个文件也给我删了，所以还是要备份一下

```shell
git filter-branch --force --index-filter \
"git rm --cached --ignore-unmatch ecosystem.config.cjs" \
--prune-empty --tag-name-filter cat -- --all
```


## pm2 启动


设置开机启动

```shell
pm2 startup

pm2 save
```