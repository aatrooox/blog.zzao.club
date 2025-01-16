import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8')
)
const appVersion = packageJson.version
// const uuid = useNanoId(8)
const isDev = process.env.NODE_ENV === 'development'
console.log(` 当前环境为：${isDev ? '开发' : '生产'}`, )
// console.log(`nuxt-secret-key已更新: `, uuid)
export default defineNuxtConfig({
  // extends: '@nuxt-themes/typography',
  debug: true,
  devtools: { enabled: true },
  sourcemap: {
    server: true,
    client: true
  },
  future: {
    compatibilityVersion: 4,
  },
  app: {
    pageTransition: false,
    layoutTransition: false,
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
          type: 'text/javascript'
        }
      ]
    }
  },
  // mdc 0.11 及以下版本可能需要
  vite: {
    optimizeDeps: {
      include: ["debug"],
    },
  },
  // 把 icon 和客户端捆绑在一起， 减少请求服务端
  icon: {
    clientBundle: {
      scan: true,
      includeCustomCollections: true, 
      sizeLimitKb: 256,
    }
  },
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
    '@nuxt/image',
    '@nuxt/icon',
    // '@nuxtjs/robots',
    '@nuxtjs/mdc',
    // 以下三个模块还没有支持最新的 nuxt content 版本
    // '@nuxtjs/sitemap',
    // '@nuxtjs/robots'
    // '@nuxtjs/seo'
    '@nuxtjs/color-mode',
    '@nuxtjs/robots'
  ],
  colorMode: {
    preference: 'system', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
  },
  primevue: {
    importTheme: { from: '@@/primevue/theme.ts' },
  },
  robots: {
    sitemap: 'https://blog.zzao.club/sitemap.xml'
  },
  tailwindcss: {
    cssPath: ['@/assets/css/tailwind.css', { injectPosition: "first" }],
    configPath: 'tailwind.config',
    exposeConfig: {
      level: 2
    },
    config: {},
    viewer: true,
  },
  routeRules: {
    '/': { prerender: true },
    '/article': { prerender: true },
    '/books': { prerender: true },
    '/book/**': { prerender: true },
    '/post/**': { prerender: true } 
  },
  css: ['@/assets/css/main.css', 'primeicons/primeicons.css'],
  runtimeConfig: {
    // cosSecretId: 'your_cos_secret_id',
    // cosSecretKey: 'your_cos_secret_key',
    // cosBucket: 'your_cos_bucket',
    // cosRegion: 'your_cos_region',
    baseURL: 'https://blog.zzao.club',
    imgHost: 'https://img.zzao.club',
    // jwtSecret: 'your_jwt_secret',
    // nuxtSecretKey: `blog-zzao-club-${uuid}`,
    // cookie: {
    //   domain: isDev ? 'localhost' : 'zzao.club'
    // },
    public: {
      ContentVersion: '3.0.0-alpha.8',
      Z_BLOG_VERSION: appVersion,
      // nuxtSecretKey:`blog-zzao-club-${uuid}`,
      imgHost: 'https://img.zzao.club',
      mdc: {
        headings: {
          anchorLinks: {
            h1: true,
            h2: true,
            h3: true
          },
        }
      }
    }
  },
  // 3.0.0-alpha.8
  content: {
    build: {
      markdown: {},
      pathMeta: {
        slugifyOptions: {
          // Keep everything except invalid chars, this will preserve Chinese characters 
          // 保留中文字符
          remove: /[$*+~()'"!\-=#?:@]/g,
        }
      }
    }
  },
  nitro: {
    // preset: 'node-server',
    compressPublicAssets: {
      gzip: true,
      brotli: true
    },
    prerender: {
      crawlLinks: true,
      failOnError: false, // 
      routes: ['/feed.xml']
    },
    imports: {
      presets: [
        {
          from: 'zod',
          imports: ['z']
        },
        {
          from: 'h3-zod',
          imports: ['useSafeValidatedQuery', 'useSafeValidatedBody', 'useValidatedParams', 'zh']
        }
      ]
    },
  },
  compatibilityDate: '2024-10-29'
})