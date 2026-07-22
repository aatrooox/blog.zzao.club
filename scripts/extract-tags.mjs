/**
 * 从 content/ 文章 frontmatter 提取 tags，去重后持久化。
 * 范围与 content.config.ts 一致（排除 -*.md / news / book / Excalidraw）。
 *
 * 用法: node scripts/extract-tags.mjs
 * 输出: data/content-tags.json
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CONTENT_DIR = path.join(ROOT, 'content')
const OUT_FILE = path.join(ROOT, 'data', 'content-tags.json')

/** 与 content.config.ts exclude 对齐 */
const EXCLUDED_DIR_NAMES = new Set(['news', 'book', 'Excalidraw'])

function walkMarkdown(dir, acc = []) {
  if (!fs.existsSync(dir))
    return acc
  for (const name of fs.readdirSync(dir)) {
    if (name.startsWith('.'))
      continue
    const full = path.join(dir, name)
    let st
    try {
      st = fs.statSync(full)
    }
    catch {
      continue
    }
    if (st.isDirectory()) {
      if (EXCLUDED_DIR_NAMES.has(name))
        continue
      walkMarkdown(full, acc)
    }
    else if (name.endsWith('.md') && !name.startsWith('-')) {
      acc.push(full)
    }
  }
  return acc
}

function stripQuote(s) {
  const t = s.trim()
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith('\'') && t.endsWith('\'')))
    return t.slice(1, -1).trim()
  return t
}

/**
 * 从 frontmatter 文本解析 tags（不依赖 yaml 包）
 * 支持:
 *   tags: [a, b]
 *   tags: ["a", "b"]
 *   tags:
 *     - a
 *     - b
 */
function parseTagsFromFrontmatter(fm) {
  const tags = []

  // 单行数组: tags: [a, "b", 'c']
  const inline = fm.match(/^tags:\s*\[([^\]]*)\]\s*$/m)
  if (inline) {
    for (const part of inline[1].split(',')) {
      const t = stripQuote(part)
      if (t && t !== '全部')
        tags.push(t)
    }
    return tags
  }

  // 多行列表
  const block = fm.match(/^tags:\s*(?:#.*)?\n((?:[ \t]+-[ \t]*.+(?:\n|$))*)/m)
  if (block) {
    for (const line of block[1].split('\n')) {
      const m = line.match(/^[ \t]+-[ \t]*(.+?)\s*$/)
      if (!m)
        continue
      const t = stripQuote(m[1].replace(/\s+#.*$/, ''))
      if (t && t !== '全部')
        tags.push(t)
    }
    return tags
  }

  // 单值: tags: foo
  const single = fm.match(/^tags:\s*(.+)\s*$/m)
  if (single && !single[1].startsWith('[')) {
    const t = stripQuote(single[1].replace(/\s+#.*$/, ''))
    if (t && t !== '全部')
      tags.push(t)
  }

  return tags
}

function extractTagsFromFile(raw) {
  if (!raw.startsWith('---'))
    return []
  const end = raw.indexOf('\n---', 3)
  if (end === -1)
    return []
  const fm = raw.slice(3, end).replace(/^\r?\n/, '')
  return parseTagsFromFrontmatter(fm)
}

/** 首页 / 文章列表展示的高频 tag 数量 */
const TOP_N = 5

export function extractContentTags({ write = true, silent = false } = {}) {
  const files = walkMarkdown(CONTENT_DIR)
  const counter = new Map()
  let untaggedCount = 0

  for (const file of files) {
    let raw
    try {
      raw = fs.readFileSync(file, 'utf8')
    }
    catch {
      continue
    }
    const fileTags = extractTagsFromFile(raw)
    if (fileTags.length === 0) {
      untaggedCount += 1
      continue
    }
    for (const tag of fileTags) {
      counter.set(tag, (counter.get(tag) ?? 0) + 1)
    }
  }

  const items = [...counter.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => {
      if (b.count !== a.count)
        return b.count - a.count
      return a.name.localeCompare(b.name, 'zh-CN')
    })

  const tags = items.map(i => i.name)
  const topItems = items.slice(0, TOP_N)
  const topTags = topItems.map(i => i.name)

  const payload = {
    generatedAt: new Date().toISOString(),
    source: 'content/**/*.md',
    fileCount: files.length,
    tagCount: tags.length,
    untaggedCount,
    topN: TOP_N,
    /** 高频 topN，供首页/文章筛选栏 */
    topTags,
    topItems,
    /** 全部 tag 名（按出现次数降序） */
    tags,
    /** 全部 tag + 篇数 */
    items,
  }

  if (write) {
    fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })
    fs.writeFileSync(OUT_FILE, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
  }

  if (!silent) {
    console.log(
      `[extract-tags] scanned ${files.length} files → ${tags.length} tags, untagged ${untaggedCount}`,
    )
    console.log(`[extract-tags] top${TOP_N}: ${topTags.join(', ') || '(none)'}`)
    console.log(`[extract-tags] wrote ${path.relative(ROOT, OUT_FILE)}`)
  }

  return payload
}

// CLI
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  extractContentTags()
}
