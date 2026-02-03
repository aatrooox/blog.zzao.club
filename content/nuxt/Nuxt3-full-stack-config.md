---
title: Nuxt3全栈开发 · 配置篇
date: 2024-11-19
lastmod: 2025-08-19
tags: ["博客", "Nuxt"]
versions: ["nuxt@3.14.0", ""@nuxt/content@2.13.4"", ""@prisma/client@5.22.0""]
describtion: Nuxt3全栈开发个人博客，会用到哪些插件和包，以及它们的详细配置
---
最近在用Nuxt3全栈开发个人博客，踩了不少小坑，这篇文章总结一下。

## 依赖库及博客主要功能

先来介绍一下我用到了哪些 `Nuxt3` 的相关生态及对应的功能。

- `@nuxtjs/color-mode` 颜色模式：白天（light）、黑夜（dark）、系统（system）三者切换
- `@nuxt/content` 展示文章，基于`mdc`，可以使用自定义组件渲染`markdown`，支持 `front matter` 
- `@nuxtjs/tailwindcss` 样式。以及配合 `@tailwindcss/typography` 自定义markdown主题
- `@primevue/nuxt-module` 组件库。
- `@nuxt/image` 图片
- `@nuxt/icon` 图标。配合 `iconify` ，我目前用的图标主要是 `@iconify-json/icon-park-outline`
- `@nuxt/robots` SEO
- `@nuxt/mdc` 解析动态（类型Memos/朋友圈/X）展示。和文章有一致的表现，也可以通过`tailwindcss`自定义样式
- `prisma` 管理数据库（sqlite3）
- `gitea` 管理代码仓库（私有）。以及使用`workflows`自动部署

基于这些库逐步使用和功能的逐渐实现，分享一下使用经验。

如果没有刻意提到的安装方式，则默认都是用 `npx nuxi@latest module add xxxx` 进行安装。

如果没有表明在何处配置，则默认是在 `nuxt.config.ts` 的顶级

如果代码中变量明显没有引入，则是使用了 `Nuxt3` 的 `auto imports`
## 颜色模式

```typescript
colorMode: {
    preference: 'system', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    // hid: 'nuxt-color-mode-script',
    // globalName: '__NUXT_COLOR_MODE__',
    // componentName: 'ColorScheme',
    // classPrefix: '',
    // classSuffix: '-mode',
    // storage: 'localStorage', // or 'sessionStorage' or 'cookie'
    // storageKey: 'nuxt-color-mode'
  },
```

有三种模式：`light` `dark` `system` ，默认为 `system` 根据系统模式来自动设置浅色或深色

切换模式时：

```typescript
const colorMode = useColorMode()
const index = ref(modes.indexOf(colorMode.preference))
// 用来显示不同图标
const modes = ['system', 'light', 'dark']

const modeIcon = computed( () => {
	switch ...
	case ...
})

function toggleColorMode() {
  colorMode.preference = modes[(++index.value) % modes.length]
}
```

配合组件库 `primevue` 的配置

```typescript
primevue: {
    importTheme: { from: '~/primevue/theme.ts' },
    // usePrimeVue: false
  },
```

`theme.ts` 如下

```typescript

import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';


const Noir = definePreset(Aura, {
  semantic: {
      primary: {
	      ...
      },
      colorScheme: {
        light: { ... }
        dark: { ... }
      }
  },
  components: {
    button: {
      ...
    }
  }
});


export default {
    preset: Noir,
    options: {
        darkModeSelector:'.dark-mode'
    }
};

```

设置 `darkModeSelector` 为 `.dark-mode`。 使用colorMode切换时，会自动切换 `html` 的 `class`

## 解析Markdown文件

```typescript
content: {
    documentDriven: {
      injectPage: false
    },
    highlight: {
      theme: 'github-light',
      langs: ['typescript', 'vue', 'javascript', 'go', 'shell', 'bash', 'yaml', 'markdown', 'json', 'html', 'ts', 'js']
    },
    sources: {
      obsidian: {
        prefix: '/obsidian', // All contents inside this source will be prefixed with `/fa`
        driver: 'fs',
        base: `/Users/your_name/code/notion/blog` // Path for source directory
      },
    }
  },
```

`documentDriven` 的 `injectPage` 是为了解决一个警告信息

```shell
[@nuxt/content 09:52:13] Using <NuxtLayout> inside app.vue will cause unwanted layout shifting in your application.
```

原因是，原代码从 `pages/[slug].vue` 改为 `pages/post/[slug].vue` 导致报错。

以下是搜索时找到的相关issue

[NuxtLayout warn vs documentation #15240](https://github.com/nuxt/nuxt/issues/15240) 

[nuxt-blog-starter](https://github.com/dan-bowen/nuxt-blog-starter/pull/9) 

`highlight` 是配置代码块高亮的，内部使用的是 [Shiki](https://github.com/shikijs/shiki)，同时和 `color-mode` 兼容，可以查看 [更多官方文档](https://content.nuxt.com/get-started/configuration#highlight)

`sources` 是核心配置，

官方的默认配置是 `base: resolve(__dirname, 'content')` , 即从当前项目下的content内读取md文件，我直接改成了自己本地的一个目录。

启动项目时，会**读取并监听**该目录下的所有md文件，并有一个忽略规则（开头为 `.` 或 `-` 的 ），然后会解析并缓存到 `.nuxt` 内，`dev` 模式下就是从 `.nuxt` 中直接拿缓存数据，所以有一些奇怪的问题可以通过删除 `.nuxt` 并重新运行可以解决。

当然这个配置也决定了必须带着 `.nuxt` 目录才能正常打包。

只靠 `@nuxt/content` 解析出的文章还没眼看，需要借助 `@tailwindcss/typography`。

使用前：

![](https://img.zzao.club/1-img-20241106171191.png)

使用（并自定义）后：

![](https://img.zzao.club/1-img-20241119101171.png)

`markdown` 被解析为 `p` 、`a` 、`code` 、`h1` 、`h2`、`img`、`strong` 等这些标签，而在 `@nuxt/content` 中，使用对应的 `ProseA`、`ProseH1` 组件进行渲染。

并且支持自己编写然后覆盖这些组件预设，在 `components/content` 目录下新建一个同名的组件，如 `ProseA.vue` ：

```typescript
<template>
  <NuxtLink :href="props.href" :target="props.target"
    class="font-bold border-b-2 border-dashed border-zinc-600 hover:border-solid hover:border-zinc-900 dark:border-zinc-300 dark:hover:border-zinc-100">
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  href: {
    type: String,
    default: ''
  },
  target: {
    type: String as PropType<'_blank' | '_parent' | '_self' | '_top' | (string & object) | null | undefined>,
    default: '_blank',
    required: false
  }
})
</script>
```

这里我把他的默认打开方式改为了 `_blank` ，并自定义了功能和样式。其他组件同理，都是可以自定义的。 [查看NuxtContent中支持的组件](https://content.nuxt.com/components/prose#prosea)  

同样的可以基于 `typography` 在顶层修改其样式。

```js
import typography from '@tailwindcss/typography'
/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  plugins: [typography()],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            code: {
              // backgroundColor: theme('colors.gray.100'),
              // color: theme('colors.orange.400'),
              fontWeight: 'normal',
              marginLeft: theme('spacing.1'),
              marginRight: theme('spacing.1'),
              paddingLeft: theme('spacing.2'),
              paddingRight: theme('spacing.2'),
              paddingTop: '1px',
              paddingBottom: '1px',
              borderRadius: '2px',
              '&::before': {
                content: `''!important`
              },
              '&::after': {
                content: `''!important`
              }
            },
            p: {
              lineHeight: theme('lineHeight.loose')
            },
            pre: {
              // paddingBottom: 0,
              // paddingTop: 0,
              '& > code': {
                color: theme('colors.gray.900'),
                backgroundColor: 'transparent'
              }
            },
            a: {
              textDecoration: 'none'
            },
            img: {
              marginTop: 0,
              marginBottom: 0,
            }
          }
        }
      })
    },
  },
}

```

这里我**建议只改大小间距等属性**，颜色相关的我放在了其他地方管理，比如 `assets/tailwind.css`：

```css
/* 针对page的prose颜色配置 */
.mdc-page-prose {
  @apply prose prose-zinc prose-pre:bg-gray-100 dark:prose-pre:bg-zinc-400 dark:text-zinc-200 dark:prose-strong:text-zinc-200 prose-code:bg-zinc-200 dark:prose-code:bg-zinc-200 prose-code:text-zinc-800 dark:prose-blockquote:text-zinc-300
}
```

因为后面还涉及到动态的展示，动态也是基于mdc渲染的，也共用一套样式，那我再定义一个 `.mac-memo-prose` 可能会更灵活一些。

## 解析Markdown字符串

`@nuxtjs/mdc` 提供了 `MDC` 组件来渲染md字符串， 添加此模块后即可使用：

```vue
<MDC :value="content" tag="section" class="mdc-memo-prose prose"/>
```

一开始我是没发现mdc可以直接使用。在搜github的issue时，早期的nuxt版本中，大家都是手动引入包内的解析函数😏 这就是用的晚的好处吧 ～

样式表现和文章解析出来一模一样，如果想自定义，就用 `mdc-memo-prose` 去添加。

如果要使用一个自定义组件（`Mtag.vue`）时：

```shell
::mtag
是实打实
::
```

在 `components/global` 目录下新建 `Mtag.vue` ：

```vue
<template>
  <Tag class="h-6 mr-2"><slot></slot></Tag>
</template>
```

此 `Mtag` 中使用的是 `primevue` 中的 `Tag` 组件，这也就意味着仅靠输入一些简单的语法，就实现了无限的组件呈现

![](https://img.zzao.club/1-img-20241119111158.png)

## 图片、图标、SEO

**图片使用 `@nuxt/image` 模块**

如果仅使用 `src` 属性，NuxtImg 会输出原始的 img 标签。

它提供了 sizes、placeholder（占位符）、preset、format（指定格式）、quality（图片质量）、loading（懒加载）、preload（预加载） 等非常多的配置，非常省事、好用。

这里没有什么特殊用法，所以可以直接[查看所有配置](https://image.nuxt.com/usage/nuxt-img#usage) 。

**图片使用 `@nuxt/icon` 模块**

搭配 icon 库(`@iconify-json/icon-park-outline`)使用：

```shell
npm i -D @iconify-json/icon-park-outline
```

直接使用：

```vue
<Icon name="icon-park-outline:wechat"></Icon>
```

修改大小 ( 修改颜色直接改 style color: xxx )：

```vue
<Icon name="icon-park-outline:wechat" size="1.5em"></Icon>
```

如果要替换掉 `primevue` 的 `icon`：

```vue
<Button severity="parimary" size="small">
	<Icon name="icon-park-outline:wechat" slot="icon"></Icon>
</Button>
```

**SEO相关**

最直接的办法就是，打开控制台，找到 `Lighthouse` , 开始分析即可

![](https://img.zzao.club/1-img-20241119111114.png)

看看哪里加载慢，SEO里提示什么可以优化，比如没有 `robots`，那就加入模块 `@nuxt/robots` 就会自动帮你做好了。

其他的就是注意 `img` 的 `alt` 有没有写，第三方 js/css 设置 `sync` `defer`，页面绘制时偏移等等

header 信息，可以用 `useHead` 轻松设置

```typescript
useHead({
  title: '早早集市｜博客站',
  meta: [
    {
      name: 'description',
      content: 'https://blog.zzao.club',
    },
    {
      name: 'keywords',
      content: '',
    },
  ],
})
```

## prisma 和 gitea

这两篇太长了，我决定分出去两篇，下次再发！

## 结语

作为一个展示为主的博客，前端使用这些模块、库已经够用了，但作为一个全栈框架，后端 `Nitro` 也是要玩一玩的，所以后续的开发计划偏向于后端。

- 登录、注册、用户分组
- 文章、动态支持评论
- 文章、动态支持分享（图片、短链接）
- 图片上传（cos）

其中涉及到大量对 Nitro 的探索，鉴权、中间件、数据库等等。这也是后面文章输出的重点方向，即 Nuxt3 的全栈开发。

👏👏欢迎关注 「早早集市」


