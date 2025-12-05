import { Buffer } from 'node:buffer'
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'

/**
 * AES-256-GCM 加密工具
 * 用于敏感数据的加密传输（如 AppID、AppSecret）
 */

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12 // GCM 推荐的 IV 长度
const AUTH_TAG_LENGTH = 16

/**
 * 获取加密密钥（从环境变量）
 * 始终使用 SHA-256 哈希确保密钥长度为 32 字节，与客户端保持一致
 */
function getEncryptionKey(): Buffer {
  const key = useRuntimeConfig().cryptoSecretKey
  if (!key) {
    throw new Error('NUXT_CRYPTO_SECRET_KEY 环境变量未配置')
  }
  // 始终使用 SHA-256 哈希，确保与客户端一致
  return createHash('sha256').update(key).digest()
}

/**
 * 加密数据
 * @param plaintext 明文
 * @returns 加密后的字符串（格式：iv:authTag:ciphertext，均为 base64）
 */
export function encrypt(plaintext: string): string {
  const key = getEncryptionKey()
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH })

  let encrypted = cipher.update(plaintext, 'utf8', 'base64')
  encrypted += cipher.final('base64')

  const authTag = cipher.getAuthTag()

  // 格式：iv:authTag:ciphertext
  return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`
}

/**
 * 解密数据
 * @param encryptedData 加密字符串（格式：iv:authTag:ciphertext）
 * @returns 解密后的明文
 */
export function decrypt(encryptedData: string): string {
  const key = getEncryptionKey()
  const parts = encryptedData.split(':')

  if (parts.length !== 3) {
    throw new Error('加密数据格式无效')
  }

  const [ivBase64, authTagBase64, ciphertext] = parts
  const iv = Buffer.from(ivBase64, 'base64')
  const authTag = Buffer.from(authTagBase64, 'base64')

  const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH })
  decipher.setAuthTag(authTag)

  let decrypted = decipher.update(ciphertext, 'base64', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}

/**
 * 加密对象（自动 JSON 序列化）
 */
export function encryptObject<T>(obj: T): string {
  return encrypt(JSON.stringify(obj))
}

/**
 * 解密对象（自动 JSON 反序列化）
 */
export function decryptObject<T>(encryptedData: string): T {
  const decrypted = decrypt(encryptedData)
  return JSON.parse(decrypted) as T
}
