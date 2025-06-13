import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  // important: true,
  content: [
    './app/**/*.{vue,js,ts}',
  ],
  plugins: [typography()],
  theme: {
    extend: {
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
