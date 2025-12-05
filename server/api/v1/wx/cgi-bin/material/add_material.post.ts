/**
 * 微信公众号上传永久素材接口
 *
 * 安全措施：
 * 1. 需要用户登录（JWT 验证）
 * 2. 仅支持 image 类型
 * 3. 可选的来源验证（X-App-Source 头）
 *
 * POST /api/v1/wx/cgi-bin/material/add_material
 *
 * Body: FormData { media: File, access_token: string, type: 'image' }
 * 返回: { media_id: string, url: string }
 */

interface WxAddMaterialResponse {
  media_id?: string
  url?: string
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

  // 3. 获取上传的文件和参数
  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      message: '缺少上传文件',
      data: { code: API_CODES.VALIDATION_ERROR },
    })
  }

  // 查找各字段
  const accessTokenField = formData.find(field => field.name === 'access_token')
  const typeField = formData.find(field => field.name === 'type')
  const mediaField = formData.find(field => field.name === 'media')

  console.log('[WX Material] 上传素材参数 ========== ')
  console.log('access_token:', accessTokenField?.data?.toString())
  console.log('type:', typeField?.data?.toString())
  console.log('media:', mediaField ? `(filename: ${mediaField.filename}, type: ${mediaField.type}, size: ${mediaField.data?.byteLength} bytes)` : 'null')
  console.log('===================================')

  // 验证 access_token
  const accessToken = accessTokenField?.data?.toString()
  if (!accessToken) {
    throw createError({
      statusCode: 400,
      message: '缺少 access_token 参数',
      data: { code: API_CODES.VALIDATION_ERROR },
    })
  }

  // 验证 type，仅允许 image
  const type = typeField?.data?.toString()
  if (type !== 'image') {
    throw createError({
      statusCode: 400,
      message: '仅支持 type=image',
      data: { code: API_CODES.VALIDATION_ERROR },
    })
  }

  // 验证 media
  if (!mediaField || !mediaField.data) {
    throw createError({
      statusCode: 400,
      message: '缺少 media 字段',
      data: { code: API_CODES.VALIDATION_ERROR },
    })
  }

  // 6. 构建发送给微信的 FormData
  const wxFormData = new FormData()
  const blob = new Blob([mediaField.data as any], {
    type: mediaField.type || 'image/jpeg',
  })
  wxFormData.append('media', blob, mediaField.filename || 'image.jpg')

  // 7. 调用微信接口上传素材
  const wxApiUrl = new URL('https://api.weixin.qq.com/cgi-bin/material/add_material')
  wxApiUrl.searchParams.set('access_token', accessToken)
  wxApiUrl.searchParams.set('type', 'image')

  try {
    const rawResponse = await $fetch<WxAddMaterialResponse | string>(wxApiUrl.toString(), {
      method: 'POST',
      body: wxFormData,
      timeout: 30000, // 30 秒超时（上传文件可能较慢）
    })

    // 微信可能返回 JSON 字符串，需要解析
    const response: WxAddMaterialResponse = typeof rawResponse === 'string'
      ? JSON.parse(rawResponse)
      : rawResponse

    console.log('[WX Material] 微信接口返回结果:', response)

    // 8. 检查微信返回的错误
    if (response.errcode && response.errcode !== 0) {
      console.error('[WX Material] 微信接口返回错误:', response)
      throw createError({
        statusCode: 400,
        message: response.errmsg || '上传素材失败',
        data: {
          code: API_CODES.NETWORK_ERROR,
          wxErrcode: response.errcode,
          wxErrmsg: response.errmsg,
        },
      })
    }

    // 9. 返回成功结果
    return {
      media_id: response.media_id,
      url: response.url,
    }
  }
  catch (error: any) {
    // 如果是已经抛出的 createError，直接重新抛出
    if (error.statusCode) {
      throw error
    }

    console.error('[WX Material] 调用微信接口失败:', error)
    throw createError({
      statusCode: 502,
      message: '调用微信接口失败，请稍后重试',
      data: { code: API_CODES.NETWORK_ERROR },
    })
  }
})
