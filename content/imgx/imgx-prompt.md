---
title: 生成卡片的超长提示词
date: 2025-03-12
lastmod: 2025-04-02
tags: ["IMGX"]

---
## 提示词

打磨了一下生成模板的提示词，用来批量生产模板

### 基于图片生成模板
 
```txt
我会给你一个图片，分析内容，并将其转化为美观漂亮的比例相同的 HTML 元素：

## 内容排版规范
	- 整体风格按照图片中的排版
	- 如何图片中有明显的样式不美观，则去除
	- 使用清晰的视觉层次结构，突出重要内容
	- 配色方案应专业、和谐，适合在社交媒体传播
## 技术规范
	- 使用 Vue3（通过CDN引入）、Tailwindcss3(通过CDN引入)
	- 使用 Vue3 渲染内容时，template 标签中只能使用两种方式定义样式
		1. class。如 class="w-full h-full"
		2. :style="{ color: myColor }"。这种方式用于接受 props 的参数，要满足 vue 语法
		3. 两者为互补关系，不能修改的样式全部用 class实现，动态传入的用 style 实现
		4. 至少在其中一个中声明 flex 布局
	- 使用 Vue3 渲染内容时，script 中只允许使用 props，props 中只能接受和内容、样式有关的数据。不允许存在任何交互逻辑
	- template 和 props 的内容要独立且完整，要用单独的变量存储。
	- template 中的内容要用 props 传入值或默认值代替，不能把 template 的内容写死。
	- CSS 请严格按照【CSS要求】，务必使用 tailwindcss3 的语法，同时要使用`:style="{}"`语法来保证能接受 props 来改变颜色、字号、间距等属性
	- CSS或 props 中不允许出现 undefined，必须有明确的值，如 width: 100%
	- html元素只能使用 div 元素
	- 每个 div 必须显式使用 flex 布局，必须具备 flex class
	- 不能使用 z-index 属性
	- 不能使用 satori 不支持的属性
	- 如果发现现有条件不能生成一模一样的样式，则放弃和原图保持一致，换一种简洁的样式来代替
	- 最外层 div 以及第二层 div 必须使用 `w-full h-full` 来占满父元素
	- 如果图片底部存在渐变色或底色，内容存在底色，要特别注意样式的准确性，必须表现在 Vue 组件内
	- 只允许最终生成单个HTML文件
	- 在 Vue 组件的外层增加一个固定宽高的 div 容器，用来模拟其固定尺寸的父元素
	- 在 Vue 组件的上方增加两个按钮
		- 1.复制 Template，点击时把 Vue 组件中的 Template 变量的内容当做字符串复制到粘贴板，要求和 template 共用一个变量
		- 2.复制 Props，点击时根据 Vue 组件中的 Props 对象的格式，生成key-value格式的对象字符串复制到粘贴板。
	- 代码中不要出现任何注释
## 媒体资源
	- 忽略所有媒体资源
## 图标与视觉元素
	- 忽略所有 emoji
	- 忽略所有 图标
	- 忽略所有背景图、复杂阴影效果
	- 不需要存在交互效果，只要视觉效果
## 性能优化
	- 确保页面加载速度快，避免不必要的大型资源
## 输出要求
	- 提供完整可运行的单一HTML文件，包含所有必要的CSS和JavaScript
	- 代码中不要出现任何注释
	- 确保代码符合W3C标准，无错误警告
	- 页面在不同浏览器中保持一致的外观和功能

请根据上传图片，基于 Vue3 创建出合适的卡片 HTML 网页内容。
```

### 让AI自主设计排版（待完善）

```txt
请基于 Vue3 在 HTML 中生成一个美观漂亮的卡片组件，同时满足以下要求：

## 排版规范
	- 整体长宽比为：3:4，用途为小红书、推特、朋友圈发帖
	- 配色方案应具有科技感，以合理的渐变作为背景
	- 文字必须成为视觉主体，占据页面至少70%的空间
	- 运用3-4种不同字号创造层次感，关键词使用最大字号
	- 主标题字号需要比副标题和介绍大三倍以上
	- 主标题提取2-3个关键词，使用特殊处理（如描边、高亮、不同颜色）
## 技术规范
	- 使用 Vue3（通过CDN引入）、Tailwindcss3(通过CDN引入)
	- 使用 Vue3 渲染内容时，template 标签中只能使用两种方式定义样式
		1. class。如 class="w-full h-full"
		2. :style="{ color: myColor }"。这种方式用于接受 props 的参数，要满足 vue 语法
		3. 两者为互补关系，不能修改的样式全部用 class实现，动态传入的用 style 实现
		4. 至少在其中一个中声明 flex 布局
	- 使用 Vue3 渲染内容时，script 中只允许使用 props，props 中只能接受和内容、样式有关的数据。不允许存在任何交互逻辑
	- template 和 props 的内容要独立且完整，要用单独的变量存储。
	- template 中的内容要用 props 传入值或默认值代替，不能把 template 的内容写死。
	- CSS或 props 中不允许出现 undefined，必须有明确的值，如 width: 100%
	- html元素只能使用 div 元素
	- 每个 div 必须显式使用 flex 布局，必须具备 flex class
	- 不能使用 z-index 属性
	- 不能使用 satori 不支持的属性
	- 最外层 div 以及第二层 div 必须使用 `w-full h-full` 来占满父元素
	- 如果图片底部存在渐变色或底色，内容存在底色，要特别注意样式的准确性，必须表现在 Vue 组件内
	- 只允许最终生成单个HTML文件
	- 在 Vue 组件的外层增加一个固定宽高的 div 容器，用来模拟其固定尺寸的父元素
	- 在 Vue 组件的上方增加两个按钮
		- 1.复制 Template，点击时把 Vue 组件中的 Template 变量的内容当做字符串复制到粘贴板，要求和 template 共用一个变量
		- 2.复制 Props，点击时根据 Vue 组件中的 Props 对象的格式，生成key-value格式的对象字符串复制到粘贴板。
	- 代码中不要出现任何注释
## 输出要求
	- 提供完整可运行的单一HTML文件，包含所有必要的CSS和JavaScript
	- 代码中不要出现任何注释
	- 确保代码符合W3C标准，无错误警告
	- 页面在不同浏览器中保持一致的外观和功能
## 用户输入内容

请根据上述要求，生成一个在单一 HTML 中可使用的Vue3卡片组件
```

修改生成卡片的样式时，只需要修改排版规范部分即可

测试：社交卡片
```
## 排版规范
- 仿照X/twitter的帖子格式来设计卡片
- 排版规范、美观、整齐
- 文字必须成为视觉主体，占据页面至少70%的空间
- 运用3-4种不同字号创造层次感，关键词使用最大字号
- 主标题字号需要比副标题和介绍大三倍以上
- 主标题提取2-3个关键词，使用特殊处理（如描边、高亮、不同颜色）
```

测试：列表
```
## 排版规范
- 仿照X/twitter的帖子格式来设计卡片
- 排版规范、美观、整齐
- 文字必须成为视觉主体，占据页面至少70%的空间
- 运用3-4种不同字号创造层次感，关键词使用最大字号
- 主标题字号需要比副标题和介绍大三倍以上
- 主标题提取2-3个关键词，使用特殊处理（如描边、高亮、不同颜色）
```

## satori 支持的 css

以下是 Satori 支持的 CSS 属性：

### 布局相关

- display：支持 none 和 flex，默认为 flex
- position：支持 relative 和 absolute，默认为 relative
- top、right、bottom、left：支持
- width、height：支持
- minWidth、minHeight、maxWidth、maxHeight：支持，但不支持 min-content、max-content 和 fit-content
- margin 及其相关属性（marginTop、marginRight 等）：支持
- gap：支持
### 灵活盒模型（Flex）

- flexDirection：支持 column、row、row-reverse、column-reverse，默认为 row
- flexWrap：支持 wrap、nowrap、wrap-reverse，默认为 wrap
- flexGrow、flexShrink、flexBasis：支持，其中 flexBasis 不支持 auto
- alignItems、alignContent、alignSelf、justifyContent：支持

### 字体与文本

- fontFamily、fontSize、fontWeight、fontStyle：支持
- tabSize、textAlign、textTransform、textOverflow、textDecoration、textShadow、lineHeight、letterSpacing、whiteSpace、wordBreak、textWrap：支持
- WebkitTextStrokeWidth、WebkitTextStrokeColor：支持

### 背景

- backgroundColor：支持单个值
- backgroundImage：支持 linear-gradient、radial-gradient、url，单个值
- backgroundPosition：支持单个值
- backgroundSize：支持两个值的大小，如 10px 20%
- backgroundClip：支持 border-box、text
- backgroundRepeat：支持 repeat、repeat-x、repeat-y、no-repeat，默认为 repeat

### 边框与圆角

- border 相关属性（borderWidth、borderStyle、borderColor 等）：支持 solid 和 dashed，默认为 solid
- borderRadius 及其相关属性（borderTopLeftRadius 等）：支持，包括简写形式如 5px、50% / 5px

### 转换与效果

- transform 相关属性（translate、translateX、translateY、rotate、scale、scaleX、scaleY、skew、skewX、skewY）：支持
- transformOrigin：支持一值和两值语法（相对和绝对值）
- objectFit：支持 contain、cover、none，默认为 none
- opacity：支持
- boxShadow：支持
- overflow：支持 visible 和 hidden，默认为 visible
- filter：支持
- clipPath：支持