export default defineAppConfig({
  // 网站基本信息
  author: '最新最全 Nuxt4 全栈开发内容',
  // 组织
  organization: '早早集市',
  // 组织地址
  organizationUrl: 'https://zzao.club',
  // 描述
  desciption: '基于 Obsidian 生成的博客站, 支持一键复制文章样式到公众号, 保持排版一致',
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
  tags: ['全部', 'Nuxt', 'Hono', 'Vue', 'issue'],
  authLayer: {
    enabled: false
  }
})