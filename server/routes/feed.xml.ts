import RSS from 'rss';
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import remarkFrontmatter from 'remark-frontmatter'
import rehypeSanitize from 'rehype-sanitize'
import remarkDirective from 'remark-directive'
import remarkDirectiveRehype from 'remark-directive-rehype'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { toHtml } from 'hast-util-to-html';

export default defineEventHandler(async (event) => {

  const config = useRuntimeConfig()
  // @ts-ignore
  const posts: any = await queryCollection(event, 'content').order('date', "DESC").all();
  const feed = new RSS({
    title: '早早集市',
    site_url: config.baseURL,
    feed_url: config.baseURL + '/feed.xml',
  })

  for ( const post of posts) {
    const content = post.rawbody
    if (content) {
      const markdownContent = cleanInvalidChars(content);
      // const mdData = await parseMarkdown(markdownContent)
      // demo.push(wrapParagraphs(convertToHtml(mdData.body)))
      feed.item({
        title: post.title,
        url: `${config.baseURL}/${post.path}`,
        date: post.date,
        description: post.description,
        custom_elements: [
          {
            'content:encoded': renderPageContent(markdownContent)
          }
        ]
      })
    }
  }

  const feedString = feed.xml();

  setResponseHeader(event, 'Content-Type', 'text/xml')

  return feedString

})

function renderPageContent(content: string) {
  const pipeline = unified()
  .use(remarkParse)
  .use(remarkBreaks)
  .use(remarkFrontmatter, ["yaml"])
  .use(remarkGfm, {  singleTilde: false })
  .use(remarkDirective)
  .use(remarkDirectiveRehype)
  .use(remarkRehype)
  .use(rehypeSanitize)
  .use(rehypeAutolinkHeadings)
  .use(rehypeStringify)

  const mdastTree = pipeline.parse(content)
  const hastTree = pipeline.runSync(mdastTree, content)
  return toHtml(hastTree)
}
/**
 * 替换掉无效内容. 原因是: 不同于直接读md文件, \n 已经被转义成 \\n 所以需要转回来
 * @param content nuxt content 保存的md原内容
 * @returns 清理后的md raw content
 */
function cleanInvalidChars(content:string) {
  return content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '').replace(/\\n/g, '\n').trim();
}
