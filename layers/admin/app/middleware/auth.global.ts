export default defineNuxtRouteMiddleware((to) => {
  // 仅在客户端做路由鉴权，避免 SSR 阶段读取不到 localStorage 导致误判
  if (import.meta.server)
    return

  if (!to.path.startsWith('/admin'))
    return

  const { isSuperAdmin, user } = useUser()
  const allowed = isSuperAdmin.value === true
  console.debug('Admin route middleware (client): isSuperAdmin =', allowed, 'user =', user.value)

  if (!allowed) {
    return abortNavigation('您没有权限访问')
  }
})
