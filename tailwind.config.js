import typography from '@tailwindcss/typography'
/** @type {import('tailwindcss').Config} */
export default {
  // important: true,
  content: [],
  plugins: [typography()],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            code: {
              // backgroundColor: theme('colors.gray.100'),
              // color: theme('colors.orange.400'),
              fontWeight: 'normal',
              marginLeft: theme('spacing.1'),
              marginRight: theme('spacing.1'),
              paddingLeft: theme('spacing.2'),
              paddingRight: theme('spacing.2'),
              paddingTop: '1px',
              paddingBottom: '1px',
              borderRadius: '2px',
              '&::before': {
                content: `''!important`
              },
              '&::after': {
                content: `''!important`
              }
            },
            blockquote: {
              // borderInlineStartWidth: 0,
              '& > p': {
                '&::before': {
                  content: `'「'!important`,
                  paddingRight: theme('spacing.2'),
                },
                '&::after': {
                  content: `'」'!important`,
                  paddingLeft: theme('spacing.2'),
                }
              }
            },
            p: {
              lineHeight: theme('lineHeight.loose')
            },
            pre: {
              // paddingBottom: 0,
              // paddingTop: 0,
              '& > code': {
                color: theme('colors.gray.900'),
                backgroundColor: 'transparent'
              }
            },
            a: {
              textDecoration: 'none'
            },
            img: {
              marginTop: 0,
              marginBottom: 0,
            }
          }
        }
      })
    },
  },
  
}

