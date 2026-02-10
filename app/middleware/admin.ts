export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server)
    return

  const { isLogin, isSuperAdmin } = useUser()
  const toast = useGlobalToast()

  if (!isLogin.value) {
    return navigateTo(`/admin/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }

  if (!isSuperAdmin.value) {
    toast.error('权限不足')
    return navigateTo('/')
  }
})
