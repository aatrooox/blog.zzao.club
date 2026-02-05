export const useAppNavigation = () => {
  const navItems = [
    {
      name: '首页',
      path: '/',
      icon: 'pixelarticons:home',
    },
    {
      name: '文章',
      path: '/article',
      icon: 'pixelarticons:article',
    },
    {
      name: '动态',
      path: '/memo',
      icon: 'pixelarticons:message-processing',
    },
    {
      name: '推文',
      path: '/news',
      icon: 'pixelarticons:radio-signal',
    },
    {
      name: '友链',
      path: '/links',
      icon: 'pixelarticons:mood-neutral',
    },
    // {
    //   name: '关于',
    //   path: '/about',
    //   icon: 'pixelarticons:info-box',
    // },
  ]

  return {
    navItems,
  }
}
