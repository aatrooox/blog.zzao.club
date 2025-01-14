import RSS from 'rss';

export default defineEventHandler(async (event) => {

  // @ts-ignore
  const posts: any = await queryCollection(event, 'content').order('date', 'DESC').all();
  // console.log(`posts`, posts[0])
  const feed = new RSS({
    title: '早早集市',
    site_url: 'https://blog.zzao.club',
    feed_url: 'https://blog.zzao.club/feed.xml',
  })

  for ( const post of posts) {
    feed.item({
      title: post.title,
      url: `https://blog.zzao.club/${post.path}`,
      date: post.date,
      description: post.description,
      // custom_elements: [
      //   {
      //     'content:encoded': extractContent(post.body.value)
      //   }
      // ]
    })
  }


  const feedString = feed.xml();

  setResponseHeader(event, 'Content-Type', 'text/xml')
  // return posts[0]
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
