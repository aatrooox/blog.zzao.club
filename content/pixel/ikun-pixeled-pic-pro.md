---
title: iKun集合！Pixeled Pic Pro 前端迭代篇（一）
published: 2023-12-14
author: 枣把儿
description: 像素厂 Pixed Pic Pro 迭代记录
category: 早早集市
tags:
  - 早早集市
  - Vue3
lastmod: 2025-08-19
date: 2023-12-14
showTitle: iKun集合！Pixeled Pic Pro 前端迭代篇（一）
---
## 引言

上篇《[Vue3项目实战：像素风LOGO编辑器 Pixeled Pic Pro](https://juejin.cn/post/7311697095505149990)》，我完成了V0.6.0版本，实现了基础功能。本来打算先写完后续的Nest篇、部署篇、总结篇，途中再自己默默更新到V1.0.0。但是写着写着，发现了些刺***激***的玩法，导致打乱了我的计划。

真是计划赶不上变化啊，无奈之下我决定加更一篇，来分享一下我又新加了什么有趣的功能！

## 功能一览

#### V0.7.0
1. 自定义行x列生成

本来是v0.6.0的功能，偷懒了，放到了这个版本补上。

![](https://img.zzao.club/article/202411191438063.png)
2.  Toast组件

原因：Konva生成过多矩形后，页面会有明显卡段，所以需要一个提示组件，提醒一下用户。

基于daisyUI封装了一下Toast小组件，目前只支持同时显示一条消息，重复的消息会重复利用这个元素

![](https://img.zzao.club/article/202411191438064.png)

3. Tab键切换颜色调整为空格键

因为Tab键和浏览器默认行为有冲突，页面有表单里元素，会自动focus，使用起来不太方便，所以调整为空格键了

#### V0.8.0
**预设功能！**

我在自己把玩自己的网站的时候，发现自己写死的几个颜色，有时候不够用，或者说我也不知道用什么颜色比较好。

于是我就想要不我用吸取颜色的软件，找几个高大上的图，吸几组配色，再放上去够大家选择。于是我寻思先在电脑里开始找几个图吧。

![](https://img.zzao.club/article/202411191438065.png)
很突然，我就发现了iKun的图片（侵删），马上就来了兴致，先画个iKun玩玩再说！
画完了之后，导出，直接发到"回家吃饭"的群里！

果然啊，大家对我的绘画水平表示了强烈的认可。
![](https://img.zzao.club/article/202411191438066.png)

我仔细对比一看啊，确实，除了背带略长，可以说是很还原了~

我又一寻思，这么好玩的功能，我发给别人，别人感兴趣了，他自己怎么再画出来呢？

他要去吸取颜色，目测一个格子的长宽数量，然后在网站上设置好，再开始画。 显然是太麻烦了，没等开始画人就关闭网站了！

从这一点我想到了两个问题：
1. 从吸取颜色到配置数量，太麻烦，太模糊。不像我这样擅长画画的话，很难一步到位
2. 画着画着，格子不够了怎么办

于是我灵机一动，我把我现在的配置保存成一个“预设”，别人想用的时候我就发给他。

能用文本传播，很自然就能想到用json，而且用剪贴板的话，不懂代码的人也不必关心复制的是个什么玩意。用的时候再从一个入口粘贴进去，我这边自动给他加上，这样就完成了和上一个创作者相同的前置条件！ 

不擅长画画也是个好事，不光好的画受欢迎，只要***你***的画够抽象，相信喜欢的人也是非常多的。因为互联网的好处就是你可以从中找到任何奇怪爱好、奇怪角度的同行者。

为了解决第一个问题，我梳理了以下功能点， 然后趁着热乎劲儿火速把他们实现：
1. 预设的内容为：方格大小和数量配置，颜色组，名称
```json
{
    name: "IKUN",
    cellConfig: {
      size: 5,
      border: 1,
      xCount: 15,
      yCount: 24,
    },
    // 从kunkun身上吸取的几个颜色
    colors: ["#564A54", "#DDDBED", "#1C1A25", "#DDB3C0", "#908B96", "#CC7A76", "#ffffff"]
}
```
2. 可以一键导出自己的预设到剪贴板 
粘贴板功能用的vue-use，[搭建项目的时候](https://juejin.cn/post/7311697095505149990)已经内置好了
```typescript
import { useClipboard } from "@vueuse/core";

const { isSupported, copy } = useClipboard();

```

![](https://img.zzao.club/article/202411191438067.png)
3. 可以一键导入别人的模版
![](https://img.zzao.club/article/202411191438068.png)
4. 选择预设后，会切换当前配置为预设内容

![](https://img.zzao.club/article/202411191438069.png)

5. 预设内容存在了LocalStorage，加载页面时会在本地缓存中加载预设，导入预设的时候，也会往本地缓存同步一下
```typescript
// 加载本地预设
...
const localPresets = localStorage.getItem("ZZSTUDIO_PPP_PRESETS");
  if (localPresets) {
    try {
      const presets = JSON.parse(localPresets);
      // 检测合法性, 没问题的话, 直接应用
      if (presets.every((preset: any) => checkPreset(preset))) {
        // 去重, name一样会被去掉, 本地优先
        const newPresets = filterNoRepeatPresets(presets.concat(awsomePreset.value));
        awsomePreset.value = newPresets.concat();
      }
    } catch (err) {
      toast.value.show({
        msg: "本地预设加载失败",
        type: "error",
      });
      return false;
    }
  } else {
    logger.info("无本地预设");
  }
...
// 导出预设
... 
if (isSupported) {
    copy(copyPreset.value);
    toast.value.show({
      type: "success",
      msg: "已复制到剪切板!",
    });
  }
...
```

写完之后，开始测试，随手画几个蒙娜丽莎这种作品，发现了几个bug，马上修复。

由于点「导出图片」按钮次数***太***多，感觉有点迷瞪了，容易和「生成」按钮混了，于是我把「生成」按钮挪到了最上边，防止误触。

又导出了几张大作并且分享之后，有用户给我提出了建议：导出之后的边框太粗了，有点影响视觉。

我觉得很道理，安排！于是加了一个「导出去边框」的Toggle，测试了一下，确实是有内味了。

目前操作栏如下：
![](https://img.zzao.club/article/202411191438070.png)

以上就是这两次小版本迭代新增的功能，边写边使用边改bug，闲里偷忙，只隔了一天就搞完啦~

## 作品演示

只复刻iKun肯定不是真粉丝，于是我把自己也打扮成了他的模样 ！

![](https://img.zzao.club/article/202411191438071.png)

请把 「**优秀**」打在评论区！！


## 小结

本次带来了两个小版本更新，以及我的传世之画作，希望大家喜欢！

从最初架构中，我并没有构思出这些功能或问题，而是在开发、使用的过程中，不断打磨、***美***化，发现问题，解决问题，**从使用者的角度增加功能**。可见，最重要的还是抛除杂念，然后下手去做。

而且！现在还只是纯前端功能，相信有了后端的加入，能够实现更多的有意思的功能~

看到这里，如果你已经提起了兴趣，可以去回顾我的上一篇《[Vue3项目实战：像素风LOGO编辑器 Pixeled Pic Pro](https://juejin.cn/post/7311697095505149990)》，然后行动起来吧~

如果你对这个产品感兴趣或者有好的功能建议要告诉我，欢迎关注公众号：[早早集市](https://mp.weixin.qq.com/s/A8wHxE5Q2jl6Su_7QA6f-A)

感谢你的阅读，我是枣把儿\~
