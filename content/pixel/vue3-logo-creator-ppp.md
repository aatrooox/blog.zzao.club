---
published: 2023-12-11 00:00:00
author: 枣把儿
title: Vue3项目实战：像素风LOGO编辑器 Pixeled Pic Pro
description: 一个基于 LeaferUI 的像素风编辑器
category: 早早集市
tags: ["产品", "早早集市", "Vue3"]
date: 2023-12-11
lastmod: 2025-08-19
showTitle: Vue3项目实战：像素风LOGO编辑器 Pixeled Pic Pro
---
## 引言

上篇文章《[当一个程序员突然想做一款产品](https://juejin.cn/post/7310786618391167013)》说到，我在做自己的产品的过程中，萌生了自己做一个像素风LOGO编辑器的想法，并设计了产品的整体功能、技术栈选择、服务器部署全部流程。

出于一个开发人员本能的对产品排期的排斥，我非常想向身为产品的自己提出一点时间上的吐槽。

但是我很快就忍住了，因为我想到xw了更好的处理办法。

## 版本划分

产品的核心功能是：生成任意行和列的方格子，按自己的喜好进行涂抹上色，创作完自己想要的图片后，导出图片即可。

所以我把核心功能定为V1版本：

1.  一个可拖动的画布，一个可绘制的区域，区域内由带或不带黑色边框的单元格组成，并且可缩放可拖动。
2.  单元格的形态为正方形格子。可以设置数量，如：100x100，单个方格可以设置大小，如格尺寸为：5x5
3.  操作模式分为两种： 1. 鼠标模式 2. 绘图模式
4.  鼠标模式下，可以自由拖拽
5.  绘图模式下，鼠标可在绘图区域的小方格上点击并滑动，小方格会被设置对应的颜色
    1.  颜色可配置，并且方便切换：比如tab键自动轮换预制的几种颜色
6.  绘制后，图片可导出

我打算这样制定版本号规则：x.y.z

*   z：通常在未上线阶段或上线后小范围迭代使用，如样式修改、代码优化等不涉及功能的改动后，此版本号加1。
*   y：通常为新增功能，bug修复等功能的迭代版本，如我这次开发的产品，我打算以v0.1.0开始，在每完成一个上述的独立功能123456后，此版本号加1，直到产品闭环。
*   x：通常为一个产品的稳定版本，此时产品的功能已经完成闭环，与上一个版本比，在功能、操作、逻辑上有重大更新或修复致命bug时，此版本号加1

这样，我就可以在有限的时间内推进项目的正常开发工作，让大家看到我这段时间的成果，后续还可以掏出时间来持续的迭代产品。显得有条不紊，尽显老鸟风范，皆大欢喜。

## 项目搭建

首先安装[degit](https://github.com/Rich-Harris/degit)这个工具，它可以用来安装[社区模版](https://github.com/vitejs/awesome-vite#templates)里的优秀模版，以此快速启动我们的项目

```shell
npm install -g degit
```

在社区模版里挑选过后，我选择了[boot-vue](https://github.com/kirklin/boot-vue/blob/master/README.zh-CN.md)。作者这样说：

*   ⚡ [闪电般的速度](https://github.com/kirklin/boot-vue#readme)：使用 Vue 3、Vite 和 pnpm 构建，速度飞快 🔥
*   💪 [强类型](https://www.typescriptlang.org/)：使用 TypeScript 💻
*   🔥 [最新语法](https://github.com/vuejs/rfcs/pull/227)：使用新的 script setup 语法 🆕
*   📦 [自动导入组件](https://chat.openai.com/chat/src/components)：自动导入组件 🚚
*   📥 [自动导入 API](https://github.com/antfu/unplugin-auto-import)：使用 unplugin-auto-import 直接导入 Composition API 和其他 API 📨
*   🎨 [UnoCSS](https://unocss.dev/) - 瞬间响应式 CSS 引擎，提供轻量级和快速的样式应用方式。
*   🌼 [Daisy](https://daisyui.com/) - 免费开源的 Tailwind CSS 组件库
*   💡 [官方路由器](https://router.vuejs.org/)：使用 Vue Router v4 🛣️
*   🎉 [加载反馈](https://github.com/rstacruz/nprogress)：使用 NProgress 提供页面加载进度反馈 🔄
*   🍍 [状态管理](https://pinia.esm.dev/)：使用 Pinia 进行状态管理 🗃️
*   📜 [中文字体预设](https://github.com/kirklin/unocss-preset-chinese)：包含中文字体预设 🇨🇳
*   🌍 [国际化就绪](https://chat.openai.com/chat/src/locales)：使用本地化准备好国际化 🌎
*   ☁️ [Netlify 就绪](https://www.netlify.com/)：可在 Netlify 上零配置部署 ☁️

可以看到，它的功能已经非常齐全，并且没有太多多余的业务类代码，拿来作为项目的启动模版是非常香的。

```shell
npx degit kirklin/boot-vue pixeled-pic-pro
```

可以看到一个叫**pixeled-pic-pro**的项目已经被创建，进入项目目录，开始安装依赖

```shell
# 没有安装pnpm的话，先自行安装一下
pnpm i
```

安装完成后，运行一下

```shell
pnpm dev
```

可以看到页面已经运行在了8888端口下，并且自动开启了一个\_\_inspect的页面

打开浏览器，发现还有一个切换主题皮肤的功能（[Daisy](https://daisyui.com/)），可以尝试后选择一个比较严肃和正经的皮肤

![](https://img.zzao.club/article/202411191440537.png)

为了以防开发完了才发现别人的库有打包的问题，我们可以先运行一下打包命令，看看是否正常

    pnpm build

good，没有问题。

## 梳理项目结构

看看这个项目里的东西有没有需要删除或修改的地方

**router**

**路由钩子**里已经结合[NProgress](https://ricostacruz.com/nprogress/)，做了加载的进度反馈，后续如果有其他需要结合路由来判断的状态，也会继续添加在这里。

模式是 Hash模式，是用createWebHashHistory()创建的，可以看到url上会有一个#标志。

如果使用createWebHistory()，则创建的是Html5模式，这种模式的url看起来会比较“正常”，但需要服务器做一些配置工作。

```nginx
#nginx部分配置
location / {
  try_files $uri $uri/ /index.html;
}
```

**store**

通过pinia进行状态管理，已经有了一个小例子，后续使用的话可以仿照着改造一下。

**pages**

页面部分。 它有两个页面。为了保持简单，我就只用这两个页面，一个写欢迎页，一个写功能页。 标题栏也直接拿来用，不要浪费。

欢迎页比较简单，我准备放一个功能演示的GIF，配一个大大的按钮【开始创作】

把首页里左上角名称改成**Pixeled Pic Pro**和作者相关的Footer注释掉，github地址换成自己的。这部分内容在**layouts**里。

注意：此项目使用的是基于[Tailwind CSS](https://www.tailwindcss.cn/docs/installation) 的UI组件库 [daisyUI](https://daisyui.com/docs/themes/)，而Tailwind CSS是通过[UnoCSS](https://unocss.dev/)来控制引入的，所以开发时需要打开它们的文档，方便查阅。

此时页面长这个样子

![](https://img.zzao.club/article/202411191440539.png)

再稍微调整一下样式，我先设置了一个flex布局，画布页面直接flex-1占满

layouts/index.vue

```html
<template>
<div class="font-chinese antialiased">
	<div class="min-h-screen flex flex-col">
		<Navbar />
		<RouterView />
	</div>
	<!-- <Footer /> -->
</div>
</template>
```

画布页面StoreTest.vue初始状态如下，文件名字可以改一改，但是我不改
![](https://img.zzao.club/article/202411191440540.png)

还需要一个操作栏，放置一些常用配置和功能

我选择把操作栏放在左侧，并且加入几个功能按钮：生成、导出、颜色配置等，按钮可以边写边加，先按主要功能一步一步的来实现。

设置到了这里，我发现了一个小问题，作者似乎对html使用了scrollbar-gutter：stable这个属性，导致我页面没有滚动条的情况下，在右侧也出现了gutter

![](https://img.zzao.club/article/202411191440541.png)

于是乎我把这个属性覆盖了一下，一切就正常了起来\~

src/styles/main.css
```css
 html {
    	scrollbar-gutter: auto
    }
```

有内味儿了吧？接下来开始实现主体功能

## 画布相关功能

安装konva、axios(备用)依赖

```shell
pnpm i konva axios
```

结合之前多次头脑风暴的经验，canvas的可玩性是非常高的，可以实现**很多**有趣但可能没用的小工具，但这里重点是很多。

很多意味着重复，写代码最忌的就是无脑复制粘贴。

哪怕写代码时的思考逻辑不是最优的，写出来的代码也不是最“优雅”的，还是要保持基本的封装的潜意识。带着一种“如果别人使用我的组件、插件的时候，他们会不会觉得不方便”的想法去思考如何封装更合理。小到一个方法，大到一个组件，都是一样的道理。

但也没必要因为追求“最合理”，陷入到一种情绪负担上，你的大脑开始焦虑的时候，你可以提醒自己，做不好是正常的，所有人都会出现这样的问题，做错的过程也同样有用。就如同我现在这个产品一样，分版本迭代，逐步解决问题。

这里为了在避免后续迭代中产生其他页面，也用到画布的相关操作，我们把整个画布封装成一个类。

如果另一个新的产品也和画布有关，那我们可以进一步把他抽离，发布到npmjs上。就如同这个boot-vue的作者自己内置的@kirklin/logger、@kirklin/reset-css一样。

回到正题。

把这个类随便取一个名字：AppStage，Konva里已经有个Stage的概念了，所以我这里稍微改改。
回顾一下需要实现的功能，按照思路，罗列出AppStage要实现哪些方法：

* 初始化画布 initStage

```typescript
export class AppStage {
	constructor(
		ref: Ref,
		options: AppStageConfig = {
			isAllowMouseSelectShapes: true,
			isInitKeyboardEvents: true,
			mouseMode: "basic",
			scale: false,
			scaleMember: null,
		}
	)
	...
	
	init(options: AppStageConfig) {
		console.log(`初始化容器为: ${this.canvasWindow.width} x ${this.canvasWindow.height}`
		);
		this.stage = new Konva.Stage({
			container: this.containerRef,
			width: this.canvasWindow.width,
			height: this.canvasWindow.height,
			id: "baseStage",
			draggable: options.scale
		});
	}
	...
}
```

*   设置是否可缩放 set
*   设置可缩放的对象 (macos上触摸板两指上下滑动等同于鼠标放大缩小)

```typescript
// Konva的stage可以监听鼠标滚轮事件
this.stage.on("wheel", (e) => {
	// 通过wheelDelta判断，是在放大还是缩小
	if (evt.wheelDelta > 0) {
          // 放大
          if (this.scaleMember.scaleX() < max) {
            this.scaleMember.scaleX(this.scaleMember.scaleX() + step);
            this.scaleMember.scaleY(this.scaleMember.scaleY() + step);
            // this.scaleMember.move({ x: -offsetX, y: -offsetY }) // 跟随鼠标偏移位置
          }
        } else {
          // 缩小
          ...
})
```

*   绑定鼠标事件（落下、移动、抬起）（移动过程中，划过的元素进行填充颜色）

```typescript
type MouseMode = "basic" | "draw" | "clip" | "fill";
```

*   解绑鼠标事件（有绑定就有解绑）
*   添加图形
*   批量添加图形（因为方格要被统一的缩放，并且只有方格可以交互，所以批量添加时需要加入到一个[Group](http://192.241.202.210/docs/groups_and_layers/Groups.html)中, 方便管理）
*   设置鼠标模式（切换绘图、拖拽模式，类似ps、ai里的操作）

```typescript
switchMouseMode(mouseMode: MouseMode) {
	this.mouseMode = mouseMode;
}
```

*   查找图形（比如查找没有上色的图形等功能可以用到）
*   导出图片 （回到缩放前的状态，然后导出）

由于具体的业务代码对大家可能并无卵用，细节代码就不展开了，代码链接放在文末的小结中。

## 生成格子

由于生成12x12这个格子属于这个产品的业务功能，我这里没有选择把他放进类的方法里，选择在自己的组件里实现

单元格配置先给几个默认的预设，方便在不配置的情况下也能正常使用，视频里用Adobe AI来实现的时候使用了十二根线交错，所以我这里先默认给个12x12的方格布局。并且生成的单元格，默认是正方形，不排除后续加入三角形、圆形。所以我先留个口子。

```typescript
const basicCellConfig = reactive({
	size: 5, // 单个格子宽高
	border: 1, // 边框宽度
	xCount: 12, // 横向有几个
	yCount: 12, // 纵向有几个
})
```

生成12x12单元格方法，这里我们先把所有rect生成好，然后传给AppStage类里按Group生成图形

```typescript
const genPixelBoxCells = () => {
  let { x, y, strokeWidth: border } = PixelRect.value?.getAttrs()
  let cells = []
  for (let xIndex = 0; xIndex < basicCellConfig.xCount; xIndex++) {
    for (let yIndex = 0; yIndex < basicCellConfig.yCount; yIndex++) {
      let attrs = {
        x: x + border + basicCellConfig.size * xIndex,
        y: y + border + basicCellConfig.size * yIndex,
        width: basicCellConfig.size,
        height: basicCellConfig.size,
        strokeWidth: basicCellConfig.border,
        stroke: 'black',
        fill: 'white',
        name: `fillnode-${xIndex}-${yIndex}`,
        draggable: false,
      }
      let rect = new Konva.Rect(attrs)
      cells.push(rect)
    }
  }
  // 把所有格子放进一个组里，方便同时管理
  Stage.value.createShapesByGroup(PixelRectGroup.value, cells)
}
```

此时，页面如下：
![](https://img.zzao.club/article/202411191440542.png)

## 鼠标模式、鼠标事件、键盘事件

监听鼠标事件，然后实现涂色功能，先默认一个颜色，把功能做出来，然后再实现切换颜色的功能

在AppStage.ts里实现监听和上色功能

```typescript
listenAndFillRect() {
	// 监听前，需要设置一个绘图对象，涂色时只对这个对象有效
    if (!this.drawTaget) {
      console.error(`未设置绘图对象 drawTarget : this.drawTarget(target:any)`);
      return;
    }

    this.drawTaget.on("mousedown", (e: any) => {
    // 如果不是自己的模式，就不执行
	  if (this.mouseMode !== "fill") {
        this.drawTaget.off('mousedown')
        return;
      };
      // 绘图时禁止冒泡, 防止拖拽
      e.cancelBubble = true;
      this.fillStatus = "filling";
      e.target.fill(this.fillConfig?.color);

      this.drawTaget.on("mousemove", (e: any) => {
        if (this.fillStatus === "filling") {
          e.target.fill(this.fillConfig?.color);
        }
      });

      this.drawTaget.on("mouseup", () => {
        this.drawTaget.off("mousemove");
        this.drawTaget.off("mouseup");
        this.fillStatus = "done";
      });
    });
  }
```

在组件内实现切换模式功能，这个功能同样封装在AppStage里，两种模式切换的时候对应两套鼠标动作，所以还需要一个listenAndAssignTask功能，来switch case一下模式，对应不同的操作逻辑

```typescript
const changeMode = () => {
  Stage.value.switchMouseMode(mode.value)
  Stage.value.listenAndAssignTask()
}
```

再加一个切换颜色的功能，写几个div，背景色就是配置的颜色，横向排列，因为我们这里是方格，所以展示颜色的div也显示成方格，如下图
![](https://img.zzao.club/article/202411191440543.png)

这个切换颜色的小组件，还可以继续优化一下，做一个动画，点击了谁就跳到第一个位置上。这里**先记下，后续再做**，继续推进功能，避免中途加太多东西，导致延期。

鼠标一个一个的点，明显不方便，我再加一个**tab键切换颜色**的功能

StoreTest.vue

```typescript
const bindKeyboardEvent = () => {
    window.addEventListener("keydown", (e) => {
      if (e.code === "Tab") {
        let index = colorConfig.value.findIndex(color => color === selectColor.value)
        index = index >= colorConfig.value.length - 1 ? 0 : index+1
        changeColor(colorConfig.value[index])
      }
      e.preventDefault();
    });
}
```

目前，页面已经实现了以下效果

![](https://img.zzao.club/article/202411191440544.png)

最后一步，实现导出图片功能

## 导出功能

Konva内置了toDataURL功能，可以自定义导出的区域

```typescript
 // 转dataURL 用于导出
  toDataURL(options = {}) {
    return this.stage.toDataURL(options);
  }
```

再封装一个用a标签下载图片的功能

```typescript
export function downloadPNGForCanvas(
  dataURL: string,
  filename: string = (+new Date()).toString(),
) {
  const a = document.createElement('a')
  a.download = filename
  a.href = dataURL
  document.body.appendChild(a)
  a.click()
  a.remove()
}
```

ok, 可以实现导出功能了。
创建方格时，我给他们套了一个Rect，方便获取导出时width、height，xy坐标是Group的坐标。

```typescript
const exportImage = () => {
  // 缩放回原始大小
  PixelRectGroup.value.scaleX(1)
  PixelRectGroup.value.scaleY(1)
  Stage.value.batchDraw()
  nextTick(() => {
    // 获取位置
    let { x, y } = PixelRectGroup.value.absolutePosition()
    let { width, height } = PixelRect.value.getAttrs()
    let dataURL = Stage.value.toDataURL({
      x,
      y,
      width,
      height,
      pixelRatio: window.devicePixelRatio, 
    })
    downloadPNGForCanvas(dataURL, '测试')
  })
}
```

最后用完成的功能画一个图试试看。
很明显啊，这是个**掘金**的标志，但是略微有些抽象，如果格子多一些后会好很多。
不过用手画还是略微有点慢呀，看来V2版本的**导入图片自动绘制像素风**要提上日程啦。

![](https://img.zzao.club/article/202411191440545.png)

## 版本迭代

Pixeled Pic Pro的**V1版本**已经按照自己规划的内容完成了。本篇的代码，我会尽快更新到[Github](https://github.com/zzdaddy/PixeledPicPro)中。这次的版本定为v0.6.0，我会打一个tag标记。

后续有优化、功能迭代的话我都会按照文章所述的版本命名方式继续在[Github](https://github.com/zzdaddy/PixeledPicPro)中更新，感兴趣的朋友可以去[Github](https://github.com/zzdaddy/PixeledPicPro) 拉代码玩一玩，考虑到这个产品本体功能可能对大部分同学都不适用，所以大家仅参考我的开发过程和思考方式即可，前端或后端的**V2版本**，我会在整个产品的V1版本闭环后再**酌情更新**。

后续文章为： Nest实战篇、前端+后端部署篇、总结篇。 总计五篇文章。我会收录在我的专栏/分类里方便大家查阅。

## 小结

下面是本次项目的总结：

*   合理的拆分需求，分阶段完成自己的目标
*   用一个现成的模版，快速启动前端项目，只要看到了成果，就对自己有正反馈。
*   文档没必要吃透，边做边查也很快，取自己所需即可
*   按拆分后列好的功能去逐步去实现，按自己的习惯、喜好去划分版本
*   碰到可复用的代码，先拆出来
*   收尾后及时总结归纳，加深印象

以上就是本篇全部的内容，文中有**不正确、不清晰**的地方，欢迎在评论区指出，我会尽快更正（不优雅不算）。

如果对大家能有一点点帮助，这将是我继续写下去的最大动力。

喜欢的朋友可以点个关注，继续追更后续的更多内容。有任何前端问题想要咨询的同学，也欢迎加VX：zzdaddy7，我会尽力为你解答。

感谢你的阅读，我是枣把儿\~

（丑陋的彩蛋...）

![](https://img.zzao.club/article/202411191440546.png)


