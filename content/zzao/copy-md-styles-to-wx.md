---
title: 基于原生 DOM 实现Markdown复制样式到公众号
date: 2024-11-03
lastmod: 2025-02-12
tags: ["博客", "Markdown"]
showTitle: 告别在线Markdown格式转换！基于原生 DOM 实现Markdown复制样式到公众号
---
很多人选择了`markdown`语法来写文章，因为它可以在纯文字的基础上添加少量的语法，就能渲染出更美观的样式，并且可以自己扩展样式。

更重要的是它的生态十分丰富，基本上所有平台、框架都支持markdown语法，再加上开源插件的协助，可以满足绝大部分展示需求。

以前我写文章的流程是这样的：先在本地的**某个写作App**上把文章写完，确认没问题后，再打开**某个自己还算信赖的markdown转换网站/App**，一键复制内容，然后打开目标平台编辑器，粘贴进去，看看样式有没有问题，然后点击预览、发布。

直接有几次半夜写完了文章想发布的时候，**markdown转换失败了**，要么是代码丢了高亮，要么是有些样式错乱了。而我别无他法，只能再找另一个网站去转换，但是经常写文章的话，某些样式可能是自己自定义的，某些主题别的网站可能还没集成，非常无奈。

我一直觉得这是个问题，但碍于我也没解决，讲出来顶多是大家一起吐槽一下，所以就不了了之。

直到前一阵，我又又又开始自建博客站，这次没有找现成的模板，因为我想**基于本地文件直接生成博客文章**，之前搬家搬的真的累，这次要一举让我写文章这个工作流达到完美。

基于本地文件生成文章，我用`nuxt/content`实现了，于是问题来到「如何一键复制到公众号」上。

要实现这个功能，有几点需要明确，思路才能理顺。

## 复制的内容是什么

我要想保持各平台样式一致，肯定是从自己博客上复制内容+样式，然后到其他平台上。

所以，那些markdown转换的网站，他们复制的是什么内容？为什么可以带有样式？

打开以前用过的网站，写一段markdown，然后点复制。粘贴进`VSCODE`看看到底是啥。

如果能正常粘贴出来的话，你可能会看到如下内容（以下是我在一个mdx编辑器内粘贴出来的内容）：

![](https://img.zzstudio.cn/1-img-20241104141167.png)

而这是它的渲染结果是这样：

![](https://img.zzstudio.cn/1-img-20241103171168.png)

所以粘贴进其他编辑器的内容是什么？ **html**！

更准确的说是**具有内联样式的html**！

那为什么可能你复制完再去粘贴，可能看不到这个**html内容**？

这是因为`navigator.clipboard` 同时设置了两种类型的文本，你在支持富文本的编辑器内粘贴，就会使用html内容，你在不支持富文本的文件内粘贴，就会只保留文本。

```typescript
const htmlData = new Blob([yourHTML], { type: 'text/html' })
const textData = new Blob([yourText], { type: 'text/plain' })
const clipboardItem = new ClipboardItem({ 'text/html': htmlData, 'text/plain': textData})
```

以上都是**浏览器原生对象**

然后使用`navigator.clipboard`写入到粘贴板：

```typescript
await navigator.clipboard.write([clipboardItem])
```

从使用技术手段实现的角度：`navigator.clipboard.write`可以把带有内联样式的html代码写入到粘贴板，目标编辑器就可以粘贴出带有样式的内容。

所以问题变成了：**怎么把自己的博客里的文章转换为带有内联样式的html代码**

## 如何获取到文章的样式

获取文章样式这个操作，让任何一个前端都能写出来，但这里明显不能用简单的`style属性`。

因为影响样式的css，可能是内联样式，也可能是通过外部引入的css。

所以这里我用了 `getComputedStyle` 这个方法，传入`DOM`，它可以获取到**DOM元素最终的样式**。

什么意思？ 意思就是仅靠这一个方法就可能实现这个功能！

所以方案就很明确了：用`getComputedStyle`获取到样式，转换为`style="xxx"` 这样的内联样式，插入到原有的`html`中。

这一步转换有没有插件？有，我搜罗了几个开源项目，基本都是使用了 `juice` 这个插件。

它可以让你传入`html`，在传入`css`，然后帮你拼接成`具有内联样式的html`。所以它适合在你知道了自己的css在哪里的场景，也就是一个在线的markdown编辑器里。

我要是解决的就是脱离在线编辑器，所以肯定是不能走这个路子。

虽然`getComputedStyle`获取到样式有几百个至多，而又有那么多的元素，直接原封不动的拼接，内容肯定是太多太大了。

但好在用markdown写文章的人，一般追求的都是**简洁**、**大气**、**低调**、**极客**，对吧？彦祖。

所以平时用到的markdow语法，其实也是有限的几种。

而渲染后的文章，通常也只有这几个元素：`p`、`a`、`span`、`blockquote`、`strong`、`code`等。

它们分别对应了：段落、超链接、代码块、标注、加粗等。

所以只需要把影响样式的样式属性限制一下，从`getComputedStyle`里只取这几个！

## 通过调试得到样式的全部覆盖

先思考一下那些样式影响了文章的样式，列出来：

```typescript
// 对元素有影响的属性
export const EffectCssAttrs = [
  // 'fontFamily',
  'fontSize',
  'fontWeight',
  'color',
  'textAlign',
  'lineHeight',
  'whiteSpace',
  'textSizeAdjust',
  'overflowX',
  'padding',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  ...
]
```

然后在通过 `getComputedStyle` 获取到dom的全部样式时，使用此列表过滤：

```typescript
	const computedCssStyles = getComputedStyle(childDom, null)
    // console.log(`computedCssStyles`, computedCssStyles)
    const _effectCssAttrs = pointCssAttrs.length > 0 ? pointCssAttrs : EffectCssAttrs
    _effectCssAttrs.forEach( cssAttr => {
          const value = computedCssStyles[cssAttr]
          if (value) {
            curCssStyles[cssAttr] = value
          }
        })
```

这样，我们只需要拿到文章最外层的`Dom`，循环所有子元素，获取到其有效样式，组合成内联样式

然后再把全部`Dom`整合起来，就得到了一个**带有样式的html字符串**。

然后再衔接上一小节的`navigator.clipboard` Api，就已经实现了功能。

但是测试下来，还是有很多需要填补和优化的地方。

比如影响样式的属性列举的不太全，导致有些渲染的不对劲；

比如`fontFamily`这个明显不需要每个元素都获取一遍的样式需要单独处理；

比如文章太长时，元素太多，复制出来的内容太大，也许精简一下也能得到相同的效果；

比如代码块 `pre` 元素内，每个`span`其实只需要`color`；

比如博客自定义了图片组件用于放大查看，其他展示平台只需要`img`单个标签等等类似的问题。

比如在A平台有效，在B平台有些样式不支持，需要单独处理。

这些问题列出来看着有点多，但基本都是先把主要功能打通后，逐个解决的，问题不大。

最后再来理一遍思路：

- 拿到文章最外层的元素，循环处理
- 封装一个整合单个元素的`递归函数（getDomCssStyle)`，放在循环内，获取到处理后的带有内联样式的html字符串
	- 处理各种特殊情况：无dom、忽略某些nodeType、忽略某些无用的标签（tagName）、忽略某些无用的class（classList）
	- 特殊处理某些组件，如图片 `img`
	- 设置缓存，优化代码。（针对文章又长又复杂时）
	- 深度优先，有子元素时，先去递归组装好全部子元素
	- 组装最终的dom字符串，return
	- 优化：抽离函数、常量等
- 使用 `ClipboardItem` （两种类型 `text/plain` 、`text/html` ）创建实例
- 使用 `navigator.clipboard.write` 实例
- 粘贴进其他编辑器

以上全部语法均基于**原生DOM**、**浏览器原生对象**。

## 结语

以上就是我为了脱离第三方markdown编辑网站而做出的一个小小功能，没有依赖任何第三方插件，目前已经应用在了我的博客站上，用来往公众号同步。但我的博客站还没搞完，所以先不贴出来了。

功能比较简单，相信大部分人都能实现，但我就是没搜到有类似的插件。大家都是画地为牢，做了一个个功能完全一样的markdown编辑网站...

幸好我解决了这个问题，再也不用发愁啦！

对自建博客或是此插件感兴趣，欢迎关注～