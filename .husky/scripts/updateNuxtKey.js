import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))


const packagePath = path.join(__dirname, '..', '..', 'package.json')

const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))

const versionParts = packageJson.version
  .split('.')
  .map((part) => parseInt(part, 10))

versionParts[2] += 1

packageJson.version = versionParts.join('.')

console.log(` ======== 当前版本: ${packageJson.version} ========`)
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n')