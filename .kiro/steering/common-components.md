# 通用组件库 (app/components/common)

## 可用组件列表

### 用户相关组件

- **UserAvatar** - 用户头像组件，支持用户信息显示
- **AppUserMenu** - 用户菜单组件
- **AppLoginDialog** - 登录对话框
- **AppRegisterDialog** - 注册对话框
- **UserConfigDrawer** - 用户配置抽屉

### 导航和菜单组件

- **AppMenuBar** - 主菜单栏组件
- **AppMenu** - 菜单组件
- **AppNavDrawer** - 导航抽屉
- **AppToc** - 目录组件 (Table of Contents)

### 内容展示组件

- **AppImg** - 图片组件，可能包含懒加载等功能
- **AppOverflowContent** - 溢出内容处理组件
- **PagePanel** - 页面面板组件
- **MemoPanel** - 备忘录面板组件

### 评论系统组件

- **CommentViewPanel** - 评论查看面板
- **SubCommentsViewPanel** - 子评论查看面板
- **QuoteComment** - 引用评论组件
- **AppCommentInput** - 评论输入组件

### 搜索和输入组件

- **AppSearchDialog** - 搜索对话框
- **ResourceSearchDialog** - 资源搜索对话框
- **AppTagInput** - 标签输入组件

### 视觉效果组件

- **AuroraBackground** - 极光背景效果组件
- **InteractiveGridPattern** - 交互式网格图案组件

### 其他功能组件

- **AppMsgFlow** - 消息流组件

## 使用规范

### 组件引用

- 这些组件已通过 Nuxt 自动导入配置，可直接在模板中使用
- 组件名称无前缀，直接使用如 `<UserAvatar />` 而不是 `<AppUserAvatar />`

### 组件特性

- 所有组件使用统一的亮色主题
- 组件设计遵循项目的 UI 规范
- 大部分组件支持响应式设计

### 常用组件组合

- 用户相关：`UserAvatar` + `AppUserMenu`
- 导航相关：`AppMenuBar` + `AppNavDrawer`
- 评论系统：`CommentViewPanel` + `AppCommentInput`
- 搜索功能：`AppSearchDialog` + `ResourceSearchDialog`

## 注意事项

- 使用组件前请确认其 props 和 events 接口
- 某些组件可能依赖特定的 store 或 composable
- 组件可能包含内部状态管理，使用时注意数据流向
