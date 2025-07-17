# 路径引用规则

## 路径别名规范

### 基本规则

- `~/` - 指向 `app/` 目录（Nuxt 4 应用目录）
- `~~/` - 指向项目根目录

### 具体使用场景

#### app/ 目录下的文件引用

```typescript
// 正确：引用 app/ 下的文件使用 ~/
import { useUserStore } from "~/stores/user";
import type { User } from "~/types/user";
import MyComponent from "~/components/MyComponent.vue";
import { myUtil } from "~/utils/helper";

// 错误：不要使用相对路径
import { useUserStore } from "../stores/user";
import type { User } from "./types/user";
```

#### 项目根目录下的文件引用

```typescript
// 正确：引用根目录下的文件使用 ~~/
import type { GlobalType } from "~~/types/global";
import { rootConfig } from "~~/config/app";
import prisma from "~~/lib/prisma";

// 错误：不要使用 ~/
import type { GlobalType } from "~/types/global";
```

### 常见目录引用示例

#### app/ 目录内的引用

- `~/components/` - 组件
- `~/composables/` - 组合式函数
- `~/stores/` - 状态管理
- `~/utils/` - 工具函数
- `~/types/` - 类型定义（如果在 app/types）
- `~/assets/` - 资源文件
- `~/plugins/` - 插件
- `~/middleware/` - 中间件

#### 根目录的引用

- `~~/types/` - 全局类型定义
- `~~/lib/` - 库文件
- `~~/server/` - 服务端代码
- `~~/prisma/` - 数据库相关
- `~~/config/` - 配置文件

### 注意事项

1. **类型导入**

   ```typescript
   // 正确
   import type { User } from "~/types/user";
   import type { ApiResponse } from "~~/types/api";

   // 使用 type 关键字进行类型导入
   ```

2. **组件导入**

   ```typescript
   // 正确
   import MyComponent from "~/components/MyComponent.vue";

   // 在 <script setup> 中
   const MyComponent = defineAsyncComponent(
     () => import("~/components/MyComponent.vue")
   );
   ```

3. **服务端代码引用**

   ```typescript
   // 在 server/ 目录中
   import { someUtil } from "~~/server/utils/helper";
   import type { ServerType } from "~~/types/server";
   ```

4. **避免混用**
   - 不要在同一个文件中混用 `~/` 和 `~~/` 来引用同一层级的文件
   - 保持引用路径的一致性和可读性

### 特殊情况

#### Nuxt 自动导入

- 对于 Nuxt 自动导入的内容（如 composables、components），通常不需要显式导入
- 但在类型定义中仍需要正确的路径引用

#### 第三方库

```typescript
// 第三方库正常导入
import { ref, computed } from "vue";
import axios from "axios";

// 项目内部使用别名
import { myHelper } from "~/utils/helper";
```
