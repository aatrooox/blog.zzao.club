import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: {
        include: '**/*.md',
        exclude: ['**/-*.md', 'book/**/*.md', 'news/**/*.*', 'Excalidraw/**/*.*'],
        prefix: '/post',
        // cwd: 'content',
      },
      schema: z.object({
        date: z.date(),
        showTitle: z.string(), // 用于展示时的文章名，title 用作生成 url 了，中文不利于 seo [已弃用此字段]
        lastmod: z.date(),
        tags: z.array(z.string()),
        group: z.string().optional(), // 分组，这些显示组名，用于显示系列文章，用冒号分割层级 如 面试题:前端
        author: z.string().optional(), // 作者，用于区分 Jinx 等多作者内容
        versions: z.array(z.string()),
        rawbody: z.string(),
      }),
    }),
    news: defineCollection({
      type: 'data',
      source: 'news/**/*.json',
      schema: z.object({
        posts: z.array(z.object({
          index: z.number(),
          username: z.string(),
          postId: z.string(),
          publishTime: z.string(),
          postLink: z.string().url(),
          textContent: z.string(),
          views: z.string(),
          likes: z.string(),
          retweets: z.string(),
          replies: z.string(),
        })),
      }),
    }),
  },

})
