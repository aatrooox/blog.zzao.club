export default defineStandardResponseHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    tag_name: z.string(),
    memo_id: z.string().optional(),
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }

  const { tag_name, memo_id } = body.data

  // 检查 tag 是否已存在
  const existingTag = await prisma.memoTag.findFirst({
    where: {
      tag_name,
      user_id: event.context.userId,
    },
  })

  if (existingTag) {
    throw createError({
      statusCode: 400,
      message: '标签已存在',
    })
  }

  // 创建 tag
  const tag = await prisma.memoTag.create({
    data: {
      tag_name,
      user_id: event.context.userId,
    },
  })

  // 如果提供了 memo_id，创建关联
  if (memo_id) {
    await prisma.memoTagRelations.create({
      data: {
        tagId: tag.id,
        memoId: memo_id,
      },
    })
  }

  return tag
})
