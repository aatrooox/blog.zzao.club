# Eastward 像素 × 现代卡通 风格规范  
技术栈：Nuxt 3 + TailwindCSS

> 基于经典像素游戏《Eastward》的视觉风格，结合现代 Web 设计理念，打造独特的复古未来主义界面体验。

---

## 1. 设计 Token

### 1.1 颜色系统
| 类别   | Token            | 值（Tailwind 类或 CSS 变量） | 使用场景 |
|--------|------------------|------------------------------|----------|
| 主色   | `primary-600`    | `#FF5C39`（Eastward 招牌橙红） | 主要按钮、链接、强调元素 |
| 辅色1  | `secondary-500`  | `#FFB547`（暖黄高光） | 次要按钮、悬停状态、高亮 |
| 辅色2  | `accent-400`     | `#50C878`（像素绿） | 状态指示、标签、装饰元素 |
| 背景   | `bg-base`        | `#1E1E2A`（深夜靛黑） | 文字、边框、深色元素 |
| 背景2  | `bg-paper`       | `#F5F1E9`（旧报纸米白） | 页面背景、卡片背景 |
| 白色   | `white`          | `#FFFFFF` | 内容背景、卡片内部 |

### 1.2 字体系统
| 类别   | Token            | 值 | 使用场景 |
|--------|------------------|-----|----------|
| 像素字体 | `font-pixel`   | `Press Start 2P`（Google Fonts） | 标题、重要文字、游戏风格元素 |
| 卡通字体 | `font-cartoon` | `Nunito`（圆润无衬线） | 正文、描述、用户界面文字 |
| 默认字体 | `font-lxgws`   | `LXGWS`（霞鹜文楷） | 中文内容、文章正文 |

### 1.3 视觉效果
| 类别   | Token            | 值 | 说明 |
|--------|------------------|-----|------|
| 像素阴影 | `shadow-pixel` | `4px 4px 0 0 #000000` | 硬边像素风格阴影 |
| 增强阴影 | `shadow-pixel-lg` | `6px 6px 0 0 #000000` | 悬停状态的加强阴影 |
| 圆角   | `rounded-xl`     | `12px` | 大圆角，现代卡通风格 |
| 边框   | `border-4`       | `4px` | 粗边框，像素风格 |

### 1.4 间距系统（8px 基线网格）
| Token | 值 | 像素值 | 使用场景 |
|-------|----|---------|---------|
| `2` | `0.5rem` | `8px` | 最小间距 |
| `4` | `1rem` | `16px` | 小间距 |
| `6` | `1.5rem` | `24px` | 中等间距 |
| `8` | `2rem` | `32px` | 大间距 |
| `12` | `3rem` | `48px` | 超大间距 |
| `16` | `4rem` | `64px` | 区块间距 |
| `18` | `4.5rem` | `72px` | 自定义间距 |

---

## 2. Tailwind 配置

```js
import typography from '@tailwindcss/typography'

export default {
  content: ['./app/**/*.{vue,js,ts}'],
  plugins: [typography()],
  theme: {
    extend: {
      colors: {
        primary: { 600: '#FF5C39' },
        secondary: { 500: '#FFB547' },
        accent: { 400: '#50C878' },
        bg: { base: '#1E1E2A', paper: '#F5F1E9' },
      },
      fontFamily: {
        pixel: ['\"Press Start 2P\"', 'monospace'],
        cartoon: ['Nunito', 'sans-serif'],
        lxgws: ['LXGWS', 'sans-serif'],
      },
      boxShadow: {
        pixel: '8px 8px 0 0 #000000',
        'pixel-lg': '12px 12px 0 0 #000000',
      },
      spacing: {
        18: '4.5rem', // 72px
      },
    },
    screens: {
      'xs': '480px',
      'sm': '640px', 
      'md': '768px',
      'lg': '1024px',
      'pc': '1140px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
  },
}
```

---

## 3. 组件设计规范

### 3.1 按钮组件

#### 主要按钮
```html
<!-- 桌面端版本 -->
<button class="bg-primary-600 hover:bg-secondary-500 text-white font-cartoon font-bold px-6 py-3 rounded-xl border-4 border-bg-base shadow-pixel hover:shadow-pixel-lg transition-all duration-200 hover:scale-105">
  按钮文字
</button>

<!-- 响应式版本 -->
<button class="bg-primary-600 hover:bg-secondary-500 text-white font-cartoon font-bold px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl border-2 md:border-4 border-bg-base shadow-pixel hover:shadow-pixel-lg transition-all duration-200 hover:scale-105">
  <span class="text-sm md:text-base">按钮文字</span>
</button>
```

#### 次要按钮
```html
<!-- 桌面端版本 -->
<button class="bg-secondary-500 hover:bg-primary-600 text-bg-base font-cartoon font-bold px-4 py-2 rounded-lg border-2 border-bg-base shadow-pixel transition-all duration-200 hover:scale-105">
  按钮文字
</button>

<!-- 响应式版本 -->
<button class="bg-secondary-500 hover:bg-primary-600 text-bg-base font-cartoon font-bold px-3 md:px-4 py-2 rounded-lg border-2 border-bg-base shadow-pixel transition-all duration-200 hover:scale-105">
  <span class="text-sm md:text-base">按钮文字</span>
</button>
```

#### 图标按钮
```html
<!-- 桌面端版本 -->
<div class="w-12 h-12 bg-primary-600 hover:bg-secondary-500 rounded-lg shadow-pixel border-2 border-bg-base cursor-pointer flex items-center justify-center transition-all duration-200 hover:scale-105">
  <Icon name="icon-name" class="text-white text-lg" />
</div>

<!-- 响应式版本 -->
<div class="w-6 h-6 md:w-12 md:h-12 bg-primary-600 hover:bg-secondary-500 rounded-lg shadow-pixel border-2 border-bg-base cursor-pointer flex items-center justify-center transition-all duration-200 hover:scale-105">
  <Icon name="icon-name" class="text-white text-xs md:text-lg" />
</div>
```

### 3.2 卡片组件

#### 基础卡片
```html
<!-- 桌面端版本 -->
<div class="bg-white rounded-xl shadow-pixel border-4 border-bg-base p-8">
  <!-- 卡片内容 -->
</div>

<!-- 响应式版本 -->
<div class="bg-white rounded-lg md:rounded-xl shadow-pixel border-2 md:border-4 border-bg-base p-4 md:p-8">
  <!-- 卡片内容 -->
</div>
```

#### 悬停卡片
```html
<!-- 桌面端版本 -->
<div class="bg-white rounded-xl border-4 border-bg-base shadow-pixel p-6 hover:shadow-pixel-lg transition-all duration-200 hover:scale-[1.02]">
  <!-- 卡片内容 -->
</div>

<!-- 响应式版本 -->
<div class="bg-white rounded-lg md:rounded-xl border-2 md:border-4 border-bg-base shadow-pixel p-4 md:p-6 hover:shadow-pixel-lg transition-all duration-200 hover:scale-[1.02]">
  <!-- 卡片内容 -->
</div>
```

### 3.3 标签组件

#### 状态标签
```html
<!-- 桌面端版本 -->
<div class="bg-accent-400 text-bg-base font-cartoon font-bold px-3 py-1 rounded-lg border-2 border-bg-base shadow-pixel text-sm">
  标签文字
</div>

<!-- 响应式版本 -->
<div class="bg-accent-400 text-bg-base font-cartoon font-bold px-2 md:px-3 py-1 rounded-lg border-2 border-bg-base shadow-pixel text-xs md:text-sm">
  标签文字
</div>
```

#### 版本标签
```html
<!-- 桌面端版本 -->
<span class="bg-secondary-500 text-bg-base font-cartoon font-bold px-3 py-1 rounded-lg border-2 border-bg-base shadow-pixel text-sm">
  V1.0.0
</span>

<!-- 响应式版本 -->
<span class="bg-secondary-500 text-bg-base font-cartoon font-bold px-2 md:px-3 py-1 rounded-lg border-2 border-bg-base shadow-pixel text-xs md:text-sm">
  V1.0.0
</span>
```

### 3.4 头像组件

```html
<div class="w-32 h-32 rounded-xl overflow-hidden border-4 border-bg-base shadow-pixel">
  <img src="avatar.jpg" alt="avatar" class="w-full h-full object-cover">
</div>
```

### 3.5 输入框组件

```html
<input class="w-full px-4 py-3 rounded-lg border-4 border-bg-base shadow-pixel font-cartoon focus:outline-none focus:border-primary-600 bg-white">
```

---

## 4. 布局规范

### 4.1 页面布局

- **容器宽度**: `max-w-7xl mx-auto`
- **页面内边距**: `px-8 py-8`
- **区块间距**: `gap-8`
- **背景**: `bg-bg-paper`（旧报纸米白）
- **默认字体**: `font-cartoon`

### 4.2 网格系统

- 使用 8px 基线网格
- 所有间距必须是 8 的倍数
- 推荐间距：`8px`, `16px`, `24px`, `32px`, `48px`, `64px`

### 4.3 响应式断点

- **xs**: 480px（小屏手机）
- **sm**: 640px（大屏手机）
- **md**: 768px（平板）
- **lg**: 1024px（小屏笔记本）
- **pc**: 1140px（桌面）
- **xl**: 1280px（大屏桌面）

### 4.4 移动端布局规范

#### 4.4.1 间距优化
- **页面容器**: `px-4 md:px-8 py-4 md:py-8`（移动端减少内边距）
- **区块间距**: `gap-4 md:gap-8`（移动端使用较小间距）
- **组件间距**: `gap-3 md:gap-4`（移动端紧凑布局）
- **标签间距**: `gap-1 md:gap-2`（移动端最小间距）

#### 4.4.2 字体大小适配
- **主标题**: `text-lg md:text-2xl`（移动端减小字体）
- **正文**: `text-base md:text-lg`（移动端适中字体）
- **按钮文字**: `text-sm md:text-base`（移动端小字体）
- **标签文字**: `text-xs md:text-sm`（移动端最小字体）

#### 4.4.3 组件尺寸适配
- **图标按钮**: `w-6 h-6 md:w-8 md:h-8`（移动端缩小尺寸）
- **按钮内边距**: `px-3 md:px-6 py-2 md:py-3`（移动端减少内边距）
- **卡片内边距**: `p-4 md:p-6`（移动端紧凑内边距）
- **标签内边距**: `px-2 md:px-3`（移动端最小内边距）

#### 4.4.4 边框和圆角适配
- **卡片边框**: `border-2 md:border-4`（移动端细边框）
- **卡片圆角**: `rounded-lg md:rounded-xl`（移动端小圆角）
- **按钮边框**: `border-2 md:border-4`（移动端统一细边框）

#### 4.4.5 移动端设计原则
1. **内容优先**: 确保核心内容在小屏幕上清晰可见
2. **触摸友好**: 按钮和交互元素保持足够的点击区域
3. **紧凑布局**: 减少不必要的空白，提高内容密度
4. **渐进增强**: 从移动端基础样式开始，逐步增强桌面端体验
5. **性能优化**: 移动端优先考虑加载速度和交互响应

---

## 5. 交互动效

### 5.1 悬停效果

- **缩放**: `hover:scale-105` 或 `hover:scale-[1.02]`
- **阴影增强**: `hover:shadow-pixel-lg`
- **颜色变化**: 主色 ↔ 辅色切换
- **过渡时间**: `transition-all duration-200`

### 5.2 点击反馈

- 使用轻微的缩放动画
- 颜色瞬间变化提供即时反馈
- 避免过度动画，保持像素风格的简洁

### 5.3 页面过渡

- 使用 Vue 的 transition-group
- 淡入淡出 + 轻微位移
- 错开动画时间创造层次感

---

## 6. 图标使用规范

### 6.1 图标风格

- 优先使用简洁的线性图标
- 图标颜色与背景形成强对比
- 在像素风格容器中使用白色图标

### 6.2 图标尺寸

- **小图标**: `text-base` (16px)
- **中等图标**: `text-lg` (18px)
- **大图标**: `text-xl` (20px)
- **特大图标**: `text-2xl` (24px)

---

## 7. 文字排版

### 7.1 标题层级

- **H1**: `text-3xl font-pixel text-bg-base`（页面主标题）
- **H2**: `text-2xl font-pixel text-bg-base`（区块标题）
- **H3**: `text-xl font-cartoon font-bold text-bg-base`（子标题）
- **H4**: `text-lg font-cartoon font-bold text-bg-base`（小标题）

### 7.2 正文文字

- **正文**: `text-lg font-cartoon text-bg-base leading-relaxed`
- **描述文字**: `text-base font-cartoon text-bg-base`
- **小字**: `text-sm font-cartoon text-bg-base`

### 7.3 特殊文字

- **强调文字**: 使用 `font-bold` 和颜色变化
- **链接文字**: `text-primary-600 hover:text-secondary-500`
- **代码文字**: 保持原有的等宽字体

---

## 8. 背景装饰

### 8.1 像素网格背景

```html
<!-- 页面背景网格 -->
<div class="fixed inset-0 -z-10 opacity-10">
  <div class="w-full h-full" style="background-image: repeating-linear-gradient(0deg, #FF5C39 0px, #FF5C39 1px, transparent 1px, transparent 8px), repeating-linear-gradient(90deg, #FF5C39 0px, #FF5C39 1px, transparent 1px, transparent 8px);" />
</div>
```

### 8.2 装饰元素

- 使用几何形状作为装饰
- 保持像素风格的硬边设计
- 颜色使用主色系，透明度较低

---

## 9. 最佳实践

### 9.1 设计原则

1. **像素优先**: 所有元素都应体现像素游戏的硬边特征
2. **对比鲜明**: 使用高对比度的颜色组合
3. **网格对齐**: 严格遵循 8px 基线网格
4. **简洁明了**: 避免过度装饰，保持功能性
5. **一致性**: 在整个应用中保持视觉一致性

### 9.2 开发建议

1. **组件化**: 将常用的像素风格元素封装为组件
2. **复用性**: 使用 Tailwind 的 @apply 指令创建复用类
3. **性能**: 避免过度使用阴影和动画
4. **可访问性**: 确保颜色对比度符合无障碍标准

### 9.3 常见错误

❌ **避免**:
- 使用圆形元素（与像素风格冲突）
- 过度使用渐变效果
- 不规则的间距（非 8 的倍数）
- 过于复杂的动画效果
- 低对比度的颜色组合

✅ **推荐**:
- 方形/矩形设计元素
- 纯色填充
- 规整的 8px 网格间距
- 简洁的过渡动画
- 高对比度的颜色搭配

---

## 10. 组件库扩展

基于此规范，可以扩展以下组件：

- **PixelButton**: 像素风格按钮组件
- **PixelCard**: 像素风格卡片组件
- **PixelBadge**: 像素风格标签组件
- **PixelInput**: 像素风格输入框组件
- **PixelModal**: 像素风格弹窗组件
- **PixelNavigation**: 像素风格导航组件

每个组件都应严格遵循上述设计规范，确保整体风格的一致性。

---

## 11. 实际应用示例

### 11.1 首页布局

#### 桌面端版本
```html
<div class="flex flex-col gap-8 max-w-7xl mx-auto px-8 py-8 bg-bg-paper font-cartoon">
  <!-- 个人介绍卡片 -->
  <div class="bg-white rounded-xl shadow-pixel border-4 border-bg-base p-8">
    <!-- 内容 -->
  </div>
  
  <!-- 文章列表 -->
  <div class="space-y-6">
    <h2 class="text-2xl font-pixel text-bg-base">最近文章</h2>
    <div class="grid gap-4">
      <!-- 文章卡片 -->
    </div>
  </div>
</div>
```

#### 响应式版本（移动端优化）
```html
<div class="flex flex-col gap-4 md:gap-8 max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-8 bg-bg-paper font-cartoon">
  <!-- 个人介绍卡片 -->
  <div class="bg-white rounded-lg md:rounded-xl shadow-pixel border-2 md:border-4 border-bg-base p-4 md:p-8">
    <!-- 内容 -->
  </div>
  
  <!-- 文章列表 -->
  <div class="space-y-4 md:space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-lg md:text-2xl font-pixel text-bg-base">最近文章</h2>
      <button class="bg-secondary-500 hover:bg-primary-600 text-bg-base font-cartoon font-bold px-3 md:px-6 py-2 md:py-3 rounded-lg border-2 md:border-4 border-bg-base shadow-pixel">
        <span class="text-sm md:text-base">更多文章</span>
      </button>
    </div>
    <div class="grid gap-3 md:gap-4">
      <!-- 文章卡片 -->
      <div class="bg-white rounded-lg md:rounded-xl border-2 md:border-4 border-bg-base shadow-pixel p-4 md:p-6">
        <div class="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <div class="flex items-center gap-3 md:gap-4 flex-1">
            <div class="w-6 h-6 md:w-8 md:h-8 bg-primary-600 rounded-lg border-2 border-bg-base shadow-pixel flex items-center justify-center">
              <Icon name="icon-park-outline:right" class="text-white text-xs md:text-sm" />
            </div>
            <div class="text-base md:text-lg font-cartoon font-bold text-bg-base leading-tight">
              文章标题
            </div>
          </div>
          <div class="flex flex-wrap gap-1 md:gap-2">
            <span class="bg-accent-400 text-bg-base font-cartoon font-bold px-2 md:px-3 py-1 rounded-lg border-2 border-bg-base shadow-pixel text-xs md:text-sm">
              标签
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 11.2 导航栏

```html
<nav class="bg-white border-b-4 border-bg-base shadow-pixel">
  <div class="max-w-7xl mx-auto px-8 py-4">
    <!-- 导航内容 -->
  </div>
</nav>
```

### 11.3 表单元素

```html
<form class="space-y-6">
  <div>
    <label class="block text-lg font-cartoon font-bold text-bg-base mb-2">标题</label>
    <input class="w-full px-4 py-3 rounded-lg border-4 border-bg-base shadow-pixel font-cartoon focus:outline-none focus:border-primary-600 bg-white">
  </div>
  
  <button class="bg-primary-600 hover:bg-secondary-500 text-white font-cartoon font-bold px-6 py-3 rounded-xl border-4 border-bg-base shadow-pixel hover:shadow-pixel-lg transition-all duration-200 hover:scale-105">
    提交
  </button>
</form>
```

这个完善的设计规范文档将为后续的页面重构提供详细的指导，确保整个应用保持一致的 Eastward 像素风格。