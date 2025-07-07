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

  const createData: any = {
    ...memoData,
  }

  // 删除 tags 字段，因为我们要单独处理
  delete createData.tags

  const data = await prisma.blogMemo.create({
    data: createData,
  }).catch(() => {
    throw createError({
      statusCode: 500,
      message: '创建失败',
    })
  })

  // 如果存在 tags，创建标签和关联
  if (memoData.tags?.length) {
    for (const tagName of memoData.tags) {
      // 查找或创建标签
      const tag = await prisma.memoTag.upsert({
        where: {
          tag_name: tagName,
        },
        update: {},
        create: {
          tag_name: tagName,
          user_id: event.context.userId,
        },
      })

      // 创建关联
      await prisma.memoTagRelations.create({
        data: {
          tagId: tag.id,
          memoId: data.id,
        },
      })
    }
  }
  console.log('create ok => ', data)
  return data
})
