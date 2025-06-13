import { SitemapStream, streamToPromise } from 'sitemap'

export default defineEventHandler(async (event) => {
  try {
    const smStream = new SitemapStream({ hostname: 'https://zzao.club/' })
    const posts: any[] = await queryCollection(event, 'content').order('date', 'DESC').all()
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
