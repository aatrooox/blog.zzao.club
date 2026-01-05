---
title: Memos自建服务入门指南
description: 基于某个版本魔改自己的Memos
published: 2024-07-30 14:14:16
tags:
  - 技术
  - Memos
category: 技术
date: 2024-07-25
lastmod: 2025-02-12
showTitle: Memos自建服务入门指南
---
Memos是一个**开源免费的私人版/家庭版推特**。适合可以在私人服务器、家庭Nas上自建服务，适合喜欢折腾的小伙伴。

本文内容主要有三部分：

1、从原作者仓库拉取Memos代码，并本地运行项目

2、通过`docker`发布自己的版本到`docker hub` 和 `云服务器容器服务`

3、在自己的服务器上**运行和更新Memos**

## 选择合适版本

**首先选择一个版本**，克隆到自己本地，或者直接**fork到自己的github仓库**再拉下来。

因为每个版本的功能不太一致，可以先用 `docker desktop` 跑一下各个版本，本地看看效果，了解一下哪个版本比较好用。

也可以在本地用 `docker build`命令运行当前拉下来的版本，再去`docker desktop`跑起来

注意有几个参数，我在图里做了标识。

![](https://img.zzstudio.cn/1-img-20240725180755.png)

我这里使用的是`0.22.3`版本，早期版本我没接触过，所以直接用的最新版，看了下界面和功能完全够我使用了。

:::tip
注意选择后，咱们的版本就固定了，大概率不再跟随原作者更新，除非有非常好用的功能，再进行手动合并
:::

代码到本地后，首先要保证自己有运行环境。

不懂`Node`或`Go`如何安装，直接问`AI`就可以了，现在`AI`的辅助能力其实要比大部分半吊子开发者要强得多。

**AI 我用的豆包**。

## 安装依赖和运行项目

首先是`Go`，根目录下就有`go.mod`，里面是项目的依赖。**不懂就直接问AI，可以解决80%的问题**

```
go mod tidy
```

然后是web，注意要 `cd ./web`，他这里用的`react`，不过框架对于老前端来说影响不大，基本都能很快上手

```
pnpm i 
```

如果只是想看一下界面，可以先用docker跑起来

打包

```
docker build ./ -t memoz --load  
```

打包后就可以在你的 ` docker desktop ` 里看到镜像了，直接点击运行即可，也可以用命令运行

```
docker run -d --name memoz -p 5230:5230 -v /memos/:/var/opt/memos memoz
```

注意 `memoz`是我起的名字， `/memos` 是我的挂载目录，最后的`memoz`是我刚才打包好的镜像。这些要视情况更改。

运行成功就可以打开 http://localhost:5230 看到界面了。

如果想要本地边开发边调试，可以分别运行go和web

停掉docker运行的容器后，在项目根目录下先运行go服务

```
go run bin/memos/main.go       
```

然后 `cd ./web` 到前端目录下

```
pnpm dev
```

然后前端项目就会运行在 `http://localhost:3001` ，此时再从浏览器访问就可以了。

## 发布到docker hub

memos推荐我们直接用作者发布好的包进行部署，像是这样：

```
docker run -d --name memoz -p 5230:5230 -v ~/memos/:/var/opt/memos usememos/memos:latest
```

那如果我们想拉取自己的版本，就要像作者一样把自己的版本发布上去

首先你要**注册**好自己的账号（docker hub）

然后要在本地登录

```
docker login
```

然后给刚才`build的镜像`打上标签，不写具体tag，默认就是`latest`

```
docker tag <image_name> <dockerhub_username>/<repository_name>:<tag>
```

然后给打好标签的镜像推送上去

```
docker push <dockerhub_username>/<repository_name>:<tag>
```

登录到docker hub网站上，就可以看到自己发布的镜像了。

然后在服务器上把自己发布的包跑起来就行了

```
docker run -d --name memoz -p 5230:5230 -v ~/memos/:/var/opt/memos <dockerhub_username>/<repository_name>:<tag>
```

**然后你就会发现，根本拉不下来**，哪怕是配置了代理，也没法顺利拉取

所以我们还是要把自己的镜像发布到对应的云服务器厂商自己的容器服务上，由于我的服务器是`阿里云`，所以此处我用阿里云演示

## 发布到阿里云容器服务

发布过程和`docker hub`是一样的 ，只不过登录的是阿里云容器服务的账号密码，推送的目标也是阿里云的容器服务

### 登录

```
sudo docker login --username=<your username> registry.cn-beijing.aliyuncs.com
```
:::tip
注意：后面的地址`registry.cn-beijing.aliyuncs.com`，可以在你的阿里云后台找到
:::

### 打包

打包的时候也有一个坑，就是要注意服务器的`platform`，在本地打包和push前就要加上参数。 比如我这里是`linux/amd64`，你可以先不管，等在服务器上运行时，会提示你报错信息，然后再根据提示加上`platform`参数重新打包发布也可以。

```
docker buildx build ./ -t memoz --load --platform linux/amd64 (对应阿里云ubuntu服务器)
```

### 打Tag

打标签前，需要在阿里云控制台里，先创建好自己的命名空间，我这里是`zzstudio0`

```
docker tag memoz registry.cn-beijing.aliyuncs.com/zzstudi0/memoz:latest
```

### 发布

```
docker push --platform linux/amd64 registry.cn-beijing.aliyuncs.com/zzstudi0/memoz:latest
```

> 此时本地操作已经完成，登录到云服务器再去拉取和运行发布好的镜像

## 运行和更新
### 拉取

拉取前也是得登录，参考上边

```
docker pull --platform linux/amd64 registry.cn-beijing.aliyuncs.com/zzstudi0/memoz:latest
```

### 运行

运行的镜像名称可以通过  `docker images` 查看，也就是 `registry.cn-beijing.aliyuncs.com/zzstudi0/memoz` 部分换成你自己的

```
docker run -d --name memoz -p 5230:5230 -v /home/memoz/:/var/opt/memos registry.cn-beijing.aliyuncs.com/zzstudi0/memoz
```

运行后通过 ` docker ps`，可以看到正在运行在`5230`端口下，如果想直接通过5230端口访问，只要在阿里云`控制台-云服务器-安全组`中打开端口即可

当自己在本地新增或者修改了某些功能后，**再按照上述的步骤，重新发布一个新版本的镜像**

然后在更新和重新运行镜像

### 更新

`container_id` 可以通过 `docker ps` 查看到

```
停止目前运行的容器
docker stop container_id
删除容器（为了避免名称冲突）
docker rm container_id
```

然后拉取新推送的版本， 比如`1.1.0`

```
docker pull --platform linux/amd64 registry.cn-beijing.aliyuncs.com/zzstudi0/memoz:1.1.0
```

然后再重新运行新版本

```
docker run -d --name memoz -p 5230:5230 -v /home/memoz/:/var/opt/memos registry.cn-beijing.aliyuncs.com/zzstudi0/memoz:1.1.0
```

再从外网访问，检查页面是否有所变化

## 总结

本文介绍了如何本地运行`Memos`，以及如何发布和部署在自己的云服务器上。

因为Web部分只是普通的`React+Vite`，对大部分人没什么难度，所以后面修改细节就不水文了，功能方面的改造会水一水。

说到底，这只是一个普通的内容工具，关键还是真的有内容要发布才行。

:::tip
文章发布时，作者已经更新了`0.22.4`版本，修改了标签和分类的筛选机制（`0.22.3`版本比较难用），把热力图也挪到了首页，所以推荐新入坑的小伙伴直接上最新的版本。
:::

以上就是全部内容啦👏

对Memos感兴趣的话欢迎私聊讨论~

