import path from 'node:path'
import { useSafeValidatedBody } from 'h3-zod'
import STS from 'qcloud-cos-sts'

export default defineEventHandler(async (event) => {
  const body = await useSafeValidatedBody(event, {
    filename: z.string(),
    folder: z.object({
      name: z.string(),
    }).optional(),
  })

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }

  const { cosSecretId, cosSecretKey, cosBucket, cosRegion } = useRuntimeConfig(event)
  console.log(`COS配置:`, { cosSecretId, cosSecretKey, cosBucket, cosRegion })
  const config = {
    secretId: cosSecretId,
    secretKey: cosSecretKey,
    bucket: cosBucket,
    region: cosRegion,
    durationSeconds: 1800, // 签名过期时间
    // 密钥的上传操作权限列表
    allowActions: [
      // 简单上传
      'name/cos:PutObject',
      // 分块上传
      'name/cos:InitiateMultipartUpload',
      'name/cos:ListMultipartUploads',
      'name/cos:ListParts',
      'name/cos:UploadPart',
      'name/cos:CompleteMultipartUpload',
    ],
  }

  // 生成要上传的 COS 文件路径文件名
  const generateCosKey = function (filename: string, ext: string, folder?: { name: string }) {
    const date = new Date()
    const m = date.getMonth() + 1
    const ymd = `${date.getFullYear()}${m < 10 ? `0${m}` : m}${date.getDate()}`
    const r = (`000000${Math.random() * 1000000}`).slice(-6)
    console.log('生成COS文件名', folder)
    let cosKey
    // 如果自定义了路径，则使用自定义路径，否则使用日期路径
    if (folder) {
      cosKey = `blog/${event.context.userId}/${folder.name}/${ymd}_${filename ? `${filename}` : `${r}${ext}`}`
    }
    else {
      cosKey = `blog/${event.context.userId}/${ymd}/${ymd}_${filename ? `${filename}` : `${r}${ext}`}`
    }
    return cosKey
  }

  function getSts({ cosKey, condition }: any) {
    return new Promise((resolve, reject) => {
      // 获取临时密钥
      const AppId = config.bucket.substr(config.bucket.lastIndexOf('-') + 1)
      const resource
        = `qcs::cos:${
          config.region
        }:uid/${
          AppId
        }:${
          config.bucket
        }/${
          cosKey}`
      console.log('检查resource是否正确', resource)
      const policy = {
        version: '2.0',
        statement: [
          {
            action: config.allowActions,
            effect: 'allow',
            resource: [
              // cos相关授权路径
              resource,
              // ci相关授权路径 按需使用
              // 'qcs::ci:' + config.region + ':uid/' + AppId + ':bucket/' + config.bucket + '/' + 'job/*',
            ],
            condition,
          },
        ],
      }
      const startTime = Math.round(Date.now() / 1000)
      STS.getCredential(
        {
          secretId: config.secretId,
          secretKey: config.secretKey,
          // proxy: config.proxy,
          region: config.region,
          durationSeconds: config.durationSeconds,
          // endpoint: 'sts.internal.tencentcloudapi.com', // 支持设置sts内网域名
          policy,
        } as any,
        (err, tempKeys) => {
          if (tempKeys)
            tempKeys.startTime = startTime
          if (err) {
            reject(err)
          }
          else {
            resolve(tempKeys)
          }
        },
      )
    })
  }

  // 上传文件可控制类型、大小，按需开启
  const permission = {
    limitExt: true, // 限制上传文件后缀
    extWhiteList: ['.jpg', '.jpeg', '.png', '.gif', '.webp'], // 限制的上传后缀
    limitContentType: true, // 限制上传 contentType
    limitContentLength: 10 * 1024 * 1024, // 限制上传文件大小
  }

  const filename = body.data.filename
  const ext = path.extname(filename)
  const cosKey = generateCosKey(filename, ext, body.data.folder)
  const condition = {}
  // 校验文件类型
  if (permission.limitExt) {
    const extInvalid = !ext || !permission.extWhiteList.includes(ext)
    if (extInvalid) {
      throw createError({
        statusCode: 400,
        message: '文件类型不支持',
      })
    }
  }

  // 2. 限制上传文件 content-type
  if (permission.limitContentType) {
    Object.assign(condition, {
      string_like: {
        // 只允许上传 content-type 为图片类型
        'cos:content-type': 'image/*',
      },
    })
  }

  // 3. 限制上传文件大小
  if (permission.limitContentLength) {
    Object.assign(condition, {
      numeric_less_than_equal: {
        // 上传大小限制不能超过 5MB
        'cos:content-length': 10 * 1024 * 1024,
      },
    })
  }

  const data: any = await getSts({ cosKey, condition }).catch((err) => {
    console.log(`getSts报错`, err)
    throw createError({
      statusCode: 500,
      message: err.message,
    })
  })

  const result = {
    TmpSecretId: data.credentials.tmpSecretId,
    TmpSecretKey: data.credentials.tmpSecretKey,
    SessionToken: data.credentials.sessionToken,
    StartTime: Math.round(Date.now() / 1000),
    ExpiredTime: data.expiredTime,
    Bucket: config.bucket,
    Region: config.region,
    Key: cosKey,
  }
  console.log(`获取临时密钥成功`)
  return {
    data: result,
    message: 'ok',
  }
})
