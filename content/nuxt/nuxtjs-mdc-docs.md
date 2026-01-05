---
title: 打造 Markdown 的绝美排版：@nuxtjs-mdc 使用指南
date: 2025-01-13
lastmod: 2025-02-12
tags:
  - Nuxt
versions:
  - "@nuxtjs/mdc@0.12.1"
showTitle: 打造 Markdown 的绝美排版：@nuxtjs-mdc 使用指南
---
这是一份持续更新的@nuxtjs/mdc的使用说明书，扩充官方文档的同时，更正一些错误信息（因为官方更的不及时）。同时也会涵盖解析 `Makdown` 语法的使用说明。

## 安装

```shell
npx nuxi@latest module add mdc
```

然后 @nuxtjs/mdc 就会被自动添加到 `nuxt.config.ts` 的 modules 中

```typescript
export default defineNuxtConfig({
  modules: ['@nuxtjs/mdc']
})
```
## 组件

MDC 中提供了三个组件来渲染 markdown 内容

`MDC`

```typescript
<script setup lang="ts">
const md = "
	# h1 标题

	`代码快`

"

</script>

<template>
  <MDC :value="md" tag="article" />
</template>

```

`MDC` 组件直接接受一个 `value` prop，传入 `markdown` 的**原始内容**即可，`tag` 属性可以决定渲染后的内容被什么标签包裹，类似于 `vue-router` 的 `RouterLink`。

`MDCRenderer`

这个组件依赖于 `parseMarkdown` 函数提供的数据

此函数需要从 `@nuxtjs/mdc/runtime` 导入

```typescript
import { parseMarkdown } from '@nuxtjs/mdc/runtime'
```

使用时可以像这样

```vue
<script setup lang="ts">
import { parseMarkdown } from '@nuxtjs/mdc/runtime'

const { data: ast } = await useAsyncData('markdown', () => parseMarkdown('::alert\nMissing markdown input\n::'))
</script>

<template>
  <MDCRenderer :body="ast.body" :data="ast.data" />
</template>
```

它还有第二个参数 [MDCParseOptions](https://github.com/nuxt-modules/mdc/blob/main/src/runtime/types/parser.ts)，可以用来控制解析起的行为。

![](https://img.zzao.club/picgo/Pasted%20image%2020250111113759.png)

也可以在 nuxt.config.ts 中配置

```typescript
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@nuxtjs/mdc'],
  mdc: {
    remarkPlugins: {
      plugins: {
        // Register/Configure remark plugin to extend the parser
      }
    },
    rehypePlugins: {
      options: {
        // Configure rehype options to extend the parser
      },
      plugins: {
        // Register/Configure rehype plugin to extend the parser
      }
    },
    headings: {
      anchorLinks: {
        // Enable/Disable heading anchor links. { h1: true, h2: false }
      }
    },
    highlight: false, // Control syntax highlighting
    components: {
      prose: false, // Add predefined map to render Prose Components instead of HTML tags, like p, ul, code
      map: {
        // This map will be used in `<MDCRenderer>` to control rendered components
      }
    }
  }
})
```

**点进去可以看到，这地址都 404 了，文件都删了，这就是为什么我要写这篇文章....**

事实上，`mdc` 底层用到的很多插件，都是和 `unified` 的生态是一致的（都是基于`remarkPlugins`、`rehypePlugins`）。

但是 `mdc` 搞的有点太封闭。没导出几个有用的Api，其实完全可以把关于 `markdown`、`html`、以及中间的 `hastTree` 都开放出来。

因为 `markdown` 相关的内容，虽然没有官方的标准，但是因为使用范围很广，早就成了事实意义上的标准。有用的人自然会用了，不用的压根都不会看一眼。

实际使用中，这种方式还没有找到使用场景（在内容渲染中），不管是自己本地的数据，还是从第三方 API获取到数据，直接扔给 `MDC` 组件是最方便的，在数据中存储原始数据（`rawbody`），在不同平台展示时自身处理渲染逻辑。

PS：但要做 RSS 订阅就不得不把生成后的 `HTML` 放在 `xml` 中 ，这就是我上边为啥吐槽它太封闭。

`MDCSlot`

这个组件是为了替代 Vue 中的 `slot` 组件，针对 `MDC` 做了特殊处理，使用这个组件时你可以删除其包裹元素`p`，（使用 `slot` 时会默认渲染一个 `p` 标签包裹文字内容）

`demo.md`

```md
ddddsadadasdasd
```

`ProseP.vue`

```vue
<template>
  <p>
    <!-- MDCSlot will only render the actual text without the wrapping <p> -->
    <MDCSlot unwrap="p" />
  </p>
</template>

```

当你输入两段纯文本，并且中间有一段空行时，这两段文本会分别被 p 标签包裹，做到换行的效果。

而如果用上述的 `ProseP.vue` 覆盖后，纯文本将不再被 `p` 标签包裹，而是变成了 `span`，也就是你在写 md 时，哪怕已经换了行，渲染后的内容也是连贯的排列在一起的。

那 ProseComponent 是什么呢

## Prose Component

`MDC` 渲染 `markdown` 内容时，使用了一套组件来渲染对应的 `markdown` 语法

![](https://img.zzao.club/picgo/CleanShot%202025-01-11%20at%2011.28.56.png)

同样的也支持你覆盖这些组件

如果你使用 `nuxt3.15.1` 并且开启了    `compatibilityVersion: 4`，那你的 `components` 路径应该是在 `app/components` 

在此路径下新建目录 `mdc` ，然后创建一个同名的 `vue` 文件：`ProseA.vue` 

![](https://img.zzao.club/picgo/Pasted%20image%2020250111114806.png)

我改写了其样式，并且把跳转默认为打开新标签页

![](https://img.zzao.club/picgo/Pasted%20image%2020250111114847.png)

可以看到如上渲染内容

## 自定义组件

`MDC` 还支持在 `markdown` 中写 `vue` 组件，语法是这样的

`demo.md`

```md
::component-name
This is an vue component
::
```

对应 `app/components/mdc/ComponentName.vue`

如果你正在搭配 Nuxt Content 使用，则对应目录为 `app/components/content/ComponentName.vue`

**再来个更实际的例子**

md 内容为：
```md
下面是一个 CustomTag 组件

::custom-tag
内部内容演示
::

组件位于`app/components/mdc/CustomTag.vue`
```

`CustomTag.vue` 内容为：

```vue
<template>
  <div class="text-center my-10">
    <div
      class="text-black px-3 py-2 text-lg font-bold">
      <slot/>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>
```

渲染后的结果为：
![](https://img.zzao.club/picgo/Pasted%20image%2020250111185601.png)

这种组件被称为 `Block Components` ，和 `display: block` 的意思相同，是个块级组件，单独占一行

既然是Vue组件，也给它传 props

```md
::custom-tag{type="warning"}
内部内容演示
::
```

再把组件改一下

```vue
<template>
  <div class="text-center my-10">
    <div
      class="text-black px-3 py-2 text-lg font-bold" :class="{ 'bg-yellow-200': props.type === 'warning', 'bg-blue-200': props.type === 'info', 'bg-green-200': props.type === 'success', 'bg-red-200': props.type === 'error' }">
      <slot/>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  type?: 'warning’ | ‘info’ | ‘success’ | ‘error’'
}>()
</script>
```
`
看下渲染的内容：

![](https://img.zzao.club/picgo/Pasted%20image%2020250111185907.png)

也可以直接传 style

```md
::custom-tag{type="warning" style="margin-top:100px;"} 
内部内容演示 
::
```

可以看到有了一个很大的间距

![](https://img.zzao.club/picgo/Pasted%20image%2020250111190522.png)

还支持使用 YAML method 的方式传入

```md
::custom-tag{type="warning" style="margin-top:100px;"} 
---
desc: "我是描述内容"
---
::
```

把组件改为

```vue
<template>
  <div class="text-center my-10">
    <div
      class="text-black px-3 py-2 text-lg font-bold" :class="{ 'bg-yellow-200': props.type === 'warning', 'bg-blue-200': props.type === 'info', 'bg-green-200': props.type === 'success', 'bg-red-200': props.type === 'error' }">
      <div class="title">
        {{ props.type }}
      </div>

      <div class="desc text-red-600">
        {{ desc }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  type?: 'warning' | 'info' | 'success' | 'error',
  desc?: string
}>()
</script>
```

渲染后：

![](https://img.zzao.club/picgo/Pasted%20image%2020250111191131.png)

不过这种方式，**不能和 slot 混用**，渲染出来 slot 会把几个 props 都覆盖。

实际使用时，**不应该对一个内容写如此复杂的组件**。

换句话说，Vue 组件应该足够完善， 让你在 `markdown` 中写足够少的信息，只传入必要的数据即可得到完美的展示才对。

上面的 `Props` 是我们自定义的组件提前写好的 `Props` ，而内置的 Prose Components 也是一套 Vue 组件而已。

所以除了在 `app/components/mdc/` 下创建一个同名的 `Prose Component` 覆盖原有组件，也可以直接给原组件传一些 `style`，改变它的样式。

```md
Attributes work on:

- ![favicon](/favicon.ico){style="display: inline; margin: 0;"} image,
- [link](#attributes){style="background-color: pink;"}, `code`{style="color: cyan;"},
- _italic_{style="background-color: yellow; color:black;"} and **bold**{style="background-color: lightgreen;"} texts.

```

除了使用一个 Vue 组件并给他传 Props，设置 style

还能使用 `:ComponentName`  的语法直接使用一个写好的组件，比如这样

```md
# Title

:banner
```

`Banner.vue`

```vue
<template>
  <aside>
    This component does not have any children.
  </aside>
</template>
```

这在自己定制的平台上使用时，会很有用。 但同样的，如果你使用其他软件或 API 来获取 md，要考虑一下语法过多导致的各平台不兼容问题。

PS: 这种md里写属性传值的方式并不是 `mdc` 的原创，而是 `unified` （remark/rehype）插件相关的生态，都是这样写的。
## 绑定数据

贴两个官方的例子，很好理解

第一种是在 Markdown 的 YAML 中定义：

```md
---
title: 'Title of the page'
description: 'meta description of the page'
customVariable: 'Custom Value'
---

# The Title is {{ $doc.title }} and customVariable is {{ $doc.customVariable || 'defaultValue' }}

```

这个用法很有局限，因为你用来写 md 文章的软件大概率不支持这个语法，或者你要同步到其他平台的时候其他平台也不会支持这个语法。

但是如果你的用途很单一，说不定会比较有用

第二种是定义在 Vue 组件中

```vue
<template>
  <div>
    <ContentRenderer :value="data" :data="mdcVars"/>
    <button type="button" v-on:click="mdcVars.name = 'Hugo'">Change name</button>
  </div>
</template>

<script setup lang="ts">
const { data } = await useAsyncData(() => queryCollection('content').path('/test').first());
const mdcVars = ref({ name: 'Maxime'});
</script>
```

md 中

```md
# Hello {{ $doc.name || 'World' }}
```

还是那种话，定制的越多，越不可控。

文章内容还是要以高质量的文字为准，自定义组件更多的是作为锦上添花，是离不开一个封闭的平台的。

----

官方还给出了一种自定义组件的方式，就是在 `nuxt.config.ts` 中配置 `prose: false`，关闭 Prose Components 的渲染方式，自定义一个 map 指定组件

```typescript
mdc: {
    // components: {
    //   prose: false,
      // map: {
      //   'a': 'MemoProseA'
      // }
    // }
  },
```

但我觉得这种方式和直接在 mdc 目录在覆盖掉原组件的区别很小，这种方式可以做到只支持部分 md 语法的渲染，比如你只写一个 a ，那其他内容就是纯文本，只有 a 标签是通过自定义组件渲染出来的，不清楚什么场景下才会有这种选择～

## tailwind CSS 主题

Prose Components 支持使用 [tailwindcss-typography](https://github.com/tailwindlabs/tailwindcss-typography) 覆盖 html 排版

这是我觉得比较实用的样式修改方式，因为 tailwindcss 足够通用，并且在全局的固定位置修改样式，便于管理

Tailwind CSS Typography 提供了一组 prose class，可以给默认的 html 元素附加排版，➡️点击查看[演示](https://play.tailwindcss.com/uj1vGACRJA?layout=preview)

```html
<article class="prose lg:prose-xl">{{ markdown }}</article>
```

**安装插件**

```shell
npm install -D @tailwindcss/typography
```

**新建或添加**到 `tailwind.config.js` 中

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    // ...
  },
  plugins: [
    require('@tailwindcss/typography'),
    // ...
  ],
}
```

**修改灰度**

```
prose prose-gray(默认) prose-slate prose-zinc prose-neutral prose-stone
```

不管使用哪个，都要带有 `prose` 这个基类

**文字整体尺寸**

```
prose prose-sm (14px) prose-base (默认16px) prose-lg (18px) prose-xl (20px) prose-2xl (24px)
```

和灰度一样，也要带有 `prose` 这个基类，实际使用下来，还是 `prose-base` 用的最多，可以在自己发文发帖的多个平台尝试不同字号

**适配深色模式**

上面的几个调整灰度的主题，都有默认的深色模式版本，可以使用 prose-invert 来触发

```html
<article class="prose dark:prose-invert">{{ markdown }}</article>
```

如果你使用了自定义组件，则需要自己使用 `dark:` 修饰符适配一下深色模式

`Nuxt` 中使用 `@nuxtjs/color-mode` 来控制颜色模式

**精细化控制样式**

除了全局设置默认的样式，也可以通过 `prose-xxx` 来控制目标标签的样式

![](https://img.zzao.club/picgo/Pasted%20image%2020250112101943.png)

像这样：

```html
<article class="prose prose-a:text-blue-600 hover:prose-a:text-blue-500">{{ markdown }}</article>
```

另外，每个修饰符都为了保证内容的可读性，设置了最大宽度。 如果你希望内容能够填充其容器的宽度，可以使用 `max-w-none`

```html
<article class="prose max-w-none">{{ markdown }}</article>
```

**取消 prose 样式**

使用 `not-prose` 标记一些元素，不使用 `prose` 的样式

```html
<article class="prose">
  <h1>My Heading</h1>
  <p>...</p>

  <div class="not-prose">
    <!-- Some example or demo that needs to be prose-free -->
  </div>

  <p>...</p>
  <!-- ... -->
</article>
```

但无法继续在 `not-prose` 里再嵌套 `prose`

**自定义颜色主题**

可以在 `tailwindcss.config.js` 中设置自定义的颜色主题

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      typography: ({ theme }) => ({
        pink: {
          css: {
            '--tw-prose-body': theme('colors.pink[800]'),
            '--tw-prose-headings': theme('colors.pink[900]'),
            '--tw-prose-lead': theme('colors.pink[700]'),
            '--tw-prose-links': theme('colors.pink[900]'),
            '--tw-prose-bold': theme('colors.pink[900]'),
            '--tw-prose-counters': theme('colors.pink[600]'),
            '--tw-prose-bullets': theme('colors.pink[400]'),
            '--tw-prose-hr': theme('colors.pink[300]'),
            '--tw-prose-quotes': theme('colors.pink[900]'),
            '--tw-prose-quote-borders': theme('colors.pink[300]'),
            '--tw-prose-captions': theme('colors.pink[700]'),
            '--tw-prose-code': theme('colors.pink[900]'),
            '--tw-prose-pre-code': theme('colors.pink[100]'),
            '--tw-prose-pre-bg': theme('colors.pink[900]'),
            '--tw-prose-th-borders': theme('colors.pink[300]'),
            '--tw-prose-td-borders': theme('colors.pink[200]'),
            '--tw-prose-invert-body': theme('colors.pink[200]'),
            '--tw-prose-invert-headings': theme('colors.white'),
            '--tw-prose-invert-lead': theme('colors.pink[300]'),
            '--tw-prose-invert-links': theme('colors.white'),
            '--tw-prose-invert-bold': theme('colors.white'),
            '--tw-prose-invert-counters': theme('colors.pink[400]'),
            '--tw-prose-invert-bullets': theme('colors.pink[600]'),
            '--tw-prose-invert-hr': theme('colors.pink[700]'),
            '--tw-prose-invert-quotes': theme('colors.pink[100]'),
            '--tw-prose-invert-quote-borders': theme('colors.pink[700]'),
            '--tw-prose-invert-captions': theme('colors.pink[400]'),
            '--tw-prose-invert-code': theme('colors.white'),
            '--tw-prose-invert-pre-code': theme('colors.pink[300]'),
            '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
            '--tw-prose-invert-th-borders': theme('colors.pink[600]'),
            '--tw-prose-invert-td-borders': theme('colors.pink[700]'),
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // ...
  ],
}
```

也可以使用自定义的色值

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: '#333',
            a: {
              color: '#3182ce',
              '&:hover': {
                color: '#2c5282',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // ...
  ],
}
```

不过不建议在这里配置颜色相关的，因为提供了通过 prose-xxx 的形式灵活控制样式时，在这里在写一遍自定义的样式会难以覆盖，可以在这里设置一些间距类的样式。

而颜色使用一个自定义的 class 去使用：

```css
.mdc-page-prose {
  @apply prose prose-zinc prose-pre:bg-gray-100 dark:prose-pre:bg-zinc-400 dark:text-zinc-200 dark:prose-strong:text-zinc-200 prose-code:bg-zinc-200 dark:prose-code:bg-zinc-200 prose-code:text-zinc-800 dark:prose-blockquote:text-zinc-300 w-full max-w-full
}

.mdc-prose {
  @apply prose prose-zinc prose-pre:bg-gray-100 dark:prose-pre:bg-zinc-400 dark:text-zinc-200 dark:prose-strong:text-zinc-200 prose-code:bg-zinc-200 dark:prose-code:bg-zinc-200 prose-code:text-zinc-800 dark:prose-blockquote:text-zinc-300 w-full max-w-full
}
```

这样的话，在一个项目中，出现两组或多组不同的 `prose` 样式，就比较方便使用 `class` 控制了，毕竟 `tailwindcss.config.js` 只有一个，尽量设置一些通用的不常变化的属性。

## 结语

以上就是 `nuxtjs/mdc` 的大部分使用场景了，通常这个库会在使用 `Nuxt Content` 时使用，但也可以只使用它来支持多种来源，片段化的 `md` 内容渲染。

但是要注意，虽然支持自定义组件，但我还是不建议你的 `md 文章`里不要包含太多的`魔法`，**在自己定制的平台上是魔法，在其他不支持的软件和 web 里就是麻瓜**。

但是自定义组件很适合用来**支持自己的自建平台**，这也是我为什么会把 mdc 这个库拿出来单独使用。

使用时注意文章开头的 `mdc` 版本号，表示此文章的生效范围，后续更新只能在我的[博客站](https://blog.zzao.club)同步了

如果你也是 `Nuxt` 的使用者，或是 `Vue` 使用者对 `Nuxt` 感兴趣，欢迎在文末或博客站首页添加我的微信，一起交流，知无不言😎

