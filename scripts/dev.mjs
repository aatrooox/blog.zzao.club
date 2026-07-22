import { spawn } from 'node:child_process'
import process from 'node:process'
import { extractContentTags } from './extract-tags.mjs'

process.env.CHOKIDAR_USEPOLLING ??= '1'
process.env.CHOKIDAR_INTERVAL ??= '500'

// 启动前刷新筛选标签（content frontmatter → data/content-tags.json）
try {
  extractContentTags()
}
catch (err) {
  console.warn('[dev] extract-tags failed:', err?.message || err)
}

const args = process.argv.slice(2)
const cmd = process.platform === 'win32' ? 'nuxt.cmd' : 'nuxt'

const child = spawn(cmd, ['dev', ...args], {
  stdio: 'inherit',
  env: process.env,
})

child.on('exit', (code, signal) => {
  if (typeof code === 'number')
    process.exit(code)
  if (signal)
    process.exit(1)
  process.exit(0)
})
