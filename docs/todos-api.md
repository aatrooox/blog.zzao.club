# Todos API 接口文档

本文档面向需要对接 `zzao.club` Todo/Issue 功能的 Agent 或外部项目。

## 基础信息

| 项目 | 说明 |
|------|------|
| Base URL | `https://zzao.club` |
| 认证方式 | `Authorization: Bearer <token>`（JWT 或 PAT） |
| 响应格式 | 统一封装 `{ code, message, data, timestamp }` |
| 成功 code | `0` |

### 认证说明

- **无需认证**：公开（`public`）Todo 的读取接口（GET 类）可在未登录状态下访问，但仅能查看公开数据。
- **需要登录**：所有写操作（创建、更新、评论）必须携带有效 token。
- **需要 `all` scope 的 PAT** 或 superAdmin JWT：才可操作私有 Todo、修改状态/可见性/标签等 owner-only 字段。

### 公共错误码

| HTTP 状态 | code | 含义 |
|-----------|------|------|
| 400 | 3001 | 参数验证失败 |
| 401 | — | 未登录 / token 无效 |
| 403 | 2001 | 无权访问（非 owner 访问私有内容等） |
| 404 | 3004 | 资源不存在 |
| 500 | 9001 | 服务器内部错误 |

---

## 数据结构

### TodoItem（Todo 条目）

```typescript
interface TodoItem {
  id: string                // UUID，唯一标识
  title: string             // 标题，最长 500 字符
  description: string | null // 详细描述
  status: 'open' | 'in_progress' | 'blocked' | 'done' | 'canceled'
  visibility: 'public' | 'private'
  reporterUserId: string    // 创建者 userId
  targetType: 'none' | 'url' | 'project' | 'post' | 'note' | 'other'
  targetRef: string | null  // 关联目标的引用（如 URL、ID）
  targetTitle: string | null // 关联目标的标题
  dueAt: string | null      // 截止时间，ISO 8601 格式
  completedAt: string | null // 完成时间（status 变为 done/canceled 时自动写入）
  createdAt: string         // 创建时间
  updatedAt: string         // 最后更新时间
  reporter: {               // 创建者信息（关联查询）
    username: string
    nickname: string | null
    avatarUrl: string | null
  }
  tags: Array<{             // 标签列表
    id: string
    name: string
    color: string | null
  }>
  participants: Array<{     // 参与者列表（仅 status=active）
    userId: string
    username: string
    nickname: string | null
    avatarUrl: string | null
    role: string            // 如 'reporter'
  }>
}
```

### TodoTag（标签）

```typescript
interface TodoTag {
  id: string
  name: string
  color: string | null
}
```

### TodoComment（评论）

```typescript
interface TodoComment {
  id: string
  todoItemId: string
  content: string
  createdAt: string
  updatedAt: string
  author: {
    id: string
    username: string
    nickname: string | null
    avatarUrl: string | null
  }
}
```

### TodoEvent（变更事件）

```typescript
interface TodoEvent {
  id: number               // 自增 ID，用作分页 cursor
  todoItemId: string
  actorUserId: string
  eventType: 'created' | 'edited' | 'status_changed' | 'visibility_changed' | 'tagged' | 'commented'
  payload: object          // 不同事件类型有不同结构（见变更日志接口说明）
  createdAt: string
}
```

---

## 接口列表

### 1. 获取 Todo 列表

**`GET /api/v1/todos`**

获取分页的 Todo 列表。未登录时只能看到公开条目；登录后可看到自己创建的私有条目；superAdmin 可查看所有条目。

#### 查询参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `page` | number | ❌ | `1` | 页码，从 1 开始 |
| `size` | number | ❌ | `20` | 每页条数 |
| `status` | string | ❌ | — | 按状态过滤：`open` / `in_progress` / `blocked` / `done` / `canceled` |
| `visibility` | string | ❌ | — | 按可见性过滤（**仅 superAdmin 有效**）：`public` / `private` / `all` |
| `tagId` | string | ❌ | — | 按标签 ID 过滤 |
| `q` | string | ❌ | — | 关键词搜索（匹配 title 和 description） |
| `scope` | string | ❌ | `all` | 范围：`created_by_me`（我创建的）/ `assigned_to_me` / `all` |

#### 成功响应 `200 OK`

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [ /* TodoItem[] */ ],
    "total": 100,
    "page": 1,
    "size": 20,
    "totalPages": 5
  },
  "timestamp": 1234567890000
}
```

#### 示例

```bash
# 获取第 1 页公开 Todo（无需登录）
curl "https://zzao.club/api/v1/todos?page=1&size=10"

# 搜索包含 "nuxt" 的待办（已登录）
curl "https://zzao.club/api/v1/todos?q=nuxt&status=open" \
  -H "Authorization: Bearer <token>"

# 只看我创建的
curl "https://zzao.club/api/v1/todos?scope=created_by_me" \
  -H "Authorization: Bearer <token>"
```

---

### 2. 创建 Todo

**`POST /api/v1/todos`**

创建一个新的 Todo 条目。**必须登录**。创建者自动成为该条目的 reporter/watcher 参与者。

#### 请求体

```json
{
  "title": "修复登录页面样式问题",
  "description": "在移动端 Safari 下，输入框会被键盘遮挡",
  "visibility": "public",
  "targetType": "url",
  "targetRef": "https://zzao.club/login",
  "targetTitle": "登录页",
  "dueAt": "2026-03-31T00:00:00.000Z",
  "tagIds": ["tag-uuid-1", "tag-uuid-2"]
}
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `title` | string | ✅ | — | 标题，1–500 字符 |
| `description` | string | ❌ | — | 详细描述 |
| `visibility` | `'public'` \| `'private'` | ❌ | `'public'` | 可见性 |
| `targetType` | string | ❌ | `'none'` | 关联类型：`none` / `url` / `project` / `post` / `note` / `other` |
| `targetRef` | string | ❌ | — | 关联目标引用，最长 1000 字符（如 URL） |
| `targetTitle` | string | ❌ | — | 关联目标标题，最长 500 字符 |
| `dueAt` | string | ❌ | — | 截止时间，ISO 8601 格式（如 `"2026-03-31T00:00:00.000Z"`） |
| `tagIds` | string[] | ❌ | — | 预设标签 ID 数组（需先通过标签接口获取） |

#### 成功响应 `200 OK`

返回刚创建的原始 TodoItem 数据（不含关联的 reporter/tags/participants，需调用详情接口获取完整数据）。

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "修复登录页面样式问题",
    "description": "在移动端 Safari 下，输入框会被键盘遮挡",
    "status": "open",
    "visibility": "public",
    "reporterUserId": "user-uuid",
    "targetType": "url",
    "targetRef": "https://zzao.club/login",
    "targetTitle": "登录页",
    "dueAt": "2026-03-31T00:00:00.000Z",
    "completedAt": null,
    "createdAt": "2026-02-26T10:00:00.000Z",
    "updatedAt": "2026-02-26T10:00:00.000Z"
  },
  "timestamp": 1234567890000
}
```

#### 示例

```bash
curl -X POST "https://zzao.club/api/v1/todos" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "修复登录页面样式问题",
    "visibility": "public",
    "targetType": "url",
    "targetRef": "https://zzao.club/login"
  }'
```

---

### 3. 获取 Todo 详情

**`GET /api/v1/todos/:id`**

获取单个 Todo 的完整信息，包含 reporter、标签列表和参与者列表。

- 公开 Todo：无需登录
- 私有 Todo：仅 superAdmin 或创建者本人可访问

#### 路径参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `id` | string | Todo 的 UUID |

#### 成功响应 `200 OK`

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "修复登录页面样式问题",
    "description": "在移动端 Safari 下，输入框会被键盘遮挡",
    "status": "open",
    "visibility": "public",
    "reporterUserId": "user-uuid",
    "targetType": "url",
    "targetRef": "https://zzao.club/login",
    "targetTitle": "登录页",
    "dueAt": "2026-03-31T00:00:00.000Z",
    "completedAt": null,
    "createdAt": "2026-02-26T10:00:00.000Z",
    "updatedAt": "2026-02-26T10:00:00.000Z",
    "reporter": {
      "username": "aatrooox",
      "nickname": "Aatrox",
      "avatarUrl": "https://..."
    },
    "tags": [
      { "id": "tag-uuid-1", "name": "bug", "color": "#ff0000" }
    ],
    "participants": [
      {
        "userId": "user-uuid",
        "username": "aatrooox",
        "nickname": "Aatrox",
        "avatarUrl": "https://...",
        "role": "reporter"
      }
    ]
  },
  "timestamp": 1234567890000
}
```

#### 示例

```bash
# 查看公开 Todo（无需登录）
curl "https://zzao.club/api/v1/todos/550e8400-e29b-41d4-a716-446655440000"
```

---

### 4. 更新 Todo

**`PATCH /api/v1/todos/:id`**

更新 Todo 的字段。**必须登录**。

**权限分级**：
- **Reporter（创建者）**：可修改 `title`、`description`、`targetType`、`targetRef`、`targetTitle`、`dueAt`
- **superAdmin（Owner）**：在 reporter 基础上，还可修改 `status`、`visibility`、`tagIds`

> 注意：Reporter 传入 `status` / `visibility` / `tagIds` 不会报错，但这些字段会被静默忽略。

#### 路径参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `id` | string | Todo 的 UUID |

#### 请求体（所有字段均为可选）

```json
{
  "title": "修复登录页面样式问题（已复现）",
  "description": "更新了描述",
  "targetType": "url",
  "targetRef": "https://zzao.club/login",
  "targetTitle": "登录页",
  "dueAt": "2026-04-30T00:00:00.000Z",
  "status": "in_progress",
  "visibility": "public",
  "tagIds": ["tag-uuid-1"]
}
```

| 字段 | 类型 | 权限 | 说明 |
|------|------|------|------|
| `title` | string | Reporter + Owner | 1–500 字符 |
| `description` | string \| null | Reporter + Owner | 传 `null` 可清空 |
| `targetType` | string | Reporter + Owner | 同创建接口的枚举值 |
| `targetRef` | string \| null | Reporter + Owner | 传 `null` 可清空 |
| `targetTitle` | string \| null | Reporter + Owner | 传 `null` 可清空 |
| `dueAt` | string \| null | Reporter + Owner | ISO 8601，传 `null` 清空截止时间 |
| `status` | string | **Owner only** | `open` / `in_progress` / `blocked` / `done` / `canceled`；变为 `done` 或 `canceled` 时自动写入 `completedAt` |
| `visibility` | string | **Owner only** | `public` / `private` |
| `tagIds` | string[] | **Owner only** | 全量替换标签（传空数组即清除所有标签） |

#### 成功响应 `200 OK`

返回更新后的 TodoItem 原始数据（不含 reporter/tags/participants 关联信息）。

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "修复登录页面样式问题（已复现）",
    "status": "in_progress",
    "updatedAt": "2026-02-26T11:00:00.000Z"
    // ... 其余字段
  },
  "timestamp": 1234567890000
}
```

#### 示例

```bash
# Reporter 更新标题
curl -X PATCH "https://zzao.club/api/v1/todos/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "修复登录页面样式问题（已复现）"}'

# Owner 关闭 Todo
curl -X PATCH "https://zzao.club/api/v1/todos/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer <superadmin-token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "done"}'
```

---

### 5. 获取 Todo 评论列表

**`GET /api/v1/todos/:id/comments`**

获取指定 Todo 下的所有评论，按创建时间升序排列（最早的在前）。

- 公开 Todo：无需登录
- 私有 Todo：仅 superAdmin 或创建者本人可访问

#### 路径参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `id` | string | Todo 的 UUID |

#### 成功响应 `200 OK`

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": "comment-uuid",
      "todoItemId": "550e8400-e29b-41d4-a716-446655440000",
      "content": "已在本地复现，分配给我来修",
      "createdAt": "2026-02-26T12:00:00.000Z",
      "updatedAt": "2026-02-26T12:00:00.000Z",
      "author": {
        "id": "user-uuid",
        "username": "aatrooox",
        "nickname": "Aatrox",
        "avatarUrl": "https://..."
      }
    }
  ],
  "timestamp": 1234567890000
}
```

#### 示例

```bash
curl "https://zzao.club/api/v1/todos/550e8400-e29b-41d4-a716-446655440000/comments"
```

---

### 6. 发表评论

**`POST /api/v1/todos/:id/comments`**

在指定 Todo 下发表一条评论。**必须登录**。

- 私有 Todo：仅 superAdmin 或创建者本人可评论。

#### 路径参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `id` | string | Todo 的 UUID |

#### 请求体

```json
{
  "content": "已在本地复现，分配给我来修"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `content` | string | ✅ | 评论内容，1–5000 字符 |

#### 成功响应 `200 OK`

返回刚创建的评论原始数据（不含 author 关联信息，如需展示作者请调用列表接口）。

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "comment-uuid",
    "todoItemId": "550e8400-e29b-41d4-a716-446655440000",
    "authorUserId": "user-uuid",
    "content": "已在本地复现，分配给我来修",
    "createdAt": "2026-02-26T12:00:00.000Z",
    "updatedAt": "2026-02-26T12:00:00.000Z"
  },
  "timestamp": 1234567890000
}
```

#### 示例

```bash
curl -X POST "https://zzao.club/api/v1/todos/550e8400-e29b-41d4-a716-446655440000/comments" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"content": "已在本地复现，分配给我来修"}'
```

---

### 7. 获取变更日志（Events）

**`GET /api/v1/todos/changes`**

以游标分页的方式获取 Todo 变更事件流。可用于实现实时同步、活动日志展示等场景。

#### 查询参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `cursor` | number | ❌ | `0` | 上次返回的 `nextCursor`，首次请求传 `0` 或不传 |
| `limit` | number | ❌ | `50` | 每次返回条数，最大 100 |
| `todoItemId` | string | ❌ | — | 过滤特定 Todo 的事件；不传则返回所有 Todo 的事件 |

#### 成功响应 `200 OK`

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "events": [
      {
        "id": 42,
        "todoItemId": "550e8400-e29b-41d4-a716-446655440000",
        "actorUserId": "user-uuid",
        "eventType": "status_changed",
        "payload": { "before": "open", "after": "in_progress" },
        "createdAt": "2026-02-26T11:00:00.000Z"
      }
    ],
    "nextCursor": 42,
    "hasMore": false
  },
  "timestamp": 1234567890000
}
```

#### 事件类型与 payload 说明

| `eventType` | `payload` 结构 | 含义 |
|------------|----------------|------|
| `created` | `{ title, visibility, tagIds }` | Todo 被创建 |
| `edited` | `{ field: 'title', before, after }` 或 `{ field: 'description' }` | 字段被编辑 |
| `status_changed` | `{ before, after }` | 状态变更 |
| `visibility_changed` | `{ before, after }` | 可见性变更 |
| `tagged` | `{ tagIds }` | 标签被更新 |
| `commented` | `{ commentId }` | 有新评论 |

#### 轮询示例

```javascript
let cursor = 0

async function poll() {
  const res = await fetch(`https://zzao.club/api/v1/todos/changes?cursor=${cursor}&limit=50`)
  const { data } = await res.json()
  
  for (const event of data.events) {
    console.log(`[${event.eventType}] Todo ${event.todoItemId}`)
  }
  
  cursor = data.nextCursor
  
  if (data.hasMore) {
    // 立即继续拉取
    await poll()
  } else {
    // 没有更多，等待后再轮询
    setTimeout(poll, 5000)
  }
}

poll()
```

---

### 8. 获取标签列表

**`GET /api/v1/todos/tags`**

获取所有可用标签，按名称字母排序。无需认证，公开访问。

#### 成功响应 `200 OK`

```json
{
  "code": 0,
  "message": "success",
  "data": [
    { "id": "tag-uuid-1", "name": "bug", "color": "#ff0000" },
    { "id": "tag-uuid-2", "name": "feature", "color": "#00ff00" },
    { "id": "tag-uuid-3", "name": "enhancement", "color": "#0000ff" }
  ],
  "timestamp": 1234567890000
}
```

#### 示例

```bash
curl "https://zzao.club/api/v1/todos/tags"
```

---

## 典型使用场景

### 场景一：Agent 自动上报任务进度

```javascript
// 1. 创建任务
const create = await fetch('https://zzao.club/api/v1/todos', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <pat_token>',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: '[Agent] 数据清洗任务 #20260226',
    description: '清洗用户行为日志，输出到 S3',
    visibility: 'private',
    targetType: 'other',
  }),
})
const { data: todo } = await create.json()

// 2. 开始执行，更新状态（需 superAdmin token）
await fetch(`https://zzao.club/api/v1/todos/${todo.id}`, {
  method: 'PATCH',
  headers: { 'Authorization': 'Bearer <superadmin_token>', 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'in_progress' }),
})

// 3. 完成后关闭
await fetch(`https://zzao.club/api/v1/todos/${todo.id}`, {
  method: 'PATCH',
  headers: { 'Authorization': 'Bearer <superadmin_token>', 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'done' }),
})
```

### 场景二：展示公开 Issue 列表

```javascript
// 无需 token，直接拉取公开数据
const res = await fetch('https://zzao.club/api/v1/todos?page=1&size=20&status=open')
const { data } = await res.json()
console.log(`共 ${data.total} 个待处理 Issue`)
```

### 场景三：监听特定 Todo 的变更

```javascript
const todoId = '550e8400-e29b-41d4-a716-446655440000'
let cursor = 0

setInterval(async () => {
  const res = await fetch(
    `https://zzao.club/api/v1/todos/changes?todoItemId=${todoId}&cursor=${cursor}`
  )
  const { data } = await res.json()
  if (data.events.length > 0) {
    console.log('新变更：', data.events)
    cursor = data.nextCursor
  }
}, 10000)
```

---

## 接口速查表

| 方法 | 路径 | 认证 | 说明 |
|------|------|------|------|
| GET | `/api/v1/todos` | 可选 | 获取 Todo 列表（支持分页/过滤） |
| POST | `/api/v1/todos` | ✅ 必须 | 创建 Todo |
| GET | `/api/v1/todos/tags` | ❌ 无需 | 获取所有标签 |
| GET | `/api/v1/todos/changes` | ❌ 无需 | 获取变更事件流（游标分页） |
| GET | `/api/v1/todos/:id` | 可选 | 获取 Todo 详情 |
| PATCH | `/api/v1/todos/:id` | ✅ 必须 | 更新 Todo |
| GET | `/api/v1/todos/:id/comments` | 可选 | 获取评论列表 |
| POST | `/api/v1/todos/:id/comments` | ✅ 必须 | 发表评论 |
