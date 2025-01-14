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
    },
    {
      name: '订阅我的博客',
      icon: 'material-symbols:rss-feed-rounded',
      url: 'https://blog.zzao.club/feed.xml'
    }
  ],
  // 小册配置请前往/content/bookConfig/*.json 一个json对应一本小册, 名称随意
  // book
  // 标签
  // 配置后会以此处配置的标签作为 /article 页面筛选栏
  // 比如: tags: ['哈哈'], 则会搜索 文章中 tags 字段中包含(模糊搜索) '哈哈' 的文章
  tags: ['Nuxt', 'Hono', 'Vue3', '博客', '吐槽']
})