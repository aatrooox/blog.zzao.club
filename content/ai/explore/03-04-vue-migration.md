# 第4题：Vue2 迁移到 Vue3 - 标准答案

## 题目

Vue2 到 Vue3 迁移策略：10万+ 行代码的大型项目如何平滑迁移？

---

## 标准答案

### 渐进式迁移策略

**阶段1：准备阶段**
- 升级到 Vue 2.7（过渡版本，支持部分 Vue3 API）
- 使用 ESLint 插件检测不兼容代码
- 建立完善的测试覆盖

**阶段2：使用 @vue/compat**
```javascript
// vite.config.js
export default {
  resolve: {
    alias: {
      vue: '@vue/compat'
    }
  }
}
```

**阶段3：逐模块迁移**
- 从独立模块开始（如工具函数、公共组件）
- 修改不兼容 API
- 建立 MVP 回归测试

**阶段4：去除兼容层**
- 逐步移除 `@vue/compat`
- 启用 Vue3 完整特性

### 常见不兼容 API

| Vue2 | Vue3 替代 |
|------|----------|
| `this.$children` | `ref()` + `expose()` |
| `this.$listeners` | 合并到 `$attrs` |
| EventBus | mitt 或 Pinia |
| `$on/$off/$once` | 已移除，用 mitt |
| Filters | 方法或计算属性 |

### 最佳实践

1. **使用自动化工具**：gogocode、vue-codemod
2. **建立测试保障**：单元测试 + E2E 测试
3. **灰度发布**：先上线小流量观察
4. **性能监控**：对比迁移前后性能数据

---

## 扩展阅读

- [Vue3 迁移指南](https://v3-migration.vuejs.org/)
- [@vue/compat 文档](https://v3-migration.vuejs.org/breaking-changes/migration-build.html)
