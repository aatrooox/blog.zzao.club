---
title: 7.Node.js Event Loop - 标准答案
date: "2026-01-21T07:21:00.000Z"
lastmod: "2026-01-21T07:21:00.000Z"
---

## 题目

**考察点**：Node.js 核心原理、事件循环、宏任务微任务

**问题**：解释 Node.js 的 Event Loop 机制，并说明以下代码的执行顺序：

```javascript
console.log(1)

setTimeout(() => {
  console.log(2)
  Promise.resolve().then(() => console.log(3))
}, 0)

Promise.resolve().then(() => console.log(4))

setTimeout(() => {
  console.log(5)
}, 0)

console.log(6)
```

---

## 标准答案

### 正确输出顺序

```
1
6
4
2
3
5
```

### 执行过程详解

```
执行栈：
1. console.log(1)  → 输出 1
2. setTimeout(..., 0) → 注册宏任务（timers 队列）
3. Promise.resolve().then(...) → 注册微任务
4. setTimeout(..., 0) → 注册宏任务（timers 队列）
5. console.log(6)  → 输出 6

同步代码执行完毕，开始 Event Loop：

第1轮循环：
  - 清空微任务队列：console.log(4) → 输出 4
  - 执行宏任务（timers）：第1个 setTimeout
    - console.log(2) → 输出 2
    - Promise.resolve().then(...) → 注册微任务
  - 清空微任务队列：console.log(3) → 输出 3

第2轮循环：
  - 执行宏任务（timers）：第2个 setTimeout
    - console.log(5) → 输出 5
```

---

## Event Loop 完整机制

### 1. Node.js Event Loop 的 6 个阶段

```
   ┌───────────────────────────┐
┌─>│           timers          │  执行 setTimeout/setInterval 回调
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │  执行延迟到下一轮的 I/O 回调
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │  仅内部使用
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │  执行 setImmediate 回调
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │  执行 socket.on('close', ...) 回调
   └───────────────────────────┘
```

**各阶段说明**：

| 阶段 | 说明 | 示例 |
|------|------|------|
| **timers** | 执行 `setTimeout` 和 `setInterval` 回调 | setTimeout(fn, 0) |
| **pending callbacks** | 执行系统操作的回调（如 TCP 错误） | - |
| **idle, prepare** | 内部使用 | - |
| **poll** | 获取新的 I/O 事件，执行 I/O 回调 | fs.readFile |
| **check** | 执行 `setImmediate` 回调 | setImmediate(fn) |
| **close callbacks** | 执行 close 事件回调 | socket.on('close', fn) |

---

### 2. 微任务（Microtask）

**微任务在每个阶段结束后执行**：

```javascript
// 微任务类型
process.nextTick(callback)  // 优先级最高
Promise.resolve().then(callback)
queueMicrotask(callback)
async/await
```

**执行顺序**：

```
每个宏任务阶段结束后：
1. 清空 process.nextTick 队列
2. 清空 Promise 微任务队列
3. 进入下一个宏任务阶段
```

---

### 3. setTimeout vs setImmediate

```javascript
// 情况1：在主模块中（非 I/O 回调）
setTimeout(() => console.log('timeout'), 0)
setImmediate(() => console.log('immediate'))

// 输出顺序不确定！
// 原因：setTimeout(fn, 0) 实际是 setTimeout(fn, 1)
//       如果事件循环启动用时 < 1ms，先执行 setImmediate
//       如果事件循环启动用时 >= 1ms，先执行 setTimeout
```

```javascript
// 情况2：在 I/O 回调中
const fs = require('fs')

fs.readFile(__filename, () => {
  setTimeout(() => console.log('timeout'), 0)
  setImmediate(() => console.log('immediate'))
})

// 输出顺序固定：
// immediate
// timeout

// 原因：I/O 回调在 poll 阶段执行
//       setImmediate 在下一个 check 阶段立即执行
//       setTimeout 需要等到下一轮 Event Loop 的 timers 阶段
```

---

### 4. process.nextTick vs Promise

```javascript
console.log('start')

process.nextTick(() => {
  console.log('nextTick 1')
  process.nextTick(() => {
    console.log('nextTick 2')
  })
})

Promise.resolve().then(() => {
  console.log('promise 1')
  Promise.resolve().then(() => {
    console.log('promise 2')
  })
})

console.log('end')

// 输出顺序：
// start
// end
// nextTick 1
// nextTick 2  ← nextTick 优先级更高，递归执行完
// promise 1
// promise 2
```

**优先级**：
```
process.nextTick > Promise.then > setTimeout > setImmediate
```

---

### 5. 复杂示例分析

```javascript
console.log('1')

setTimeout(() => {
  console.log('2')
  process.nextTick(() => console.log('3'))
}, 0)

setTimeout(() => {
  console.log('4')
  process.nextTick(() => console.log('5'))
}, 0)

process.nextTick(() => console.log('6'))

console.log('7')

// 输出顺序分析：

// 同步代码：
1, 7

// 第1轮 Event Loop：
// - 微任务（process.nextTick）：
6

// - 宏任务（timers 第1个 setTimeout）：
2
// - 微任务（process.nextTick）：
3

// - 宏任务（timers 第2个 setTimeout）：
4
// - 微任务（process.nextTick）：
5

// 最终输出：
// 1, 7, 6, 2, 3, 4, 5
```

---

### 6. async/await 与 Event Loop

```javascript
async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')  // 相当于 Promise.then
}

async function async2() {
  console.log('async2')
}

console.log('script start')

setTimeout(() => {
  console.log('setTimeout')
}, 0)

async1()

new Promise(resolve => {
  console.log('promise1')
  resolve()
}).then(() => {
  console.log('promise2')
})

console.log('script end')

// 输出顺序：
// script start
// async1 start
// async2
// promise1
// script end
// async1 end  ← await 后面的代码进入微任务队列
// promise2
// setTimeout
```

**await 的本质**：

```javascript
// 这段代码：
async function fn() {
  await somePromise()
  console.log('after await')
}

// 等价于：
function fn() {
  return somePromise().then(() => {
    console.log('after await')
  })
}
```

---

## 浏览器 vs Node.js Event Loop

| 特性 | 浏览器 | Node.js |
|------|--------|---------|
| 宏任务 | setTimeout、setInterval、I/O、UI 渲染 | setTimeout、setImmediate、I/O |
| 微任务 | Promise、MutationObserver | Promise、process.nextTick |
| 执行顺序 | 每次执行 1 个宏任务 → 清空所有微任务 | 每个阶段执行所有宏任务 → 清空所有微任务 |
| 特殊 API | 无 | `process.nextTick`（优先级最高） |

---

## 常见面试陷阱

### 陷阱1：setTimeout(fn, 0) 并非真正的 0ms

```javascript
setTimeout(() => console.log('timeout'), 0)

// 实际延迟：
// - 浏览器：至少 4ms（HTML5 标准）
// - Node.js：至少 1ms
```

### 陷阱2：process.nextTick 可能导致饿死

```javascript
// ❌ 危险代码
function recursiveNextTick() {
  process.nextTick(recursiveNextTick)
}
recursiveNextTick()

// 问题：nextTick 优先级太高，会一直递归，阻塞 Event Loop
// 其他 I/O 操作永远无法执行
```

### 陷阱3：微任务插队

```javascript
setTimeout(() => {
  console.log('timeout 1')
  Promise.resolve().then(() => console.log('promise'))
  setTimeout(() => console.log('timeout 2'), 0)
}, 0)

// 输出顺序：
// timeout 1
// promise  ← 微任务插队，比 timeout 2 先执行
// timeout 2
```

---

## 最佳实践

1. **理解宏任务和微任务的区别**
2. **避免滥用 process.nextTick**（可能阻塞 Event Loop）
3. **I/O 回调中优先使用 setImmediate**（而非 setTimeout）
4. **长任务分片**：避免阻塞 Event Loop

```javascript
// ❌ 阻塞 Event Loop
for (let i = 0; i < 1e9; i++) {
  // 耗时操作
}

// ✅ 分片处理
function processData(data, batchSize = 1000) {
  let index = 0
  
  function processBatch() {
    const end = Math.min(index + batchSize, data.length)
    
    for (let i = index; i < end; i++) {
      // 处理数据
    }
    
    index = end
    
    if (index < data.length) {
      setImmediate(processBatch)  // 让出 Event Loop
    }
  }
  
  processBatch()
}
```

5. **使用 Worker Threads 处理 CPU 密集型任务**

```javascript
const { Worker } = require('worker_threads')

const worker = new Worker('./heavy-task.js')
worker.on('message', result => {
  console.log('Result:', result)
})
```

---

## 扩展阅读

- [Node.js Event Loop 官方文档](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)
- [深入理解 Node.js Event Loop](https://nodejs.org/en/docs/guides/dont-block-the-event-loop/)
- [浏览器 Event Loop vs Node.js Event Loop](https://blog.insiderattack.net/event-loop-and-the-big-picture-nodejs-event-loop-part-1-1cb67a182810)
