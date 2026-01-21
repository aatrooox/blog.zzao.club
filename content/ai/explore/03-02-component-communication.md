# 第2题：Vue 组件通信 - 标准答案

## 题目

**考察点**：方案选型、状态管理、性能优化、架构设计

**场景描述**：
一个电商后台管理系统，包含：
- 多层级的嵌套路由（3-5层）
- 全局状态（用户信息、权限、主题配置）
- 跨模块的数据共享（订单模块 ↔ 库存模块 ↔ 财务模块）
- 实时数据更新（WebSocket 推送的订单状态变更）

**问题**：
1. **方案选型**：`props/emit`、`provide/inject`、`Vuex`、`Pinia`、`EventBus` 这些方案，您会如何组合使用？
2. **状态管理**：Vuex vs Pinia，在 Vue3 项目中您会选择哪个？为什么？
3. **性能优化**：当状态树很大时，如何避免不必要的组件重渲染？
4. **实战经验**：您在项目中遇到过哪些组件通信的难题？

---

## 标准答案

### 1. 方案选型与组合使用

| 方案 | 适用场景 | 优点 | 缺点 |
|------|---------|------|------|
| **props/emit** | 父子组件直接通信 | 简单直接、类型安全 | 层级多时繁琐 |
| **provide/inject** | 跨层级传递配置、依赖 | 无需逐层传递 | 不适合响应式数据 |
| **Pinia** | 全局状态、跨组件共享 | 组合式API、TS支持好 | 学习成本 |
| **EventBus** | 跨组件事件通信 | 灵活 | 难以维护、Vue3已移除 |

**推荐组合方案**：

```javascript
// 1. 父子组件：props/emit
<ChildComponent :data="parentData" @update="handleUpdate" />

// 2. 跨层级配置：provide/inject
// 父组件
provide('theme', computed(() => theme.value))

// 子孙组件
const theme = inject('theme')

// 3. 全局状态：Pinia
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isLoggedIn = computed(() => !!user.value)
  
  function login(credentials) {
    // ...
  }
  
  return { user, isLoggedIn, login }
})

// 4. 实时更新：Pinia + WebSocket
export const useOrderStore = defineStore('order', () => {
  const orders = ref([])
  
  onMounted(() => {
    const ws = new WebSocket('ws://...')
    ws.onmessage = (event) => {
      const order = JSON.parse(event.data)
      updateOrder(order)
    }
  })
  
  return { orders }
})
```

---

### 2. Vuex vs Pinia

**选择 Pinia 的理由**：

1. **更好的 TypeScript 支持**
```typescript
// Pinia - 自动类型推导
export const useStore = defineStore('main', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }
  return { count, doubleCount, increment }
})

// 使用时有完整类型提示
const store = useStore()
store.count  // number
store.doubleCount  // number
store.increment()  // void
```

2. **组合式 API 风格**（更符合 Vue3）
3. **无需 mutations**（简化代码）
4. **支持多实例**（适合SSR和多标签页场景）
5. **更轻量**（~1KB）

**核心差异**：

| 特性 | Vuex | Pinia |
|------|------|-------|
| API 风格 | Options API | Composition API |
| Mutations | 必需 | 无需（直接修改state） |
| TypeScript | 需手动声明 | 自动推导 |
| DevTools | 支持 | 支持 |
| 模块化 | 需配置 modules | 天然支持多 store |
| SSR | 支持 | 更好的支持 |

---

### 3. 性能优化

**避免不必要的重渲染**：

```javascript
// 1. 使用 storeToRefs 解构响应式属性
import { storeToRefs } from 'pinia'

const store = useStore()
const { count, doubleCount } = storeToRefs(store)  // 保持响应式
const { increment } = store  // 方法不需要响应式

// 2. 选择性订阅（只监听需要的状态）
const orderStore = useOrderStore()

// ❌ 不好：订阅整个store
watch(() => orderStore.$state, () => {
  // 任何状态变化都会触发
})

// ✅ 好：只监听特定状态
watch(() => orderStore.orders, (newOrders) => {
  // 只在orders变化时触发
})

// 3. 使用计算属性过滤数据
const filteredOrders = computed(() => {
  return orderStore.orders.filter(order => order.status === 'pending')
})

// 4. 虚拟滚动处理大列表
import { useVirtualList } from '@vueuse/core'

const { list, containerProps, wrapperProps } = useVirtualList(
  largeList,
  { itemHeight: 50 }
)
```

---

### 4. 实战经验

**常见问题与解决方案**：

**问题1：多标签页状态隔离**

```javascript
// 解决方案：多实例 Pinia
import { createPinia, setActivePinia } from 'pinia'

// 每个标签页创建独立的 pinia 实例
const pinia = createPinia()
setActivePinia(pinia)

app.use(pinia)
```

**问题2：跨模块数据同步**

```javascript
// 订单store监听库存store变化
export const useOrderStore = defineStore('order', () => {
  const inventoryStore = useInventoryStore()
  
  watch(() => inventoryStore.stock, (newStock) => {
    // 库存变化时更新订单状态
    updateOrdersAvailability(newStock)
  })
  
  return { orders }
})
```

**问题3：组件卸载后状态清理**

```javascript
export const useFormStore = defineStore('form', () => {
  const formData = ref({})
  
  function reset() {
    formData.value = {}
  }
  
  // 组件卸载时自动清理
  onUnmounted(() => {
    reset()
  })
  
  return { formData, reset }
})
```

---

## 最佳实践

1. **优先使用 props/emit**（父子组件）
2. **Pinia 管理全局状态**（用户、权限、主题）
3. **provide/inject 传递依赖**（配置、服务实例）
4. **避免 EventBus**（难以维护，Vue3已移除）
5. **状态持久化**：使用 `pinia-plugin-persistedstate`
6. **状态分模块**：按业务领域拆分 store
7. **性能优化**：使用 `storeToRefs`、计算属性、虚拟滚动

---

## 扩展阅读

- [Pinia 官方文档](https://pinia.vuejs.org/)
- [Vue3 组件通信最佳实践](https://vuejs.org/guide/components/)
- [Vuex vs Pinia 对比](https://pinia.vuejs.org/introduction.html#comparison-with-vuex)
