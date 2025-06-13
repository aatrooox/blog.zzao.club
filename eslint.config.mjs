// @ts-check
import antfu from '@antfu/eslint-config'
// import pluginVue from 'eslint-plugin-vue'

// import withNuxt from './.nuxt/eslint.config.mjs'

export default antfu(
  {
    vue: {
      a11y: true,
    },
    typescript: true,
    formatters: {
      css: true,
      html: true,
      markdown: false,
    },
    ignores: ['app/components/ui/**', '**/*.md'],
  },
  // {
  //   files: ['*.vue'],
  //   plugins: {
  //     vue: pluginVue,
  //   },
  // },
  {
    ignores: ['app/components/ui/**', '**/*.md'],
    rules: {
      'ts/no-explicit-any': 'off',
      'no-console': 'off',
      'no-unreachable-loop': 'warn',
      'no-control-regex': 'warn',
      'vue-a11y/click-events-have-key-events': 'off',
      'vue-a11y/no-static-element-interactions': 'off',
      'vue-a11y/mouse-events-have-key-events': 'off',
      'vue-a11y/form-control-has-label': 'off',
      'vue-a11y/label-has-for': 'off',
    },
  },
)
