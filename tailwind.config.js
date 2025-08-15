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
        bg: {
          'pixel-primary': 'var(--pixel-bg-primary)',
          'pixel-secondary': 'var(--pixel-bg-secondary)',
          'pixel-tertiary': 'var(--pixel-bg-tertiary)',
          'pixel-card': 'var(--pixel-bg-card)',
          'pixel-input': 'var(--pixel-bg-input)',
          'pixel-code': 'var(--pixel-bg-code)',
        },
        text: {
          'pixel-primary': 'var(--pixel-text-primary)',
          'pixel-secondary': 'var(--pixel-text-secondary)',
          'pixel-tertiary': 'var(--pixel-text-tertiary)',
          'pixel-muted': 'var(--pixel-text-muted)',
          'pixel-disabled': 'var(--pixel-text-disabled)',
          'pixel-code': 'var(--pixel-text-code)',
        },
        border: {
          'pixel-primary': 'var(--pixel-border-primary)',
          'pixel-secondary': 'var(--pixel-border-secondary)',
          'pixel-input': 'var(--pixel-border-input)',
          'pixel-focus': 'var(--pixel-border-focus)',
        },
        shadow: {
          'pixel-primary': 'var(--pixel-shadow-primary)',
          'pixel-secondary': 'var(--pixel-shadow-secondary)',
        },
        accent: {
          'pixel-primary': 'var(--pixel-accent-primary)',
          'pixel-cyan': 'var(--pixel-accent-cyan)',
          'pixel-cyan-hover': 'var(--pixel-accent-cyan-hover)',
          'pixel-cyan-light': 'var(--pixel-accent-cyan-light)',
          'pixel-cyan-border': 'var(--pixel-accent-cyan-border)',
          'pixel-cyan-shadow': 'var(--pixel-accent-cyan-shadow)',
        },
        status: {
          'pixel-success': 'var(--pixel-status-success)',
          'pixel-success-border': 'var(--pixel-status-success-border)',
          'pixel-warning': 'var(--pixel-status-warning)',
          'pixel-warning-border': 'var(--pixel-status-warning-border)',
          'pixel-error': 'var(--pixel-status-error)',
          'pixel-error-border': 'var(--pixel-status-error-border)',
          'pixel-info': 'var(--pixel-status-info)',
          'pixel-info-border': 'var(--pixel-status-info-border)',
        },
        highlight: {
          'pixel-yellow': 'var(--pixel-highlight-yellow)',
          'pixel-green': 'var(--pixel-highlight-green)',
          'pixel-green-text': 'var(--pixel-highlight-green-text)',
          'pixel-green-border': 'var(--pixel-highlight-green-border)',
          'pixel-teal': 'var(--pixel-highlight-teal)',
          'pixel-teal-text': 'var(--pixel-highlight-teal-text)',
          'pixel-teal-border': 'var(--pixel-highlight-teal-border)',
        },
        gradient: {
          'pixel-start': 'var(--pixel-gradient-start)',
          'pixel-mid': 'var(--pixel-gradient-mid)',
          'pixel-end': 'var(--pixel-gradient-end)',
        },
      },
      boxShadow: {
        'pixel': '4px 4px 0 0 #000000',
        'pixel-sm': '2px 2px 0 0 var(--pixel-shadow-light)',
        'pixel-md': '2px 2px 0 0 var(--pixel-shadow-light), 4px 4px 0 0 var(--pixel-border-primary)',
        'pixel-lg': '2px 2px 0 0 var(--pixel-shadow-light), 4px 4px 0 0 var(--pixel-border-primary), 6px 6px 0 0 var(--pixel-shadow-primary)',
        'pixel-btn': '2px 2px 0 var(--pixel-border-primary)',
        'pixel-btn-hover': '3px 3px 0 var(--pixel-border-primary)',
        'pixel-btn-active': '1px 1px 0 var(--pixel-border-primary)',
        'pixel-btn-primary': '2px 2px 0 var(--pixel-accent-cyan-border)',
        'pixel-btn-primary-hover': '3px 3px 0 var(--pixel-accent-cyan-border)',
        'pixel-btn-primary-active': '1px 1px 0 var(--pixel-accent-cyan-border)',
        'pixel-card': '2px 2px 0 var(--pixel-bg-card), 4px 4px 0 var(--pixel-bg-tertiary)',
        'pixel-card-hover': '2px 2px 0 var(--pixel-border-primary), 4px 4px 0 var(--pixel-bg-tertiary), 6px 6px 0 var(--pixel-shadow-primary)',
        'pixel-card-elevated': '2px 2px 0 var(--pixel-border-primary), 4px 4px 0 var(--pixel-bg-tertiary), 6px 6px 0 var(--pixel-shadow-primary)',
        'pixel-card-elevated-hover': '3px 3px 0 var(--pixel-border-primary), 6px 6px 0 var(--pixel-bg-tertiary), 9px 9px 0 var(--pixel-shadow-primary)',
        'pixel-border': '0 0 0 2px var(--pixel-shadow-primary), 2px 2px 0 0 var(--pixel-shadow-light)',
        'pixel-tag': '1px 1px 0 var(--pixel-accent-cyan-border)',
        'pixel-tag-hover': '2px 2px 0 var(--pixel-accent-cyan-border)',
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
      sans: ['LXGWS', 'sans-serif'],
      mono: ['ui-monospace', 'SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', 'monospace'],
      lxgws: ['LXGWS', 'sans-serif'],
      pixel: ['"Press Start 2P"', 'monospace'],
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
