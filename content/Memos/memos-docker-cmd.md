---
title: Memos Docker命令
tags: ["das", "dadd"]
date: 2025-02-19
lastmod: 2025-02-24
showTitle: Memos Docker命令
---
## 本地打包

```
docker build ./ -t memoz --load  
```

## 本地运行

```
docker run -d --name memoz -p 5230:5230 -v /memos/:/var/opt/memos memoz
```

## docker hub发布

登录 docker hub


### 1️⃣打Tag

```
docker tag memoz gnakdogg/memoz:1.0.1 
```

### 2️⃣发布

```
docker push gnakdogg/memoz:1.0.1
```

## 云服务器运行

```
docker run -d --name memoz -p 5230:5230 -v /home/memoz/:/var/opt/memos gnakdogg/memoz:latest
```

## 云服务器本地运行（因为云服务器拉不下来Docker hub

> 先把代码传到云服务器，然后运行 docker build  打包出镜像，然后run运行

> 运行到pnpm build时报内存溢出 加入参数 --memory=2g

```
docker build ./ -t memoz --memory=2g
```

```
docker run -d --name memoz -p 5230:5230 -v /home/memoz/:/var/opt/memos memoz
```


Docker加速


```shell
sudo mkdir -p /etc/docker

sudo tee /etc/docker/daemon.json <<-'EOF'
{
    "registry-mirrors": [
	    "https://1js6gccw.mirror.aliyuncs.com",
        "https://docker.m.daocloud.io",
        "https://dockerproxy.com",
        "https://docker.mirrors.ustc.edu.cn",
        "https://docker.nju.edu.cn"
    ]
}
EOF

sudo systemctl daemon-reload
sudo systemctl restart docker
```


## Docker推送到阿里云容器服务

1. 登录
```
sudo docker login --username=523748995@qq.com registry.cn-beijing.aliyuncs.com
``` 

```
sudo docker login --username=523748995@qq.com --password godkang75 registry.cn-beijing.aliyuncs.com
```

 2. 打包
 ```
 docker build ./ -t memoz --load  
 docker buildx build ./ -t memoz --load --platform linux/amd64 (对应阿里云ubuntu服务器)
 
```
在阿里云容器镜像服务实例中建一个命名空间如zzstudi0
2. Tag
```
docker tag memoz registry.cn-beijing.aliyuncs.com/zzstudi0/memoz:latest
```


3. Push
```
docker push registry.cn-beijing.aliyuncs.com/zzstudi0/memoz:latest
```

```
docker push --platform linux/amd64 registry.cn-beijing.aliyuncs.com/zzstudi0/memoz:latest
```
拉取

1. 登录
2. 拉取
```
docker pull registry.cn-beijing.aliyuncs.com/zzstudi0/memoz:latest
```

```
docker pull --platform linux/amd64 ![[成为一个前端开发者的路线.pdf]]:latest
```
3. 运行
```
docker run -d --name memoz -p 5230:5230 -v /home/memoz/:/var/opt/memos registry.cn-beijing.aliyuncs.com/zzstudi0/memoz
```



docker network ： e1cb1ad4b9bc

## 更新版本

```
停止目前运行的容器
docker stop container_id
删除容器（为了避免名称冲突）
docker rm container_id
```

拉取指定版本
```
docker pull --platform linux/amd64 registry.cn-beijing.aliyuncs.com/zzstudi0/memoz:1.1.0
```


然后运行指定版本
```
docker run -d --name memoz -p 5230:5230 -v /home/memoz/:/var/opt/memos registry.cn-beijing.aliyuncs.com/zzstudi0/memoz:1.1.0
```

因为数据已经挂载到了外部，所以不用担心数据丢失