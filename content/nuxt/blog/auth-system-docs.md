---
title: 博客鉴权机制详细文档
date: 2025-08-21
lastmod: 2025-08-21
tags:
  - 博客
  - Nuxt
---
## 概述

本项目采用双 Token 鉴权机制，结合了 JWT 的无状态特性和 Redis 的有状态管理，提供了安全性和用户体验的最佳平衡。

## 鉴权架构

### 1. 双 Token 机制

- **Access Token (JWT)**
  - 类型：无状态 JWT
  - 过期时间：15 分钟
  - 用途：API 访问凭证
  - 存储：客户端内存/localStorage

- **Refresh Token**
  - 类型：随机字符串
  - 过期时间：7 天
  - 用途：刷新 Access Token
  - 存储：Redis（服务端）+ 客户端

### 2. 错误代码系统

所有 API 统一返回 200 HTTP 状态码，通过 `code` 字段（数值）标识业务状态：

```typescript
// 响应格式
{
  code: number,      // 错误代码（0表示成功）
  message: string,   // 错误描述
  data: any,         // 响应数据
  timestamp: number  // 时间戳
}
```

#### 错误代码定义

```typescript [/shared/utils/apiCodes.ts]
export const API_CODES = {
  // 成功
  SUCCESS: 0,

  // 认证相关错误 (1000-1999)
  NO_TOKEN: 1001,           // 未提供token
  TOKEN_EXPIRED: 1002,      // token过期（可刷新）
  TOKEN_INVALID: 1003,      // token无效（不可刷新）
  AUTH_FAILED: 1004,        // 认证失败
  REFRESH_TOKEN_EXPIRED: 1005, // refresh token过期

  // 权限相关错误 (2000-2999)
  PERMISSION_DENIED: 2001,  // 无权限
  FORBIDDEN: 2002,          // 禁止访问

  // 业务相关错误 (3000-3999)
  VALIDATION_ERROR: 3001,   // 参数验证错误
  RESOURCE_NOT_FOUND: 3002, // 资源不存在
  DUPLICATE_ERROR: 3003,    // 重复错误

  // 系统错误 (9000-9999)
  INTERNAL_ERROR: 9001,     // 内部错误
  NETWORK_ERROR: 9002,      // 网络错误
}
```

## 后端实现

### 1. API 响应处理器

```typescript [/server/utils/handler.ts]
export const defineStandardResponseHandler = <T extends EventHandlerRequest, D> (
  handler: EventHandler<T, D>,
): EventHandler<T, D> =>
  defineEventHandler<T>(async (event) => {
    try {
      const response = await handler(event)
      // 成功响应
      return {
        code: API_CODES.SUCCESS,
        message: 'ok',
        data: response,
        timestamp: Date.now(),
      }
    }
    catch (error: any) {
      // 强制设置 HTTP 状态码为 200
      setResponseStatus(event, 200)
      
      if (error.statusCode) {
        const customCode = error.data?.code
        const customMessage = error.data?.message || error.message
        
        return {
          code: customCode || API_CODES.INTERNAL_ERROR,
          message: customMessage || '出错啦，请稍后再试～',
          data: error.data?.data || null,
          timestamp: Date.now(),
        }
      }
      
      // 未知错误
      return {
        code: API_CODES.INTERNAL_ERROR,
        message: '出错啦，请稍后再试～',
        data: null,
        timestamp: Date.now(),
      }
    }
  })
```

### 2. API 开发方式

#### 成功案例

```typescript
// /server/api/v1/user/login.post.ts
export default defineStandardResponseHandler(async (event) => {
  const body = await useSafeValidatedBody(event, schema)

  if (!body.success) {
    throw createError({
      statusCode: 400,
      data: {
        code: API_CODES.VALIDATION_ERROR,
        message: '参数验证失败',
        data: body.error,
      },
    })
  }

  // 业务逻辑处理...
  const tokenPair = await generateTokenPair(user.id)

  // 直接返回数据，由 handler 包装成标准格式
  return {
    accessToken: tokenPair.accessToken,
    refreshToken: tokenPair.refreshToken,
    accessExpiresAt: tokenPair.accessExpiresAt,
    refreshExpiresAt: tokenPair.refreshExpiresAt,
    user,
  }
})
```

#### 错误处理

```typescript
// 参数验证错误
throw createError({
  statusCode: 400,
  data: {
    code: API_CODES.VALIDATION_ERROR,
    message: '参数验证失败',
    data: validationErrors,
  },
})

// 认证失败
throw createError({
  statusCode: 401,
  data: {
    code: API_CODES.AUTH_FAILED,
    message: '账号或密码错误',
  },
})

// 内部错误
throw createError({
  statusCode: 500,
  data: {
    code: API_CODES.INTERNAL_ERROR,
    message: '系统繁忙，请稍后重试',
  },
})
```

### 3. 鉴权中间件

```typescript [/server/middleware/2.auth0.ts]
export default defineEventHandler(async (event) => {
  // 需要鉴权的路径判断
  if (needsAuth(event)) {
    if (!event.context.token) {
      // 强制设置状态码为 200，返回错误代码
      setResponseStatus(event, 200)
      return {
        code: API_CODES.NO_TOKEN,
        message: API_ERROR_MESSAGES[API_CODES.NO_TOKEN],
        data: null,
        timestamp: Date.now(),
      }
    }

    const { isAuth, userId, error } = verifyJWTAccessToken(event.context.token)

    if (!isAuth) {
      let errorCode = API_CODES.AUTH_FAILED
      if (error?.includes('expired')) {
        errorCode = API_CODES.TOKEN_EXPIRED
      } else if (error?.includes('invalid')) {
        errorCode = API_CODES.TOKEN_INVALID
      }

      setResponseStatus(event, 200)
      return {
        code: errorCode,
        message: API_ERROR_MESSAGES[errorCode],
        data: null,
        timestamp: Date.now(),
      }
    }

    event.context.userId = userId
  }
})
```

### 4. Token 管理

```typescript [/server/utils/token.ts]
// 生成双 Token
export async function generateTokenPair(userId: number) {
  const accessToken = generateJWT(userId, '15m')
  const refreshToken = generateRandomToken()
  
  // 存储 refresh token 到 Redis
  await redis.setex(`refresh_token:${userId}`, 7 * 24 * 60 * 60, refreshToken)
  
  return {
    accessToken,
    refreshToken,
    accessExpiresAt: Date.now() + 15 * 60 * 1000,
    refreshExpiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  }
}

// 刷新访问令牌
export async function refreshAccessToken(refreshToken: string) {
  // 从 Redis 验证 refresh token
  const userId = await redis.get(`refresh_token_user:${refreshToken}`)
  
  if (!userId) {
    return null // refresh token 无效或过期
  }

  // 生成新的 access token
  const newAccessToken = generateJWT(userId, '15m')
  
  return {
    accessToken: newAccessToken,
    expiresAt: Date.now() + 15 * 60 * 1000,
  }
}
```

## 前端实现

### 1. 请求拦截器

```typescript [/app/plugins/fetch.ts]
const $api = $fetch.create({
  onRequest: async ({ options }) => {
    const userStore = useUser()
    
    // 自动添加 Authorization 头
    if (userStore.tokenInfo.value.accessToken) {
      options.headers.set('Authorization', `Bearer ${userStore.tokenInfo.value.accessToken}`)
    }
  },

  onResponse: async ({ request, response }) => {
    const userStore = useUser()
    const globalToast = useGlobalToast()

    const apiResponse = response._data
    
    // 处理业务层面的错误
    if (apiResponse?.code && apiResponse.code !== API_CODES.SUCCESS) {
      const { code, message } = apiResponse

      // 不可刷新的认证错误
      if ([API_CODES.NO_TOKEN, API_CODES.TOKEN_INVALID, API_CODES.AUTH_FAILED].includes(code)) {
        userStore.logout()
        globalToast.add({ message: message || '认证失败，请重新登录', type: 'error' })
        return
      }

      // Token 过期处理
      if (code === API_CODES.TOKEN_EXPIRED) {
        // 自动刷新 token 逻辑
        if (userStore.tokenInfo.value.refreshToken && !userStore.isRefreshTokenExpired.value) {
          const { refreshToken } = useAuth()
          const success = await refreshToken()
          
          if (!success) {
            userStore.logout()
            globalToast.add({ message: '登录已过期，请重新登录', type: 'error' })
          }
        }
        return
      }

      // 其他错误处理
      globalToast.add({ message: message || '操作失败', type: 'error' })
    }
  },

  onResponseError: async ({ response }) => {
    // 只处理真正的网络错误
    const globalToast = useGlobalToast()
    const errorMessage = response?._data?.message || '网络请求失败'
    globalToast.add({ message: errorMessage, type: 'error' })
  },
})
```

### 2. 用户状态管理

```typescript [/composables/useUser.ts]
export const useUser = () => {
  const tokenInfo = ref({
    accessToken: '',
    refreshToken: '',
    accessExpiresAt: 0,
    refreshExpiresAt: 0,
  })

  // 检查 access token 是否过期
  const isAccessTokenExpired = computed(() => {
    return Date.now() >= tokenInfo.value.accessExpiresAt
  })

  // 检查 refresh token 是否过期
  const isRefreshTokenExpired = computed(() => {
    return Date.now() >= tokenInfo.value.refreshExpiresAt
  })

  // 登录
  const login = async (credentials: LoginData) => {
    try {
      const response = await $fetch.post('/api/v1/user/login', credentials)
      
      if (response.code === API_CODES.SUCCESS) {
        tokenInfo.value = {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          accessExpiresAt: response.data.accessExpiresAt,
          refreshExpiresAt: response.data.refreshExpiresAt,
        }
        
        // 保存到 localStorage
        localStorage.setItem('tokenInfo', JSON.stringify(tokenInfo.value))
        return true
      }
      
      return false
    } catch (error) {
      console.error('登录失败:', error)
      return false
    }
  }

  // 登出
  const logout = () => {
    tokenInfo.value = {
      accessToken: '',
      refreshToken: '',
      accessExpiresAt: 0,
      refreshExpiresAt: 0,
    }
    localStorage.removeItem('tokenInfo')
    navigateTo('/login')
  }

  return {
    tokenInfo: readonly(tokenInfo),
    isAccessTokenExpired,
    isRefreshTokenExpired,
    login,
    logout,
  }
}
```

### 3. 鉴权组合式函数

```typescript [/composables/useAuth.ts]
export const useAuth = () => {
  const userStore = useUser()

  // 刷新 token
  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await $fetch.post('/api/v1/auth/refresh', {
        refreshToken: userStore.tokenInfo.value.refreshToken,
      })

      if (response.code === API_CODES.SUCCESS) {
        // 更新 access token
        userStore.tokenInfo.value.accessToken = response.data.accessToken
        userStore.tokenInfo.value.accessExpiresAt = response.data.expiresAt
        
        // 更新 localStorage
        localStorage.setItem('tokenInfo', JSON.stringify(userStore.tokenInfo.value))
        return true
      }

      return false
    } catch (error) {
      console.error('Token 刷新失败:', error)
      return false
    }
  }

  // 检查登录状态
  const checkAuth = () => {
    if (!userStore.tokenInfo.value.accessToken) {
      return false
    }

    if (userStore.isRefreshTokenExpired.value) {
      userStore.logout()
      return false
    }

    return true
  }

  return {
    refreshToken,
    checkAuth,
  }
}
```

## 前端使用方式

### 1. API 调用

```typescript
// 在组件中使用
export default defineNuxtPlugin({
  async setup() {
    const { $api } = useNuxtApp()

    // GET 请求
    const userData = await $api.get('/api/v1/user/profile')
    if (userData.code === API_CODES.SUCCESS) {
      console.log('用户信息:', userData.data)
    }

    // POST 请求
    const result = await $api.post('/api/v1/posts', {
      title: '新文章',
      content: '文章内容...'
    })

    if (result.code === API_CODES.SUCCESS) {
      console.log('创建成功:', result.data)
    } else {
      console.error('创建失败:', result.message)
    }
  }
})
```

### 2. 路由守卫

```typescript
// /middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const { checkAuth } = useAuth()
  
  if (!checkAuth()) {
    return navigateTo('/login')
  }
})
```

### 3. 页面使用

```vue
<template>
  <div>
    <h1>受保护的页面</h1>
    <button @click="handleApiCall">调用API</button>
  </div>
</template>

<script setup>
// 页面级别的鉴权
definePageMeta({
  middleware: 'auth'
})

const { $api } = useNuxtApp()

const handleApiCall = async () => {
  try {
    const response = await $api.post('/api/v1/some-protected-endpoint', {
      data: 'some data'
    })
    
    // 成功处理
    if (response.code === API_CODES.SUCCESS) {
      console.log('操作成功:', response.data)
    }
  } catch (error) {
    // 错误会被拦截器自动处理，显示对应的 toast 消息
    console.error('请求失败:', error)
  }
}
</script>
```

## 错误处理最佳实践

### 1. 前端错误分类处理

```typescript
const handleApiResponse = (response: ApiResponse) => {
  switch (response.code) {
    case API_CODES.SUCCESS:
      // 成功处理
      break
      
    case API_CODES.VALIDATION_ERROR:
      // 参数验证错误，显示具体字段错误
      showValidationErrors(response.data)
      break
      
    case API_CODES.PERMISSION_DENIED:
      // 权限不足，可能需要升级账户
      showPermissionDialog()
      break
      
    case API_CODES.RESOURCE_NOT_FOUND:
      // 资源不存在，可能需要刷新页面
      navigateTo('/404')
      break
      
    default:
      // 其他错误，显示通用错误消息
      showErrorToast(response.message)
  }
}
```

### 2. 自动重试机制

```typescript
const apiWithRetry = async (url: string, options: any, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await $api.request(url, options)
      
      if (response.code === API_CODES.SUCCESS) {
        return response
      }
      
      // 如果是 token 过期，等待刷新后重试
      if (response.code === API_CODES.TOKEN_EXPIRED && i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        continue
      }
      
      return response
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}
```

## 安全考虑

### 1. Token 存储安全

- **Access Token**: 存储在内存中，避免 XSS 攻击
- **Refresh Token**: 存储在 httpOnly cookie 中（推荐）或 localStorage
- **敏感信息**: 永远不要在 JWT 中存储敏感信息

### 2. CSRF 防护

```typescript
// 添加 CSRF token 到请求头
onRequest: ({ options }) => {
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
  if (csrfToken) {
    options.headers.set('X-CSRF-Token', csrfToken)
  }
}
```

### 3. 请求频率限制

```typescript
// 在中间件中添加频率限制
export default defineEventHandler(async (event) => {
  const ip = getClientIP(event)
  const key = `rate_limit:${ip}`
  
  const current = await redis.incr(key)
  if (current === 1) {
    await redis.expire(key, 60) // 1分钟窗口
  }
  
  if (current > 100) { // 每分钟最多100个请求
    setResponseStatus(event, 200)
    return {
      code: API_CODES.FORBIDDEN,
      message: '请求过于频繁，请稍后再试',
      data: null,
      timestamp: Date.now(),
    }
  }
})
```

## 常见问题排查

### 1. Token 刷新失败

**现象**: 用户频繁被要求重新登录

**排查步骤**:
1. 检查 Redis 中的 refresh token 是否存在
2. 确认 refresh token 的过期时间设置
3. 检查网络请求是否正常到达服务器
4. 确认前端 token 刷新逻辑是否正确触发

### 2. 鉴权中间件不生效

**现象**: 未登录用户可以访问受保护的 API

**排查步骤**:
1. 检查路由是否在白名单中
2. 确认中间件的执行顺序
3. 检查 Authorization 头是否正确传递
4. 验证 JWT 解析逻辑

### 3. 前端错误处理不正确

**现象**: 错误信息显示不准确或不显示

**排查步骤**:
1. 检查 onResponse 和 onResponseError 的处理逻辑
2. 确认错误代码的匹配是否正确
3. 验证 toast 组件是否正常工作
4. 检查控制台是否有 JavaScript 错误

## 总结

本鉴权系统提供了：

1. **安全性**: 双 Token 机制，JWT + Redis 存储
2. **用户体验**: 自动 token 刷新，无感知续期
3. **开发友好**: 统一的错误处理，清晰的错误代码
4. **可维护性**: 模块化设计，易于扩展和修改
5. **类型安全**: 完整的 TypeScript 支持

