---
title: Nuxt Content 实现上一篇下一篇功能
date: 2025-05-13
lastmod: 2025-05-13
tags:
  - Nuxt
versions:
  - "@nuxt/content@3.4.0"
  - nuxt@3.17.2
---
在很多博客里，阅读一篇文章到底部后，会有一个相关文章推荐，以及上一篇下一篇的功能。

本文就来记录一下如何利用 `queryCollectionItemSurroundings` 这个 `API` 实现此功能

