---
title: 使用 Chrome DevTools 排查内存泄漏完全指南
date: 2026-01-22
lastmod: "2026-01-22T08:00:15.428Z"
---

## 概述

内存泄漏是前端性能优化中最难排查的问题之一。本文将详细介绍如何使用 Chrome DevTools 的 Performance 和 Memory 面板，系统化地排查并定位内存泄漏问题，并映射到真实代码逻辑。

***

## 一、内存泄漏的识别

### 1.1 典型症状

内存泄漏通常表现为以下症状：

* 页面运行一段时间后变卡

* 滚动、点击响应变慢

* 浏览器标签页显示内存占用持续增长

* 最终页面崩溃（Out of Memory）

### 1.2 快速检测方法

在控制台运行以下代码，观察内存是否持续增长：

```javascript
setInterval(() => {
  const usedMB = performance.memory.usedJSHeapSize / 1024 / 1024
  console.log(`当前内存占用: ${usedMB.toFixed(2)} MB`)
}, 1000)
```

***

## 二、Performance 面板：确认是否泄漏

### 2.1 录制内存快照

**操作步骤**：

1. 打开 Chrome DevTools（F12）
2. 切换到 **Performance** 标签
3. 勾选 **Memory** 选项（显示内存走势图）
4. 点击 **Record** 开始录制
5. 执行可疑操作（如滚动列表、打开关闭弹窗、切换路由等）
6. 持续操作 30-60 秒
7. 点击 **Stop** 停止录制

### 2.2 分析内存走势图

**正常情况**（有涨有跌，GC 能回收）：

```
Memory (MB)
  ↑
  │     ╱╲      ╱╲      ╱╲
  │    ╱  ╲    ╱  ╲    ╱  ╲
  │   ╱    ╲  ╱    ╲  ╱    ╲
  └─────────────────────────────→ 时间
```

**内存泄漏**（持续上涨，呈阶梯状）：

```
Memory (MB)
  ↑
  │   ╱──────╱─────╱─────╱──
  │  ╱      ╱     ╱     ╱
  │ ╱      ╱     ╱     ╱
  └─────────────────────────────→ 时间
```

**判断标准**：

* ✅ **正常**：内存有涨有跌，垃圾回收（GC）后能降下来

* ❌ **泄漏**：内存持续上涨，GC 后仍然增长

***

## 三、Memory 面板：定位泄漏点

### 3.1 对比堆快照（Heap Snapshot）

### 步骤 1：录制快照

```
操作流程：
1. DevTools → Memory 标签
2. 选择 "Heap snapshot"
3. 点击 "Take snapshot" → 获得快照 1
4. 执行可疑操作（如打开 10 次弹窗后关闭）
5. 强制垃圾回收（点击 🗑️ 图标）
6. 点击 "Take snapshot" → 获得快照 2
7. 重复步骤 4-6，获得快照 3
```

### 步骤 2：对比快照

在左上角下拉菜单中：

* 将视图从 **Summary** 切换为 **Comparison**

* 选择 "between Snapshot 1 and Snapshot 2"

### 步骤 3：理解关键列

| 列名              | 含义       | 关注点              |
| --------------- | -------- | ---------------- |
| **# New**       | 新增的对象数量  | > 0 且很大时可疑       |
| **# Deleted**   | 删除的对象数量  | 应该接近 # New       |
| **# Delta**     | 净增加的对象数量 | 应该接近 0           |
| **Alloc. Size** | 新增对象占用内存 | 持续增长说明泄漏         |
| **Freed Size**  | 释放的内存    | 应该接近 Alloc. Size |
| **Size Delta**  | 净增加的内存   | **最关键的指标**       |

### 3.2 查找泄漏对象

按 **Size Delta** 排序，找到占用内存最多的对象类型：

```
示例输出：
Constructor              # Delta    Size Delta
─────────────────────────────────────────────
(array)                  +500       +2.5 MB    ← 可疑！数组持续增长
Detached HTMLDivElement  +200       +800 KB    ← DOM 泄漏
EventListener            +150       +150 KB    ← 事件监听器未移除
Timeout                  +100       +50 KB     ← 定时器未清理
```

***

## 四、定位到真实代码

### 4.1 查看 Retainers（保留路径）

**这是最关键的环节！** Retainers 显示了为什么这个对象没有被垃圾回收。

**操作步骤**：

1. 点击可疑对象类型（如 `(array)`）展开
2. 选择具体的实例（如 `@123456`）
3. 右侧面板会显示 **Retainers**（保留路径）

### 4.2 解读 Retainers 路径

**示例 1：全局变量引用**

```
Retainers (保留路径)
  → Window / http://localhost:3000
    → devices                    ← 全局变量名
      → VueComponent                ← Vue 组件实例
        → setupState                ← setup() 返回的状态
          → allData                  ← 你的变量名
            → [[FiberNode]]
              → @123456 (array)     ← 泄漏的数组
```

**解读**：

* 从 `Window`（全局对象）出发

* 通过 `VueComponent`（某个组件）

* 到达 `setupState.allData`（你定义的变量）

* 引用了泄漏的数组

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
          → [[Scopes]]
            → VueComponent    ← 组件实例被闭包引用
```

**解读**：

* `scroll` 事件监听器没有被移除

* 监听器的回调函数（闭包）引用了组件实例

* 导致组件销毁后仍无法被回收

***

## 五、常见内存泄漏模式

### 5.1 DOM 泄漏（Detached HTMLElement）

### 现象

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

### 6.1 问题代码

```vue
<script setup>
import { ref, onMounted } from 'vue'

const data = ref([])
let ws = null

onMounted(() => {
  // 初始化数据
  data.value = Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Item ${i}` }))
  
  // WebSocket 连接
  ws = new WebSocket('ws://localhost:8080')
  ws.onmessage = (event) => {
    const newItem = JSON.parse(event.data)
    data.value.push(newItem) // ❌ 数据无限增长
  }
  
  // 滚动监听
  window.addEventListener('scroll', handleScroll) // ❌ 未清理
})

function handleScroll() {
  console.log('scrolling')
}

// ❌ 没有 onUnmounted 清理
</script>
```

### 6.2 排查步骤

### 步骤 1：Performance 面板观察

录制 60 秒后发现：

* JS Heap 从 50MB 增长到 150MB

* 没有明显的 GC 回收

* 内存呈阶梯状持续增长 ← **确认有泄漏**

### 步骤 2：Memory 面板对比快照

```
Comparison (Snapshot 1 vs Snapshot 2)：

Constructor      # Delta    Size Delta
────────────────────────────────────────
(array)          +1        +50 MB      ← data 数组持续增长
EventListener    +1        +100 KB     ← scroll 监听器未清理
WebSocket        +1        +50 KB      ← WebSocket 未关闭
```

### 步骤 3：展开 (array) 查看 Retainers

```
Retainers:
  → Window
    → VueComponent (VirtualList.vue)
      → setupState
        → data                  ← 找到了！是 data.value
          → [[FiberNode]]
            → @789012 (array)   ← 10000+ 条数据
```

**结论**：`data` 变量持续增长，没有限制大小。

### 步骤 4：展开 EventListener 查看 Retainers

```
Retainers:
  → Window
    → eventListeners
      → scroll
        → [[Handler]]: handleScroll
          → [[Scopes]]
            → Closure (setup)
              → data            ← handleScroll 闭包引用了 data
```

**结论**：`scroll` 监听器没有被移除，且闭包引用了 `data`。

### 步骤 5：展开 WebSocket 查看 Retainers

```
Retainers:
  → Window
    → WebSocket
      → onmessage
        → [[Handler]]
          → [[Scopes]]
            → data              ← WebSocket 回调闭包引用了 data
```

**结论**：组件销毁时 WebSocket 没有关闭。

### 6.3 修复代码

```vue
<script setup>
import { shallowRef, onMounted, onUnmounted, triggerRef } from 'vue'

const data = shallowRef([]) // ✅ 使用 shallowRef 优化性能
let ws = null

onMounted(() => {
  // 初始化数据
  data.value = Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Item ${i}` }))
  
  // WebSocket 连接
  ws = new WebSocket('ws://localhost:8080')
  ws.onmessage = (event) => {
    const newItem = JSON.parse(event.data)
    data.value.push(newItem)
    
    // ✅ 限制数据量
    if (data.value.length > 5000) {
      data.value.splice(0, data.value.length - 5000) // 删除旧数据
    }
    
    triggerRef(data)
  }
  
  // 滚动监听
  window.addEventListener('scroll', handleScroll, { passive: true })
})

// ✅ 清理资源
onUnmounted(() => {
  // 移除事件监听器
  window.removeEventListener('scroll', handleScroll)
  
  // 关闭 WebSocket
  if (ws) {
    ws.close()
    ws = null
  }
  
  // 清空数据
  data.value = []
})

function handleScroll() {
  console.log('scrolling')
}
</script>
```

***

## 七、快速检查清单

### Vue 3 组件中的常见泄漏点

```javascript
export default {
  setup() {
    // ✅ 1. 定时器
    const timer = setInterval(() => {}, 1000)
    onUnmounted(() => clearInterval(timer))
    
    // ✅ 2. 全局事件监听
    const handleResize = () => {}
    window.addEventListener('resize', handleResize)
    onUnmounted(() => window.removeEventListener('resize', handleResize))
    
    // ✅ 3. WebSocket
    const ws = new WebSocket('ws://...')
    onUnmounted(() => ws.close())
    
    // ✅ 4. 第三方库实例（如 ECharts）
    const chart = echarts.init(el)
    onUnmounted(() => chart.dispose())
    
    // ✅ 5. 事件总线
    bus.on('event', handler)
    onUnmounted(() => bus.off('event', handler))
    
    // ✅ 6. IntersectionObserver / ResizeObserver
    const observer = new IntersectionObserver(() => {})
    observer.observe(el)
    onUnmounted(() => observer.disconnect())
    
    // ✅ 7. 大数据限制
    const data = shallowRef([])
    function limitSize() {
      if (data.value.length > MAX_SIZE) {
        data.value.splice(0, data.value.length - MAX_SIZE)
      }
    }
    
    return { /* ... */ }
  }
}
```

***

## 八、性能优化建议

### 8.1 使用 shallowRef 优化大数据

对于大数据量场景（> 1000 条），使用 `shallowRef` 代替 `ref`：

```javascript
import { shallowRef, triggerRef } from 'vue'

// ✅ 只追踪 .value 本身，不追踪数组内部元素
const data = shallowRef([/* 10000 条数据 */])

// 更新数据
function updateData(newItems) {
  data.value.push(...newItems)
  triggerRef(data) // 手动触发更新
}
```

**性能提升**：

* 初始化时间：快 30 倍

* 内存占用：减少 30-50%

* 更新性能：提升 10 倍以上

### 8.2 自动化内存监控

在开发环境添加内存监控脚本：

```javascript
if (process.env.NODE_ENV === 'development') {
  let lastHeapSize = 0
  
  setInterval(() => {
    const currentHeap = performance.memory.usedJSHeapSize
    const delta = currentHeap - lastHeapSize
    
    if (delta > 5 * 1024 * 1024) { // 增长超过 5MB
      console.warn('⚠️ 可能存在内存泄漏！')
      console.log('内存增长:', (delta / 1024 / 1024).toFixed(2), 'MB')
    }
    
    lastHeapSize = currentHeap
  }, 5000)
}
```

***

## 九、总结

### 9.1 排查流程

```
1. Performance 面板
   → 确认是否泄漏（观察内存走势图）

2. Memory 面板
   → 对比快照，找到泄漏对象类型

3. 查看 Retainers
   → 找到引用路径

4. 映射到代码
   → 通过变量名定位文件和行号

5. 修复 + 验证
   → 清理资源，再次录制确认修复
```

### 9.2 关键技巧

| 技巧                | 说明                              |
| ----------------- | ------------------------------- |
| **看 Retainers**   | 这是定位代码的关键，显示从 Window 到具体变量的完整路径 |
| **认识常见模式**        | 定时器、事件监听器、DOM 引用、闭包是主要原因        |
| **使用 shallowRef** | 大数据场景必备，减少响应式开销                 |
| **限制数据量**         | 虚拟滚动中必须限制数组大小                   |
| **清理资源**          | `onUnmounted` 中清理所有副作用          |

### 9.3 最佳实践

* ✅ 所有副作用都在 `onUnmounted` 中清理

* ✅ 使用 `shallowRef` 存储大数据

* ✅ 限制列表/数组的最大长度

* ✅ 避免闭包捕获大对象

* ✅ 定期用 DevTools 检查内存占用

* ✅ 在开发环境启用自动化监控

***

## 参考资源

* [Chrome DevTools 官方文档 - Memory](https://developer.chrome.com/docs/devtools/memory-problems/)

* [Vue 3 性能优化指南](https://vuejs.org/guide/best-practices/performance.html)

* [JavaScript 内存管理 - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)

