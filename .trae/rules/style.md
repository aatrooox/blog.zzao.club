### UI设计规范

#### 设计风格 - 像素风格（Pixel Art Style）
- **像素艺术风格**：采用复古8位像素风格设计，营造怀旧游戏氛围
- **深色主题**：以深灰色系为主，配合青色、绿色、黄色等像素化强调色
- **像素化边框**：所有元素使用2px-4px的硬边边框，营造像素块效果
- **方块阴影**：使用多层方块阴影（box-shadow）模拟3D像素效果
- **等宽字体**：统一使用 Courier New、Consolas 等等宽字体
- **高对比度**：使用高对比度的颜色组合，确保像素风格的清晰可读
- **图标系统**：使用像素风格的emoji图标，配合像素化文字

#### 布局规范 - 像素风格布局
- **网格化布局**：所有元素基于8px网格系统对齐
- **卡片式布局**：使用像素化卡片，带有立体边框和阴影效果
- **响应式网格**：使用grid布局，在不同屏幕尺寸下保持像素比例
- **移动端适配**：在移动端保持像素风格的同时优化显示比例

```vue
<!-- ✅ 响应式布局示例 -->
<template>
  <!-- Web端：左侧导航 + 右侧内容 -->
  <div class="hidden lg:flex h-screen">
    <!-- 左侧导航栏 -->
    <aside class="w-64 bg-gray-900 border-r border-gray-800">
      <nav class="p-4">
        <!-- 导航菜单 -->
      </nav>
    </aside>
    
    <!-- 右侧内容区 -->
    <main class="flex-1 bg-gray-950 overflow-auto">
      <div class="p-6">
        <!-- 页面内容 -->
      </div>
    </main>
  </div>
  
  <!-- 移动端：上方内容 + 底部导航 -->
  <div class="lg:hidden flex flex-col h-screen">
    <!-- 上方内容区 -->
    <main class="flex-1 bg-gray-950 overflow-auto">
      <div class="p-4">
        <!-- 页面内容 -->
      </div>
    </main>
    
    <!-- 底部导航栏 -->
    <nav class="h-16 bg-gray-900 border-t border-gray-800">
      <!-- 底部导航菜单 -->
    </nav>
  </div>
</template>
```

#### 配色规范 - 像素风格配色
- **主色调**：以像素青色为核心强调色，黄色为主要对比色
- **配色方案**：
  - **主要强调色**：`oklch(70% 0.15 195)` - 像素青色，用于主要按钮、标签背景、重要状态
  - **次要强调色**：`oklch(75% 0.15 195)` - 淡青色，用于悬停状态、次要按钮
  - **标题强调色**：`oklch(84% 0.15 85)` - 像素黄色，用于标题、重要文字强调
  - **辅助色1**：`oklch(70% 0.15 220)` - 像素蓝色，用于信息提示、图表数据
  - **辅助色2**：`oklch(65% 0.15 25)` - 像素红色，用于错误状态、警告提示
  - **背景色**：
    - 主背景：`oklch(25% 0.05 250)` - 深灰色像素背景
    - 卡片背景：`oklch(30% 0.05 250)` - 中灰色像素卡片
    - 边框颜色：`oklch(40% 0.05 250)` - 像素边框色
  - **文字色**：
    - 主要文字：`oklch(90% 0.02 250)` - 像素亮白色
    - 次要文字：`oklch(75% 0.03 250)` - 像素中灰色
    - 禁用文字：`oklch(50% 0.03 250)` - 像素暗灰色

```vue
<!-- ✅ 配色使用示例 -->
<template>
  <div class="bg-gray-950 min-h-screen">
    <!-- 主要按钮 -->
    <button class="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg">
      主要操作
    </button>
    
    <!-- 信息卡片 -->
    <div class="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h3 class="text-gray-100 text-lg font-semibold">卡片标题</h3>
      <p class="text-gray-400 mt-2">卡片描述内容</p>
      
      <!-- 状态指示器 -->
      <div class="flex gap-2 mt-4">
        <span class="bg-emerald-600 text-white px-2 py-1 rounded text-sm">成功</span>
        <span class="bg-orange-500 text-white px-2 py-1 rounded text-sm">警告</span>
        <span class="bg-blue-600 text-white px-2 py-1 rounded text-sm">信息</span>
      </div>
    </div>
  </div>
</template>
```

#### 组件设计规范
- **间距规范**：
  - 组件内边距：16-24px (`p-4` 到 `p-6`)
  - 组件间距：16-24px (`gap-4` 或 `gap-6`)
  - 页面边距：24px (`p-6`)
- **阴影规范**：使用 Tailwind 的 `shadow-lg` 或 `shadow-xl` 为卡片添加深度
- **边框规范**：使用 `border-gray-800` 作为分割线和边框颜色
- **卡片设计规范**：
  - **主要信息卡片**：使用渐变背景或深色背景，大圆角，突出显示
  - **数据展示卡片**：半透明背景，清晰的数据层次
  - **功能按钮卡片**：矩形，图标+文字组合
  - **头像设计**：方形头像，带边框或阴影效果

#### 3.5 像素风格字体规范
- **主要字体**：使用等宽字体，确保像素风格统一性
  - 首选：`font-mono` (Courier New, Consolas, Monaco, monospace)
  - 备选：`ui-monospace`, `SFMono-Regular`, `Menlo`
- **字体权重**：
  - 标题：700 (bold) - 粗体像素效果
  - 正文：400 (normal) - 标准像素字体
  - 强调：600 (semibold) - 半粗体强调
- **字体大小**：
  - 大标题：text-2xl 到 text-4xl - 像素化大标题
  - 中标题：text-xl 到 text-2xl - 像素化中标题
  - 正文：text-base 到 text-lg - 像素化正文
  - 小字：text-sm 到 text-xs - 像素化小字

#### 3.6 像素风格边框规范
- **边框宽度**：2px-4px 硬边像素边框
- **边框样式**：使用 `border-2` 或 `border-4` 类
- **边框颜色**：严格按照配色规范使用
- **立体边框效果**：
  ```css
  .pixel-border {
    border: 2px solid #374151;
    box-shadow: 
      0 0 0 2px #1f2937,
      2px 2px 0 0 #4b5563;
  }
  ```

#### 3.7 像素风格阴影规范
- **方块阴影**：使用多层 `box-shadow` 模拟3D像素效果
- **阴影层级**：
  - 基础：2px 2px 0 0 #4b5563
  - 中级：2px 2px 0 0 #4b5563, 4px 4px 0 0 #374151
  - 高级：2px 2px 0 0 #4b5563, 4px 4px 0 0 #374151, 6px 6px 0 0 #1f2937
- **示例**：
  ```css
  .pixel-shadow {
    box-shadow: 
      2px 2px 0 0 #4b5563,
      4px 4px 0 0 #374151,
      6px 6px 0 0 #1f2937;
  }
  ```

#### 3.8 响应式设计规范
- **必须同时考虑移动端和PC端的用户体验**
- 使用移动优先（Mobile First）的设计理念
- **如果用户要求的样式不合理，必须提示该排版在移动端或PC端可能存在的问题**
- 确保关键功能在所有设备上都能正常使用
- **断点规范**：
  - `sm`: 640px+ (小型平板)
  - `md`: 768px+ (平板)
  - `lg`: 1024px+ (小型桌面)
  - `xl`: 1280px+ (桌面)
  - `2xl`: 1536px+ (大型桌面)

```vue
<!-- ✅ 完整响应式设计示例 -->
<template>
  <div class="min-h-screen bg-gray-950">
    <!-- Web端布局 -->
    <div class="hidden lg:flex h-screen">
      <!-- 左侧导航 -->
      <aside class="w-64 bg-gray-900 border-r border-gray-800">
        <!-- 导航内容 -->
      </aside>
      
      <!-- 右侧内容 -->
      <main class="flex-1 overflow-auto">
        <div class="p-6">
          <!-- 网格布局 -->
          <div class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
            <div class="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <!-- 卡片内容 -->
            </div>
          </div>
        </div>
      </main>
    </div>
    
    <!-- 移动端布局 -->
    <div class="lg:hidden flex flex-col h-screen">
      <!-- 内容区 -->
      <main class="flex-1 overflow-auto">
        <div class="p-4">
          <!-- 单列布局 -->
          <div class="space-y-4">
            <div class="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <!-- 卡片内容 -->
            </div>
          </div>
        </div>
      </main>
      
      <!-- 底部导航 -->
      <nav class="h-16 bg-gray-900 border-t border-gray-800">
        <!-- 导航菜单 -->
      </nav>
    </div>
  </div>
</template>
```

### 4. 样式开发规范

#### 4.1 Tailwind CSS v4 使用规范
- **完全使用 Tailwind CSS v4 进行样式开发**
- 优先使用 Tailwind 的原子类
- 充分利用 Tailwind 的响应式断点：`sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- 严格遵循上述配色规范，使用指定的颜色类
- 对于复杂样式，可以在 `<style>` 标签内使用 CSS

```vue
<!-- ✅ 推荐写法（符合设计规范） -->
<template>
  <div class="flex items-center justify-between p-6 bg-gray-900 border border-gray-800 rounded-lg shadow-lg">
    <h1 class="text-2xl font-bold text-gray-100">标题</h1>
    <button class="custom-gradient-button">按钮</button>
  </div>
</template>

<style scoped>
.custom-gradient-button {
  @apply px-6 py-2 rounded-lg text-white font-medium bg-cyan-600 hover:bg-cyan-500 transition-colors;
}

/* 自定义渐变（如需要） */
.custom-gradient {
  background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%);
}
</style>
```

#### 4.2 基础组件库使用规范
- **优先使用 shadcn-vue 提供的 UI 组件**
- 组件配置在 `components.json` 中
- 基础颜色使用 `zinc`，样式使用 `new-york`
- **如果需要的组件不存在，必须先提示用户使用 CLI 添加**

```bash
# 添加 shadcn-vue 组件
pnpm dlx shadcn-vue@latest add button
pnpm dlx shadcn-vue@latest add card
pnpm dlx shadcn-vue@latest add input
pnpm dlx shadcn-vue@latest add dialog
```

#### 4.3 动画组件库使用规范
- **优先使用 vue-bits 动画组件库**
- 官方文档：https://vue-bits.dev/
- **如果需要的动画组件不存在，必须先提示用户添加**

```bash
# 添加 vue-bits 动画组件（示例）
npx jsrepo add https://vue-bits.dev/ui/TextAnimations/SplitText
npx jsrepo add https://vue-bits.dev/ui/Animations/FadeIn
npx jsrepo add https://vue-bits.dev/ui/Animations/SlideIn
```

#### 4.4 动画插件使用规范
- **优先使用 GSAP 和 motion-v 作为动画插件**
- GSAP 用于复杂的时间轴动画和高性能动画
- motion-v 用于 Vue 3 的声明式动画

```vue
<!-- GSAP 使用示例 -->
<script setup lang="ts">
import { gsap } from 'gsap'

function animateElement() {
  gsap.to('.element', { duration: 1, x: 100, rotation: 360 })
}
</script>

<!-- motion-v 使用示例 -->
<template>
  <Motion
    :initial="{ opacity: 0, y: 20 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.5 }"
  >
    <div>动画内容</div>
  </Motion>
</template>
```

### 5. 像素风格组件规范

#### 5.1 像素按钮规范
```css
.pixel-btn {
  background: oklch(30% 0.05 250);
  border: 2px solid oklch(40% 0.05 250);
  color: oklch(90% 0.02 250);
  font-family: ui-monospace, monospace;
  padding: 8px 16px;
  box-shadow: 2px 2px 0 oklch(40% 0.05 250);
  transition: all 0.15s ease;
}
.pixel-btn:hover {
  background: oklch(35% 0.05 250);
  transform: translateY(-1px);
  box-shadow: 3px 3px 0 oklch(40% 0.05 250);
}
.pixel-btn:active {
  transform: translateY(1px);
  box-shadow: 1px 1px 0 oklch(40% 0.05 250);
}
```

#### 5.2 像素卡片规范
```css
.pixel-card {
  background: oklch(30% 0.05 250);
  border: 2px solid oklch(40% 0.05 250);
  box-shadow: 
    2px 2px 0 oklch(40% 0.05 250),
    4px 4px 0 oklch(35% 0.05 250);
  padding: 16px;
  margin: 8px;
}
```

#### 5.3 像素状态指示器
- **在线状态**：绿色像素点 `oklch(70% 0.15 145)`
- **离线状态**：红色像素点 `oklch(65% 0.15 25)`
- **警告状态**：黄色像素点 `oklch(75% 0.15 85)`
- **未知状态**：灰色像素点 `oklch(50% 0.05 250)`

#### 5.4 像素进度条
```css
.pixel-progress-bar {
  background: oklch(25% 0.05 250);
  border: 2px solid oklch(40% 0.05 250);
  height: 16px;
  position: relative;
}
.pixel-progress-fill {
  background: oklch(70% 0.15 195);
  height: 100%;
  transition: width 0.3s ease;
}
```

#### 5.5 像素风格响应式适配
- **像素网格系统**：基于8px网格对齐所有元素
- **移动端适配**：
  - 调整像素边框为1px（移动端优化）
  - 保持字体清晰可读
  - 确保触摸目标足够大
- **PC端优化**：
  - 完整像素化效果展示
  - 增强交互反馈
  - 保持像素风格一致性
