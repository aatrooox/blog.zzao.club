export default defineAppConfig({
  // 网站基本信息
  author: '早早集市',
  // 组织
  organization: '',
  // 组织地址
  organizationUrl: 'https://zzao.club',
  // 描述
  desciption: '人生游戏 DLC',
  // 头像
  avatar: '/avatar.jpg',
  // 社交媒体 icon 从 https://icones.js.org/ 里找
  social: [
    {
      name: 'Github',
      icon: 'icon-park-outline:github',
      // 这是一个 hover 弹出框，目前用来放一个图片
      popover: '',
      url: 'https://github.com/aatrooox/blog.zzao.club',
    },
    {
      name: '微信公众号',
      icon: 'icon-park-outline:weixin-top-stories',
      popover: 'https://img.zzao.club/article/202412301618068.jpg',
    },
    {
      name: '个人微信',
      icon: 'icon-park-outline:wechat',
      popover: 'https://img.zzao.club/article/202412301618241.jpg',
    },
    {
      name: '订阅我的博客',
      icon: 'material-symbols:rss-feed-rounded',
      url: 'https://zzao.club/feed.xml',
    },
  ],
  // 标签
  // 配置后会以此处配置的标签作为 /article 页面筛选栏
  // 比如: tags: ['哈哈'], 则会搜索 文章中 tags 字段中包含(模糊搜索) '哈哈' 的文章
  // 因为观察到其他博客，如果把所有的 tags 都自动罗列出来，会有很多 tag 只有一篇文章，可能是当时随手加的，所以不如自己维护几个高频的
  tags: ['Nuxt', 'AI', 'Hono', 'Vue', '生活'],
  authLayer: {
    enabled: false,
  },
  links: [
    {
      name: 'IMGX',
      url: 'https://imgx.zzao.club',
      desc: '便捷地生成精美卡片',
    },
    {
      name: '極客死亡計劃',
      url: 'https://www.geedea.pro',
      desc: '极客死亡计划',
      logo: 'https://www.geedea.pro/favicon.png',
    },
    {
      name: '洛丽糖',
      url: 'http://luolt.cn/',
      desc: '一个宅男的云上次元世界',
      logo: 'https://q.qlogo.cn/g?b=qq&nk=1340326824&s=0',
    },
    {
      name: '封闭脑袋',
      url: 'https://www.joomaen.com/',
      logo: 'https://media.235421.xyz/favicon.png',
      desc: '零落残魂何处断',
    },
    {
      name: 'Memento',
      url: 'https://zhongxuyang.github.io/blog/',
      logo: 'https://avatars.githubusercontent.com/u/20455656?v=4',
      desc: '记忆碎片',
    },
    // {
    //   name: 'MEMOZ',
    //   url: 'https://memo.zzao.club',
    //   desc: 'Nuxt 版 Flomo',
    // }
  ],
  frameworks: [
    {
      name: 'Nuxt',
      icon: 'logos:nuxt',
      version: '3.16.2',
    },
    {
      name: 'vite',
      icon: 'logos:vitejs',
      version: '6.2.5',
    },
  ],
  // 精选文章
  featuredPosts: [
    { title: 'Nuxt4 全栈博客搭建实战', path: '/post/nuxt/nuxt3-full-stack', tag: 'Nuxt' },
    { title: '从零开始的 HonoJS 后端之旅', path: '/post/hono/hono-getting-started', tag: 'Hono' },
  ],
  products: [
    {
      name: '博客站',
      slug: 'blog',
      description: '基于Nuxt4+Drizzle+MySQL的全栈博客系统，支持SSR渲染、动态内容发布、用户系统等功能。',
      icon: 'lucide:layout-template',
      features: ['SSR 渲染', '全栈开发', '用户系统', '动态内容'],
      link: '/',
    },
    {
      name: 'Zotepad',
      slug: 'zotepad',
      description: '基于Nuxt4和Tauri2构建的多端纯本地笔记推送应用',
      icon: 'lucide:notebook-pen',
      features: ['跨平台', '本地优先', '自定义推送', '隐私安全'],
      link: '/product/zotepad',
    },
  ],
})
