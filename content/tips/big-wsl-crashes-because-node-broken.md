---
title: WSL Node.js 崩溃导致 C 盘空间被大量占用
date: "2026-02-09T03:33:59.000Z"
lastmod: "2026-02-09T11:48:33.327Z"
tags: ["WSL"]
---

## 问题现象

Windows C 盘空间异常减少，从正常使用逐渐增长至 173GB/191GB（91% 占用）。

排查后发现 `C:\Users\<用户名>\AppData\Local\Temp\wsl-crashes` 目录占用了 **54.74GB**。

根本原因
Node.js 进程在 WSL Ubuntu 环境中频繁崩溃，WSL 自动生成了大量崩溃转储文件（.dmp）用于调试。

这些转储文件包含了崩溃时的完整内存快照。
崩溃进程信息
wsl-crash-\*-root.local\_share\_fnm\_node-versions\_v20.19.5\_installation\_bin\_node-6.dmp

* **崩溃进程**: `/root/.local/share/fnm/node-versions/v20.19.5/installation/bin/node`
* **单个文件大小**: 约 6.8GB（说明进程内存占用极高）
* **崩溃频率**: 在 2026/2/9 下午 4-5 点期间发生 8 次崩溃（平均每 5 分钟一次）
* **触发场景**: TypeScript 语言服务器处理 Nuxt 大型项目时内存泄漏

## 解决方案

立即清理（释放 54GB）（**直接删除即可！**）

