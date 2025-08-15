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
        // ... 您可能有的其他颜色
        bg: {
          'pixel-primary': 'rgb(var(--pixel-bg-primary) / <alpha-value>)',
          'pixel-secondary': 'rgb(var(--pixel-bg-secondary) / <alpha-value>)',
          'pixel-tertiary': 'rgb(var(--pixel-bg-tertiary) / <alpha-value>)',
          'pixel-quaternary': 'rgb(var(--pixel-bg-quaternary) / <alpha-value>)',
          'pixel-card': 'rgb(var(--pixel-bg-card) / <alpha-value>)',
          'pixel-input': 'rgb(var(--pixel-bg-input) / <alpha-value>)',
          'pixel-code': 'rgb(var(--pixel-bg-code) / <alpha-value>)',
        },
        text: {
          'pixel-primary': 'rgb(var(--pixel-text-primary) / <alpha-value>)',
          'pixel-secondary': 'rgb(var(--pixel-text-secondary) / <alpha-value>)',
          'pixel-tertiary': 'rgb(var(--pixel-text-tertiary) / <alpha-value>)',
          'pixel-muted': 'rgb(var(--pixel-text-muted) / <alpha-value>)',
          'pixel-disabled': 'rgb(var(--pixel-text-disabled) / <alpha-value>)',
          'pixel-code': 'rgb(var(--pixel-text-code) / <alpha-value>)',
        },
        border: {
          'pixel-primary': 'rgb(var(--pixel-border-primary) / <alpha-value>)',
          'pixel-secondary': 'rgb(var(--pixel-border-secondary) / <alpha-value>)',
          'pixel-input': 'rgb(var(--pixel-border-input) / <alpha-value>)',
          'pixel-focus': 'rgb(var(--pixel-border-focus) / <alpha-value>)',
        },
        shadow: {
          'pixel-primary': 'rgb(var(--pixel-shadow-primary) / <alpha-value>)',
          'pixel-secondary': 'rgb(var(--pixel-shadow-secondary) / <alpha-value>)',
          'pixel-deep': 'rgb(var(--pixel-shadow-deep) / <alpha-value>)',
          'pixel-light': 'rgb(var(--pixel-shadow-light) / <alpha-value>)',
        },
        accent: {
          'pixel-cyan': 'rgb(var(--pixel-accent-cyan) / <alpha-value>)',
          'pixel-cyan-hover': 'rgb(var(--pixel-accent-cyan-hover) / <alpha-value>)',
          'pixel-cyan-light': 'rgb(var(--pixel-accent-cyan-light) / <alpha-value>)',
          'pixel-cyan-border': 'rgb(var(--pixel-accent-cyan-border) / <alpha-value>)',
          'pixel-cyan-shadow': 'rgb(var(--pixel-accent-cyan-shadow) / <alpha-value>)',
        },
        status: {
          'pixel-success': 'rgb(var(--pixel-status-success) / <alpha-value>)',
          'pixel-success-border': 'rgb(var(--pixel-status-success-border) / <alpha-value>)',
          'pixel-warning': 'rgb(var(--pixel-status-warning) / <alpha-value>)',
          'pixel-warning-border': 'rgb(var(--pixel-status-warning-border) / <alpha-value>)',
          'pixel-error': 'rgb(var(--pixel-status-error) / <alpha-value>)',
          'pixel-error-border': 'rgb(var(--pixel-status-error-border) / <alpha-value>)',
          'pixel-info': 'rgb(var(--pixel-status-info) / <alpha-value>)',
          'pixel-info-border': 'rgb(var(--pixel-status-info-border) / <alpha-value>)',
        },
        highlight: {
          'pixel-yellow': 'rgb(var(--pixel-highlight-yellow) / <alpha-value>)',
          'pixel-green': 'rgb(var(--pixel-highlight-green) / <alpha-value>)',
          'pixel-green-text': 'rgb(var(--pixel-highlight-green-text) / <alpha-value>)',
          'pixel-green-border': 'rgb(var(--pixel-highlight-green-border) / <alpha-value>)',
          'pixel-teal': 'rgb(var(--pixel-highlight-teal) / <alpha-value>)',
          'pixel-teal-text': 'rgb(var(--pixel-highlight-teal-text) / <alpha-value>)',
          'pixel-teal-border': 'rgb(var(--pixel-highlight-teal-border) / <alpha-value>)',
        },
        gradient: {
          'pixel-start': 'rgb(var(--pixel-gradient-start) / <alpha-value>)',
          'pixel-mid': 'rgb(var(--pixel-gradient-mid) / <alpha-value>)',
          'pixel-end': 'rgb(var(--pixel-gradient-end) / <alpha-value>)',
        },
      },
      boxShadow: {
        'pixel': '4px 4px 0 0 #000000',
        'pixel-sm': '2px 2px 0 0 rgb(var(--pixel-shadow-light))',
        'pixel-md': '2px 2px 0 0 rgb(var(--pixel-shadow-light)), 4px 4px 0 0 rgb(var(--pixel-border-primary))',
        'pixel-lg': '2px 2px 0 0 rgb(var(--pixel-shadow-light)), 4px 4px 0 0 rgb(var(--pixel-border-primary)), 6px 6px 0 0 rgb(var(--pixel-shadow-primary))',
        'pixel-btn': '2px 2px 0 rgb(var(--pixel-border-primary))',
        'pixel-btn-hover': '3px 3px 0 rgb(var(--pixel-border-primary))',
        'pixel-btn-active': '1px 1px 0 rgb(var(--pixel-border-primary))',
        'pixel-btn-primary': '2px 2px 0 rgb(var(--pixel-accent-cyan-border))',
        'pixel-btn-primary-hover': '3px 3px 0 rgb(var(--pixel-accent-cyan-border))',
        'pixel-btn-primary-active': '1px 1px 0 rgb(var(--pixel-accent-cyan-border))',
        'pixel-card': '2px 2px 0 rgb(var(--pixel-border-primary)), 4px 4px 0 rgb(var(--pixel-bg-tertiary))',
        'pixel-card-hover': '2px 2px 0 rgb(var(--pixel-border-primary)), 4px 4px 0 rgb(var(--pixel-bg-tertiary)), 6px 6px 0 rgb(var(--pixel-shadow-primary))',
        'pixel-card-elevated': '2px 2px 0 rgb(var(--pixel-border-primary)), 4px 4px 0 rgb(var(--pixel-bg-tertiary)), 6px 6px 0 rgb(var(--pixel-shadow-primary))',
        'pixel-card-elevated-hover': '3px 3px 0 rgb(var(--pixel-border-primary)), 6px 6px 0 rgb(var(--pixel-bg-tertiary)), 9px 9px 0 rgb(var(--pixel-shadow-primary))',
        'pixel-border': '0 0 0 2px rgb(var(--pixel-shadow-primary)), 2px 2px 0 0 rgb(var(--pixel-shadow-light))',
        'pixel-tag': '1px 1px 0 rgb(var(--pixel-accent-cyan-border))',
        'pixel-tag-hover': '2px 2px 0 rgb(var(--pixel-accent-cyan-border))',
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
