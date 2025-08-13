import { useStorage } from '@vueuse/core'

interface NavBarStatus {
  isHidden: boolean
}

export function useNavBar() {
  // 使用 useState 进行状态管理，结合 useStorage 实现持久化
  const navBar = useState<NavBarStatus>('navBar', () => {
    // 在客户端时从 localStorage 读取，服务端使用默认值
    if (import.meta.client) {
      const stored = useStorage<NavBarStatus>('blog/navBar', {
        isHidden: true,
      })
      return stored.value
    }
    return { isHidden: true }
  })

  const pageScrolling = useState<boolean>('pageScrolling', () => {
    if (import.meta.client) {
      const stored = useStorage('blog/pageScrolling', false)
      return stored.value
    }
    return false
  })

  const scrollY = useState<number>('scrollY', () => {
    if (import.meta.client) {
      const stored = useStorage('blog/scrollY', 0)
      return stored.value
    }
    return 0
  })

  const selectionScrollY = useState<number>('selectionScrollY', () => {
    if (import.meta.client) {
      const stored = useStorage('blog/selectionScrollY', 0)
      return stored.value
    }
    return 0
  })

  // 同步状态到 localStorage
  const syncToStorage = () => {
    if (import.meta.client) {
      const navBarStorage = useStorage<NavBarStatus>('blog/navBar', { isHidden: true })
      const pageScrollingStorage = useStorage('blog/pageScrolling', false)
      const scrollYStorage = useStorage('blog/scrollY', 0)
      const selectionScrollYStorage = useStorage('blog/selectionScrollY', 0)

      navBarStorage.value = navBar.value
      pageScrollingStorage.value = pageScrolling.value
      scrollYStorage.value = scrollY.value
      selectionScrollYStorage.value = selectionScrollY.value
    }
  }

  const setNavStatus = (data: NavBarStatus) => {
    navBar.value = data
    syncToStorage()
  }

  const setPageScroll = (flag: boolean) => {
    pageScrolling.value = flag
    syncToStorage()
  }

  // 发生划词操作时的页面滚动高度
  const setSelectionScrollY = (y: number) => {
    selectionScrollY.value = y
    syncToStorage()
  }

  const setScrollY = (y: number) => {
    scrollY.value = y
    syncToStorage()
  }

  return {
    navBar: readonly(navBar),
    pageScrolling: readonly(pageScrolling),
    scrollY: readonly(scrollY),
    selectionScrollY: readonly(selectionScrollY),
    setNavStatus,
    setPageScroll,
    setScrollY,
    setSelectionScrollY,
  }
}
