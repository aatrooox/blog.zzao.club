export default defineAppConfig({
  // 网站基本信息
  author: '人生游戏DLC',
  // 组织
  organization: '早早集市',
  // 组织地址
  organizationUrl: 'https://zzao.club',
  // 描述
  desciption: '生活是一个需要不断学习和精心经营的游戏',
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
    },
    {
      name: '订阅我的博客',
      icon: 'material-symbols:rss-feed-rounded',
      url: 'https://blog.zzao.club/feed.xml'
    }
  ],
  // 标签
  // 配置后会以此处配置的标签作为 /article 页面筛选栏
  // 比如: tags: ['哈哈'], 则会搜索 文章中 tags 字段中包含(模糊搜索) '哈哈' 的文章
  // 因为观察到其他博客，如果把所有的 tags 都自动罗列出来，会有很多 tag 只有一篇文章，可能是当时随手加的，所以不如自己维护几个高频的
  tags: ['全部', 'Nuxt', 'Hono', 'Vue', '生活'],
  authLayer: {
    enabled: false
  },
  links: [
    {
      name: '早早集市',
      url: 'https://zzao.club',
      desc: '人生游戏DLC',
    },
    {
      name: 'IMGX',
      url: 'https://imgx.zzao.club',
      desc: '便捷地生成精美卡片',
    },
    // {
    //   name: 'MEMOZ',
    //   url: 'https://memo.zzao.club',
    //   desc: 'Nuxt 版 Flomo',
    // }
  ]
})