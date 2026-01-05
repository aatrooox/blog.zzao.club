---
title: 【Hono】完善：使用sqlite数据库及基于winston的日志持久化
date: 2025-02-10
lastmod: 2025-02-12
tags:
  - Hono
versions:
  - hono@4.5.11
showTitle: 【Hono】完善：使用sqlite数据库及基于winston的日志持久化
---
# 【Hono】完善：使用sqlite数据库及基于winston的日志持久化
前面两章完成了项目搭建、路由分组、参数校验、响应标准化、错误处理等功能点。

这一章来继续完善项目，并且为整个项目画一个图辅助理解。
## 使用Bun:sqlite作为数据库

在`hono`项目中使用`sqlite`作为数据库十分简单，因为bun自带了sqlite模块！

用的时候都不需要去`install`了，直接在文件中引入即可

```shell
import { Database } from 'bun:sqlite';
```

然后在简单翻阅文档后，发现可用的api似乎也比较简单，所以简单封装一下

```typescript
// src/database/sqlite.ts

const sqlite: Database = new Database("db/zzaoclub.db", { create: true, strict: true });

// 查询单条数据
export const query = (sql: SQL) => {
  return sqlite.query(sql);
};

// 查询列表数据
export const queryAll = (sql: SQL) => {
  return sqlite.query(sql).all();
};

// 执行新增、删除、修改等不需要返回值的操作
export const run = (sql: SQL, params: any[] = []) => {
  return sqlite.run(sql, params);
};
// run 会返回以下
// {
//   lastInsertRowid: 0,
//   changes: 0,
// }
export default sqlite;

```

简简单单的，甚至觉得哪里不对劲。

然后使用时，再去具体模块内定义查询的`SQL语句`。

由于也没有看到有什么推荐的`orm`，这里我决定体验一下`原生SQL`来写好了

```typescript
// src/user/crud.ts

import { queryAll } from '../database/sqlite';

// 比如一个简单的用户列表查询
export function getUserList() {
  return queryAll('SELECT * FROM users');
}
```

在路由处使用

```typescript
// src/user/index.ts

user.post("/list", zvalidator('json', userSchema), (c) => {
  // 校验后的params
  const params = c.req.valid('json')
  const users = userModal.getUserList()
  return c.json({ data: users })
})
```

然后就结束了。🤔

或者可以像bun:sqlite的文档中这样

```typescript
const query = db.query("SELECT * FROM foo WHERE bar = $bar");
const results = query.all({
  $bar: "bar",
});
```

我觉得倒不如直接把一条语句写好传进来了。

so，只要再跟着AI学习一下基础的CRUD操作就可以了，我觉得对于实现简单应用来说不难。

当然，表结构不会自动创建，我们还是要写一个sql文件，比如`init.sql`，让程序在初始化时运行。

或者借助一些sqlite工具来生成SQL语句

```sql
--- 用户表
CREATE TABLE IF NOT EXISTS user (
	"id"	INTEGER NOT NULL UNIQUE,
	"username"	TEXT NOT NULL DEFAULT '',
	"nickname"	TEXT NOT NULL DEFAULT '',
	"phone"	TEXT NOT NULL DEFAULT '',
	"role"	TEXT NOT NULL CHECK(role in ('admin','user','vendor')),
	"password_hash"	TEXT NOT NULL DEFAULT '',
	"avatar_url"	TEXT NOT NULL DEFAULT '',
	PRIMARY KEY("id" AUTOINCREMENT)
);

```

再打通上述接口后，就可以拿`Apifox`等工具再去请求一下，看看能否拿到自己插入的数据。

具体的SQL语句我就不展示了，一般让AI写出来一试，也不会有什么问题。

## 日志系统

日志我们使用winston这个库来实现，也是不管用什么框架都可以使用的

首先`install`，这里需要搭配另一个插件，实现日志按天分割，以及配置日志保存方式、保存时长等等

```shell
bun add winston winston-daily-rotate-file
```

使用`winston.createLogger()`来创建一个中间件，然后配置两个输出的log文件，一个用来存储日常所有的日志，一个单独存储错误日志，且都是按天分割文件。

```typescript
// LOG_DIR 需要自行配置

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(), // 添加颜色化格式化器
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }), // 时间日期格式
    winston.format.printf(({ timestamp, level, message }: any) => {
      return `${timestamp} ${level}: ${message}`;
    }) // 打印格式
  ),
  transports: [
    new DailyRotateFile({
      level: 'info',
      filename: path.join(LOG_DIR, 'info-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '10m', // 文件大小
      maxFiles: '7d', // 保留日志文件7天
      format: winston.format.combine(
        winston.format.uncolorize(), // 去除颜色 不去除无法toUpperCase
        winston.format.printf(({ timestamp, level, message }: any) => {
          return `${timestamp} ${level.toUpperCase()}: ${message}`;
        })
      ),
    }),
    // 错误日志文件传输配置, 生产环境建议放在别的目录下, 和开发环境区分开
    new DailyRotateFile({
      level: 'error',
      filename: path.join(LOG_DIR, 'err-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '10m',
      maxFiles: '30d', // 保留错误日志文件30天
      format: winston.format.combine(
        winston.format.uncolorize(), // 去除颜色
        winston.format.printf(({ timestamp, level, message }: any) => {
          return `${timestamp} ${level.toUpperCase()}: ${message}`;
        })
      ),
    })
  ]
});
```

配置项很好理解，也可以很方便的实验，所以就不过多赘述了。

然后去添加一个全局的中间价，打印一下请求信息

```typescript
// src/index.ts
// 这里myLogger就是winston创建的logger
api.use('*', async (c, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  // 使用 winston 创建的 logger 记录每个请求的详细信息
  myLogger.info(`[${c.req.method}] ${c.req.path} - ${c.res.status} - ${ms}ms`);
})
```

然后再去使用浏览器或`Apifox`尝试请求一下，看看效果

```shell
2024-09-19 16:35:37 error: [GET] http://localhost:4775/api/user - no authorization included in request
2024-09-19 16:35:37 info: [GET] /api/user - 200 - 6ms
```

能看到正常打印信息就可以了

然后再检查一下我们配置好的保存日志文件的目录下（注意目录要创建好，并且程序具备读写权限），会生成出 `err-2024-09-10.log` 以及`info-2024-09-10.log`两个日志文件即可。

## 总结

这一章主要是对项目的补充，借助`bun:sqlite`可以很方便的使用sqlite数据库，而且不像Mysql那样还需要安装和启动数据库服务，省时省力，开箱即用。

针对项目运行中方便排查可能出现的问题，加入了`winston`来让日志写入到文件中，同时日志文件可以限制大小，限制保存时长，按日期分割等等。

目前整个项目的结构已经比较清晰了，最后的**环境配置**放在下一节的优化里来一起写，最后再补一个图来梳理一下整个流程


![](https://img.zzao.club/article/202411191443812.png)


