---
title: 为 Nuxt 应用 MySQL 和 Redis 服务
date: 2025-02-27 10:41:22
lastmod: 2025-03-02 10:25:41
tags: ["Docker"]
versions: ["macos", "docker"]
description: Nuxt中如何使用Mysql和Redis服务，Docker配置详解
---
最近开始陆续架设数据库服务，打算起一个mysql服务，不同应用之间分库。自己管自己的。

同时有一个基础服务，用于给一些单纯提供api，不提供前端界面的Nitro服务提供鉴权

这里记录一下（本地Macos下）启动MySQL服务的命令，当然Debian上也是一样的

```shell
mkdir -p mysql/{data,conf,logs,backup}
```

```shell
touch mysql/conf/my.cnf
```

```txt
[mysqld]
# 字符集
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci
bind-address=127.0.0.1

# 默认认证插件
default_authentication_plugin=mysql_native_password

# 最大连接数
max_connections=1000

# 缓冲池大小
innodb_buffer_pool_size=512M

# 日志配置
slow_query_log=1
slow_query_log_file=/var/log/mysql/slow.log
long_query_time=2

[client]
default-character-set=utf8mb4

[mysql]
default-character-set=utf8mb4
```

禁止从远程连接数据库，如果从其他容器访问，需要加入同一个网络

```yaml
services:
  mysql:
    image: mysql:8.0
    container_name: mysql_local
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: 123456
      MYSQL_DATABASE: blog
    ports:
      - "3306:3306"
    volumes:
      - ./data:/var/lib/mysql
      - ./conf/my.cnf:/etc/mysql/conf.d/my.cnf
      - ./logs:/var/log/mysql
      - ./backup:/backup
  redis:
    image: redis:7.0
    container_name: redis_local
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - ./redis_data:/data
    command: redis-server --appendonly yes
    networks:
      - mysql_internal
networks:
  mysql_internal:
    driver: bridge
```

```shell
chmod -R 755 mysql
```

```shell
docker compose up -d
```