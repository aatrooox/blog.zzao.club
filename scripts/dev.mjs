import { spawn } from 'node:child_process'
import process from 'node:process'

process.env.CHOKIDAR_USEPOLLING ??= '1'
process.env.CHOKIDAR_INTERVAL ??= '500'

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
