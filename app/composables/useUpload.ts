
import COS from 'cos-js-sdk-v5'
export default async function useUpload(file: File) {
  const { data, error }: { data: any, error: any} = await $http.post('/api/v1/upload/cos', { filename: file.name })
  if (error?.value) {
    throw new Error('上传失败')
  }
  const stsResult = data.value.data
  const {
    TmpSecretId,
    TmpSecretKey,
    SessionToken,
    StartTime,
    ExpiredTime,
    Bucket,
    Region,
    Key,
  } = stsResult;

  const cos = new COS({
    SecretId: TmpSecretId,
    SecretKey: TmpSecretKey,
    SecurityToken: SessionToken,
    StartTime,
    ExpiredTime,
  });

  return new Promise( (resolve, reject) => {
    cos.uploadFile({
      Bucket,
      Region,
      Key,
      Body: file, // 要上传的文件对象。
      onProgress: function(progressData) {
        console.log(`正在上传: ${progressData.percent * 100}%`);
      }
    },  (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    });
  })
  
}