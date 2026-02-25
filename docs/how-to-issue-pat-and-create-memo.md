# 如何为创作者签发 PAT 并发布 Memo

本文说明超级管理员如何为创作者签发 Personal Access Token（PAT），以及创作者如何使用 PAT 通过 API 发布 Memo。

---

## 第一步：签发 PAT

### 方式一：管理后台 UI

1. 进入 `/admin/creators`
2. 找到目标创作者，点击「签发 PAT」
3. 填写：
   - **备注**（必填）：描述此 PAT 用途，如 `alice-mobile-app`
   - **有效天数**（默认 365 天）
   - **权限范围**：勾选 `memo`（发布 Memo 所需）
4. 点击「签发」，**立即复制**返回的 token — 它只展示一次

### 方式二：API

**接口**：`POST /api/v1/admin/users/:userId/pat`

**认证**：`Authorization: Bearer <superAdmin JWT token>`

**路径参数**：

| 参数 | 说明 |
|------|------|
| `userId` | 创作者的用户 UUID（创建账号时返回） |

**请求体**：

```json
{
  "note": "alice-mobile-app",
  "expiresInDays": 365,
  "scopes": ["memo"]
}
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `note` | ❌ | 备注，默认空字符串 |
| `expiresInDays` | ❌ | 有效天数，默认 365 |
| `scopes` | ❌ | 权限范围数组，默认 `["memo"]` |

**可用 scope**：

| Scope | 允许路径 | 说明 |
|-------|---------|------|
| `memo` | `/api/v1/memo/` | 发布 / 管理 Memo |
| `comment` | `/api/v1/comment/` | 管理评论 |
| `upload` | `/api/v1/upload/` | 文件上传 |
| `user` | `/api/v1/user/` | 用户信息 |
| `wx` | `/api/v1/wx/` | 微信接口 |
| `all` | `/api/v1/` | 全部权限 |

**成功响应** `200 OK`：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "pat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "note": "alice-mobile-app",
    "expiresInDays": 365,
    "scopes": ["memo"],
    "expiresAt": "2027-02-25T00:00:00.000Z",
    "message": "PAT 已签发，请立即保存，此 token 不会再次展示"
  },
  "timestamp": 1234567890
}
```

> ⚠️ **token 只返回一次**，请立即安全保存。丢失后需重新签发。

---

## 第二步：使用 PAT 发布 Memo

创作者拿到 PAT 后，通过以下方式调用 API：

**接口**：`POST /api/v1/memo/create`

**认证**：`Authorization: Bearer pat_xxxxxxxx...`

**请求体**：

```json
{
  "content": "这是我的第一条 Memo！",
  "tags": ["日常", "测试"],
  "photos": [],
  "from": "mobile"
}
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `content` | ✅ | Memo 正文，支持 Markdown |
| `tags` | ❌ | 标签数组（字符串） |
| `photos` | ❌ | 图片 URL 数组 |
| `from` | ❌ | 来源标识，默认 `blog` |

**成功响应** `200 OK`：

```json
{
  "code": 0,
  "message": "success",
  "data": { "id": "memo-uuid-xxx" },
  "timestamp": 1234567890
}
```

**curl 示例**：

```bash
curl -X POST https://zzao.club/api/v1/memo/create \
  -H "Authorization: Bearer pat_xxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello from API!", "tags": ["api"]}'
```

---

## 常见错误排查

| HTTP 状态 | code | 原因 | 解决方式 |
|-----------|------|------|---------|
| 401 | 1003 | PAT 无效或已过期 | 重新签发 PAT |
| 403 | 2002 | PAT scope 不含 `memo` | 签发时加上 `memo` scope |
| 400 | 3001 | content 字段缺失 | 请求体加上 content |
| 500 | 9001 | 服务器内部错误 | 查看服务器日志 |

---

## 流程图

```
超级管理员
  │
  ├─ POST /api/v1/admin/users          → 创建创作者账号 (role=user)
  │
  └─ POST /api/v1/admin/users/:id/pat  → 签发 PAT (scope=memo)
       │
       └─> 返回 pat_xxx token
              │
              └─> 创作者保存 token
                     │
                     └─ POST /api/v1/memo/create  → 发布 Memo ✅
```
