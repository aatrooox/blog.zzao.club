---
title: 基于Hono和Satori的后端生成SVG图片简易方案
date: 2024-11-07
lastmod: 2025-08-19
versions:
  - hono@4.5.11
  - satori@0.11.2
tags:
  - Hono
  - IMGX
showTitle: 基于Hono和Satori的后端生成SVG图片简易方案
---
`Satori` （Vercel的）是一个可以把`HTML+CSS`生成`SVG`的一个库。

通常提到把HTML转为图片，都会想到 `html2canvas` 、`html-to-image`这类的库，但这类库需要借助浏览器环境，比如各种卡片类网站的导出功能（css特性支持有限）。但如果是多端都有生成需求，或者要实现更便捷的获取方式，就得考虑放在后端去实现。

而Satori只需要接收**JSX元素**就可以计算得出`SVG`内容，不需要在前端就可以实现。重要的是，文字的字体也会保留，文字直接被解析成了`path`！

虽然`Satori`不保证`SVG`和浏览器呈现的 `HTML` 100%匹配，但我觉得仅是脱离浏览器和保留了相当一部分`css`属性的支持，就足够产生无限的想象。

 ![](https://imgx.zzao.club/api/img/001/%E6%88%91%E4%B8%8D%E5%BE%97%E4%B8%8D%E5%91%8A%E8%AF%89%E4%BD%A0%E7%9A%84+deepseek-r1%E7%9A%84%E4%BD%BF%E7%94%A8%E6%8A%80%E5%B7%A7)

## 功能构思

要实现的功能很简单，前端网站上有个文字转卡片的界面，支持保存主题和样式的预设到后端，然后用户在其他地方调接口就能到图片。

<br />

* 前端页面上可以自定义一套样式，包括背景，渐变，flex布局，阴影等等一切 `Satori` 支持的`css` 。

* **前端的html框架和后端jsx的框架保持一致**。比如一张卡片就是套三个div，最外层负责渐变色，中间层负责半透明+磨砂效果，最内层div负责展示文字。那hono中也用jsx定义好一样的结构，并在前端维护好三个`style对象`，调用接口把样式存起来，比如和用户id挂钩。或者把页面结构也存起来。

* 用户传文本过来，拿到对应的结构和样式，把文本塞进去，用`Satori`生成`SVG`，返回给用户

* 为了防止消耗大量资源，限流一下，比如每分钟xx次

## Hono中直接使用TSX

关于`Hono`项目的搭建、部署，我已经写过一个简易的流程了，可以自行翻阅，这部分就跳过了。

直接在项目内新建一个目录 `src/imgx`

初始化该子模块下的路由 `src/imgx/index.tsx`并在根路由下挂载

```typescript
const imgx = new Hono<{ Variables: Variables }>();

imgx.post("/gen", zvalidator('json', textGenSchema), async (c) => {
  const { text } = c.req.valid('json')

  const svg = await renderSVG(c, <><div>{text}</div></>)
  c.header('Content-Type', 'image/svg+xml');
  c.header('Content-Disposition', 'attachment; filename="imgx.svg"');
  return c.body(svg)
})
```

因为要直接写`JSX`，所以直接把文件名后缀改为.`tsx`即可。`tsx` 的内容还是按正常的写法，只不过它支持`JSX`了，如果用到类型的话，可以在 `hono/jsx` 中导出 `{ FC, JSX }`。

结构参数用 `zvalidator` 校验一下，或者把此接口白名单去掉，需要登录后才能使用。

关于怎么存样式和HTML框架就不写了，随意怎么存都行，我这里直接存个json文件做演示。

当收到请求时并通过校验后，先去读取对应的样式，当然也有可能读不到

```typescript
try {
    style = fs.readFileSync(path.resolve(process.cwd(), "style.json"));
  } catch(err) {
    c.set('errMsg', '不存在预设的样式文件, 请联系管理员处理')
    throw new HTTPException(400)
  }
```

然后把样式里的各种信息解析出来

```typescript
  const { bgStyle, innerStyle, textStyle, imgSize } = JSON.parse(style)
```

再传给 Satori 处理就可以了

```typescript
import { fonts } from '../common/fonts'

const svg = await satori(
    <div
    style={{ 
      ...bgStyle,
      ...textStyle
    }}
>   
<div style={{ ...innerStyle }}>
{ element }
</div>
    
</div> ,
    {
      width: imgSize.width,
      height: imgSize.height,
      fonts: fonts
    }

  )
```

因为我这个是文字生成图片，只要存在文字，`Satori` 就一定要显式的传入字体，也就是上边的`fonts`

而字体库，可以自己维护在服务器上，应该用到的也不是很多，`Satori` 支持 `ttf` 、`oft` 、 `woff` 这三种格式的字体。要把字体数据作为 ArrayBuffer 或 Buffer 传递。

我用的Bun运行Hono项目，所以可以这样处理：

```typescript
import type { FontStyle, FontWeight } from "satori";
import path from 'path'
const YouSheBiaoTiHei = Bun.file(path.resolve(process.cwd(), "fonts", "YouSheBiaoTiHei-2.ttf"));
export const fonts: Array<{
  name: string;
  data: ArrayBuffer;
  weight: FontWeight;
  style: FontStyle;
}> = [
    {
      name: "YouSheBiaoTiHei",
      data: await YouSheBiaoTiHei.arrayBuffer(),
      weight: 500,
      style: 'normal'
    }
  ]
```

最后不要忘了处理`header`

```typescript
c.header('Content-Type', 'image/svg+xml');
c.header('Content-Disposition', 'attachment; filename="imgx.zzao.club.svg"');
```

用 `res.body` 返回就可以了

然后可以用 `hono-rate-limiter` 做一下限流

```typescript
import { rateLimiter } from "hono-rate-limiter";

const limiter = rateLimiter({
  windowMs: 1 * 60 * 1000, // 1分钟
  limit: 50, // Limit each IP to 50 requests per `window` (here, per 1 minutes).
  standardHeaders: "draft-6", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  keyGenerator: (c) => c.req.url, // Method to generate custom identifiers for clients.
  // store: ... , // Redis, MemoryStore, etc. See below.
});

```

`limiter` 是一个中间价，可以直接在全局启用，也可以单独在某一个路由上使用

```typescript
imgx.post("/gen", limiter, zvalidator('json', textGenSchema), async (c) => {
	...
})
```

当来自某个ip的请求，在1分钟内超过了50次，就会直接返回HTTP错误，提示请求了太多次（too many request ... ）

## 进一步处理

生成了SVG， 可以用前端通过 `post` 请求，并设置 `responseType: 'blob'` ，拿到数据，然后配合a标签直接进行下载。

```typescript
const a = document.createElement('a')
const dataUrl = URL.createObjectURL(response.data)
a.href = dataUrl
a.download = 'image.svg'
a.click()
```

但这样就和直接在前端生成图片比，看起来没有优势了。当然也可以拿到svg再用其他canvas插件处理一下，二次编辑一下。

或者直接在后端使用 `Resvg` 来生成`PNG`，`Resvg`是`rust`写的，所以速度比较快，内存占用比较小。

**但最重要的是这是一个独立的接口，也就意味着我无需再打开某个卡片网站，再复制进文字，再点击下载。**

我可以直接在自己的笔记软件里、在博客上、浏览器插件里接入接口，做到看到什么就分享什么，写出什么就分享什么的效果。

毕竟一个卡片网站有再多的主题，自己常用的其实就1-2个，而每次文字要分享的文字是不一样。

所以我觉得在变化的地方起手是比较舒适的操作。

不知道你意下如何？
