import { customAlphabet } from 'nanoid'
export function useNanoId(len = 16) {
  const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
  return nanoid(len)
}