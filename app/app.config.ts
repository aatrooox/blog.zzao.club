export default defineAppConfig({
  // 网站基本信息
  author: '博客站',
  // 组织
  organization: '早早集市',
  // 组织地址
  organizationUrl: 'https://zzao.club',
  // 描述
  desciption: '基于 Obsidian 的 Github 仓库生成博客站，文章和小册在 OB 里维护。',
  // 头像
  avatar: 'https://img.zzao.club/article/202412301500611.png',
  // 社交媒体 icon 从 https://icones.js.org/ 里找
  social: [
    {
      name: 'Github',
      icon: 'icon-park-outline:github',
      // 这是一个 hover 弹出框，目前用来放一个图片
      popover: '',
      url: 'https://github.com/aatrooox/blog.zzao.club'
    },
    {
      name: '微信公众号',
      icon: 'icon-park-outline:weixin-top-stories',
      popover: 'https://img.zzao.club/article/202412301618068.jpg',
    },
    {
      name: '个人微信',
      icon: 'icon-park-outline:wechat',
      popover: 'https://img.zzao.club/article/202412301618241.jpg'
    }
  ],
  book: {
    list: [
      {
        name: 'Nuxt问题合集',
        url: 'https://img.zzao.club/article/202412261015007.png'
      }
    ]
  }
})