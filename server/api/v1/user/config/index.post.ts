import { eq } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { userConfigs } from '~~/lib/drizzle/schema'

// 更新和创建用户配置
export default defineStandardResponseHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    userId: z.string(),
    allowEmailNotify: z.number().optional().default(0),
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error),
    })
  }
  // 前端校验合法性
  const { userId, allowEmailNotify } = body.data

  // 检查是否已存在配置
  const existingConfig = await db.select()
    .from(userConfigs)
    .where(eq(userConfigs.userId, userId))
    .limit(1)

  let config
  if (existingConfig.length > 0) {
    // 更新现有配置
    await db.update(userConfigs)
      .set({ allowEmailNotify })
      .where(eq(userConfigs.userId, userId))

    config = await db.select()
      .from(userConfigs)
      .where(eq(userConfigs.userId, userId))
      .limit(1)

    config = existingConfig[0]
  }
  else {
    // 创建新配置
    const now = new Date()
    await db.insert(userConfigs).values({
      userId,
      allowEmailNotify,
      createdAt: now,
      updatedAt: now,
    })

    const configResult = await db.select()
      .from(userConfigs)
      .where(eq(userConfigs.userId, userId))
      .limit(1)

    config = configResult[0]
  }

  return config
})
