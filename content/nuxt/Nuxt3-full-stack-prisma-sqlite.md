---
title: Nuxt3全栈开发 · 如何使用Prisma+Sqlite
date: 2024-11-26
lastmod: 2025-08-19
tags: ["博客", "Nuxt", "Prisma"]
versions: ["nuxt@3.14.0", "@prisma/client@5.22.0"]
description: Nuxt3全栈开发时，如何使用Prisma来管理Sqlite、Mysql等数据库
---
想要在 `Nuxt3` 中使用 `Sqlite` 非常简单，但重点是如何管理表结构的变更。

Nuxt3官方提供了配置，可以直接开启数据库，默认就是`sqlite`，数据库文件会存储在`.data/` 目录下。

https://db0.unjs.io/connectors/sqlite

```typescript
nitro: {
    experimental: {
      database: true
    },
    database: {
      default: {
        connector: 'sqlite',
        options: {
          path: '/blog',
          name: 'blog.db'
        }
      }
    },
    devDatabase: {
      default: {
        connector: 'sqlite',
        options: {
          path: '/Users/your_name/code/abc/databases/blog',
          name: 'blog.db'
        }
      }
    }
  },
```

但是后续的表结构的更新、新增、删除等操作如何和线上同步就是一个大问题了。

所以对于单机部署的博客来说，还是用上`Prisma`省心。 

## 安装及配置

没有用到官方的 `@prisma/nuxt` ，因为一开始装上报错了。

```shell
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Error: 
The "path" argument must be of type string. Received undefined
```

后来单独安装了 `prisma` 和 `@prisma/client` 之后，发现有同样的问题。我也懒得再来一遍来，就按 `prisma` 文档里流程接入。 总之，运行 `prisma` 相关命令时添加上 `npx prisma` 就可以了。

```shell
npm i prisma -D
```

```shell
npm i @prisma/client
```

```shell
npx prisma init
```

初始化完成后，会生成一个 `prisma` 目录，里面有一个 `dev.db` 和 `schema.prisma`。 

`dev.db` 是本地的数据库文件。如果你恰好也用 `VS Code` 的话，可以用 `SQLite3 Editor`  这个免费的插件管理

https://github.com/yy0931/sqlite3-editor

好用的话别忘了给人家点个赞

![](https://img.zzao.club/article/202411261618324.png)

`schema.prisma` 就是我们代码和数据库之间的“桥梁”，里面定义了：

- client：客户端配置
- db：数据库配置，使用什么数据库， 链接地址
- model：所有表结构

`client` 里的 `provider` 是一个固定的值 `prisma-client-js` ，还有一个 `binaryTargets` 比较有用。

```typescript
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "debian-openssl-3.0.x"]
}
```

`native` 就是本机的环境，第二个值我配的是服务器上的环境，配好这个参数后，`prisma/client` 里会生成对应的二进制文件，会被打包上去。（因为我这个项目是本地打包）如果你是线上打包的话，那 `native` 其实就是你得线上服务器环境了。

![](https://img.zzao.club/article/202411261618325.png)

`db` 主要是指定使用的数据库，以及地址。

这里我用 `Sqlite`，所以我这样配置：

```typescript
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

其中 `env("DATABASE_URL")` 是要读取你根目录下的 `.env` 文件里的 `DATABASE_URL`，所以说在部署时，要把 `env文件` 也发上去。

但 Nuxt3 里不推荐用 `env文件` 管理环境变量，因为它本身要支持更多的部署环境，所以这里可以用其他方式来设置。

如果用 `pm2` 启动 `node` 服务（Nuxt output），那就可以在 `ecosystem.config.cjs`，设置环境变量

```js
module.exports = {
  apps: [
    {
      name: 'Blog',
      port: '4577',
      exec_mode: 'fork',
      // instances: 'max',
      script: './server/index.mjs',
      // interpreter: '~/.bun/bin/bun',
      env: {
        NODE_ENV: 'production',
      },
      env_production: {
        NODE_ENV: 'production',
        DATABASE_URL: "file:/your_path/data1/dbs/blog.db"
      }
    }
  ]
}

```

如果用 `docker` / `docker-compose` 同样的也是在 `Dockerfile`、`docker-compose.yml` 里配置好。

`model` 里就是定义表结构。以一个 `user` 表为例

```typescript
model User {
  id           Int           @id @default(autoincrement())
  email        String?       @unique
  username     String        @unique
  nickname     String?
  password     String
  avatar_url   String?
  articles     Articles[]

  @@map("b_users")
}
```

`model User` ，这里的 `User` 会在其他的 model 中使用，如 `user_info  User` ：

```typescript
model Articles {
  id         Int        @id @default(autoincrement())
  uid        String     @unique
  title      String
  tags       String     @default("[]")
  create_ts  DateTime   @default(now())
  updated_ts DateTime   @updatedAt
  user_id    Int
  user_info  User       @relation(fields: [user_id], references: [id], onDelete: NoAction)

  @@map("b_articles")
}
```

字段、类型、说明这些规则就不说了，看看文档就能懂。这里 `user` 和 `article` 是一对多关系，每个 `article` 只有一个 `user`，一个 `user` 可以有多个 `article`。

**这个 `user_info` 在表结构中不会存在，只是 prisma 会用到**，所以表里的字段是 `user_info` 上面的那些。

这个 `User`，同样也会在使用 `prisma` 进行查询时使用，比如：

```typescript
await prisma.user.findMany(...some options )
```

如果要给 `User` 重新定义个名字，就使用 `@@map` ，这个名字（`b_users`）就是数据库真正的表名

## 初始化和使用

定义好自己配置、表结构后，我们希望把定义好的结构同步到 `dev.db` 里去，此时 `dev.db` 是空的。

```shell
npx prisma migrate dev --name init
```

`migrate` 是迁移的命令，`dev` 是在本地开发时表结构发生表更时生成一个迁移文件的命令。

生成的迁移文件会在 `prisma/migrations` 中 `2024111100000_init/migration.sql` 。

生成会自动执行一下 `prisma generate`，此命令会安装 `@prisma/client`并根据我们定义的模型，生成 `client API` 。

这就是为什么刚才的代码能顺利运行，并且提示的信息还特别全的原因（提供了完整的 TS 代码提示）：

```typescript
await prisma.user.findMany(...some options )
```

![](https://img.zzao.club/article/202411261623713.png)

此时我们就可以使用 `prisma/client` 的 API 在代码中进行增删改查操作了。

在此之前，如果还没有一个 prisma 实例，可以像我一样在 `server` 目录中创建一个 `prisma.ts` 

```typescript
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
```

然后在 `server/api/v1/user` 中（没有的话需要创建），新建一个接口文件 `login.post.ts` 

此时 `Nuxt` 中会出现一个 POST 接口：`/api/v1/user/login` ,（你可以在页面中或其他 api工具中调用测试一下）

然后在 `login.post.ts` 中引入 `prisma` 进行使用 。当然，如果你用了官方的 module，这里直接使用 `prisma` 实例就可以了。

```typescript

import prisma from '~/server/prisma'

export default defineEventHandler(async (event) => {
	// useSafeValidatedBody
  const body = await readBody(event)
  const { nuxtSecretKey, jwtSecret } = useRuntimeConfig(event)
  const { username, password } = body
  const secret = new TextEncoder().encode(jwtSecret)
  const user = await prisma.user.findUnique({
    where: {
      username
    }
  })

  return {
    data: user,
    msg: '登录成功'
  }
})
```

这里仅仅演示一下 `client api` 的使用。然后在 nuxt3 中，使用 `$fetch` 、`useAsyncData` 、`useFetch` 进行调用即可。


## 表结构变更和同步

在开发阶段，表结构很有可能会变动。

这种情况下，只需要修改 `prisma.schema` 的 `model` 定义，然后再使用 `migrate dev` ，生成一条迁移文件。

```shell
npx prisma migrate dev
```

比如我的初始 `User` 是这样的 （init/migration.sql）

```sql
-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

```

然后我发现字段不够，或者要改，于是修改 model 后，运行 `migrate dev` , 又生成了一条 `migration.sql` 

```sql
/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user'
);
INSERT INTO "new_User" ("email", "id", "name") SELECT "email", "id", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

```

我又加了 `password`、`role`，它的做法是新建一个 `new_user` 表，把原来的表的内容插入进去，然后把新的表名改一下。同时上方有提醒 我加了一个 `password` ，但又**不能为空**，如果原表有数据的话，就会有问题了。这个需要注意一下。

此时，把新的表结构同步到线上的命令，使用的是：`prisma migrate deploy`

如果数据库是空的、新的，那本地一直用 `migrate dev` 生成变更，线上一直用 `migrate deploy` 就能一直同步（目前我没发现问题）

但有一些情况是，项目可能是老的，数据库也已经存在。此时就需要 prisma 的其他命令，如 `push` 、`pull` 

## 设置基线

如果已经有数据库了，数据库无法被重置。

就要用到 **基线** 。只要不是刚接入数据库，可以都算这种情况。

先把现有的表结构拉下来。官方称之为 内省/反省 （==Introspection==）

```shell
prisma db pull
```

拉下来的结果，就和初始化时自己写 `model` 一样，prisma.schema 里会生成一堆和现有数据库对应的表结构。

如果已经有了 `prisma/migrations` 文件夹，请删除、移动、重命名或备份此文件夹

新建`migrations`文件夹，新增一个 `0_init` 目录，注意：**前缀是必须的**！,正常使用时是按时间戳排序的，这里需要重建一个**基线**，所以以 **0_** 开头。

```shell
mkdir -p prisma/migrations/0_init
```

使用`migrate diff`生成一份`migration.sql`。

个人理解：生成一份和当前数据库差异`sql`，也就是运行这个`sql`后可以达到目前这个数据库的结构。

```
npx prisma migrate diff \  
--from-empty \  
--to-schema-datamodel prisma/schema.prisma \  
--script > prisma/migrations/0_init/migration.sql
```

**resolve 应用这个差异**

个人理解：应用意为已经执行过了，相当于**抹平了历史记录**，从现在开始的改动就是基于当前数据库结构的变更了。

```shell
npx prisma migrate resolve --applied 0_init
```

线上数据库同理。

后续有表结构的改动，就使用`migrate dev`来维护就可以了

```shell
npx prisma migrate dev
```

部署到服务器上时， 我是把 `prisma` 也直接`push` (**git**)到项目打包后的目录下了，同步表结构只需要:

```shell
npx prisma migrate deploy
```

不知道关于这部分，我有没有讲清楚？

## 总结

以上就是在 `Nuxt3` 中使用 `prisma` 管理 `Sqlite` 的一些经验分享。

后续还会有深入和具体的 Nuxt3 全栈项目内的使用，完全使用 Nuxt 的 Server 能力开发接口等内容还在编写中～

欢迎关注「**早早集市**」
