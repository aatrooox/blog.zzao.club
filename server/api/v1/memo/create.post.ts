export default defineStandardResponseHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    content: z.string(),
    tags: z.array(z.string()).optional(),
    visible: z.string().optional(),
    defalt_floded: z.boolean().optional(),
    flod_tip: z.string().optional(),
    user_id: z.string(),
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }
  const memoData = {
    ...body.data,
  }
  console.log(`创建memo`, memoData)
  const tagsCreate = []
  // 创建memo时, 同步创建tag, 并更新关联表
  if (memoData.tags?.length) {
    for (const tag of memoData.tags) {
      tagsCreate.push({
        tag: {
          connectOrCreate: {
            where: {
              tag_name: tag,
            },
            create: {
              tag_name: tag,
              user_id: event.context.userId,
            },
          },
        },
      })
    }
  }

  const createData: any = {
    ...memoData,
    tags: null,
  }

  if (tagsCreate.length) {
    createData.tags = {
      create: tagsCreate,
    }
  }
  else {
    // 不存在时要删除此字段, 不然会报错
    delete createData.tags
  }
  const data = await prisma.blogMemo.create({
    data: createData,
  }).catch(() => {
    throw createError({
      statusCode: 500,
      message: '创建失败',
    })
  })

  return data
})
