---
title: 使用puppeteer爬取掘金热榜
description: 使用puppeteer爬取掘金热榜
tags: ["Puppeteer", "Node"]
category: 技术
published: 2023-12-11 00:00:00
date: 2025-02-12 12:57:38
lastmod: 2025-08-15 22:58:41
showTitle: 使用puppeteer爬取掘金热榜
---
## 引言

又开新坑了。准备花点时间研究一下爬虫、自动化方向的技术，当然还是围绕node来展开。

我会把前端、Node相关体系的技术内容和实际需求融合，力求闭环，闭不了就当把全部干货整理成知识库。文章首发在公众号：早早集市，感兴趣的可以关注一下。

本篇是基于puppeteer这个库做的爬虫demo。

## 什么是Puppeteer

Puppeteer 是一个 Node 库，它提供了一个高级 API 来通过 [DevTools](https://chromedevtools.github.io/devtools-protocol/ "DevTools") 协议控制 Chromium 或 Chrome。Puppeteer 默认以 [headless](https://developers.google.com/web/updates/2017/04/headless-chrome "headless") 模式运行，但是可以通过修改配置文件运行“有头”模式。

## Puppeteer能做什么

-   生成页面 PDF。
-   抓取 SPA（单页应用）并生成预渲染内容（即“SSR”（服务器端渲染））。
-   自动提交表单，进行 UI 测试，键盘输入等。
-   创建一个时时更新的自动化测试环境。 使用最新的 JavaScript 和浏览器功能直接在最新版本的Chrome中执行测试。
-   捕获网站的 [timeline trace](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/reference "timeline trace")，用来帮助分析性能问题。
-   测试浏览器扩展。

## 环境准备

一是可以单独写一个js文件，从头开始写个demo，直接用node运行即可。

二是写在其他后端项目里。这里我选择写在我之前的nest的项目，方便后续灵感来了之后进一步整合。

**版本：**

-   node 18.18.2
-   puppeteer 21.7.0

### 安装

先装puppeteer

```typescript
pnpm i puppeteer
```

如果在公司，网络不好的话，可以换个源试试

```typescript
pnpm config set registry https://registry.npmmirror.com

```

安装完成后，我们可以写一个接口用于测试，每次请求时运行一下爬取函数。然后在service里实现爬取的逻辑。

## 开始编写

关于[example](https://pptr.dev/ "example")，官网就有，很适合快速学习一下api。我仿照这个example快速开始，只不过我这里换成了掘金，因为例子里的地址因为某些原因，不方便访问。

```typescript
const browser = await puppeteer.launch({
      headless: false,
      args: ['--start-fullscreen'],
    });
const page = await browser.newPage();
await page.goto('https://juejin.cn/hot/articles');

```

先解释一下上边几句。每个api我都附上了官方文档地址，我写代码一般就只看官方文档来写。

[launch](https://pptr.dev/api/puppeteer.puppeteernode.launch "launch")：启动一个浏览器实例，并且可以传入配置参数，如`headless`可以配置以无头(`'new'`)或有头模式（`fasle`）运行。返回值 `Promise<`[Browser](https://pptr.dev/api/puppeteer.browser "Browser")`>`

[newPage](https://pptr.dev/api/puppeteer.browser.newpage "newPage")：在 default browser context打开一个页面。返回值`Promise<`[Page](https://pptr.dev/api/puppeteer.page "Page")`>`

[goto](https://pptr.dev/api/puppeteer.page.goto "goto")：导航到一个url。返回值`Promise<`[HTTPResponse](https://pptr.dev/api/puppeteer.httpresponse "HTTPResponse")` | null>`



所以爬取数据的思路，就和自己打开浏览器进入掘金浏览一样，打开网页 ⇒ 输入地址 ⇒ 等待加载 ⇒ 加载完成 ⇒ 看到（拿到）数据 ⇒ 数据存储



因为掘金不需要登录也可以直接看到文章热榜，所以直接去找页面元素，拿到数据即可。

对于一个前端来说，去审查元素是比较简单的，如何你不是前端的话，可以用这种方式去获取元素

### 分析页面

1.  F12或者右键审查，打开控制台，选中这个工具，去点击页面上的元素

![[1-img-20241119141175.png]]

1.  在左侧点击页面上的字后，右侧控制台的元素会自动聚焦

![[2-img-20241119141155.png]]

1.  在右侧高亮的元素上右键，可以看到复制，打开后有个复制selector，选择。因为puppeteer是使用的css selector来获取元素。

![[1-img-20241119141177.png]]

### 获取数据

puppeteer提供几个api可以用来获取到元素

-   `Page.$()`  相当于 `document.querySelector`
-   `Page.$$()`  相当于 `document.querySelectorAll`

这两个api的返回值分别是`Promise<`[ElementHandle](https://pptr.dev/api/puppeteer.elementhandle "ElementHandle")`<`[NodeFor](https://pptr.dev/api/puppeteer.nodefor "NodeFor")`<Selector>> | null>` 和 `Promise<Array<`[ElementHandle](https://pptr.dev/api/puppeteer.elementhandle "ElementHandle")`<`[NodeFor](https://pptr.dev/api/puppeteer.nodefor "NodeFor")`<Selector>>>>`

而ElementHandle也有获取元素的相同api

-   `ElementHandle.$()` 相当于在获取了一个元素的基础上，再获取它的子元素
-   `ElementHandle.$$()` 同理

这两个api的返回值和Page的两个api**返回值相同**。

获取到元素后，还需要获取元素的值。一般有两种，一种是元素的内容，一种是元素的属性值

-   **Page.\$eval**('.selector', el ⇒ el.textContent)  这种方式可以直接获取到元素内容
-   **Page.\$\$eval**('.selector, (elements) => elements.map((el) => el.getAttribute('href')') 这种则是获取元素的属性，当然这个api是获取所有内容
-   ElementHandle.\$eval  同理
-   ElementHandle.\$\$eval 同理

知道了这几个api之后，爬数据基本不是问题了。

继续写一下代码，粘贴一下刚才复制的selector，看看能否取到数据。

```typescript
const number = await wrap.$eval('#juejin > div:nth-child(1) > div.view-container.hot-lists > main > div.hot-list-body > div.hot-list-wrap > div.hot-list > a:nth-child(1) > div > div.article-item-left > div.article-number.article-number-1', (e) => e.textContent)
```

可以看到复制来的selector非常长，是从页面最开始元素开始的，可以自己适当删减一下。一般只具体到它的父元素和它自己的元素就可以了。

有的时候，元素需要时间加载，比如元素基于接口渲染时，接口或者网速很慢，这个时候获取元素是获取不到的。puppeteer也有api可以等待元素加载出来

-   [Page.waitForSelector()](https://pptr.dev/api/puppeteer.page.waitforselector "Page.waitForSelector()")

比如要等待掘金热榜的文章列表被加载出来

```typescript
  await page.waitForSelector('.hot-list .article-item-wrap');

```



然后照着葫芦画瓢，再把文章标题、作者、热度等信息也获取到

```typescript
const number = await wrap.$eval(
  '.article-number',
  (el) => el.textContent,
);
const title = await wrap.$eval('.article-title', (el) => el.textContent);
const hotNumber = await wrap.$eval(
  '.article-hot .hot-number',
  (el) => el.textContent,
);
const authorName = await wrap.$eval(
  '.article-author-name-text',
  (el) => el.textContent,
);
const authorUrl = await wrap.$eval('.article-author-name', (el) =>
  el.getAttribute('href'),
);
```

可以在nest的控制台打印一下，看看输出的内容是否正确。

爬取完成后，可以关闭一下browser

```typescript
await browser.close();

```

### 数据存储

基于学习的目的，数据可以看情况存储在本地json文件，或者数据库中，或者发送给其他服务器。

注意不要滥用数据或进行其他违法行为，目的仅仅是学习node，切记切记。

这里我选择把数据`articleList`存在本地json文件中。用`JSON.stringify(articleList, null, 2)` 按缩进为2格式化一下数据。

```typescript
fs.writeFileSync(
  `./热榜-${+new Date()}.json`,
  JSON.stringify(articleList, null, 2),
);
```

### 数据处理

通过获取到的数据可以发现，很多数据没法直接存储，需要被洗一洗。比如上边文章编号，拿到数据之后有很多空格，存之前我们先处理处理。

```typescript
let reg = /(\n|\s)*/g;

for循环articleList
  article.number = article.number.replace(reg, '');
  article.hotNumber = article.hotNumber.replace(reg, '');
```

把多余的`空格`和`\n`去掉。

然后当前爬取的是哪个榜单，存的时候我也想记录一下，再去页面上找文章列表上方的榜单名称。

```typescript
let navName = await page.$eval(
  'div.hot-list-header > div > span.hot-title > span',
  (el) => el.textContent,
);
```

榜单名称拿到后，也需要处理一下空格，不再赘述。

这个榜单名称是通过接口获取到然后渲染的，在点击左侧导航栏的时候就可以发现，所以要确保右侧内容被渲染完，我们再去开始爬取行为，所以可以在开头加上这两句。确保页面加载出来的时候，这两块已经被渲染完毕。

```typescript
await page.waitForSelector('.hot-list .article-item-wrap');
await page.waitForSelector(
  'div.hot-list-header > div > span.hot-title > span',
);
```

这样就完成了对热榜-综合榜的爬取。然后再去爬其他榜单。

### 多页爬取

通过分析左侧的导航栏，可以在元素a标签上发现一个href，点击后，页面就会切换到对应的地址。所以我的思路是先采集全部的地址。

```typescript
const navUrls = await page.$$eval(
  '.sub-nav-item-wrap .nav-item-content a',
  (elements) => elements.map((el) => el.getAttribute('href')),
);
```

然后把刚才写的爬取综合榜的过程，封装到一个函数里，作为爬取单页的方法。因为每个榜单的样式都是一样的。

```typescript
// 伪代码
 function getPageData() {
   await 元素加载
   await 获取元素
   await 获取内容
   await 组装数据
   await 数据处理
   await 写入文件
 }
```

然后用一个for of 循环进行多页的爬取，注意不要用forEach，因为要保证能await

```typescript
for (const url of navUrls) {
  const pageUrl = 'https://juejin.cn' + url;
  await page.goto(pageUrl);
  await this.getPageData(page);
}
```

然后就在项目的根目录，产生了9个json文件了，可以看一下数据爬取的有没有问题。处理过程中，主要问题是要等待页面元素加载完再拿，符合一个正常人去看网页的逻辑。

Puppeteer也提供了其他等待的方法，如：

-   waitForTimeout
-   waitForFunction
-   waitForRequest
-   waitForResponse
-   等等

后续我再做登录、验证码等自动化操作时再详细总结一下。

以上就是全部内容了👏

## 小结

这篇文章作为一个简单的小demo，记录一下研究puppeteer的开始，感觉可玩性很强。

可以用来在不适合摸鱼的办公环境，爬一下热榜然后通过webhook发到钉钉去看。或者用于签到、领这领那等重复工作。

等我发现了好玩的玩法，再写出来和大家分享 。

另外最近十来天一直在梳理自己的知识库，思考自己的定位问题，对未来的做一下规划，最好和最坏的情况考虑，也在学习如何运营。可以说收获满满，能无限进步的感觉很棒。

虽然也会偶尔动摇，但总体还算坚定，后续也会稳定的输出文章！！！

我是枣把儿，欢迎关注我的公众号：早早集市，来找我玩耍🥳





