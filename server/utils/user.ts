export async function updateOAuthUser(oauthId: string, userId: string) {
  const data = await prisma.oAuth.update({
    where: {
      id: oauthId,
    },
    data: {
      userId,
    },
  }).catch(() => {
    throw createError({
      statusCode: 500,
      message: '更新用户失败',
    })
  })

  return data
}
