import { skipHydrate } from 'pinia'
import { useStorage } from '@vueuse/core'

interface NavBarStatus {
  isHidden: boolean
}

export const useNavBarStore = defineStore('navBar', () => {
  const navBar = useStorage<NavBarStatus | Record<any, any>>('blog/navBar', {});
  const pageScrolling = useStorage('blog/pageScrolling', false);
  const scrollY = useStorage('blog/scrollY', 0);
  const selectionScrollY = useStorage('blog/selectionScrollY', 0);

  const setNavStatus = (data: NavBarStatus) => {
    navBar.value = data;
  }

  const setPageScroll = (flag: boolean) => {
    pageScrolling.value = flag
  }

  // 发生划词操作时的页面滚动高度
  const setSelectionScrollY = (y: number) => {
    selectionScrollY.value = y
  }
  const setScrollY = (y: number) => {
    scrollY.value = y
  }

  return {
    navBar: skipHydrate(navBar),
    pageScrolling: skipHydrate(pageScrolling),
    scrollY: skipHydrate(scrollY),
    selectionScrollY: skipHydrate(selectionScrollY),
    setNavStatus,
    setPageScroll,
    setScrollY,
    setSelectionScrollY
  }
})