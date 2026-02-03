---
title: Nest从TypeORM到Prisma：迁移记录
description: Prisma初体验
image: 
tags: ["Nest", "Prisma"]
category: 技术
author: zzdaddy
published: 2023-01-01
date: 2024-01-22
lastmod: 2025-08-19
showTitle: Nest从TypeORM到Prisma：迁移记录
---
最近把typeORM换成了prisma，主要是想用prisma的migrate功能，于是记录了一下其中发现的问题。

### 安装

全局安装prisma

```shell
npm i -g prisma
```

项目安装@prisma/client

```shell
pnpm add @prisma/client
```

在nest根目录初始化prisma，初始化后会在根目录创建一个prisma目录以及一个`.env`，目录里面有个`schema.prisma` 。

```shell
npx prisma init
```

nest创建一个新的模块prisma

```shell
nest g resource prisma
```

可以用`@Global`把这个模块注册成全局模块。

`service部分`可以参考nest官网的推荐或者其他野文，基本上都一样

```typescript
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  constructor() {
    super();
  }
  async onApplicationBootstrap() {
    await this.$connect();
  }

  async onApplicationShutdown() {
    await this.$disconnect();
  }
}
```

把之前typeORM相关的，find、save等等方法一一替换成prisma。比如：

```typescript
async findUserById(id: bigint) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  } 
```

确定没有问题之后，看一下prisma的常用命令。这部分也可以先跳过，migrate dev命令放在了正确的迁移这一小节中。

`db pull `
基于数据库schema生成prisma schema

`prisma generate`
生成client代码，不会同步数据库

`prisma db push`
用于将本地的表结构改动同步到数据库。

如果表里已经有了字段和数据，再新增字段时，务必设置为允许为null的可选字段，如`String?`，否则会清空表结构。虽然会提示你，也不排除很多人会不看英文提示。

```shell
 username   String?  @db.VarChar(255) ✅
 username2  String  @db.VarChar(255)  ❌
```

如果是删除了字段。运行后会同步到mysql数据库中。同时不会删除已有的数据，只会删除对应的字段。

[**Prisma CLI reference**](https://www.prisma.io/docs/orm/reference/prisma-cli-reference#migrate-resolve "Prisma CLI reference") 👈此处有所有命令，还是建议看看官方文档。

**注意此操作不会像migrate一样会被记录**

### 正确的迁移

迁移过程也有[官方文档](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project "官方文档")👈，这里相当于我实践后又讲述了一遍。

1.  首先设置好开头`init`好的`schema.prisma`，如：

```typescript
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

1.  使用dotenv重新配置一下env文件，和项目现有的env文件结合起来，如：

```shell
npm install -g dotenv-cli
```

在`package.json`配置一下常用命令

```typescript
  "migrate:dev": "npx dotenv -e .dev.env -- prisma migrate dev",
    "migrate:deploy": "npx dotenv -e .prod.env -- prisma migrate deploy",
    "prisma:generate:dev": "npx dotenv -e .dev.env -- prisma generate",
    "prisma:generate:prod": "npx dotenv -e .prod.env -- prisma generate",
    "db:push:dev": "npx dotenv -e .dev.env -- prisma db push",
    "db:push:prod": "npx dotenv -e .prod.env -- prisma db push",
    "db:pull:dev": "npx dotenv -e .dev.env -- prisma db pull",
    "db:pull:prod": "npx dotenv -e .prod.env -- prisma db pull",
    "db:seed:dev": "npx dotenv -e .dev.env -- prisma db seed",
    "db:seed:prod": "npx dotenv -e .prod.env -- prisma db seed",
```

然后把prisma默认的env里配置的`DATABASE_URL`挪到`.dev.env` 和` .prod.env`里去，在不同环境测试一下能否正确连接数据库。

由于数据库里已有表结构和数据，prisma属于后来者，我不想丢失数据和结构，所以先使用db pull 生成prisma schema

```shell
pnpm db:pull:dev
```

最关键的一点来了。migrate dev会记录迁移的过程，如果直接使用migrate dev的话，他会清空数据，并生成一个migration和建表的sql，这样显然不符合预期。所以先手动创建一个migration

```shell
mkdir -p prisma/migrations/0_init
```

然后使用prisma migrate diff 输出一个sql脚本

```shell
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql
```

此时，检查一下生成sql语句确保没有任何问题，然后把这个migration标记为已应用

```shell
npx prisma migrate resolve --applied 0_init
```

这个时候，去修改prisma schema后再使用migrate dev，就会生成基于已有数据库后的一个变更了。这个变更就不会影响已有数据了。

下边我也基于migrate dev的操作做了一些场景重现，感兴趣的可以瞅瞅。

### migrate dev 操作演示

假设我不懂如何在两个环境之间迁移，只是在本地把玩prisma，直到我开始想到和线上数据库要同步一下。

运行`pnpm migrate:dev`会在prisma目录下生成一个`migrations`目录，并生成本次操作的sql。

现在本地数据库已经有了一堆表，刚刚接入了prisma，或者本地乱搞的时候已经不知道是什么状态了。我通过`init`后用`db puill `生成了`prisma schame` 然后我在`prisma schema`中删除了一个`model`。

#### 删除表

然后运行`pnpm migrate:dev` 并在提示下命名为`delete_table1`。它会提示你的数据库架构与迁移历史不一致，然后继续执行。因为此时我本地的状态已经混乱，migrations记录已经不在了，所以他从头开始给我记录了。

```typescript
Drift detected: Your database schema is not in sync with your migration history.
The following is a summary of the differences between the expected database schema given your migrations files, and the actual schema of the database.
It should be understood as the set of changes to get from the expected schema to the actual schema.

```

此时可以看到目录下生成对应的sql，**里面是一堆创建表的SQL语句**。再去本地数据库看的时候，数据都被清除了，并且自动执行了`seed.ts` 插入了假数据

![](https://img.zzao.club/article/202411191448363.png)

然后再删除一张表`admin_user`，然后再运行一下`migrate:dev`，这次命名为`delete_table2`，可以看到这次没有提示错误，只是单纯的删除了一张表

![](https://img.zzao.club/article/202411191448364.png)

```typescript
DROP TABLE `admin_user`;
```

#### 增加表

这个没有什么可说的

```typescript
CREATE TABLE `color2` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `desc` VARCHAR(20) NULL,
    `desc2` VARCHAR(20) NULL,
    `desc3` VARCHAR(20) NULL,
    `value` VARCHAR(255) NOT NULL,
    `createTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updateTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `userId` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 删除字段

然后我找了一张表`color`，给他直接加了一条数据，然后在`model`里把其中一个字段`desc`删掉，再去运行`pnpm migrate:dev`，这次生成的SQL里也只是删除了一个字段，对数据没有影响。

```typescript
ALTER TABLE `color` DROP COLUMN `desc`;
```

#### 增加字段

还是这张表`color`，再加两个必填字段`desc`、`desc2`

```typescript
desc       String   @db.VarChar(20)
desc2      String   @db.VarChar(20)
```

因为这俩字段都是必填的，所以直接把表清空了，这次也没提示会清空表（？）。

再去数据造一条数据，然后再把这俩字段改成可选，再次执行`pnpm migrate:dev`

```typescript
desc       String?   @db.VarChar(20)
desc2      String?   @db.VarChar(20)
```

这次没有数据没有被清，只是字段被设置了可以为null

```typescript
-- AlterTable
ALTER TABLE `color` MODIFY `desc` VARCHAR(20) NULL,
    MODIFY `desc2` VARCHAR(20) NULL;

```

直接添加一个可选字段`desc3`，这次只是单纯增加了一个可以为null的desc3字段

```typescript
-- AlterTable
ALTER TABLE `color` ADD COLUMN `desc3` VARCHAR(20) NULL;
```

正常情况下，已经有数据的表，不可能再增加一个必填字段了，因为已有字段就都不符合条件了。我这里只是演示一下，对于一个没接触过后端和数据库的前端来说，这个可能也是需要考虑的......

#### 同步到其他环境的数据库

如果本地有docker容器的端口会冲突的话，先stop一下，然后把nest项目本地用docker-compose跑起来。

如何使用docker-compose 部署nest项目可以看下我这篇文章，里面有详细解释 👉[使用 Docker Compose 部署 Nest 应用](https://juejin.cn/post/7316202589603807259 "使用 Docker Compose 部署 Nest 应用")。

```typescript
docker-compose up --build -d
```

打包完成后，来到nest服务内部，这里我用的Docker Desktop 演示。此时，正式数据库还是没有`color2`这个表，color表里也没有`desc2` 和`desc`的。然后运行一下，为了保证他运行不报错，我先把20240117080859\_delete\_table1删了，因为这个sql里全是建表的语句。后面会重新来一下这个过程来弥补这个错误。

```typescript
/app # pnpm migrate:deploy

> master@0.0.1 migrate:deploy /app
> npx dotenv -e .prod.env -- prisma migrate deploy

Prisma schema loaded from prisma/schema.prisma
Datasource "db": MySQL database "zzstudio" at "zz_mysql:3306"

6 migrations found in prisma/migrations

Applying migration `20240117080859_delete_table2`
Applying migration `20240117082030_delete_field1`
Applying migration `20240117082351_add_desc2`
Applying migration `20240117082752_optional1`
Applying migration `20240117083056_add_desc3`
Applying migration `20240117083359_addtablecolor2`

The following migrations have been applied:

migrations/
  └─ 20240117080859_delete_table2/
    └─ migration.sql
  └─ 20240117082030_delete_field1/
    └─ migration.sql
  └─ 20240117082351_add_desc2/
    └─ migration.sql
  └─ 20240117082752_optional1/
    └─ migration.sql
  └─ 20240117083056_add_desc3/
    └─ migration.sql
  └─ 20240117083359_addtablecolor2/
    └─ migration.sql
      
All migrations have been successfully applied.

```

虽然我在本地开发时，先增加了两个必填字段desc、desc2，导致了当时数据被删除，后面又增加了desc、desc2、desc3三个可选字段，在正式环境的数据库中，数据并没有丢失，这三个可选字段也被加上了。为了验证修改也有数据的字段会不会产生影响，我把正式库和本地库的desc、desc2、desc3三个可选字段都造上数据，然后再去代码里把desc3改为desc4。

SQL如下

```typescript
ALTER TABLE `color` DROP COLUMN `desc3`,
    ADD COLUMN `desc4` VARCHAR(20) NULL;
```

然后再模拟一下部署上线，再次运行deploy。

然后在正式环境运行deploy没有问题。但在本地执行上边那一步时，会检查我的migration记录，导致我跑不起来，所以我在不知道如何操作的情况下，只能又从垃圾桶里把删除的文件还原。

然后把全部migrations部署到正式上去运行deploy时，也会提示我

```typescript
A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve

Migration name: 20240117075835_delete_table1
```

根据提示的地址，然后运行了，

```typescript
/app # npx dotenv -e .prod.env -- prisma migrate resolve --rolled-back "20240117075835_delete_table1" 
```

提示如下。把20240117075835\_delete\_table1这条记录回滚了。

```typescript
Migration 20240117075835_delete_table1 marked as rolled back.
```

再次deploy时，因为20240117075835\_delete\_table1的sql里和正式数据库有冲突（重复创建了表），所以还是报错了。然后我就把20240117075835\_delete\_table1删了再重新部署上去deplpy，此时提示， 这个migrate在之前的一个时刻失败了。因为prisma有一个自己表，会记录整个迁移的过程。

```typescript
The `20240117075835_delete_table1` migration started at 2024-01-17 09:13:27.542 UTC failed
```

于是我又重新运行了一下resolve

```typescript
/app # npx dotenv -e .prod.env -- prisma migrate resolve --rolled-back "20240117075835_delete_table1" 
```

然后再次deploy，可以了。刷新了一下表里数据，desc3被删了，desc4也加上了。

#### 开始修复

但是由于一顿操作，搞的两边的prisma migrations不太同步了，具体哪里不一样我也忘了。而我只想跳过第一步会给我清空表数据再重新建表的migration。

于是我把本地`reset`一下，把`migrations`全删掉，也不管他是啥状态了，先按照正确的迁移的做法建好一个`0_init`，标记为`applied`，然后继续修改一些model字段，然后再使用`migrate dev`生成了一条migration记录。重新“部署上线”

```typescript
docker-compose up --build -d
```

在docker内部尝试一下deploy

```shell
/app # pnpm migrate:deploy
```

会报错：

```shell
A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve

Migration name: 0_init

Database error code: 1050
```

这个错已经在本地看了无数遍了。好解决！把它标记为已应用

```shell
/app # npx dotenv -e .prod.env -- prisma migrate resolve --applied 0_init
```

成功后再次使用deploy。可以看到没问题了，只执行了0\_init之后的两个migration记录。

### 附录

-   [Troubleshooting](https://www.wolai.com/dZFPf36pn52aSaFT1TcvDr#qkBYymtEjsbxhg95MxLmn "Troubleshooting") 包含了各种migration的操作
-   [**Prisma CLI reference**](https://www.prisma.io/docs/orm/reference/prisma-cli-reference#migrate-resolve "Prisma CLI reference")  包含所有prisma cli 命令
-   [Add to existing project](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project "Add to existing project") 将prisma添加到现有项目中

### 小结

以上就是从typeorm到prisma的变更过程及遇到的问题。

如果对你有帮助的话，希望可以点个关注支持一下 (๑•̀ㅂ•́)و✧

### 相关文章

Nest搭建： [一个产品要有一个“好底子”：Nest项目搭建](https://juejin.cn/post/7313418992310616101 "一个产品要有一个“好底子”：Nest项目搭建")

Nest部署：[使用 Docker Compose 部署 Nest 应用](https://juejin.cn/post/7316202589603807259 "使用 Docker Compose 部署 Nest 应用")
