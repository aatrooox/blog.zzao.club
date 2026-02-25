# 如何创建创作者账号

本文说明超级管理员如何通过管理后台或 API 创建普通创作者账号。

---

## 前提条件

- 你是 `superAdmin` 角色（第一个注册的用户自动成为超级管理员）
- 已登录并持有有效的 JWT access token

---

## 方式一：通过管理后台 UI

1. 登录站点，进入 `/admin/creators`
2. 点击右上角「新增创作者」按钮
3. 填写表单：
   - **用户名**（必填）：创作者登录用的账号名
   - **密码**（选填，默认 `changeme123`）
   - **昵称**（选填）：展示在 Memo 上的显示名
   - **头像 URL**（选填）：公开可访问的图片链接
4. 点击「创建」，成功后列表自动刷新

> 创作者默认角色为 `user`，无法拥有超级管理员权限。

---

## 方式二：通过 API

**接口**：`POST /api/v1/admin/users`

**认证**：`Authorization: Bearer <superAdmin JWT token>`

**请求体**：

```json
{
  "username": "alice",
  "password": "my-strong-password",
  "nickname": "Alice",
  "avatarUrl": "https://example.com/avatar/alice.jpg"
}
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `username` | ✅ | 唯一用户名 |
| `password` | ❌ | 默认 `changeme123` |
| `nickname` | ❌ | 展示昵称 |
| `avatarUrl` | ❌ | 头像图片 URL |

**成功响应** `200 OK`：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "uuid-xxx",
    "username": "alice",
    "nickname": "Alice",
    "avatarUrl": "https://example.com/avatar/alice.jpg",
    "role": "user"
  },
  "timestamp": 1234567890
}
```

**常见错误**：

| HTTP 状态 | code | 说明 |
|-----------|------|------|
| 400 | 3001 | 参数验证失败（username 缺失） |
| 403 | 2001 | 非超级管理员 |
| 409 | 3003 | 用户名已被占用 |

---

## 下一步

账号创建后，为其签发 PAT 才能让创作者通过 API 发布 Memo，见 [how-to-issue-pat-and-create-memo.md](./how-to-issue-pat-and-create-memo.md)。
