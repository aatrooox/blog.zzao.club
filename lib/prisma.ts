import process from 'node:process'
import { PrismaClient } from '~~/prisma/generated/prisma'

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>

} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production')
  globalThis.prismaGlobal = prisma

function prismaClientSingleton() {
  return new PrismaClient()
}
