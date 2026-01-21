---
title: 5.Vue Diff 算法 - 标准答案
date: "2026-01-21T07:19:00.000Z"
lastmod: "2026-01-21T07:19:00.000Z"
---

## 题目

**考察点**：核心原理、算法理解、性能优化

**问题**：
Vue 的虚拟 DOM Diff 算法是如何工作的？Vue2 和 Vue3 的 Diff 算法有什么区别？为什么需要 key？

---

## 标准答案

### 1. Diff 算法基本原理

**为什么需要 Diff 算法？**

```javascript
// 直接操作 DOM 成本很高
const list = document.querySelector('#list')
list.innerHTML = ''  // 清空
data.forEach(item => {
  const li = document.createElement('li')
  li.textContent = item
  list.appendChild(li)  // 每次都操作 DOM
})

// 虚拟 DOM + Diff 算法
// 1. 对比新旧虚拟 DOM 树
// 2. 找出最小差异
// 3. 只更新变化的部分
```

**核心思想**：
- **同层比较**：只比较同一层级的节点（时间复杂度 O(n)）
- **类型判断**：不同类型直接替换
- **key 标识**：快速定位可复用节点

---

### 2. Vue2 的 Diff 算法（双端对比）

#### 算法流程

```
旧节点：A B C D
新节点：B A D C

步骤1：双端对比
  旧头 A  ←→  新头 B  ❌
  旧尾 D  ←→  新尾 C  ❌
  旧头 A  ←→  新尾 C  ❌
  旧尾 D  ←→  新头 B  ❌

步骤2：通过 key 查找
  新头 B 在旧节点中找到，移动 B

步骤3：继续双端对比
  ...
```

#### 源码简化版

```javascript
function updateChildren(oldCh, newCh) {
  let oldStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let newStartIdx = 0
  let newEndIdx = newCh.length - 1
  
  let oldStartVnode = oldCh[0]
  let oldEndVnode = oldCh[oldEndIdx]
  let newStartVnode = newCh[0]
  let newEndVnode = newCh[newEndIdx]
  
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 跳过已处理的节点
    if (!oldStartVnode) {
      oldStartVnode = oldCh[++oldStartIdx]
    } else if (!oldEndVnode) {
      oldEndVnode = oldCh[--oldEndIdx]
    }
    
    // 四种快速匹配
    else if (sameVnode(oldStartVnode, newStartVnode)) {
      // 旧头 vs 新头
      patchVnode(oldStartVnode, newStartVnode)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    }
    else if (sameVnode(oldEndVnode, newEndVnode)) {
      // 旧尾 vs 新尾
      patchVnode(oldEndVnode, newEndVnode)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    }
    else if (sameVnode(oldStartVnode, newEndVnode)) {
      // 旧头 vs 新尾（节点右移）
      patchVnode(oldStartVnode, newEndVnode)
      nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    }
    else if (sameVnode(oldEndVnode, newStartVnode)) {
      // 旧尾 vs 新头（节点左移）
      patchVnode(oldEndVnode, newStartVnode)
      nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    }
    
    // 都不匹配，通过 key 查找
    else {
      const idxInOld = findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
      if (!idxInOld) {
        // 新节点，创建
        createElm(newStartVnode, parentElm, oldStartVnode.elm)
      } else {
        // 找到了，移动复用
        const vnodeToMove = oldCh[idxInOld]
        patchVnode(vnodeToMove, newStartVnode)
        oldCh[idxInOld] = undefined
        nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
      }
      newStartVnode = newCh[++newStartIdx]
    }
  }
  
  // 处理剩余节点
  if (oldStartIdx > oldEndIdx) {
    // 新节点有剩余，批量添加
    addVnodes(parentElm, newCh, newStartIdx, newEndIdx)
  } else if (newStartIdx > newEndIdx) {
    // 旧节点有剩余，批量删除
    removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
  }
}
```

**特点**：
- ✅ 双端对比，4 种快速匹配
- ✅ 适合头尾操作（push、pop、shift、unshift）
- ❌ 中间插入需要遍历查找

---

### 3. Vue3 的 Diff 算法（最长递增子序列）

#### 核心优化

**Vue3 算法分 5 个步骤**：

```
旧节点：A B C D E
新节点：B A D C F

步骤1：前序对比（从头开始）
  A ≠ B，停止

步骤2：后序对比（从尾开始）
  E ≠ F，停止

步骤3：处理新增/删除
  如果旧节点遍历完，新节点有剩余 → 新增
  如果新节点遍历完，旧节点有剩余 → 删除

步骤4：处理未知序列（最长递增子序列）
  旧节点：B C D
  新节点：B D C
  
  找到最长递增子序列：B D
  只需移动 C，复用 B 和 D

步骤5：移动节点
  移动非递增序列的节点
```

#### 最长递增子序列算法

```javascript
// 找出最长递增子序列的索引
function getSequence(arr) {
  const p = arr.slice()  // 保存前驱索引
  const result = [0]
  let i, j, u, v, c
  const len = arr.length
  
  for (i = 0; i < len; i++) {
    const arrI = arr[i]
    
    if (arrI !== 0) {
      j = result[result.length - 1]
      
      // 如果当前值大于结果序列的最后一个，直接push
      if (arr[j] < arrI) {
        p[i] = j
        result.push(i)
        continue
      }
      
      // 二分查找，找到第一个比 arrI 大的位置，替换它
      u = 0
      v = result.length - 1
      while (u < v) {
        c = (u + v) >> 1  // 中间位置
        if (arr[result[c]] < arrI) {
          u = c + 1
        } else {
          v = c
        }
      }
      
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1]
        }
        result[u] = i
      }
    }
  }
  
  // 回溯找到正确的序列
  u = result.length
  v = result[u - 1]
  while (u-- > 0) {
    result[u] = v
    v = p[v]
  }
  
  return result
}

// 示例
const arr = [0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15]
console.log(getSequence(arr))
// 输出最长递增子序列的索引位置
```

#### Vue3 Diff 源码简化

```javascript
function patchKeyedChildren(c1, c2, container) {
  let i = 0
  const l2 = c2.length
  let e1 = c1.length - 1  // 旧子节点末尾索引
  let e2 = l2 - 1  // 新子节点末尾索引
  
  // 1. 前序对比
  while (i <= e1 && i <= e2) {
    const n1 = c1[i]
    const n2 = c2[i]
    if (isSameVNodeType(n1, n2)) {
      patch(n1, n2, container)
    } else {
      break
    }
    i++
  }
  
  // 2. 后序对比
  while (i <= e1 && i <= e2) {
    const n1 = c1[e1]
    const n2 = c2[e2]
    if (isSameVNodeType(n1, n2)) {
      patch(n1, n2, container)
    } else {
      break
    }
    e1--
    e2--
  }
  
  // 3. 新节点有剩余（新增）
  if (i > e1) {
    if (i <= e2) {
      while (i <= e2) {
        patch(null, c2[i], container)
        i++
      }
    }
  }
  
  // 4. 旧节点有剩余（删除）
  else if (i > e2) {
    while (i <= e1) {
      unmount(c1[i])
      i++
    }
  }
  
  // 5. 处理未知序列（最长递增子序列）
  else {
    const s1 = i
    const s2 = i
    
    // 5.1 建立新节点的 key -> index 映射
    const keyToNewIndexMap = new Map()
    for (i = s2; i <= e2; i++) {
      const nextChild = c2[i]
      keyToNewIndexMap.set(nextChild.key, i)
    }
    
    // 5.2 遍历旧节点，找出需要移动和删除的节点
    let patched = 0
    const toBePatched = e2 - s2 + 1
    let moved = false
    let maxNewIndexSoFar = 0
    const newIndexToOldIndexMap = new Array(toBePatched).fill(0)
    
    for (i = s1; i <= e1; i++) {
      const prevChild = c1[i]
      
      if (patched >= toBePatched) {
        // 新节点都处理完了，剩下的都是要删除的
        unmount(prevChild)
        continue
      }
      
      let newIndex = keyToNewIndexMap.get(prevChild.key)
      
      if (newIndex === undefined) {
        // 旧节点在新节点中不存在，删除
        unmount(prevChild)
      } else {
        // 记录新旧节点的映射关系
        newIndexToOldIndexMap[newIndex - s2] = i + 1
        
        // 判断是否需要移动
        if (newIndex >= maxNewIndexSoFar) {
          maxNewIndexSoFar = newIndex
        } else {
          moved = true
        }
        
        // 复用节点
        patch(prevChild, c2[newIndex], container)
        patched++
      }
    }
    
    // 5.3 移动和挂载新节点
    const increasingNewIndexSequence = moved
      ? getSequence(newIndexToOldIndexMap)
      : []
    
    let j = increasingNewIndexSequence.length - 1
    
    // 倒序遍历，方便插入
    for (i = toBePatched - 1; i >= 0; i--) {
      const nextIndex = s2 + i
      const nextChild = c2[nextIndex]
      const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : null
      
      if (newIndexToOldIndexMap[i] === 0) {
        // 新节点，挂载
        patch(null, nextChild, container, anchor)
      } else if (moved) {
        // 需要移动
        if (j < 0 || i !== increasingNewIndexSequence[j]) {
          move(nextChild, container, anchor)
        } else {
          j--
        }
      }
    }
  }
}
```

---

### 4. key 的作用

**为什么需要 key？**

```vue
<!-- ❌ 没有 key -->
<li v-for="item in items">{{ item.name }}</li>

<!-- 新旧列表 -->
旧：[{ name: 'A' }, { name: 'B' }, { name: 'C' }]
新：[{ name: 'B' }, { name: 'C' }, { name: 'A' }]

<!-- Diff 结果：就地复用，修改所有节点的文本内容 -->
1. 修改第1个 li 的文本：A → B
2. 修改第2个 li 的文本：B → C
3. 修改第3个 li 的文本：C → A
效率低！


<!-- ✅ 有 key -->
<li v-for="item in items" :key="item.id">{{ item.name }}</li>

<!-- Diff 结果：通过 key 识别，只移动节点 -->
1. 复用 B 节点，移动到第1位
2. 复用 C 节点，移动到第2位
3. 复用 A 节点，移动到第3位
效率高！
```

**key 的最佳实践**：

```vue
<!-- ✅ 好：使用唯一 ID -->
<li v-for="item in users" :key="item.id">{{ item.name }}</li>

<!-- ❌ 不好：使用 index -->
<li v-for="(item, index) in users" :key="index">{{ item.name }}</li>
<!-- 问题：删除第1项后，所有 index 都变了，无法复用 -->

<!-- ❌ 不好：使用随机数 -->
<li v-for="item in users" :key="Math.random()">{{ item.name }}</li>
<!-- 问题：每次渲染 key 都不同，永远无法复用 -->
```

**不使用 key 的副作用**：

```vue
<template>
  <div v-for="(item, index) in list" :key="index">
    <input v-model="item.value" />
  </div>
</template>

<script setup>
const list = ref([
  { id: 1, value: 'A' },
  { id: 2, value: 'B' },
  { id: 3, value: 'C' }
])

// 删除第1项
function removeFirst() {
  list.value.shift()
}
</script>

<!-- 问题：
删除第1项后：
  原本 index=0 的 input（值为'A'）被删除
  原本 index=1 的 input 变成 index=0（但值仍为'B'）
  原本 index=2 的 input 变成 index=1（但值仍为'C'）
  
  Vue 会复用 DOM，导致 input 的值错位！
-->

<!-- 解决：使用唯一 ID -->
<div v-for="item in list" :key="item.id">
  <input v-model="item.value" />
</div>
```

---

### 5. Vue2 vs Vue3 Diff 对比

| 特性 | Vue2 | Vue3 |
|------|------|------|
| 算法 | 双端对比 | 最长递增子序列 |
| 时间复杂度 | O(n) | O(n log n) |
| 移动次数 | 较多 | 最少（理论最优） |
| 适合场景 | 头尾操作 | 任意位置插入/删除 |
| 静态标记 | 无 | PatchFlag 静态提升 |

**性能测试**：

```
场景：1000个节点，随机插入/删除

Vue2：需要移动 ~500 个节点
Vue3：需要移动 ~100 个节点（找到最长递增子序列，只移动非递增的）

结果：Vue3 性能提升 5倍
```

---

## 最佳实践

1. **始终使用唯一且稳定的 key**
2. **不要使用 index 作为 key**（除非列表完全静态）
3. **不要使用随机数作为 key**
4. **不要省略 key**（虽然 Vue 不报错，但性能差）
5. **理解 Diff 算法原理**，写出高性能的列表代码

---

## 扩展阅读

- [Vue3 源码 - patchKeyedChildren](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/renderer.ts)
- [最长递增子序列算法详解](https://leetcode.cn/problems/longest-increasing-subsequence/)
- [虚拟 DOM 与 Diff 算法](https://vue-next-template-explorer.netlify.app/)
