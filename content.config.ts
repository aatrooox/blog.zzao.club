import { defineCollection, defineContentConfig, z } from '@nuxt/content';

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: {
        include: '**/*.md',
        exclude: ['**/-*.md', 'book/**/*.md', 'Excalidraw/**/*.*'],
        prefix: '/post',
        // cwd: process.env.CONTENT_FS_PATH,
        repository: process.env.CONTENT_MD_REPO_URL,
        authToken: process.env.CONTENT_REPO_TOKEN
      },
      schema: z.object({
        date: z.date(),
        showTitle: z.string(), // 用于展示时的文章名，title 用作生成 url 了，中文不利于 seo
        lastmod: z.date(),
        tags: z.array(z.string()),
        versions: z.array(z.string()),
        rawbody: z.string()
      })
    })
  }

}) 
