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
      lastmod: z.date(),
      tags: z.array(z.string()),
      versions: z.array(z.string()),
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
