import prisma from "@@/server/prisma"
import { useSafeValidatedBody } from 'h3-zod'
import useNanoId from '../../../utils/useNanoId';

// uid           String     @unique
//   content       String
//   create_ts     DateTime   @default(now())
//   updated_ts    DateTime   @updatedAt
//   tags          String     @default("[]")
//   visible       String     @default("public") // 可见性 public / group / private 
//   defalt_floded Boolean    @default(false) // 默认折起
//   flod_tip      String? // 折起时，在标题栏展示折起的原因
//   user_id       Int

export default defineEventHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    id: z.number()
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error)
    })
  }
  

  const data = await prisma.memos.delete({
    where: {
      id: body.data.id
    }
  })

  return {
    data,
    message: 'ok'
  }
})
