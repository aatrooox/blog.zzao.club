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
        group: z.string().optional(), // 分组，这些显示组名，用于显示系列文章，用冒号分割层级 如 面试题:前端
        versions: z.array(z.string()),
        rawbody: z.string(),
      }),
    }),
  },

})
