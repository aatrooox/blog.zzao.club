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
      name: '友链',
      path: '/links',
      icon: 'pixelarticons:mood-neutral',
    },
  ]

  return {
    navItems,
  }
}
