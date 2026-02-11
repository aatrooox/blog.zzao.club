import fs from 'node:fs'
// import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
// @tailwindcss/vite is now registered by @nuxt/ui module automatically
// import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'),
)

const appVersion = packageJson.version

const isDev = process.env.NODE_ENV === 'development'
console.log(` 当前环境为：${isDev ? '开发' : '生产'}`)
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxtjs/robots', '@nuxt/content', '@nuxt/image', '@nuxt/icon', // '@nuxtjs/robots',
    '@nuxtjs/mdc', // 以下三个模块还没有支持最新的 nuxt content 版本
    // '@nuxtjs/sitemap',
    // '@nuxtjs/robots'
    // '@nuxtjs/seo'
    '@nuxtjs/color-mode', '@pinia/nuxt', '@vueuse/nuxt', 'shadcn-nuxt', 'nuxt-nodemailer', 'nuxt-auth-utils', '@nuxt/eslint'],
  components: [
    {
      path: '~/components/common',
      prefix: '',
    },
    {
      path: '~/components/ui',
      prefix: '',
      extensions: ['.vue'],
    },
    {
      path: '~/components/animate',
      prefix: 'Animate',
    },
    {
      path: '~/components/memo',
      prefix: 'Memo',
    },
    {
      path: '~/components/vue-bits',
      pathPrefix: false,
      prefix: 'VB',
    },
    {
      path: '~/components/content',
      global: true,
    },
  ],
  image: {
    domains: ['zzao.club', 'img.zzao.club'],
    provider: isDev ? 'none' : 'ipx',
    dir: 'public',
    quality: 80,
    format: ['webp'],
  },
  imports: {
    presets: [
      {
        from: 'vue-sonner',
        imports: ['toast'],
      },
      {
        from: 'animejs',
        imports: ['animate'],
      },
    ],
  },
  devtools: { enabled: true },
  app: {
    pageTransition: false,
    layoutTransition: true,
    head: {
      script: [
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-6WVZHT91DH',
          async: true,
        },
        {
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6WVZHT91DH');
          `,
          type: 'text/javascript',
        },
      ],
      meta: [
        {
          name: 'baidu-site-verification',
          content: 'codeva-wbD6D2XuzG',
        },
        // <meta name="msvalidate.01" content="A7FB0FAB6DCCC738B8B3D60179F1496C" />
        {
          name: 'msvalidate.01',
          content: 'A7FB0FAB6DCCC738B8B3D60179F1496C',
        },
        {
          name: 'keywords',
          content: 'Nuxt4,Nuxt3,Nitro,NuxtContent,Vue,Vue3,前端,前端工程化,前端架构,Node,Hono,博客站,爬虫,副业',
        },
        // OG defaults
        {
          property: 'og:site_name',
          content: '早早集市',
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'og:locale',
          content: 'zh_CN',
        },
        // Twitter Card defaults
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://img.zzao.club' },
        { rel: 'preconnect', href: 'https://www.googletagmanager.com' },
      ],
    },
  },
  css: ['@/assets/css/tailwind.css', 'viewerjs/dist/viewer.css'],
  // nuxt/color-mode
  colorMode: {
    preference: 'light', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    dataValue: 'theme',
    classPrefix: '',
    classSuffix: '',
    storage: 'localStorage', // or 'sessionStorage' or 'cookie'
    storageKey: 'nuxt-color-mode',
  },
  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'github-light',
          langs: ['ts', 'js', 'vue', 'json', 'yml', 'yaml', 'typescript', 'javascript', 'sql', 'shell'],
        },
      },
      pathMeta: {
        slugifyOptions: {
          // Keep everything except invalid chars, this will preserve Chinese characters
          // 保留中文字符
          remove: /[$*+~()'"!\-=#?:@]/g,
        },
      },
    },
  },
  mdc: {
    components: {
      prose: false,
      map: {
        a: 'ProseA',
        p: 'ProseP',
        h1: 'ProseH1',
        h2: 'ProseH2',
        h3: 'ProseH3',
        img: 'ProseImg',
        pre: 'ProsePre',
        code: 'ProseCode',
        strong: 'ProseStrong',
        hr: 'ProseHr',
        table: 'ProseTable',
        thead: 'ProseThead',
        tbody: 'ProseTbody',
        tr: 'ProseTr',
        th: 'ProseTh',
        td: 'ProseTd',
        ul: 'ProseUl',
        li: 'ProseLi',
        blockquote: 'ProseBlockquote',
      },
    },
    headings: {
      anchorLinks: {
        h1: true,
        h2: true,
        h3: true,
      },
    },
  },
  runtimeConfig: {
    feishuWebhook: '',
    feishuUserId: '',
    baseURL: 'https://zzao.club',
    imgHost: 'https://img.zzao.club',
    jwtSecret: 'your_jwt_secret',
    cryptoSecretKey: '', // 用于加密敏感数据的密钥（至少 32 字符）
    cosRegion: '',
    cosSecretId: '',
    cosSecretKey: '',
    cosBucket: '',
    public: {
      ContentVersion: '3.0.0',
      Z_BLOG_VERSION: appVersion,
      // nuxtSecretKey:`blog-zzao-club-${uuid}`,
      imgHost: 'https://img.zzao.club',
      apiBase: 'https://zzao.club',
    },
  },
  routeRules: {
    '/': { prerender: true },
    '/article': { prerender: true },
    '/memo': { prerender: true },
    '/post/**': { prerender: true },
    '/settings': { prerender: false },
    '/admin/**': { prerender: false },
  },
  sourcemap: {
    server: isDev,
    client: isDev,
  },
  compatibilityDate: '2024-10-29',
  nitro: {
    // preset: 'bun',
    experimental: {
      tasks: true,
    },
    // scheduledTasks: {
    //   '0 * * * *': ['news:juejin'],
    // },
    errorHandler: '~~/server/error',
    moduleSideEffects: ['sharp'],
    storage: {
      redis: {
        driver: 'redis',
        host: process.env.REDIS_HOST || 'localhost',
        db: 0,
        tls: false,
        port: Number(process.env.REDIS_PORT || 6379),
      },
    },

    compressPublicAssets: {
      gzip: true,
      brotli: true,
    },
    prerender: {
      crawlLinks: true,
      failOnError: true,
      ignore: ['/_ipx'],
      routes: ['/feed.xml', '/sitemap.xml'],
    },
    imports: {
      presets: [
        {
          from: 'zod',
          imports: ['z'],
        },
        {
          from: 'h3-zod',
          imports: ['useSafeValidatedQuery', 'useSafeValidatedBody', 'useValidatedParams', 'zh'],
        },
      ],
      dirs: [
        './server/utils',
      ],
    },
    watchOptions: {
      ignored: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.git/**',
      ],
    },
  },
  vite: {
    esbuild: {
      drop: isDev ? [] : ['console', 'debugger'],
    },
    plugins: [],
    optimizeDeps: {
      include: ['debug'],
    },
    // resolve: {
    //   alias: {
    //     '.prisma/client/index-browser': path.relative(__dirname, prismaClientIndexBrowser),
    //     '@prisma/client/index-browser': path.relative(__dirname, prismaClientIndexBrowser),
    //   },
    // },
  },
  debug: isDev,
  hooks: {
    // close: () => {
    //   // @see https://github.com/nuxt/cli/issues/169#issuecomment-1729300497
    //   // Workaround for https://github.com/nuxt/cli/issues/169
    //   process.exit(0)
    // },
    'content:file:afterParse': (ctx) => {
      const { file, content } = ctx
      // 自定义content值，如 content.group = 'xxxx'
      const wordsPerMinute = 180
      const text = typeof file.body === 'string' ? file.body : ''
      const wordCount = text.split(/\s+/).length

      content.readingTime = Math.ceil(wordCount / wordsPerMinute)
    },
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  // 把 icon 和客户端捆绑在一起， 减少请求服务端
  icon: {
    clientBundle: {
      scan: true,
      includeCustomCollections: true,
      sizeLimitKb: 256,
    },
  },
  nodemailer: {
    from: '"Aatrox" <gnakzz@qq.com>',
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
      user: '',
      pass: '',
    },
  },
  robots: {
    sitemap: 'https://zzao.club/sitemap.xml',
  },
  shadcn: {
    prefix: '',
    componentDir: '~/components/ui',
  },
  ui: {
    prefix: 'U',
  },
  fonts: {
    providers: {
      google: false,
      bunny: false,
      googleicons: false,
    },
  },
})
