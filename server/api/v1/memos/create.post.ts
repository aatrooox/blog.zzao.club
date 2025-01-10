import prisma from "@@/server/prisma"

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
    content: z.string(),
    tags: z.string().optional(),
    visible: z.string().optional(),
    defalt_floded: z.boolean().optional(),
    flod_tip: z.string().optional(),
    user_id: z.number()
  }))
  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error)
    })
  }
  const uid = useNanoId()
  const memoData = {
      uid,
      ...body.data
  }
  console.log(`创建memo`, memoData)
  const data = await prisma.memos.create({
    data: memoData
  })

  return {
    data,
    message: 'ok'
  }
})
