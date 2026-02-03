---
title: 使用 Docker Compose 部署 Nest 应用
description: Docker compose使用指南
published: 2023-01-01
tags: ["Nest", "Docker"]
category: 技术
image: 
lastmod: 2025-08-19
date: 2023-12-24
showTitle: 使用 Docker Compose 部署 Nest 应用
---
## 引言


最近把像素厂（[PixeledPicPro](https://mp.weixin.qq.com/s/_XUUL1HR60Zfu3xjKFeZ_w)）的前端又翻新了一遍，也把 Nest应用部署到了云服务器，下面分享一下使用 docker-compose 的部署流程，保证你可以按步骤完成 Nest 项目（小水管服务器的）部署工作。

## 配置文件

本地和服务器是两个环境，所以难免会涉及配置文件问题，这里一并讲了。然后按本地模拟部署和服务器两部分演示

### 本地部署 

首先保证你的 Nest 服务在本地 dev 环境下是正常可用的。有些同学不要一上来就拿不知道哪年的项目开始练手，结果项目本身就有问题。

因为本地和线上是两个不同环境，mysql、redis等很多需要区分环境的属性值都需要统一配置。Nest提供了`@nest/config`这个包，可以用来读取环境变量文件，并注入一个 service 到所有 module 里使用。

环境变量文件的类型有很多，可以是.env 文件，也可以是.yaml，也可以是.js, .ts。这里我使用的是.env，下面就以此为例。

.env 文件放在根目录下，如果你是有多个微服务，这个 .env文件默认读取的也是根目录。

在目录中位置如下：

![](https://img.zzao.club/article/202411191445665.png)

在app.module.ts 中配置 ConfigModule，同样的，在这个文件中把 TypeOrmModule 的配置改成 env里的配置项

```typescript
@Module({
	imports: [
		ConfigModule.forRoot({
	      isGlobal: true,
	      envFilePath:
	        process.env.NODE_ENVIRONMENT === 'production'
	          ? path.join(process.cwd(), '.prod.env')
	          : path.join(process.cwd(), '.dev.env'),
	    }),
		TypeOrmModule.forRootAsync({
	      imports: [ConfigModule],
	      useFactory(configService: ConfigService) {
	        return {
	          type: 'mysql',
	          host: configService.get('mysql_server_host'),
	          port: configService.get('mysql_server_port'),
	          username: configService.get('mysql_server_username'),
	          password: configService.get('mysql_server_password'),
	          database: configService.get('mysql_server_database'),
	          # 可以同步表结构，先开着
	          synchronize: true,
	          logging: true,
	          entities: [
	            你的 entities
	          ],
	          poolSize: 10,
	          connectorPackage: 'mysql2',
	          extra: {
	            authPlugin: 'sha256_password',
	          },
	        };
	      },
	      inject: [ConfigService],
	    }),
	]
})
 
```

redis配置同理，也把之前写死的属性值改成 env 文件里的配置项

redis.module.ts
```typescript
@Module({
  controllers: [RedisController],
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory(configService: ConfigService) {
        console.log(`redis 打印`, configService.get('redis_server_port'));
        const client = createClient({
          socket: {
            host: configService.get('redis_server_host'),
            port: configService.get('redis_server_port'),
          },
          database: configService.get('redis_server_db'),
        });
        await client.connect();
        return client;
      },
      inject: [ConfigService],
    },
  ],
  imports: [],
  exports: [RedisService],
})

```

更改完成后，先启动一下本地服务，看看能不能正常访问，如果可以再进行下一步！这一步卡住也没事，慢慢 Google 一下，基本都是常见问题。出现问题再解决才能变成自己的东西。

本地开发的时候，我是用Docker Desktop单独跑了两个容器：mysql、redis。他们的 data 也挂载到了我本地目录上。而上线的时候我需要用 docker-compose 编排 nest、mysql、redis 他们三个，并且 nest 依赖于 mysql 和 redis，下面直接列一下我本地部署时的 docker-compose.yml。我直接把注释写在里面，免去上下滑动对比着看了

有些名称、端口我故意没有起成一样的，方便形成对比

```yaml
version: '1.0'
services:
 # 我的nest服务名称
  nest-master:
	  # 指定了容器名， 这个容器名会用于容器间的通信， 比如你本地 mysql 的 host 是 localhost，那线上就用 zz_master 访问。 不声明的话就是‘nest-master’
    container_name: 'zz_master'
    # nest项目打包时，用的是他自己目录下的 Dockerfile
    build:
      context: ./
      dockerfile: ./apps/master/Dockerfile
    # 依赖于另外两个 service，另外两个 service 会先被构建
    depends_on:
      - zz-mysql-7
      - zz-redis-7
    # 端口映射，左边是宿主机上的端口 7008，也就是你打开浏览器http://localhost:7008 可以访问到 nest 的接口，而在容器内部他是运行在 7007 上
    ports:
      - '7008:7007'
    # 失败时重启，有时候 mysql 没启动起来，nest 已经完事了，就会连不上 mysql，所以一直重启，知道 mysql 启动成功
    # 不过你的项目如果有bug，他就会无限重启，所以要自己注意了
    restart: on-failure
    # 声明他们在zzstudio-server 这个网络中，可以用container_name进行访问
    # 不声明的话，也会在同一个网络中，名称默认是 项目_default， 比如我这个项目叫 zz-nest, 默认的网络名称就是 zz-nest_default
    networks:
      - zzstudio-server
  # 我的 mysql 服务的名称
  zz-mysql-7:
    # 我指定的容器名，当 nest服务（也就是上边的 nest-master）要访问 mysql 时，mysql的 host 就配置为 zz_mysql
    container_name: 'zz_mysql'
    image: mysql
    # 端口映射，当你从外部访问 3307 时会被映射到容器内部的 3306 上。
    # 因为这里我们三个服务在同一个网络下，所以我们prod.env 使用的应该是 3306
    ports:
      - '3307:3306'
    # 挂载的本地目录
    volumes:
      - /我的本地目录/mysql:/var/lib/mysql
      # 可以用于初始化时执行一些 sql，我查阅的野文里，有的用来解决数据库没有被创建，或用来表结构初始化，有需要的自行尝试
      # - ./init.sql/:/docker-entrypoint-initdb.d/init.sql

    # 相关的环境变量，密码应该是必须要设置的，忘了咋回事了
    environment:
      # 如果你的 mysql 是 8.x 不要指定 MYSQL_USER=root，会报错
      # 在指定了MYSQL_DATABASE后，会自动创建这个数据库！
      MYSQL_DATABASE: zzstudio 
      MYSQL_ROOT_PASSWORD: 123456
    # 同样，显式的声明在一个网络下
    networks:
      - zzstudio-server
  # 我的redis服务名称
  zz-redis-7:
    # 我指定的容器名称，当 nest 应用要连接 redis 时，redis server host 直接写这个‘zz_redis’ 即可
    container_name: 'zz_redis'
    image: redis
    # 端口映射，道理和 mysql 一样。可以看下上边的描述
    ports:
      - '6378:6379'
    volumes:
      - /我的本地目录/redis:/data
    networks:
      - zzstudio-server
# 声明网络，和上边所有的 server 下边的 networks 相对应
networks:
  zzstudio-server:
    driver: bridge

```

然后再对比看一下本地和线上的环境配置，我**放在了一起演示**，可以自己体会一下

```
redis_server_host=localhost #dev
redis_server_host=zz_redis #prod 对应 docker-compose.yml 里的 redis 的 container_name

redis_server_port=6379 #dev
redis_server_port=6379 #prod  ports 配的是 6378：6379，这里用的是 6379，因为他们已经在同一个网络里

redis_server_db=1

mysql_server_host=localhost # dev
mysql_server_host=zz_mysql # prod 对应 docker-compose.yml 里的 msyql 的 container_name
mysql_server_port=3307# dev 我本地 docker单独启用 mysql 时， 使用的 ports 是 3307:3306，所以我 nest 访问 mysql是用 3307 访问，从外部访问。同理 navicat 这种软件访问也需要从 3307
mysql_server_port=3306# prod 线上ports 配的也是 3307:3306，这里用的是 3306，因为他们已经在同一个网络里
#mysql_server_username=用户名
#mysql_server_password=密码
#mysql_server_database=数据库名称
```

nest 应用的 Dockerfile 如下，要注意的是我单独把 `prod.env` 复制进去了，不然不会扔进去。你也可以先自己试试，看看报错信息，思考一下是哪里出了问题，再回过头来按我这个流程排查。这样也能加深记忆。

这个 Dockfile 我也是参考了很多野文，这方面不再赘述了，能跑起来就行！

`要注意：master 是我的服务的文件名，要记得换成自己的`

```
FROM node:18.18.2-alpine3.18 as build-stage

WORKDIR /app

RUN npm install -g pnpm

COPY package.json .

RUN pnpm install

COPY . .

RUN pnpm build:master 

FROM node:18.18.2-alpine3.18 as production-stage 

COPY --from=build-stage /app/dist/apps /app/apps
COPY --from=build-stage /app/.prod.env /app/.prod.env
COPY --from=build-stage /app/package.json /app/package.json

WORKDIR /app

RUN npm install -g pnpm

ENV NODE_ENVIRONMENT=production

RUN pnpm install --production

CMD [ "node", "./apps/master/main.js" ]

EXPOSE 7007

```

写好了Dockerfile、 docker-compose.yml 和本地 env，我们先把本地当线上跑一下，跑之前先看看自己本地的docker 运行情况，不要冲突了。

```
docker-compose up
```

跑完后，出现下图，即为成功

![](https://img.zzao.club/article/202411191445666.png)

如果出现了类似以下报错，可能是**因为没建成数据库**，也可能是你挂载的本地目录` /你的目录/mysql `**不为空，导致初始化失败**。

也可能会出现 178.x.x.x：端口号 访问不到的报错，一般是你配置文件里 `port` 配错了，应该配成容器的 `network` 的 `bridge` 的 `Gateway` 地址

可以往上滑一下日志，看看具体报错信息，如有不知名报错，也可以在公众号：早早集市 找到我，我再尝试复现一下。

```
zz_master  | Error: getaddrinfo EAI_AGAIN zz_mysql
```

然后我们拿浏览器测试一下 Get接口即可，能返回数据，终端里有输出日志就行啦

然后开始部署到云服务器！

### 服务器部署

往服务器部署前还需要改一下 `docker-compose.yml` 

mysql、redis的 `volumes` 改为服务器上的地址，没有的话先新建一下

然后代码传到服务器上，可以用各种方式，如 git、ftp、jenkins等。

然后我们通过 ssh 连一下云服务器，然后进入到项目的根目录下， 运行

```
docker-compose up
```

如果你的服务器上只安装了 docker 没有 docker-compose，可以使用以下命令先安装一下

```
sudo curl -L "https://github.com/docker/compose/releases/download/v2.6.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

docker-compose --version
```

在经过几次 retry之后，可以看到服务成功启动!

```
zz_master  | [Nest] 1  - 12/24/2023, 12:32:59 PM   ERROR [TypeOrmModule] Unable to connect to the database. Retrying (4)...
```

使用 `docker-compose down` 停止，然后使用`docker-compose up -d`，在后台启动即可

然后使用`docker ps` ，查看已经在运行的容器～

`docker-compose down` 运行后也可以看到，启动的是三个 Container，一个 Network，Network 就是上边指定的网络

```
[+] Running 4/4
 ⠿ Container zz_master             Removed                                                                                                              10.4s
 ⠿ Container zz_redis              Removed                                                                                                                 0.4s
 ⠿ Container zz_mysql              Removed                                                                                                                 1.1s
 ⠿ Network server_zzstudio-server  Removed    
```

ok，服务已经启动，接下来我用 Ngxin 做代理，把接口代理到 nest 服务上（容器的对外端口上）

nginx 也是一个 docker 单独启动的容器，目前用来挂载一个前端应用的目录，靠`Termius`的 `SFTP` 部署前端，因为Jenkins 太吃内存，后面我再调研一下有没有平替的方案。运维方面也不着急优化。

## Nginx 转发到 Nest

一开始我是这样配置的

```
 location ^~ /api/ {
            proxy_set_header  X-Real-IP  $remote_addr;
            proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
            proxy_pass http://localhost:7007/; 
        }
```

在服务器里使用 `curl` 是可以调通Nest的接口的，但是用 `Apifox` 调不同，会报 502，查看错误日志

```
2023/12/24 08:04:24 [warn] 24#24: *4 upstream server temporarily disabled while connecting to upstream, client: xxxx, server: zzstudio.cn, request: "GET /api/user/aaa HTTP/1.1", upstream: "http://127.0.0.1:7007/user/aaa", host: "zzstudio.cn"
2023/12/24 08:04:25 [error] 24#24: *4 no live upstreams while connecting to upstream, client: xxx, server: zzstudio.cn, request: "GET /api/user/aaa HTTP/1.1", upstream: "http://localhost/user/aaa", host: "zzstudio.cn"
```

然后把配置里的 localhost 改成自己服务器的公网 ip，发现还是不行

然后又查看了一下 nginx 容器里的 ip

```
# 我的nginx容器名称叫nginx
docker inspect nginx
```

拉到最后，看到 `Networks`里，`bridge` 的 `Gateway` 地址，把上边 `location` 里的 `proxy_pass`  改成 `http://Gateway 地址: 端口号/`， 再去 Apifox 尝试下自己的接口

```
 location ^~ /api/ {
            proxy_set_header  X-Real-IP  $remote_addr;
            proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
            proxy_pass http://Gateway 地址:7007/; 
        }
```

成功了👏

## 小结

以上就是我使用 docker-compose 部署 Nest 应用的全部过程，如果对你有帮助的话，还望点个关注、点赞支持一下～

也欢迎关注公众号：[早早集市](https://mp.weixin.qq.com/s/A8wHxE5Q2jl6Su_7QA6f-A)，第一时间围观我继续产出其他产品和文章～

感谢你的阅读，我是枣把儿\~


## 相关文章推荐

- 产品构思： [当一个程序员突然想做一款产品](https://mp.weixin.qq.com/s/A8wHxE5Q2jl6Su_7QA6f-A)
- 前端搭建： [Vue3项目实战：像素风LOGO编辑器 Pixeled Pic Pro](https://mp.weixin.qq.com/s/_XUUL1HR60Zfu3xjKFeZ_w)
- 前端迭代（一）：[iKun集合！Pixeled Pic Pro 前端迭代篇（一）](https://mp.weixin.qq.com/s/n8E_clCeQl8Zu2nLg0lHbQ)
- 后端搭建：[一个产品要有一个“好底子”：Nest项目搭建](https://mp.weixin.qq.com/s/GnYy_Ym3Z7jlVRfsjGLMUA)



## 后记 2023年12月26日17:59:16


nest项目通过docker-compose更新

```
# 先停止
docker-compose down 
# 然后后台启动的时候重新build，mysql和redis自动越过了，重新打包了nest服务
docker-compose up --build -d
```


```shell
sudo tee /etc/docker/daemon.json <<-EOF { "registry-mirrors": [ "https://1js6gccw.mirror.aliyuncs.com", "https://dockerproxy.com", "https://mirror.baidubce.com", "https://docker.m.daocloud.io", "https://docker.nju.edu.cn", "https://docker.mirrors.sjtug.sjtu.edu.cn" ] } EOF
```

```
sudo mkdir -p /etc/docker 
sudo tee /etc/docker/daemon.json <<-EOF 
{ "registry-mirrors": [ 
	"https://1js6gccw.mirror.aliyuncs.com",
	"https://dockerproxy.com", 
	"https://mirror.baidubce.com", 
	"https://docker.m.daocloud.io", 
	"https://docker.nju.edu.cn",
	"https://docker.mirrors.sjtug.sjtu.edu.cn" 
	] 
} 
EOF

sudo systemctl daemon-reload
sudo systemctl restart docker
```


```
docker run -d \
--init \
--name memoz \
--publish 5230:5230 \
--volume /home/memoz/:/var/opt/memos \
neosmemo/memos:0.22.3
```