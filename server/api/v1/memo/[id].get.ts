import { eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { blogMemos } from '~~/lib/drizzle/schema'

export default defineStandardResponseHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'id is required',
    })
  }

  const data = await db.query.blogMemos.findFirst({
    where: eq(blogMemos.id, id),
    with: {
      user: {
        columns: {
          username: true,
          avatarUrl: true,
        },
      },
      comments: {
        with: {
          user: {
            columns: {
              username: true,
              avatarUrl: true,
            },
          },
        },
      },
      tags: {
        with: {
          tag: {
            columns: {
              id: true,
              tagName: true,
            },
          },
        },
      },
    },
  })

  return data
})
