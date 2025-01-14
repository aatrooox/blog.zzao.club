import RSS from 'rss';
import { parseMarkdown } from '@nuxtjs/mdc/runtime'

export default defineEventHandler(async (event) => {

  const config = useRuntimeConfig()
  // @ts-ignore
  const posts: any = await queryCollection(event, 'content').all();
  console.log(`posts`, posts[1])
  const feed = new RSS({
    title: '早早集市',
    site_url: config.baseURL,
    feed_url: config.baseURL + '/feed.xml',
  })

  const demo = [];

  for ( const post of posts) {
    const content = post.rawbody
    if (content) {
      const markdownContent = cleanInvalidChars(content);
      const mdData = await parseMarkdown(markdownContent)
      demo.push(extractContent(mdData.body))
      feed.item({
        title: post.title,
        url: `${config.baseURL}/${post.path}`,
        date: post.date,
        description: post.description,
        custom_elements: [
          {
            'content:encoded': extractContent(mdData.body)
          }
        ]
      })
    }
  }
  // const content = posts[0].rawbody
  // const markdownContent = content.replace(/^---[\s\S]*?---/, '').trim();


  // const mdData = await parseMarkdown(markdownContent)

  // const feedString = extractContent(mdData.body)
  const feedString = feed.xml();

  setResponseHeader(event, 'Content-Type', 'text/xml')

  // return demo
  // console.log(`feedString`, feedString)
  return feedString

  // const { data } = await useAsyncData('feed-content', async () => {
  //   return queryCollection('content').order('date', 'DESC').select('id', 'path', 'title', 'date', 'tags', 'description', 'versions', 'lastmod', 'meta').all()
  // })
  // const data = $fetch('/api/content/content/query', {
  //   context: event ? { cloudflare: event.context.cloudflare } : {},
  //   headers: { 'content-type': 'application/json' },
  //   method: 'POST',
  //   body: {
  //     sql: 'SELECT * FROM contents ORDER BY date DESC'
  //   }
  // }) 

  // console.log(`data`, data)
  // return posts
})

function cleanInvalidChars(content:string) {
  // 移除 ASCII 控制字符（0-31，除了换行符和制表符）
  return content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '').replace(/^---[\s\S]*?---/, '').trim();
}

export function extractContent(
  node: any | null
): string {
  if (!node)
    return ''
  if (typeof node === 'string') {
    return node
  }
  if (Array.isArray(node)) {
    return node.map(extractContent).join('')
  }
  if (typeof node === 'object' && node !== null) {
    if (node.type === 'text' && typeof node.value === 'string') {
      return node.value
    }
    if ('tag' in node && typeof node.tag === 'string') {
      // 忽略 style 标签
      if (node.tag === 'style') {
        return ''
      }

      let attributes = ''
      if (node.props && node.tag !== 'pre' && node.tag !== 'code') {
        attributes = Object.entries(node.props)
          .filter(([key]) => !['style'].includes(key))
          .map(([key, value]) => `${key}="${value}"`)
          .join(' ')

        if (attributes) {
          attributes = ` ${attributes}`
        }
      }

      const content = Array.isArray(node.children)
        ? extractContent(node.children)
        : ''

      return `<${node.tag}${attributes}>${content}</${node.tag}>`
    }
    if (Array.isArray(node.children)) {
      return extractContent(node.children)
    }
  }
  return ''
}
