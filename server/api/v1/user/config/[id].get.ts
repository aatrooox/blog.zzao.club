export default defineStandardResponseHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'userId is required',
    })
  }

  const userConfig = await prisma.userConfig.findUnique({
    where: {
      userId: id,
    },
  })

  return userConfig
})
