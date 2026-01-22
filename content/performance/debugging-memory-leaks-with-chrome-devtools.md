---
title: 使用 Chrome DevTools 排查内存泄漏完全指南
date: 2026-01-22
lastmod: 2026-01-22
---

## 概述

内存泄漏是前端性能优化中最难排查的问题之一。本文将详细介绍如何使用 Chrome DevTools 的 Performance 和 Memory 面板，系统化地排查并定位内存泄漏问题，并映射到真实代码逻辑。

***

## 一、内存泄漏的识别

### 典型症状

* 页面运行一段时间后变卡

* 滚动、点击响应变慢

* 浏览器标签页显示内存占用持续增长

* 最终页面崩溃（Out of Memory）

### 快速检测

在控制台运行以下代码,观察内存是否持续增长：

```javascript
setInterval(() => {
  const usedMB = performance.memory.usedJSHeapSize / 1024 / 1024
  console.log(`当前内存占用: ${usedMB.toFixed(2)} MB`)
}, 1000)
```

***

## 二、Performance 面板：确认是否泄漏

### 录制内存快照

1. 打开 DevTools (F12) → Performance 标签
2. 勾选 **Memory** 选项
3. 点击 **Record** 录制 30-60 秒
4. 执行可疑操作（滚动列表、打开关闭弹窗等）
5. 停止录制

### 分析内存走势图

**正常情况**（有涨有跌,GC 能回收）：

```
Memory (MB)
  ↑     ╱╲      ╱╲      ╱╲
  │    ╱  ╲    ╱  ╲    ╱  ╲
  └─────────────────────────→ 时间
```

**内存泄漏**（持续上涨,呈阶梯状）：

```
Memory (MB)
  ↑   ╱──────╱─────╱─────╱──
  │  ╱      ╱     ╱     ╱
  └─────────────────────────→ 时间
```

**判断标准**：

* ✅ 正常：内存有涨有跌,GC 后能降下来

* ❌ 泄漏：内存持续上涨,GC 后仍然增长

***

## 三、Memory 面板：定位泄漏点

### 对比堆快照

**操作流程**：

1. DevTools → Memory 标签 → 选择 "Heap snapshot"
2. 点击 "Take snapshot" → 获得快照 1
3. 执行可疑操作（如打开 10 次弹窗后关闭）
4. 强制垃圾回收（点击 🗑️ 图标）
5. 点击 "Take snapshot" → 获得快照 2
6. 切换视图为 **Comparison** → 选择 "between Snapshot 1 and Snapshot 2"

**关键列说明**：

| 列名              | 含义       | 关注点              |
| --------------- | -------- | ---------------- |
| **# Delta**     | 净增加的对象数量 | 应该接近 0           |
| **Size Delta**  | 净增加的内存   | **最关键的指标**       |
| **Alloc. Size** | 新增对象占用内存 | 持续增长说明泄漏         |
| **Freed Size**  | 释放的内存    | 应该接近 Alloc. Size |

### 查找泄漏对象

按 **Size Delta** 排序,找到占用内存最多的对象类型：

```
Constructor              # Delta    Size Delta
─────────────────────────────────────────────
(array)                  +500       +2.5 MB    ← 可疑！数组持续增长
Detached HTMLDivElement  +200       +800 KB    ← DOM 泄漏
EventListener            +150       +150 KB    ← 事件监听器未移除
```

***

## 四、定位到真实代码

### 查看 Retainers（保留路径）

**这是最关键的环节！** Retainers 显示了为什么这个对象没有被垃圾回收。

**操作**：点击可疑对象 → 选择具体实例 → 右侧面板显示 **Retainers**

### 解读 Retainers 路径

**示例 1：全局变量引用**

```
Retainers:
  → Window / http://localhost:3000
    → VueComponent                ← Vue 组件实例
      → setupState                ← setup() 返回的状态
        → allData                  ← 你的变量名
          → @123456 (array)       ← 泄漏的数组
```

**如何对应到代码**：

* 看到 `allData` → 在代码中搜索 `const allData = ref(...)`

* 看到 `VueComponent` → 定位到具体的组件文件

**示例 2：事件监听器引用**

```
Retainers:
  → Window
    → eventListeners          ← 全局事件监听器映射
      → scroll                ← scroll 事件
        → [[Handler]]
          → VueComponent      ← 组件实例被闭包引用
```

**结论**：`scroll` 事件监听器没有被移除,闭包引用了组件实例。

***

## 五、常见内存泄漏模式

通过 Memory 面板,常见的泄漏对象类型：

### 5.1 DOM 泄漏

**现象**：
```
Constructor              # Delta    Size Delta
────────────────────────────────────────────
Detached HTMLDivElement  +200       +800 KB
```

**原因**：移除 DOM 时未清理事件监听器,导致元素无法被 GC

**解决**：在移除 DOM 前调用 `removeEventListener`

***

### 5.2 定时器泄漏

**现象**：
```
Constructor    # Delta    Size Delta
────────────────────────────────────
Timeout        +50        +100 KB
```

**原因**：组件销毁时定时器仍在运行

**解决**：在 `onUnmounted` 中调用 `clearInterval` / `clearTimeout`

***

### 5.3 事件监听器泄漏

**现象**：
```
Constructor      # Delta    Size Delta
──────────────────────────────────────
EventListener    +100       +200 KB
```

**原因**：全局事件监听器未移除

**解决**：在 `onUnmounted` 中调用 `window.removeEventListener`

***

### 5.4 组件实例泄漏

**现象**：
```
Constructor        # Delta    Size Delta
────────────────────────────────────────
VueComponent       +50        +5 MB
```

**原因**：事件总线监听器未注销,导致组件实例无法释放

**解决**：在 `onUnmounted` 中调用 `bus.off`

***

### 5.5 闭包引用大对象

**现象**：
```
Constructor    # Delta    Size Delta
────────────────────────────────────
(array)        +100       +10 MB
(closure)      +50        +500 KB
```

**原因**：事件处理函数闭包不必要地引用了大对象

**解决**：只保留必需的数据,或在使用后手动设为 `null`

***

## 六、实战案例：排查 Vue3 虚拟滚动内存泄漏

### 6.1 问题症状

Performance 面板录制 60 秒后发现：
- JS Heap 从 50MB 增长到 150MB
- 内存呈阶梯状持续增长
- 没有明显的 GC 回收

### 6.2 Memory 面板对比快照

```
Comparison (Snapshot 1 vs Snapshot 2)：

Constructor      # Delta    Size Delta
────────────────────────────────────────
(array)          +1        +50 MB      ← data 数组持续增长
EventListener    +1        +100 KB     ← scroll 监听器未清理
WebSocket        +1        +50 KB      ← WebSocket 未关闭
```

### 6.3 Retainers 定位代码

通过查看 Retainers 路径,找到 3 个泄漏点：

1. **data 数组**：`Window → VueComponent → setupState → data` 持续增长,没有限制大小
2. **scroll 监听器**：`Window → eventListeners → scroll` 未移除,闭包引用了 `data`
3. **WebSocket**：组件销毁时未关闭,回调闭包引用了 `data`

### 6.4 修复方案

根据 Retainers 路径,需要：
- 限制 `data` 数组最大长度
- 在 `onUnmounted` 中移除 `scroll` 监听器
- 在 `onUnmounted` 中关闭 WebSocket 连接
- 使用 `shallowRef` 优化大数据响应式开销

***

## 七、快速检查清单

Vue 3 组件中需要在 `onUnmounted` 清理的资源：

1. **定时器**：`clearInterval(timer)` / `clearTimeout(timer)`
2. **全局事件监听**：`window.removeEventListener('resize', handler)`
3. **WebSocket**：`ws.close()`
4. **第三方库实例**：`chart.dispose()` (如 ECharts)
5. **事件总线**：`bus.off('event', handler)`
6. **Observer**：`observer.disconnect()` (IntersectionObserver/ResizeObserver)
7. **大数据限制**：使用 `shallowRef` + 限制数组最大长度

***

## 八、总结

### 排查流程

1. **Performance 面板** → 确认是否泄漏（观察内存走势图）
2. **Memory 面板** → 对比快照,找到泄漏对象类型
3. **查看 Retainers** → 找到引用路径
4. **映射到代码** → 通过变量名定位文件和行号
5. **修复 + 验证** → 清理资源,再次录制确认修复

### 关键技巧

- **看 Retainers**：这是定位代码的关键,显示从 Window 到具体变量的完整路径
- **认识常见模式**：定时器、事件监听器、DOM 引用、闭包是主要原因
- **使用 shallowRef**：大数据场景必备,减少响应式开销
- **限制数据量**：虚拟滚动中必须限制数组大小
- **清理资源**：`onUnmounted` 中清理所有副作用

### 最佳实践

- ✅ 所有副作用都在 `onUnmounted` 中清理
- ✅ 使用 `shallowRef` 存储大数据
- ✅ 限制列表/数组的最大长度
- ✅ 避免闭包捕获大对象
- ✅ 定期用 DevTools 检查内存占用

***

## 参考资源

* [Chrome DevTools 官方文档 - Memory](https://developer.chrome.com/docs/devtools/memory-problems/)
* [Vue 3 性能优化指南](https://vuejs.org/guide/best-practices/performance.html)
* [JavaScript 内存管理 - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)

