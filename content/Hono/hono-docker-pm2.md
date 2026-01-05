---
title: 【Hono】部署篇 Docker+pm2部署
date: 2025-02-10
lastmod: 2025-05-15
tags:
  - Hono
versions:
  - hono@4.5.11
showTitle: 【Hono】部署篇 Docker+pm2部署
---
# 【Hono】部署篇 Docker+pm2部署
项目开发完后，要部署到服务器上才能正常使用，这里我分享一下`docker`和`pm2`两种方式的部署。

以下经验来自于**我日常的折腾中，适合入门，非企业级操作。**仅用于分享！
## Docker部署

用`docker`的话，也算有两种运行方式。

先在本地`build`，然后打`tag`，然后`push`上去。

把包**发布到`dockerhub`或你的对应的云服务商的容器镜像服务**上（比如阿里云）后

一种是使用`docker run` 附带一些参数进行启动

另一种使用`docker-compose.yml`配置参数，用`docker compose`命令重新拉取最新的镜像并重启。


## Dockerfile

这个dockerfile来自Bun的官方，然后我又加了一些自己的需求，可以做一下参考

```shell
# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# [optional] tests & build
ENV NODE_ENV=production
# RUN bun test
RUN bun run build

# copy production dependencies and source code into final image
FROM base AS release

# 一个后端node/bun服务运行,必须需要node_modules
# 以及打包后的入口
# 如果存在环境变量配置, 还需要复制环境变量配置文件
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/out/index.js .
COPY --from=prerelease /usr/src/app/package.json .
COPY --from=prerelease /usr/src/app/.env .
COPY --from=prerelease /usr/src/app/.env.production .

# 此处是为了把日志和数据库持久化, 方便备份和查看
# 创建日志目录和数据库目录
RUN mkdir -p /usr/src/app/prod-logs && chmod -R 777 /usr/src/app/prod-logs
RUN mkdir -p /usr/src/app/db && chmod -R 777 /usr/src/app/db

ENV NODE_ENV=production
# run the app
USER bun
EXPOSE 4775/tcp
ENTRYPOINT [ "bun", "run", "index.js" ]
```

有几个`dockerfile`内需要注意的点：

- 如果你有env文件，记得也把env复制进去

- 如果你的日志等文件持久化了（放在了一个自定义的目录下），记得**分配读写权限**

- 记得设置ENV NODE_ENV=xxx

- 分阶段构建不是必须的

另外，`dockerfile`中用到了`bun run build`这个命令

要注意，`bun build` 需要指定 `--target` 为 `bun`

```json
"scripts": {
    "dev": "bun run --hot src/index.ts",
    "build": "bun build src/index.ts --outdir out --target=bun"
  },
```

编写完`dockerfile`以及打包命令后，没必要去服务器验证，可以在本地验证。

```shell
docker build ./ -t your_name --load
```

打包后，直接在`docker desktop`中点击运行，输入你自定义的端口号、本地挂载路径等就可以了。

如果有错误的话，就直接在desktop看日志，解决完明显的问题后再往服务器上发。

但是如果很多类似：端口号、挂载地址、环境变量需要配置时，光在开始这一步就会感觉非常麻烦。所以还是配一个`docker compose`比较方便

## Docker Compose

小水管服务器最好还是不要在服务器上跑**`docker build`** ，真是很容易就卡死。

在项目根目录下新建`docker-compose`配置文件

docker-compose.prod.yml

```yaml
version: '3.8'
# 正式服务器打包
services:
  hono:
    container_name: 'hono'
    # 填写发布后的镜像
    image: 'xxxxxxx'
    ports:
      - '4775:4775'
    restart: on-failure
    volumes:
      - /home/db/hono:/usr/src/app/db
      - /home/log/hono:/usr/src/app/prod-logs

```

在配置文件内写好所有的配置，很直观。

如果是在本地的话可以再新建一个

docker-compose.dev.yml

```yaml
version: '3.8'
# 开发环境测试打包
services:
  hono:
    container_name: 'hono'
    build:
      context: ./
      dockerfile: ./Dockerfile
    ports:
      - '4775:4775'
    restart: on-failure
    volumes:
      - /Users/your_name/your_dir/databases/hono-db:/usr/src/app/db
      - /Users/your_name/your_dir/databases/hono-logs:/usr/src/app/prod-logs

```

使用本地的dockerfile来打包验证

```shell
docker-compose up
```

这样就不用重复敲很多配置了。

测试没问题，可以正常运行后，就可以去发布了

## 发布到容器镜像服务

在各家的云服务商的后台，都可以找到各自的容器镜像服务。

因为`dockhub`被墙了，直接在大陆的服务器上是拉不下来`dockhub`的镜像的，所以要想分版本的发布，就需要用云服务商自己的容器镜像服务。

以下以阿里云为例。

**登录**

```shell
sudo docker login --username=<your username> registry.cn-beijing.aliyuncs.com
```


**注意：后面的地址`registry.cn-beijing.aliyuncs.com`，可以在你的阿里云后台找到**

**打包**

打包的时候也有一个坑，就是要注意服务器的`platform`，在本地打包和push前就要加上参数。 比如我这里是`linux/amd64`。（你可以先不管，等在服务器上运行时，会提示你报错信息，然后再根据提示加上`platform`参数重新打包发布也可以。）

```shell
docker buildx build ./ -t your_name --load --platform linux/amd64 (对应阿里云ubuntu服务器)
```

**打Tag**

打标签前，需要在阿里云控制台里，先创建好自己的命名空间，假设我这里是`zzstudio1`

```shell
docker tag memoz registry.cn-beijing.aliyuncs.com/zzstudi1/your_name:latest
```

**发布**

```shell
docker push --platform linux/amd64 registry.cn-beijing.aliyuncs.com/zzstudi1/your_name:latest
```

*此时本地操作已经完成，登录到云服务器再去拉取和运行发布好的镜像*

不得不说，有墙是真难受，万一有网络问题，还容易卡住。

发布成功后，再去回头看我们`docker-compose.prod.yml`的配置的`image`，就是此时发布的镜像了。

只要这个`docker-compose.prod.yml`文件在服务器上，就可以运行起来了。后续如果需要更新，则需要在本地重复上述的，打包、打Tag、发布流程

然后在服务器重启即可

```shell
# 先停止
docker-compose down 
docker-compose up --build -d
```

注意：`docker compose`是可以管理多个镜像的，如果你要同时使用`redis`、`mysql`、`nginx`等，都可以统一管理，详细使用可以看我这篇**[《使用Docker Compose部署Nest应用》](https://mp.weixin.qq.com/s/UNxFJvZNrZyCnDKFQyApsQ)**，里面有详细的配置说明

## 小结一下

>  1. 配置`package.json`中的`build`命令，注意`--taget=bun`
 2. 参考bun官方示例，编写`Dockerfile`，构建，然后把项目打上版本号，打包发布到指定平台
 3. 服务器上只装`docker`，服务都使用`docker`运行
 3. 编写多个`docker-compose.*.yml`文件，配置不同环境的策略，拉取指定平台指定版本的镜像
 4. 后续使用`docker compose`命令进行更新和重新运行

再来看一下pm2部署有什么不同

## PM2部署

使用`pm2`运行项目，需要在服务器安装相应的环境（`Bun`、`Pm2`、`Git`），后续有其他服务也使用`pm2`进行管理就可以了。

就是不像docker似的，环境隔离起来，换服务器方便一些。

但是国内这个环境其实用`docker`还麻烦一些，如果能一股脑丝滑的发步到`dockerhub`上就会轻松很多。

所以我一般如果选择了`pm2`部署，就相当于在服务器上安装了一圈环境（包括`Nginx`），配置过一遍后，后续使用`git`提交代码，提交代码后再通过`ssh`在服务器打包和重启一下对应服务。

以下是一些基本命令，安装node、bun、nginx等，且只在`Ubuntu`验证过。

安装node20.x版本

```shell
curl -sL https://deb.nodesource.com/setup_20.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
```

使用apt安装

```shell
sudo apt install nodejs
```

安装完成后验证

```shell
node -v
npm -v
```

安装`bun`，先安装`unzip`

```shell
sudo apt install unzip
```

再安装`bun`

```shell
curl -fsSL https://bun.sh/install | bash
```

设置国内镜像

```shell
npm config set registry https://registry.npmmirror.com/
```

安装PM2

```shell
npm install pm2@latest -g
```

使用`ecosystem.config.js` （在项目根目录下新建）（内容非常简单，在官网复制就可以）

```shell
pm2 start ecosystem.config.js

pm2 stop ecosystem.config.js

pm2 reload ecosystem.config.js

pm2 restart ecosystem.config.js

pm2 delete ecosystem.config.js


```

安装Nginx

```shell
sudo apt install nginx

systemctl status nginx
systemctl start nginx
```

配置防火墙

```shell
sudo ufw allow 'Nginx HTTP'
sudo ufw allow 'Nginx HTTPS'
```

主配置文件：`/etc/nginx/nginx.conf`

站点配置文件目录：**/etc/nginx/sites-available** 和 **/etc/nginx/sites-enabled**

测试nginx配置

```shell
sudo nginx -t
```

重启nginx

```shell
sudo systemctl reload nginx
```

关于**git建裸库**，大家可以自行搜索相关文章，我也是按之前搜出来的一篇文章来建的，如果有懒得搜的，也可以直接**私信**我要教程。

**最终，你的服务器上的项目文件夹内要具备：**

- node_modules 是的，后端项目不同于前端，也是需要node_modules才能正常运行的

- package.json 用于**安装和更新node_modules**

- `env`文件环境变量配置

- 打包且压缩后的JS文件/文件夹，如：server/index.js

此时在你的服务器环境下运行就可以了

```typescript
pm2 start ecosystem.config.js
```

而关于重启、多实例运行等都在一个`config.js`里配置

**启动后，验证项目是否可以被正常请求，数据库读写是否正常，日常是否在正常记录就可以了**

## 总结

**对于我来说，选择其中一种方式部署，意味着后续其他服务都用这一种方式进行部署。**

如果使用了`docker`，那我只在服务器上把`docker`装好，所有服务都通过`docker`来打包、分版本、发布、拉取、运行、重启。

如果使用了`pm2`，我会在服务器上直接装一遍`Node`、`Bun`、`Git`、`Nginx`、`pm2`，后续通过`git`管理代码，通过`git tag/branch`或是代码内管理版本，ssh工具在服务器打包代码pm2来运行和重启。

当然有很多其他运维工具`gitea`、`jenkins`等等，我看过后感觉都不太适合我这种**处于探索而非运营阶段**的小水管服务器折腾。

如果真的有业务，着急搭建，我觉得花点钱找个靠谱的人弄都行，不用费这种心。

以上就是全部内容啦👏👏



