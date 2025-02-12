import { defineCollection, z } from '@nuxt/content';

export const collections = {
  content: defineCollection({
    type: 'page',
    source: {
      include: '**/*.md',
      exclude: ['**/-*.md', 'book/**/*.md'],
      prefix: '/post',
      // cwd: process.env.CONTENT_FS_PATH,
      repository: 'https://github.com/aatrooox/Blog',
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
  }),
  book: defineCollection({
    type: 'page',
    source: {
      include: 'book/**/*.md',
      exclude: ['book/**/-*.md'],
      // prefix: '/post',
      // cwd: process.env.CONTENT_FS_PATH,
      repository: 'https://github.com/aatrooox/Blog',
      authToken: process.env.CONTENT_REPO_TOKEN
    },
    schema: z.object({
      date: z.date(),
      lastmod: z.date(),
      tags: z.array(z.string()),
      versions: z.array(z.string()),
      showTitle: z.string(), // 用于展示时的文章名，title 用作生成 url 了，中文不利于 seo
    })
  }),
  bookConfig: defineCollection({
    type: 'data',
    source: 'bookConfig/**.json',
    schema: z.object({
      name: z.string(),
      description: z.string(),
      cover: z.string(),
      status: z.string()
    })
  })
}
