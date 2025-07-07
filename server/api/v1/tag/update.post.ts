export default defineStandardResponseHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    id: z.string(),
    tag_name: z.string(),
    memo_ids: z.array(z.string()).optional(),
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }

  const { id, tag_name, memo_ids } = body.data

  // 检查 tag 是否存在且属于当前用户
  const existingTag = await prisma.memoTag.findFirst({
    where: {
      id,
      user_id: event.context.userId,
    },
  })

  if (!existingTag) {
    throw createError({
      statusCode: 400,
      message: '标签不存在或无权限修改',
    })
  }

  // 检查新名称是否与其他标签冲突
  const conflictingTag = await prisma.memoTag.findFirst({
    where: {
      tag_name,
      user_id: event.context.userId,
      id: { not: id },
    },
  })

  if (conflictingTag) {
    throw createError({
      statusCode: 400,
      message: '标签名称已存在',
    })
  }

  // 更新 tag
  const tag = await prisma.memoTag.update({
    where: { id },
    data: {
      tag_name,
    },
  })

  // 如果提供了 memo_ids，更新关联
  if (memo_ids !== undefined) {
    // 删除现有关联
    await prisma.memoTagRelations.deleteMany({
      where: {
        tagId: id,
      },
    })

    // 创建新关联
    if (memo_ids.length > 0) {
      await prisma.memoTagRelations.createMany({
        data: memo_ids.map((memoId: string) => ({
          tagId: id,
          memoId,
        })),
      })
    }
  }

  return tag
})
