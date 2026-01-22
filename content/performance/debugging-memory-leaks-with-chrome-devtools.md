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

- 页面运行一段时间后变卡
- 滚动、点击响应变慢
- 浏览器标签页显示内存占用持续增长
- 最终页面崩溃（Out of Memory）

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
- ✅ 正常：内存有涨有跌,GC 后能降下来
- ❌ 泄漏：内存持续上涨,GC 后仍然增长

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
- 看到 `allData` → 在代码中搜索 `const allData = ref(...)`
- 看到 `VueComponent` → 定位到具体的组件文件

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

### 5.1 DOM 泄漏

移除 DOM 时未清理事件监听器,导致元素无法被 GC。

```javascript
// ❌ 问题
function closeModal() {
  document.body.removeChild(modal) // DOM 被移除但 handler 闭包仍引用它
}

// ✅ 修复
function closeModal() {
  modal.removeEventListener('click', handler)
  document.body.removeChild(modal)
}
```

***

### 5.2 定时器泄漏

组件销毁时定时器仍在运行。

```vue
<script setup>
let timer = null

onMounted(() => {
  timer = setInterval(() => fetchData(), 1000)
})

onUnmounted(() => {
  clearInterval(timer) // ✅ 必须清理
  timer = null
})
</script>
```

***

### 5.3 事件监听器泄漏

全局事件监听器未移除。

```vue
<script setup>
function handleScroll() { /* ... */ }

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll) // ✅ 必须清理
})
</script>
```

***

### 5.4 Event Bus 泄漏

事件总线监听器未注销,导致组件实例无法释放。

```vue
<script setup>
const bus = inject('eventBus')

function handleUpdate(data) { /* ... */ }

onMounted(() => {
  bus.on('data-update', handleUpdate)
})

onUnmounted(() => {
  bus.off('data-update', handleUpdate) // ✅ 必须注销
})
</script>
```

***

### 5.5 闭包引用大对象

事件处理函数闭包不必要地引用了大对象。

```javascript
// ❌ 问题:闭包引用了整个 largeData,即使不需要
function setupComponent() {
  const largeData = Array.from({ length: 10000 }, () => ({ /* ... */ }))
  document.getElementById('btn').addEventListener('click', () => {
    console.log('clicked')
  })
}

// ✅ 修复:只保留需要的数据
function setupComponent() {
  const largeData = Array.from({ length: 10000 }, () => ({ /* ... */ }))
  const summary = { count: largeData.length }
  
  // 闭包只引用小对象
  document.getElementById('btn').addEventListener('click', () => {
    console.log('Summary:', summary)
  })
}
```
Constructor              # Delta    Size Delta
────────────────────────────────────────────
Detached HTMLDivElement  +200       +800 KB
```

### 问题代码

```javascript
// ❌ 问题代码
function setupModal() {
  const modal = document.createElement('div')
  document.body.appendChild(modal)
  
  modal.addEventListener('click', function handler() {
    console.log('clicked')
  })
  
  // 关闭弹窗时只移除 DOM，没有移除事件监听器
  function closeModal() {
    document.body.removeChild(modal) // DOM 被移除
    // ❌ 但 handler 闭包仍然引用着 modal，导致 modal 无法被 GC
  }
}
```

### 修复方法

```javascript
// ✅ 正确做法
function setupModal() {
  const modal = document.createElement('div')
  document.body.appendChild(modal)
  
  function handler() {
    console.log('clicked')
  }
  
  modal.addEventListener('click', handler)
  
  function closeModal() {
    modal.removeEventListener('click', handler) // ✅ 移除监听器
    document.body.removeChild(modal)
  }
  
  return closeModal
}
```

***

### 5.2 定时器泄漏（Timeout / Interval）

### 现象

```
Constructor    # Delta    Size Delta
────────────────────────────────────
Timeout        +50        +100 KB
```

### 问题代码

```javascript
// ❌ 问题代码
export default {
  mounted() {
    setInterval(() => {
      this.fetchData()
    }, 1000)
  }
  // ❌ 组件销毁时定时器仍在运行
}
```

### 修复方法

```vue
<script setup>
import { onMounted, onUnmounted } from 'vue'

let timer = null

onMounted(() => {
  timer = setInterval(() => {
    fetchData()
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer) // ✅ 清理定时器
    timer = null
  }
})
</script>
```

***

### 5.3 事件监听器泄漏（EventListener）

### 现象

```
Constructor      # Delta    Size Delta
──────────────────────────────────────
EventListener    +100       +200 KB
```

### 问题代码

```javascript
// ❌ 问题代码
export default {
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    window.addEventListener('resize', this.handleResize)
  }
  // ❌ 组件销毁时事件监听器仍在
}
```

### 修复方法

```vue
<script setup>
import { onMounted, onUnmounted } from 'vue'

function handleScroll() { /* ... */ }
function handleResize() { /* ... */ }

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll) // ✅ 清理
  window.removeEventListener('resize', handleResize)
})
</script>
```

***

### 5.4 Vue 组件实例泄漏

### 现象

```
Constructor        # Delta    Size Delta
────────────────────────────────────────
VueComponent       +50        +5 MB
```

### 问题代码

```javascript
// ❌ 问题代码
// main.js
const eventBus = mitt()
app.config.globalProperties.$bus = eventBus

// 组件中
export default {
  mounted() {
    this.$bus.on('data-update', this.handleUpdate)
  }
  // ❌ 组件销毁时没有 off，导致组件实例被 eventBus 持有
}
```

### 修复方法

```vue
<script setup>
import { getCurrentInstance, onMounted, onUnmounted } from 'vue'

const instance = getCurrentInstance()
const bus = instance.appContext.config.globalProperties.$bus

function handleUpdate(data) { /* ... */ }

onMounted(() => {
  bus.on('data-update', handleUpdate)
})

onUnmounted(() => {
  bus.off('data-update', handleUpdate) // ✅ 移除监听
})
</script>
```

***

### 5.5 闭包引用大对象

### 现象

```
Constructor    # Delta    Size Delta
────────────────────────────────────
(array)        +100       +10 MB
(closure)      +50        +500 KB
```

### 问题代码

```javascript
// ❌ 问题代码
function setupComponent() {
  const largeData = Array.from({ length: 10000 }, () => ({ /* ... */ }))
  
  // 事件处理函数形成闭包，引用了整个 largeData
  document.getElementById('btn').addEventListener('click', () => {
    console.log('clicked')
    // 这个函数不需要 largeData，但闭包仍然引用了它
  })
}
```

### 修复方法

```javascript
// ✅ 方法1：避免不必要的闭包
function setupComponent() {
  const largeData = Array.from({ length: 10000 }, () => ({ /* ... */ }))
  
  // 处理数据后释放引用
  processData(largeData)
  largeData = null // 手动释放
  
  // 事件处理函数定义在外部，不形成闭包
  document.getElementById('btn').addEventListener('click', handleClick)
}

function handleClick() {
  console.log('clicked')
}

// ✅ 方法2：只保留需要的数据
function setupComponent() {
  const largeData = Array.from({ length: 10000 }, () => ({ /* ... */ }))
  
  // 只提取需要的信息
  const summary = {
    count: largeData.length,
    total: largeData.reduce((sum, item) => sum + item.value, 0)
  }
  
  // 闭包只引用小对象
  document.getElementById('btn').addEventListener('click', () => {
    console.log('Summary:', summary)
  })
}
```

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

### 6.4 修复代码

```vue
<script setup>
import { shallowRef, onMounted, onUnmounted, triggerRef } from 'vue'

const data = shallowRef([])
let ws = null

onMounted(() => {
  data.value = Array.from({ length: 10000 }, (_, i) => ({ 
    id: i, 
    name: `Item ${i}` 
  }))
  
  ws = new WebSocket('ws://localhost:8080')
  ws.onmessage = (event) => {
    const newItem = JSON.parse(event.data)
    data.value.push(newItem)
    
    // ✅ 限制数据量
    if (data.value.length > 5000) {
      data.value.splice(0, data.value.length - 5000)
    }
    
    triggerRef(data)
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (ws) {
    ws.close()
    ws = null
  }
  data.value = []
})

function handleScroll() {
  console.log('scrolling')
}
</script>
```

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

## 八、性能优化建议

### 8.1 使用 shallowRef 优化大数据

对于大数据量场景（> 1000 条），使用 `shallowRef` 代替 `ref`：

```javascript
import { shallowRef, triggerRef } from 'vue'

const data = shallowRef([/* 10000 条数据 */])

// 更新数据
function updateData(newItems) {
  data.value.push(...newItems)
  triggerRef(data) // 手动触发更新
}
```

**性能提升**：初始化快 30 倍，内存减少 30-50%，更新提升 10 倍以上

### 8.2 自动化内存监控

在开发环境添加内存监控：

```javascript
if (process.env.NODE_ENV === 'development') {
  let lastHeapSize = 0
  setInterval(() => {
    const currentHeap = performance.memory.usedJSHeapSize
    const delta = currentHeap - lastHeapSize
    if (delta > 5 * 1024 * 1024) { // 增长超过 5MB
      console.warn('⚠️ 可能存在内存泄漏！')
    }
    lastHeapSize = currentHeap
  }, 5000)
}
```

***

## 九、总结

### 排查流程

1. **Performance 面板** → 确认是否泄漏（观察内存走势图）
2. **Memory 面板** → 对比快照，找到泄漏对象类型
3. **查看 Retainers** → 找到引用路径
4. **映射到代码** → 通过变量名定位文件和行号
5. **修复 + 验证** → 清理资源，再次录制确认修复

### 关键技巧

- **看 Retainers**：这是定位代码的关键，显示从 Window 到具体变量的完整路径
- **认识常见模式**：定时器、事件监听器、DOM 引用、闭包是主要原因
- **使用 shallowRef**：大数据场景必备，减少响应式开销
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

