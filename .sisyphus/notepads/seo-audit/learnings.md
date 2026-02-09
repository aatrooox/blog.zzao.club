# SEO Audit Learnings

## 2026-02-09 Batch 1
- `nuxt.config.ts` uses `app.head.meta` array for global meta tags. OG tags use `property` attr, Twitter use `name` attr.
- `useSeoMeta()` and `useHead()` can coexist in the same component — they merge.
- For JSON-LD: use `useHead({ script: [{ type: 'application/ld+json', innerHTML: JSON.stringify({...}) }] })`
- `page.value` from `usePageByPath()` has: `.seo.title`, `.seo.description`, `.date`, `.lastmod`, `.tags`, `.id`, `.title`, `.body`, `.group`
- Author is always "Aatrox", publisher is "早早集市", base URL is `https://zzao.club`
- The project uses Nuxt 4 + Vue 3 + `<script setup>` syntax
- ESLint uses `@antfu/eslint-config` — single quotes, 2-space indent, no semicolons required
- Errors return HTTP 200 with `code` field — this is intentional design

## 2026-02-09 Batch 2 P1-1 Part 1
- Global OG defaults added to `nuxt.config.ts` lines 106-123: og:site_name, og:type, og:locale, twitter:card
- These serve as fallbacks; page-level `useSeoMeta` will override them
