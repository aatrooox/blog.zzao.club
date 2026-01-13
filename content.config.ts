import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: {
        include: '**/*.md',
        exclude: ['**/-*.md', 'book/**/*.md', 'Excalidraw/**/*.*'],
        prefix: '/post',
        // cwd: 'content',
      },
      schema: z.object({
        date: z.date(),
        showTitle: z.string(), // 用于展示时的文章名，title 用作生成 url 了，中文不利于 seo [已弃用此字段]
        lastmod: z.date(),
        tags: z.array(z.string()),
        versions: z.array(z.string()),
        rawbody: z.string(),
      }),
    }),
  },

})
