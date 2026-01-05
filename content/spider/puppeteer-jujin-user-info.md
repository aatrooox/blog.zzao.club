---
published: 2023-12-11 00:00:00
title: 使用puppeteer爬取掘金个人信息
description: 使用puppeteer爬取掘金个人信息
tags:
  - 技术
  - Puppeteer
  - Node
category: 技术
date: 2024-01-29
lastmod: 2025-08-19
showTitle: 使用puppeteer爬取掘金个人信息
---
## 引言

上一篇文章《使用puppeteer爬取掘金热榜》里，用了puppeteer的一些基础语法就完成了数据的爬取，这种可见即可爬的方式对于普通的使用者在感觉上来说，还是非常可靠和实用的。这次依旧是选择爬掘金的个人信息，但绕开了最麻烦的一步。

## 绕过登录

登录里比较麻烦就是验证码，有滑块、数字、数学计算等等多种多样的。

由于爬取的目的一般来说只是不太方便打开目标网站，或者要关注的网站太多，需要聚合一下每天刷一刷，所以对爬取的速度并没有太多要求。比较重要的是拿到数据后，如何进行可视化，所以就又回到了前端界面优化的问题上了。

所以我这里选择手动登录，并且之前使用的`puppeteer`这个库，现在换成了`puppeteer-core`，我用它来控制现有的chrome浏览器。

还有一个隐形的好处。比如有一个好朋友也有类似的需求，而他不懂技术，把程序打包成二进制给他之后，他能看着浏览器一步步的操作，反而会感觉更安心一些🤔

开始改造一下上次写的代码。

## 连接现有浏览器

因为不用默认内置的浏览器了，所以需要先打开自己的chrome浏览器，然后获取到浏览器的调试信息，再进行连接

```typescript
const browser = await puppeteer.connect({
      slowMo: 50,
      browserWSEndpoint: address,
    });
```

获取address前，需要先用debug模式启动chrome，以macos为例，启动一个9222的端口号

```typescript
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome  --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=$(mktemp -d -t 'your_chrome_data_dir') 
```

如果是windows，dir路径需要是一个存在的路径

```typescript
文件路径/chrome.exe --remote-debugging-port=9222 --user-data-dir="your_chrome_data_dir"


```

启动成功后可以通过`GET`  [http://127.0.0.1:9222/json/version](http://127.0.0.1:9222/json/version "http://127.0.0.1:9222/json/version") 这个地址获取到`webSocketDebuggerUrl`，也就是上边的`address`

```typescript
const data = await axios
      .get('http://127.0.0.1:9222/json/version')
      .catch((err) => {
        this.logger.error(`未找到已启动的chrome浏览器1`);
      });
```

先获取webSocketDebuggerUrl， 如果获取成功，使用puppeteer-core连接，如果获取失败，提示出来，不再执行。

`slowMo`可以控制脚本操作chrome的时候慢一些，方便观察。

## 自行登录

连接成功后，自己可以使用任意方式登录。

但是有一个很大的问题，启动后的**命令行界面和浏览器，都不能关闭**。不然登录状态就没了，再重新打开后又得登录一遍。如果爬取的大部分网站不需要登录还好，如果都要登录的话，那还是得想办法自动登录一下。

打码平台有很多，云码、超级鹰等都可以自己对接，不过大部分都是要钱的。也可以自己找找github上有没有开源项目，接入一下。或者等我找到之后，再来看我的😎

最小化窗口没有影响，跑起来还是会自己打开。

## 开始爬取

以下内容，和爬取热榜大同小异，有需要的自取。&#x20;

获取css selector的方式也是用的上篇文章的方式。

```typescript
// 等待数据展示区域展示出来
    await page.waitForSelector(
      '#juejin > div.view-container > main > div > div.minor-area > div > div.stat-block.block.shadow > div.block-body ',
    );
    // 等待头像加载出来, 头像出来了, 右侧信息肯定都有了
    await page.waitForSelector(
      '#juejin > div.view-container > main > div > div.major-area > div.user-info-block.block.shadow > div.avatar.jj-avatar > img',
    );
    // 文章被点赞数
    const articleUpvote = await page.$eval(
      '#juejin > div.view-container > main > div > div.minor-area > div > div.stat-block.block.shadow > div.block-body > div:nth-child(1) > span > span',
      (el) => el.textContent,
    );
    console.log(`文章被点赞数`, articleUpvote);
    // 文章被阅读数
    const articleViewNumber = await page.$eval(
      '#juejin > div.view-container > main > div > div.minor-area > div > div.stat-block.block.shadow > div.block-body > div:nth-child(2) > span > span',
      (el) => el.textContent,
    );
    console.log(`文章被阅读数`, articleViewNumber);
    // 文章被阅读数
    const articleJueNumber = await page.$eval(
      '#juejin > div.view-container > main > div > div.minor-area > div > div.stat-block.block.shadow > div.block-body > a > span > span',
      (el) => el.textContent,
    );
    console.log(`掘力值`, articleJueNumber);
    // 获取头像
    const avatarUrl = await page.$eval(
      '#juejin > div.view-container > main > div > div.major-area > div.user-info-block.block.shadow > div.avatar.jj-avatar > img',
      (el) => el.getAttribute('src'),
    );
    console.log(`头像地址`, avatarUrl);
    // 获取用户名
    const userName = await page.$eval(
      '#juejin > div.view-container > main > div > div.major-area > div.user-info-block.block.shadow > div.info-box.info-box > div.top > div.left > h1 > span',
      (el) => el.textContent,
    );
    console.log(`用户名`, userName);
    const position = await page.$eval(
      '#juejin > div.view-container > main > div > div.major-area > div.user-info-block.block.shadow > div.info-box.info-box > div.introduction > div.left > div.position > span > span:nth-child(1)',
      (el) => el.textContent,
    );
    console.log(`职位`, position);
    const company = await page.$eval(
      '#juejin > div.view-container > main > div > div.major-area > div.user-info-block.block.shadow > div.info-box.info-box > div.introduction > div.left > div.position > span > span:nth-child(3)',
      (el) => el.textContent,
    );
    console.log(`公司`, company);
    const intro = await page.$eval(
      '#juejin > div.view-container > main > div > div.major-area > div.user-info-block.block.shadow > div.info-box.info-box > div.introduction > div.left > div.intro > span',
      (el) => el.textContent,
    );
    console.log(`个人简介`, intro);
    let fansNumber = await page.$eval(
      '#juejin > div.view-container > main > div > div.minor-area > div > div.follow-block.block.shadow > a:nth-child(2) > div.item-count',
      (el) => el.textContent,
    );

```

信息拿到之后，重点是要干啥用。

## 信息处理

我提供几种思路，大家酌情考虑。

#### webhook通知

用nestjs里的定时任务，每天自动跑一下，拿到数据之后，用钉钉/飞书的webhook直接发出来，早上看看有无数据的变动或者消息。

#### 数据趋势可视化

可以把每天的文章数据、粉丝数据、阅读量等记录一下，生成趋势图，看起来更直观一些。

也可以看到自己关注的博主最新更新的信息，计算一下他有几天没有更新了🤔

思路再打开一些，不一定是技术站点，其他任何自己感兴趣的网站都可以爬下来，做一些直观又好看的趋势图。

#### 名片类可视化

可以把自己的数据，和平时自己看的动漫、电影、游戏等面板结合起来。

比如我能想到的就是JOJO的面板，搜了一圈，目前还没啥可用的网站。

由于游戏已经很久没玩了，从最开始的英雄联盟、守望先锋、PUBG后来就几乎不玩了，灵感已经枯竭。这两天帕兽大火，我才开了一下机，发现steam密码早忘了，然后账号密码找回，让我贴一张支付截图，我支付宝账单都找到17年去了🥲

## 小结

![[1-img-20241119141155.png]]

认知这个框的，估计也快30了吧😏

以上就是全部内容啦，没啥新鲜东西，有时间再慢慢做吧。

最近摸鱼环境不容乐观，闲里偷忙的机会越来越少啦！！

我是枣把儿，欢迎关注我的公众号：早早集市，来找我玩耍🥳
