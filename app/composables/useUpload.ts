import COS from 'cos-js-sdk-v5'

/**
 * 上传 COS
 * @param file 文件内容
 * @param folder 保存目录配置
 * @returns 保存的地址
 */
export default async function useUpload(file: File, folder?: { name: string }) {
  const { $api } = useNuxtApp()
  const { data, error }: { data: any, error: any } = await $api.post('/api/v1/upload/cos', { filename: file.name, folder })
  if (error?.value) {
    throw new Error('上传失败')
  }
  const stsResult = data
  console.log(`sts-result`, stsResult)
  const {
    TmpSecretId,
    TmpSecretKey,
    SessionToken,
    StartTime,
    ExpiredTime,
    Bucket,
    Region,
    Key,
  } = stsResult

  const cos = new COS({
    SecretId: TmpSecretId,
    SecretKey: TmpSecretKey,
    SecurityToken: SessionToken,
    StartTime,
    ExpiredTime,
  })

  return new Promise((resolve, reject) => {
    cos.uploadFile({
      Bucket,
      Region,
      Key,
      Body: file, // 要上传的文件对象。
      onProgress(progressData) {
        console.log(`正在上传: ${progressData.percent * 100}%`)
      },
    }, (err, data) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(data)
      }
    })
  })
}
