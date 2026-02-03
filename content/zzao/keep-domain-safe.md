---
title: 如何防止别人把域名解析到自己的服务器公网 ip 上
date: 2024-12-04
lastmod: 2025-02-12
tags: ["Nginx"]
showTitle: 如何防止别人把域名解析到自己的服务器公网 ip 上
---
我遇到了一个很奇葩的问题，以前没遇到过：就是有个网站解析到了我服务器 ip 上。

我是怎么发现的呢，一开始我是在看 CDN 的监控指标，里面有个 referer 来源，本来应该都是我自己的域名，但是跑出来一个陌生的域名。

于是我打开了这个域名，好嘛，这不就是我的网站么🥲

这个域名还是个子域名，主域名上什么也没有，也看不到他的购买信息。本来想去问候一下。

我就开始寻找解决办法，求助 AI，求助身边的运维朋友，可惜朋友没回...

然后我就先把 cookie 的 samesite、domain、secure 设置好，确保接口不会被一直调用。但是我文章里的图片是个问题啊...  因为我把图片都存在了腾讯云上，他这个网站访问的时候，也会走我的流量，但是我当时又没找到办法解决，只好把主域名的 Nginx 配置先停掉了

过了几天后，我又想起这个事儿，然后又换了个 AI 问了一遍，还是让我设置 Nginx 就行

显示加了一个 

```nginx
add_header X-Frame-Options "SAMEORIGIN";
```

这个只是不允许其他网站嵌入

然后又设置的

```nginx
server {
	listen 80 default_server;  # 这个 server 块是默认的
	server_name _;  # 匹配所有未定义的域名

	return 301 https://zzao.club$request_uri;  # 重定向到 HTTPS
}
```

即 `80` 端口上如果有我没配的域名，则重定向到我的域名

当时尝试了，没成功，应该是因为加了 `https`，导致规则没走这条。大意了！

这次把 `https` 换成 `http`，发现其实是生效的

于是照猫画虎，把 `443` 端口也堵上

```nginx
server {
	listen 443 default_server;  # 这个 server 块是默认的
	server_name _;  # 匹配所有未定义的域名
	
	ssl_certificate /etc/nginx/aaa.pem;  # 指定证书的位置，绝对路径
	ssl_certificate_key /etc/nginx/bbb.key;  # 绝对路径，同上

	return 301 https://zzao.club$request_uri;  # 重定向到 HTTPS
}
```

再次访问那个域名，会自动跳到我的域名了！

虽然解决了，但是还是很奇怪

解析到我的网站有什么用呢，我的网站没有用户，没有价值....

还是说他只是批量的尝试，碰巧扫到我的了

不过有了这次的经历，Nginx 的配置倒又学到了一点😛

sss