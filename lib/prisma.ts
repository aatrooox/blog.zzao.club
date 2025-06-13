import process from 'node:process'
import { PrismaClient } from '@prisma/client'

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
// eslint-disable-next-line no-restricted-globals
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production')
  globalThis.prismaGlobal = prisma

function prismaClientSingleton() {
  return new PrismaClient()
}
