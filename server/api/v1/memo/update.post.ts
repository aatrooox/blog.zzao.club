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

  const tagsCreate = []
  // 更新memo时, 同步创建tag, 并更新关联表
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

  const updateData: any = {
    ...memoData,
    tags: null,
  }

  // 先删除现有的标签关联
  await prisma.memoTagRelations.deleteMany({
    where: {
      memoId: id,
    },
  })

  if (tagsCreate.length) {
    updateData.tags = {
      create: tagsCreate,
    }
  }
  else {
    // 不存在时要删除此字段, 不然会报错
    delete updateData.tags
  }

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

  return data
})
