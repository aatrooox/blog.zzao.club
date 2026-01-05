---
title: 【Hono】Gitea+Bun+Hono+Pm2 自动化部署后记
date: 2025-02-10
lastmod: 2025-02-12
tags:
  - Hono
versions:
  - hono@4.5.11
showTitle: 【Hono】Gitea+Bun+Hono+Pm2 自动化部署后记
---
# 【Hono】Gitea+Bun+Hono+Pm2 自动化部署后记
本文记录一下`bun`项目在使用`pm2`部署时产生的一点问题。

部署流程：使用`Gitea`自建git仓库，编写workflow，on[push]，自动拉取代码=>下载依赖=>打包=>移动到目标文件夹=>启动/重启 `pm2 stop/start ecosystem.config.cjs`

> 云服务器（新加坡）：debian 12  2h4g
bun: 1.1.31 
pm2: 5.4.2

这是一个4G内存的机器，所以我上了gitea，利用gitea的`act_runner`自动部署。

2G的服务器我实测打包Nuxt项目会爆内存，刚好**峰值内存要吃2G出头。**

项目本身使用`honojs`，有几个简单接口，只有登录注册业务。因为已经用其他项目把`act_runner`调通了，所以这个项目也很顺利的运行成功。整个gitea actions运行时间在`1s`左右

**但是pm2启动后显示error，没有错误日志!!**

actions是已经成功跑完的，所以生产环境需要的文件已经被移动到了目标文件夹内。

尝试在项目根目录直接使用`bun run index.js`后，发现有打不开`.env.production`里配置的目录的情况，原来是没正确加载上`NODE_ENV`

于是又查阅了一番pm2文档、bun文档，发现需要给`pm2 start`加上`--env production`参数

```shell
pm2 start ecosystem.config.cjs --env production
```

加上后，重新提交代码，自动部署，发现还是一样，显示error但没有日志

再次在项目根目录直接使用`NODE_ENV=production bun run index.js`，发现可以正常运行，那估计就是pm2有什么问题影响了，但单看配置文件是没有写错的，还是不知道什么原因无法用pm2启动

于是又不用配置文件启动，尝试直接`pm2 start index.js --interpreter bun` 跑一下试试，这时候发现可以了，而且mode很明显是`fork`，而刚才我配置`ecosystem.config.js`时用的是`cluster`。

bun官网也只是提了一下要配置一下`interpreter`为`~/.bun/bin/bun`。无奈只能先这样处理，等后续解决后再来水一篇！

👇下面是配置参考

```typescript
module.exports = {
  apps: [
    {
      name: 'your_app_name',
      port: '5577',
      // 运行bun项目时，先设置为fork模式
      exec_mode: 'fork',
      // instances: 'max',
      script: 'index.js',
      interpreter: '/root/.bun/bin/bun',
      env: {
        NODE_ENV: 'production'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}

```

**.gitea/workflow/build.yaml 这个完全和github一致，熟悉github actions的可以略过了**

```yaml
name: Gitea Actions Demo
run-name: ${{ gitea.actor }} is testing out Gitea Actions  
on: [push]
jobs:
  Explore-Gitea-Actions:
    runs-on: debian
    steps:
      - run: echo "  The job was automatically triggered by a ${{ gitea.event_name }} event."
      - run: echo "  This job is now running on a ${{ runner.os }} server hosted by Gitea!"
      - run: echo "  The name of your branch is ${{ gitea.ref }} and your repository is ${{ gitea.repository }}."
      # 把代码checkout到一个临时的文件夹中
      - name: Check out repository code
        uses: actions/checkout@v3
      # 下载依赖，因为我要在服务器打包代码
      - name: Install dependencies
        run: bun install
      # 打包代码
      - name: Build Project
        run: npm run build
      # 打包后的代码，移动到指定的文件夹内
      # 为了测试配置文件，我把两个配置文件都copy过去了，实际只用到了.env.production
      - name: Copy Files
        run: |
          mkdir -p /root/a/b
          cp -R out/* /root/a/b/
          cp -R ecosystem.config.cjs /root/a/b/ecosystem.config.cjs
          cp -R package.json /root/a/b/package.json
          cp -R .env.production /root/a/b/.env.production
          cp -R .env /root/a/b/.env
      # 下载依赖
      - name: Install dependencies
        run: |
          cd /root/a/b
          bun install
     # 使用pm2启动项目 --env production
      - name: Deploy to production2
        run: |
          cd /root/a/b
          pm2 stop ecosystem.config.cjs
          pm2 start ecosystem.config.cjs --env production
      - run: echo "  The ${{ gitea.repository }} repository has been cloned to the runner."
      - run: echo " ️ The workflow is now ready to test your code on the runner."
      - name: List files in the repository
        run: |
          ls ${{ gitea.workspace }}          
      - run: echo "  This job's status is ${{ job.status }}."
```



