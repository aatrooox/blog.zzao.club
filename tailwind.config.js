import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  // important: true,
  content: [
    './app/**/*.{vue,js,ts}',
  ],
  plugins: [typography()],
  corePlugins: {
    // 确保 line-clamp 功能可用
    lineClamp: true,
  },
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
      },
      boxShadow: {
        // Cleaned up pixel shadows
      },
      spacing: {
        18: '4.5rem', // 72px
      },
      typography: {
        DEFAULT: {
          css: {
            'code::before': {
              content: '""', // 移除前引号
            },
            'code::after': {
              content: '""', // 移除后引号
            },
            'code': {
              // backgroundColor: theme('colors.gray.100'),
              // color: theme('colors.orange.400'),
              fontWeight: 'normal',
              fontSize: 'normal',
              // paddingTop: '1px',
              // paddingBottom: '1px',
              // borderRadius: '2px',
              // '&::before': {
              //   content: `''!important`
              // },
              // '&::after': {
              //   content: `''!important`
              // }
            },
            'blockquote': {
              // borderInlineStartWidth: 0,
              // '& > p': {
              //   '&::before': {
              //     content: `'「'!important`,
              //   },
              //   '&::after': {
              //     content: `'」'!important`,
              //   }
              // }
            },
            'p': {
              lineHeight: '2',
              // color: ''
            },
            'pre': {
              // paddingBottom: 0,
              // paddingTop: 0,
              // '& > code': {
              //   color: theme('colors.gray.900'),
              //   backgroundColor: 'transparent'
              // }
              // backgroundColor: theme('colors.zinc.100'),
            },
            'a': {
              textDecoration: 'none',
            },
            'img': {
              marginTop: 0,
              marginBottom: 0,
            },
          },
        },
      },
    },
    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      mono: ['ui-monospace', 'SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', 'monospace'],
      lxgws: ['LXGWS', 'sans-serif'],
      pixel: ['Inter', 'sans-serif'], // 映射到现代字体，保持兼容性
      cartoon: ['Nunito', 'sans-serif'],
      // douyin: ['DouYin', 'sans-serif'],
      // ipix: ['IPIX', 'sans-serif'],
      // silver: ['Silver', 'sans-serif'],
      // nanodsong: ['NanoDSong', 'sans-serif']
    },
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'pc': '1140px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
  },

}
