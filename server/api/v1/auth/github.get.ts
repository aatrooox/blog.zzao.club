export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true,
  },
  async onSuccess(event: any, { user, tokens }: any) {
    console.log(`oauth user =>`, user)
    console.log(`oauth tokens =>`, tokens)
    await setUserSession(event, { user })

    const auth = await prisma.oAuth.findUnique({
      where: {
        provider_providerId: {
          provider: 'github',
          providerId: `${user.id}`,
        },
      },
    })

    // 保存必要的 oauth 信息
    if (!auth) {
      await prisma.oAuth.create({
        data: {
          provider: 'github',
          providerId: `${user.id}`,
        },
      })
    }

    return sendRedirect(event, '/?login=github&status=success')
  },
  // Optional, will return a json error and 401 status code by default
  onError(event: any, error: any) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/?login=github&status=fail')
  },
})
