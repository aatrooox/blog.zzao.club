---
title: 无需额外软件，MacOS 缩小托盘图标间隔
date: 2025-06-13 21:22:13
lastmod: 2025-06-13 21:22:40
tags: ["MacOS", "奇技淫巧"]

---
众所周知，macos 有些机型的刘海屏十分反人类，导致图标展示不全。

此方法可以无需软件缩小图标的间距

原贴地址 [V2ex](https://www.v2ex.com/t/1047186)

```shell  
# 指定间距  
defaults -currentHost write -globalDomain NSStatusItemSpacing -int 5  
# 指定内边距  
defaults -currentHost write -globalDomain NSStatusItemSelectionPadding -int 5  
# 当前间距查询  
defaults -currentHost read -globalDomain NSStatusItemSpacing  
defaults -currentHost read -globalDomain NSStatusItemSelectionPadding  
# 重置  
defaults -currentHost delete -globalDomain NSStatusItemSpacing  
defaults -currentHost delete -globalDomain NSStatusItemSelectionPadding  
```