export default defineStandardResponseHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    id: z.string(),
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }

  const { id } = body.data

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
      message: '标签不存在或无权限删除',
    })
  }

  // 删除 tag（关联表会自动删除，因为有 onDelete: NoAction）
  const tag = await prisma.memoTag.delete({
    where: { id },
  })

  return tag
})
