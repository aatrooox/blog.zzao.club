---
title: Prisma 迁移到 Dizzle 后的基线问题
date: 2025-08-15
lastmod: 2025-08-20
tags:
  - Node
---
把 `prisma` 迁移到了 `dizzle` 

由于 `dizzle` 的 `schema` 是直接让 `AI` 生成的，完全没看 `dizzle` 的官方文档

然后也遇到了已有项目迁移到 `Prisma` 一样的问题：**设置基线**。

Dizzle 也是用一个 migrations 文件夹来管理所有迁移。

初次生成时

```shell
drizzle-kit generate
```

生成的 `sql` 都是 `CREATE TABLE` ，这显然不应该在执行 `migrate` 命令时应用

_dizzle 的 migrate 和 prisma 的 deploy 是一样的，就是把变更应用到当前数据库的意思_

因为有 `prisma` 的[迁移经验](https://zzao.club/post/nest/nest-from-typeorm-to-prisma)了，所以也能大概猜到 `dizzle` 也有类似设置基线的方式

于是问了一下 `Kimi` 就得到了答案

在 `generate` 命令之后，得到了一个 `migrations` 文件夹，以及一个 `sql` 文件

```shell [dizzle/migrations/0000000000_xxxx_xxx.sql]
CREATE TABLE xxxx
```

拿到这个文件的 `hash` 部分，也就是：`0000000000_xxxx_xxx`

在配置文件中配置好 `migrations`

```typescript [dizzle.config.ts]

export default defineConfig({
  migrations: {
    prefix: 'timestamp',
    table: '__drizzle_migrations__',
    schema: 'public',
  },
})
```

一开始我配错了，配成了 `__drizzle_migrations` ，实测好像他不认这个表名，当然更可能是我不知道参数，但是我懒得去找了。

登录自己的服务器

进入数据库，如果你还没有 __drizzle_migrations__ 这个表，可以先跑一下 

```shell
drizzle-kit migrate
```

它会报错，但是没关系，只要帮咱创建好了表就行

然后手动插入一条记录

```sql
INSERT INTO __drizzle_migrations__ (hash, created_at)
VALUES ('0000000000_xxxx_xxx', NOW(6));
```

此时再去部署自己的项目时，就不会执行初始化生成的那个 sql 了，因为我们已经手动标记它已经被执行过了。

⚠️**插入的这条记录注意一下**，要和 `_journal.json` 里的值保持一致，不然后续的 migrations 都不会被执行

![](https://img.zzao.club/article/202508201440546.png)
至此结束

---

你别说 `kimi` 给的这种方式比以前迁移 `prisma` 更直接，更好理解了。

`prisma` 的各种命令反而更绕～

周末愉快 🚀