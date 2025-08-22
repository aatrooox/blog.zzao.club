import Crawler from 'crawler'

export default defineTask({
  meta: {
    name: 'news:juejin',
    description: '爬取掘金最新榜单',
  },
  async run() {
    interface ArticleItem {
      rank: number
      title: string
      url: string
      author: string
    }

    return new Promise<any>((resolve) => {
      const c = new Crawler({
        maxConnections: 1,
        rateLimit: 3000, // 增加延时到3秒
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        },
      })

      c.add([
        {
          url: 'https://juejin.cn/hot/articles',
          callback: async (err: any, res: any, done: any) => {
            if (err) {
              console.error(err)
              done()
              resolve({ result: 'error' })
              return
            }

            const $ = res.$
            const list: ArticleItem[] = []

            // 先检查页面内容
            console.log('页面标题:', $('title').text())

            // 尝试多种选择器
            let $rows = $('.hot-list').find('a')
            console.log('方式1 - .hot-list a:', $rows.length)

            if ($rows.length === 0) {
              // 尝试其他可能的选择器
              $rows = $('.hot-list-container a')
              console.log('方式2 - .hot-list-container a:', $rows.length)
            }

            if ($rows.length === 0) {
              // 尝试直接查找文章链接
              $rows = $('a[href^="/post/"]')
              console.log('方式3 - a[href^="/post/"]:', $rows.length)
            }

            if ($rows.length === 0) {
              // 尝试查找包含文章的任何链接
              $rows = $('a').filter((_i: any, el: any) => {
                const href = $(el).attr('href')
                return href && href.includes('/post/')
              })
              console.log('方式4 - 包含/post/的链接:', $rows.length)
            }

            $rows.slice(0, 20).each((i: number, el: any) => {
              const $el = $(el)
              const title = $el.find('.title, .article-title, .entry-title').text().trim()
                || $el.text().trim()
              const href = $el.attr('href')
              const url = href?.startsWith('http') ? href : `https://juejin.cn${href}`
              const author = $el.find('.author, .article-author-name-text, .username').text().trim() || 'unknown'

              if (title && href) {
                list.push({ rank: i + 1, title, url, author })
              }
            })

            console.log(`抓取到 ${list.length} 条数据`)
            console.table(list)

            done()
            resolve({ result: 'ok', data: list })
          },
        },
      ])
    })
  },
})
