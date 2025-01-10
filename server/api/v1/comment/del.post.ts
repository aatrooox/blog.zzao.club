import prisma from "@@/server/prisma"
import { useSafeValidatedBody } from 'h3-zod'
import useNanoId from '../../../utils/useNanoId';

export default defineEventHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    id: z.number()
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error)
    })
  }
  

  const data = await prisma.comments.delete({
    where: {
      id: body.data.id
    }
  })

  return {
    data,
    message: 'ok'
  }
})
