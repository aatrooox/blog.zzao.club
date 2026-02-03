---
title: Vue 官方 VSCode 插件发布 3.0 大版本，更好用！更智能！
date: 2025-07-03
lastmod: 2025-07-03
tags: ["新闻", "前端"]

---
**Vue (Official)** 在近日发布了 `V3.0.0` 大版本更新，我也是在**第二时间**进行了更新，发现有一些好用的新功能值得一说！

## 组件引入新方式

现在引入 `vue component` 可以直接从一侧的文件栏拖拽到 `template` 标签中。

拖拽后按住 `shift` 键，会在当前鼠标位置生成一个组件标签，并且在 script 中自动引入改成组件

![](https://img.zzao.club/article/202507031152188.gif)

## 组件 props 提示

现在使用某个组件时，会直接提示你必传的 props，不用再去组件里找了！

![](https://img.zzao.club/article/202507031152190.png)

## 组件点击直接跳转到组件本身

在 template 中点击某个组件，现在会直接跳转到组件文件，而不是 tsconfig 的定义处了！

![](https://img.zzao.club/article/202507031152191.gif)

## Props 提示

众所周知，`vue3.5` 之后（没记错的话）,`defindProps` 可以直接解构了。

```vue
// const props = defineProps<{ id?: string }>()
const { id = '标题' } = defineProps<{ id?: string }>()
```

假如继续写一个其他的 `computed` 或者 `watch` 时，用到这个 `id`，显示会有一个提示。

告知你这个 id 来自于 `props`

![](https://img.zzao.club/article/202507031152192.png)

## .value自动补全

当使用一个 `ref` 变量时，现在会自动补全 `.value`

![](https://img.zzao.club/article/202507031152193.png)

设置里需要勾选

![](https://img.zzao.club/article/202507031152194.png)

## 结语

以上就是我发现的一些新功能，如果有所遗漏，欢迎评论区补充～～