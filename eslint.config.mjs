// @ts-check
import antfu from '@antfu/eslint-config'
// import withNuxt from './.nuxt/eslint.config.mjs'

export default antfu({
  rules: {
    'ts/no-explicit-any': 'off',
    'no-console': 'off',
    'no-unreachable-loop': 'warn',
    'no-control-regex': 'warn',
  },
  // 不检查第三方的组件
  ignores: ['app/components/ui/**', '**/*.md'],
})
