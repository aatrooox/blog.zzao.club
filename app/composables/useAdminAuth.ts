export function useAdminAuth() {
  const { tokenInfo, isLogin, isSuperAdmin, user } = useUser()
  const isChecking = ref(false)
  const isAuthorized = ref(false)

  async function checkAdmin(): Promise<boolean> {
    if (!isLogin.value) {
      return false
    }

    isChecking.value = true
    try {
      const { data } = await useFetch('/api/v1/user/me', {
        headers: {
          Authorization: `Bearer ${tokenInfo.value.accessToken}`,
        },
      })

      if (!data.value)
        return false

      const response = data.value as any
      if (response.code !== 0)
        return false

      isAuthorized.value = response.data?.role === 'superAdmin'
      return isAuthorized.value
    }
    catch {
      return false
    }
    finally {
      isChecking.value = false
    }
  }

  return {
    isChecking: readonly(isChecking),
    isAuthorized: readonly(isAuthorized),
    isSuperAdmin,
    isLogin,
    user,
    checkAdmin,
  }
}
