export default defineEventHandler( async (event) => {
  const path = getRouterParam(event, 'path')
  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: 'path is required',
    })
  }

  const body = await useSafeValidatedBody(event, z.object({
    name: z.string(),
    text: z.string(),
    to: z.string().email(),
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error)
    })
  }

  if (path === 'mail') {
    const { name, text, to } = body.data

    const subject = `来自早早集市的回复`

    const html = `
      <div>
        <p>Hi，${name}：</p>
        <p>${text.replace(/\n/g, '<br>')}</p>
      </div>
    `
    await sendMail({ subject, html, to})
  }
})