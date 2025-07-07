export default defineStandardResponseHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    id: z.string(),
    content: z.string(),
    tags: z.array(z.string()).optional(),
    visible: z.string().optional(),
    defalt_floded: z.boolean().optional(),
    flod_tip: z.string().optional(),
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }

  const { id, ...memoData } = body.data
  console.log(`更新memo`, { id, ...memoData })

  // 检查memo是否存在且属于当前用户
  const existingMemo = await prisma.blogMemo.findFirst({
    where: {
      id,
      user_id: event.context.userId,
    },
  })

  if (!existingMemo) {
    throw createError({
      statusCode: 400,
      message: 'Memo不存在或无权限修改',
    })
  }

  const updateData: any = {
    ...memoData,
  }

  // 删除 tags 字段，因为我们要单独处理
  delete updateData.tags

  // 先删除现有的标签关联
  await prisma.memoTagRelations.deleteMany({
    where: {
      memoId: id,
    },
  })

  const data = await prisma.blogMemo.update({
    where: {
      id,
    },
    data: updateData,
  }).catch(() => {
    throw createError({
      statusCode: 500,
      message: '更新失败',
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

  return data
})
