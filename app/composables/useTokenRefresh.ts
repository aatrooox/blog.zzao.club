/**
 * Token 自动刷新机制
 * 定期检查并刷新即将过期的 access token
 */

export function useTokenRefresh() {
  const userStore = useUser()
  const { refreshToken } = useAuth()

  let refreshTimer: NodeJS.Timeout | null = null

  // 停止自动刷新
  const stopAutoRefresh = () => {
    if (refreshTimer) {
      clearInterval(refreshTimer)
      refreshTimer = null
    }
  }

  // 启动自动刷新机制
  const startAutoRefresh = () => {
    if (refreshTimer) {
      clearInterval(refreshTimer)
    }

    // 每分钟检查一次token状态
    refreshTimer = setInterval(async () => {
      if (!userStore.isLogin.value) {
        stopAutoRefresh()
        return
      }

      // 如果access token在5分钟内过期，自动刷新
      const expiresAt = new Date(userStore.tokenInfo.value.accessExpiresAt)
      const now = new Date()
      const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000)

      if (expiresAt <= fiveMinutesFromNow) {
        console.log('Access token 即将过期，自动刷新...')
        try {
          await refreshToken()
          console.log('Token 自动刷新成功')
        }
        catch (error) {
          console.error('Token 自动刷新失败:', error)
          stopAutoRefresh()
        }
      }
    }, 60 * 1000) // 每分钟检查一次
  }

  // 在组件挂载时启动，卸载时停止
  onMounted(() => {
    if (userStore.isLogin.value) {
      startAutoRefresh()
    }
  })

  onUnmounted(() => {
    stopAutoRefresh()
  })

  // 监听登录状态变化
  watch(() => userStore.isLogin.value, (isLogin) => {
    if (isLogin) {
      startAutoRefresh()
    }
    else {
      stopAutoRefresh()
    }
  })

  return {
    startAutoRefresh,
    stopAutoRefresh,
  }
}
