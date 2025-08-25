// Minimal .env loader for PM2 preload (no external deps)
const fs = require('node:fs')
const process = require('node:process')

function stripBOM(text) {
  if (text.charCodeAt(0) === 0xFEFF)
    return text.slice(1)
  return text
}

function parseEnv(content) {
  const out = {}
  for (const raw of content.split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) {
      continue
    }
    // support lines like: export KEY=VAL
    const clean = line.startsWith('export ')
      ? line.slice('export '.length).trim()
      : line
    const eq = clean.indexOf('=')
    if (eq < 0) {
      continue
    }
    const key = clean.slice(0, eq).trim()
    let val = clean.slice(eq + 1)
    // Strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith('\'') && val.endsWith('\''))) {
      val = val.slice(1, -1)
    }
    out[key] = val
  }
  return out
}

const envPath = process.env.DOTENV_CONFIG_PATH || '/root/envs/blog/.env'
try {
  let content = fs.readFileSync(envPath, 'utf8')
  content = stripBOM(content)
  const parsed = parseEnv(content)
  for (const [k, v] of Object.entries(parsed)) {
    if (process.env[k] === undefined) {
      process.env[k] = v
    }
  }
}
catch (e) {
  console.error(`[pm2.preload] Failed to load env: ${envPath} -> ${e.message}`)
}
