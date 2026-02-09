import { SitemapStream, streamToPromise } from 'sitemap'

export default defineEventHandler(async (event) => {
  try {
    const smStream = new SitemapStream({ hostname: 'https://zzao.club/' })
    const posts: any[] = await queryCollection(event, 'content').order('date', 'DESC').all()

    // Static pages
    const staticPages = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/article', changefreq: 'daily', priority: 0.8 },
      { url: '/memo', changefreq: 'daily', priority: 0.7 },
      { url: '/about', changefreq: 'monthly', priority: 0.5 },
      { url: '/links', changefreq: 'monthly', priority: 0.5 },
      { url: '/news', changefreq: 'weekly', priority: 0.6 },
      { url: '/imgx', changefreq: 'monthly', priority: 0.4 },
      { url: '/product', changefreq: 'monthly', priority: 0.6 },
      { url: '/product/zotepad', changefreq: 'monthly', priority: 0.6 },
    ]
    staticPages.forEach((page) => {
      smStream.write(page)
    })

    posts.forEach((post: any) => {
      smStream.write({
        url: post.path,
        changefreq: 'daily',
        lastmod: post.lastmod,
      })
      // console.log(`https://zzao.club` + post.path)
    })
    smStream.end()
    const xmlString = await streamToPromise(smStream).then(buffer => buffer.toString())
    setResponseHeader(event, 'Content-Type', 'text/xml')

    return xmlString
  }
  catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: '解析错误',
    })
  }
})
