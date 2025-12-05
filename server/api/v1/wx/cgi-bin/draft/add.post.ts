/**
 * 微信公众号新增草稿接口
 *
 * 安全措施：
 * 1. 需要用户登录（JWT 验证）
 * 2. 可选的来源验证（X-App-Source 头）
 *
 * POST /api/v1/wx/cgi-bin/draft/add?access_token=ACCESS_TOKEN
 *
 * Body: { articles: Article[] }
 * 返回: { media_id: string }
 */

interface ImageInfo {
  image_media_id: string
}

interface Article {
  /** 文章类型: news=图文消息, newspic=图片消息 */
  article_type: 'news' | 'newspic'
  /** 标题 */
  title: string
  /** 作者 */
  author?: string
  /** 摘要 */
  digest?: string
  /** 具体内容 */
  content: string
  /** 封面图 media_id，article_type=news 时必填，article_type=newspic 时为封面图 */
  thumb_media_id?: string
  /** 是否打开评论 0=不打开 1=打开，默认打开 */
  need_open_comment?: number
  /** 图片信息，article_type=newspic 时必填 */
  image_info?: ImageInfo[]
}

interface DraftAddRequest {
  articles: Article[]
}

interface WxDraftAddResponse {
  media_id?: string
  errcode?: number
  errmsg?: string
}

export default defineStandardResponseHandler(async (event) => {
  // 1. 验证用户已登录
  const userId = event.context.userId
  if (!userId) {
    throw createError({
      statusCode: 401,
      message: '请先登录',
      data: { code: API_CODES.NO_TOKEN },
    })
  }

  // 2. 可选：验证请求来源
  const appSource = getHeader(event, 'X-App-Source')
  const validSources = ['zotepad', 'zotepad-desktop']
  if (appSource && !validSources.includes(appSource)) {
    throw createError({
      statusCode: 403,
      message: '非法请求来源',
      data: { code: API_CODES.FORBIDDEN },
    })
  }

  // 3. 获取并验证 query 参数
  const query = getQuery(event)
  const accessToken = query.access_token as string

  if (!accessToken) {
    throw createError({
      statusCode: 400,
      message: '缺少 access_token 参数',
      data: { code: API_CODES.VALIDATION_ERROR },
    })
  }

  // 4. 获取请求体
  const body = await readBody<DraftAddRequest>(event)
  if (!body?.articles || !Array.isArray(body.articles) || body.articles.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'articles 参数必须是非空数组',
      data: { code: API_CODES.VALIDATION_ERROR },
    })
  }

  // 5. 验证每篇文章的必填字段
  for (let i = 0; i < body.articles.length; i++) {
    const article = body.articles[i]

    // 验证 article_type
    if (!['news', 'newspic'].includes(article.article_type)) {
      throw createError({
        statusCode: 400,
        message: `articles[${i}].article_type 必须是 news 或 newspic`,
        data: { code: API_CODES.VALIDATION_ERROR },
      })
    }

    // 验证 title
    if (!article.title) {
      throw createError({
        statusCode: 400,
        message: `articles[${i}].title 不能为空`,
        data: { code: API_CODES.VALIDATION_ERROR },
      })
    }

    // 验证 content
    if (!article.content) {
      throw createError({
        statusCode: 400,
        message: `articles[${i}].content 不能为空`,
        data: { code: API_CODES.VALIDATION_ERROR },
      })
    }

    // article_type=news 时，thumb_media_id 必填
    if (article.article_type === 'news' && !article.thumb_media_id) {
      throw createError({
        statusCode: 400,
        message: `articles[${i}].thumb_media_id 在 article_type=news 时必填`,
        data: { code: API_CODES.VALIDATION_ERROR },
      })
    }

    // article_type=newspic 时，image_info 必填
    if (article.article_type === 'newspic') {
      if (!article.image_info || !Array.isArray(article.image_info) || article.image_info.length === 0) {
        throw createError({
          statusCode: 400,
          message: `articles[${i}].image_info 在 article_type=newspic 时必填`,
          data: { code: API_CODES.VALIDATION_ERROR },
        })
      }
    }

    // 设置 need_open_comment 默认值
    if (article.need_open_comment === undefined) {
      article.need_open_comment = 1
    }
  }

  // 6. 调用微信接口新增草稿
  const wxApiUrl = new URL('https://api.weixin.qq.com/cgi-bin/draft/add')
  wxApiUrl.searchParams.set('access_token', accessToken)

  try {
    const response = await $fetch<WxDraftAddResponse>(wxApiUrl.toString(), {
      method: 'POST',
      body: { articles: body.articles },
      timeout: 30000,
    })

    // 7. 检查微信返回的错误
    if (response.errcode && response.errcode !== 0) {
      console.error('[WX Draft] 微信接口返回错误:', response)
      throw createError({
        statusCode: 400,
        message: response.errmsg || '新增草稿失败',
        data: {
          code: API_CODES.NETWORK_ERROR,
          wxErrcode: response.errcode,
          wxErrmsg: response.errmsg,
        },
      })
    }

    // 8. 返回成功结果
    return {
      media_id: response.media_id,
    }
  }
  catch (error: any) {
    // 如果是已经抛出的 createError，直接重新抛出
    if (error.statusCode) {
      throw error
    }

    console.error('[WX Draft] 调用微信接口失败:', error)
    throw createError({
      statusCode: 502,
      message: '调用微信接口失败，请稍后重试',
      data: { code: API_CODES.NETWORK_ERROR },
    })
  }
})
