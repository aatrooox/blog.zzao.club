import fs from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
// @ts-ignore
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8')
)

const appVersion = packageJson.version
// const uuid = useNanoId(8)
const isDev = process.env.NODE_ENV === 'development'
console.log(` 当前环境为：${isDev ? '开发' : '生产'}`, )
import { createRequire } from 'module'

const { resolve } = createRequire(import.meta.url)

const prismaClient = `prisma${path.sep}client`

const prismaClientIndexBrowser = resolve('@prisma/client/index-browser').replace(`@${prismaClient}`, `.${prismaClient}`)
// console.log(`nuxt-secret-key已更新: `, uuid)
export default defineNuxtConfig({
  // extends: '@nuxt-themes/typography',
  debug: isDev,
  devtools: { enabled: true },
  extends: [
    // README https://github.com/aatrooox/zc-auth-layer
    // ['github:aatrooox/zc-auth-layer', { install: true }]
    // 'zc-auth-layer'
  ],
  sourcemap: {
    server: isDev,
    client: isDev
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
        },
        {
          src: 'https://umami.zzao.club/script.js',
          defer: true,
          "data-website-id": "ede2b0ce-e029-41f7-9d56-be35fc07ba6c"
        }
      ],
      meta: [
        {
          name: 'baidu-site-verification',
          content: 'codeva-wbD6D2XuzG'
        },
        // <meta name="msvalidate.01" content="A7FB0FAB6DCCC738B8B3D60179F1496C" />
        {
          name: 'msvalidate.01',
          content: 'A7FB0FAB6DCCC738B8B3D60179F1496C'
        }
      ]
    }
  },
  // mdc 0.11 及以下版本可能需要
  vite: {
    plugins: [
      tailwindcss()
    ],
    optimizeDeps: {
      include: ["debug"],
    },
    resolve: {
      alias: {
        ".prisma/client/index-browser": path.relative(__dirname, prismaClientIndexBrowser)
      }
    }
  },
  modules: [
    '@nuxtjs/robots',
    '@nuxt/content',
    // '@primevue/nuxt-module',
    '@nuxt/image',
    '@nuxt/icon',
    // '@nuxtjs/robots',
    '@nuxtjs/mdc',
    // 以下三个模块还没有支持最新的 nuxt content 版本
    // '@nuxtjs/sitemap',
    // '@nuxtjs/robots'
    // '@nuxtjs/seo'
    '@nuxtjs/color-mode',
    '@prisma/nuxt',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'shadcn-nuxt',
    'vue-sonner/nuxt'
  ],
  // 把 icon 和客户端捆绑在一起， 减少请求服务端
  icon: {
    clientBundle: {
      scan: true,
      includeCustomCollections: true,
      sizeLimitKb: 256,
    }
  },
  // nuxt/color-mode
  colorMode: {
    preference: 'system', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    dataValue: 'theme',
    classPrefix: '',
    classSuffix: '',
    storage: 'localStorage', // or 'sessionStorage' or 'cookie'
    storageKey: 'nuxt-color-mode'
  },
  // primevue 移除中
  // primevue: {
  //   importTheme: { from: '@@/primevue/theme.ts' },
  // },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './app/components/ui'
  },
  robots: {
    sitemap: 'https://zzao.club/sitemap.xml'
  },
  routeRules: {
    '/': { prerender: true },
    '/article': { prerender: true },
    '/post/**': { prerender: true }
  },
  css: ['@/assets/css/main.css', 'viewerjs/dist/viewer.css'],
  runtimeConfig: {
    feishuWebhook: '',
    feishuUserId: '',
    baseURL: 'https://zzao.club',
    imgHost: 'https://img.zzao.club',
    jwtSecret: 'your_jwt_secret',
    public: {
      ContentVersion: '3.0.0',
      Z_BLOG_VERSION: appVersion,
      // nuxtSecretKey:`blog-zzao-club-${uuid}`,
      imgHost: 'https://img.zzao.club',
    }
  },
  // 3.0.0-alpha.8
  mdc: {
    headings: {
      anchorLinks: {
        h1: true,
        h2: true,
        h3: true
      },
    }
  },
  content: {
    
    build: {
      
      markdown: {
        highlight: {
          // Theme used in all color schemes.
          // theme: 'one-dark-pro',
          // OR
          theme: {
            // Default theme (same as single string)
            default: 'one-dark-pro',
            // Theme used if `html.dark`
            dark: 'one-dark-pro',
            // Theme used if `html.sepia`
            // sepia: 'text'
          },
          langs: ['ts', 'js', 'vue', 'json', 'yml', 'yaml', 'typescript', 'javascript', 'sql']
        }
      },
      pathMeta: {
        slugifyOptions: {
          // Keep everything except invalid chars, this will preserve Chinese characters
          // 保留中文字符
          remove: /[$*+~()'"!\-=#?:@]/g,
        }
      }
    }
  },
  imports: {
    presets: [
      {
        from: "vue-sonner",
        imports: ['toast']
      }
    ]
  },
  nitro: {
    // preset: 'bun',
    storage: {
      redis: {
        driver: 'redis',
        host: 'localhost',
        db: 0,
        tls: false,
        port: 6379,
      }
    },
    
    compressPublicAssets: {
      gzip: true,
      brotli: true
    },
    prerender: {
      crawlLinks: true,
      failOnError: true, //
      routes: ['/feed.xml', '/sitemap.xml']
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
      ],
      dirs: [
        './server/utils'
      ]
    },
    watchOptions: {
      ignored: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.git/**'
      ]
    }
  },
  compatibilityDate: '2024-10-29'
})