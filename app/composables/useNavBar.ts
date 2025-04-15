import { skipHydrate } from 'pinia'
import { useStorage } from '@vueuse/core'

interface NavBarStatus {
  isHidden: boolean
}

export const useNavBarStore = defineStore('navBar', () => {
  const navBar = useStorage<NavBarStatus | Record<any, any>>('blog/navBar', {});

  const setNavStatus = (data: NavBarStatus) => {
    navBar.value = data;
  }

  return {
    navBar: skipHydrate(navBar),
    setNavStatus
  }
})