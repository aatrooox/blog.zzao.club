---
title: 使用 pm2 启动 ipx 服务(bun运行时)
date: 2025-04-08
lastmod: 2025-04-08
tags:
  - IMGX
  - Bun
---
在给 `imgx` 的预设静态化图片启动服务时，我使用了 `unjs/ipx` 来作为图片服务，这样可以直接进行格式转换和裁剪

后续图片操作（x）也必然涉及到要先把图片存储再操作，所以还是单独启动一个服务罢了

考虑到 `bun` 的吞吐量要比 `node` 大一些

于是使用此命令来启动 `ipx` 服务

```shell
bunx ipx serve --dir ./public
```

对应到 `pm2` 的 `config.yml` 上配置为

```yaml
apps:
  - name: imgx-nitro
    script: ./server/index.mjs
    interpreter: node
    exec_mode: fork
    env:
      PORT: 1234
  - name: imgx-ipx
    script: bunx
    args: ["ipx", "serve", "--dir", "./public"]
    exec_mode: fork
    env:
      PORT: 5678
```

注意不需要指定 `bun` ，直接使用 `bunx` 即可

系统为 `Debian12.0` ，供诸君参考