import { decryptObject } from '~~/server/utils/crypto'

interface WxCredentials {
  appId: string
  appSecret: string
}

interface WxTokenResponse {
  access_token?: string
  expires_in?: number
  errcode?: number
  errmsg?: string
}

/**
 * 微信公众号 Access Token 获取接口
 *
 * 安全措施：
 * 1. 需要用户登录（JWT 验证）
 * 2. AppID 和 AppSecret 需加密传输
 * 3. 可选的来源验证（X-App-Source 头）
 *
 * POST /api/v1/wx/cgi-bin/token
 *
 * Body: { encrypted: "加密后的凭证字符串" }
 * 凭证格式: { appId: string, appSecret: string }
 */
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

  // 2. 可选：验证请求来源（Tauri App 可以设置自定义 Header）
  const appSource = getHeader(event, 'X-App-Source')
  const validSources = ['zotepad', 'zotepad-desktop'] // 允许的来源
  if (appSource && !validSources.includes(appSource)) {
    throw createError({
      statusCode: 403,
      message: '非法请求来源',
      data: { code: API_CODES.FORBIDDEN },
    })
  }

  // 3. 获取加密的凭证
  const body = await readBody<{ encrypted: string }>(event)
  if (!body?.encrypted) {
    throw createError({
      statusCode: 400,
      message: '缺少加密凭证',
      data: { code: API_CODES.VALIDATION_ERROR },
    })
  }

  // 4. 解密凭证
  let credentials: WxCredentials
  try {
    credentials = decryptObject<WxCredentials>(body.encrypted)
  }
  catch (error) {
    console.error('[WX Token] 解密失败:', error)
    throw createError({
      statusCode: 400,
      message: '凭证解密失败，请检查加密密钥是否正确',
      data: { code: API_CODES.VALIDATION_ERROR },
    })
  }

  // 5. 验证凭证完整性
  if (!credentials.appId || !credentials.appSecret) {
    throw createError({
      statusCode: 400,
      message: 'AppID 或 AppSecret 不能为空',
      data: { code: API_CODES.VALIDATION_ERROR },
    })
  }

  // 6. 调用微信接口获取 Access Token
  const wxApiUrl = new URL('https://api.weixin.qq.com/cgi-bin/token')
  wxApiUrl.searchParams.set('grant_type', 'client_credential')
  wxApiUrl.searchParams.set('appid', credentials.appId)
  wxApiUrl.searchParams.set('secret', credentials.appSecret)

  try {
    const response = await $fetch<WxTokenResponse>(wxApiUrl.toString(), {
      method: 'GET',
      timeout: 10000, // 10 秒超时
    })

    // 7. 检查微信返回的错误
    if (response.errcode && response.errcode !== 0) {
      console.error('[WX Token] 微信接口返回错误:', response)
      throw createError({
        statusCode: 400,
        message: response.errmsg || '获取微信 Token 失败',
        data: {
          code: API_CODES.VALIDATION_ERROR,
          wxErrcode: response.errcode,
          wxErrmsg: response.errmsg,
        },
      })
    }

    // 8. 返回成功结果
    return {
      accessToken: response.access_token,
      expiresIn: response.expires_in, // 通常是 7200 秒（2 小时）
    }
  }
  catch (error: any) {
    // 如果是我们自己抛出的错误，直接重新抛出
    if (error.statusCode) {
      throw error
    }

    // 网络或其他错误
    console.error('[WX Token] 请求微信接口失败:', error)
    throw createError({
      statusCode: 500,
      message: '请求微信服务失败，请稍后重试',
      data: { code: API_CODES.NETWORK_ERROR },
    })
  }
})
