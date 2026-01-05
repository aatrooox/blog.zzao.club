---
title: Debian12 服务器上启动 MySQL 服务
date: 2025-03-05 10:17:23
lastmod: 2025-03-09 21:07:57
tags:
  - Docker
---
启动方式同[本地](https://blog.zzao.club/post/nuxt/local-init-mysql-by-docker)

```shell
docker compose exec mysql mysql -u root -p
```

创建一个数据库

```shell
CREATE DATABASE imgx CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

创建一个新用户

```sql
-- 创建用户，限制只能从特定 IP 访问（更安全）
CREATE USER 'imgx'@'%' IDENTIFIED BY 'your_strong_password!';

-- 如果需要限制特定 IP 访问（推荐）
-- CREATE USER 'prod_user'@'192.168.1.%' IDENTIFIED BY 'Strong_Password_123!';
```


授予最小必要权限

```sql
-- 授予特定数据库的必要权限
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER, REFERENCES, LOCK TABLES 
ON imgx.* TO 'imgx'@'%';


-- 如果只需要读写权限
-- GRANT SELECT, INSERT, UPDATE, DELETE ON production_db.* TO 'prod_user'@'%';
```

刷新权限

```sql
FLUSH PRIVILEGES;
```

验证用户权限

```sql
SHOW GRANTS FOR 'imgx'@'%';
```

设置密码策略

```sql
-- 设置密码过期策略（90天过期）
ALTER USER 'prod_user'@'%' PASSWORD EXPIRE INTERVAL 90 DAY;

-- 设置密码重试限制和锁定时间
ALTER USER 'prod_user'@'%' FAILED_LOGIN_ATTEMPTS 3 PASSWORD_LOCK_TIME 2;
```

密码过期后：
- 用户无法执行正常操作
- 只能执行修改密码的操作
- 会收到错误提示： ERROR 1820 (HY000): You must reset your password using ALTER USER statement before executing this statement

过期后修改密码：

```sql
-- 方式1：用户自己修改密码
ALTER USER USER() IDENTIFIED BY 'new_password';

-- 方式2：管理员帮助修改
ALTER USER 'username'@'%' IDENTIFIED BY 'new_password';
```

设置备份策略

```sql
-- 授予备份权限（如果需要）
GRANT SELECT, SHOW VIEW, PROCESS, TRIGGER ON production_db.* TO 'prod_user'@'%';
GRANT LOCK TABLES ON production_db.* TO 'prod_user'@'%';

```

测试新用户登录

```shell
docker compose exec mysql mysql -u umami -p
```

