import { customAlphabet } from 'nanoid'
export default function useNanoId(len = 12) {
    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', len)
    return nanoid()
}