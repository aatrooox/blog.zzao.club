import { and, eq, inArray } from 'drizzle-orm'
import { db } from '~~/lib/drizzle'
import { oauths, users } from '~~/lib/drizzle/schema'

export async function updateOAuthUser(oauthId: string, userId: string) {
  try {
    await db.update(oauths)
      .set({ userId })
      .where(eq(oauths.id, oauthId))

    const data = await db.select()
      .from(oauths)
      .where(eq(oauths.id, oauthId))
      .limit(1)

    return data[0]
  }
  catch {
    throw createError({
      statusCode: 500,
      message: '更新用户失败',
    })
  }
}

/**
 * 获取用户（只取 id 与 role），不存在返回 null
 */
export async function getUserBase(userId: string) {
  if (!userId)
    return null
  const rows = await db.select({ id: users.id, role: users.role })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)
  return rows[0] || null
}

/** 判断是否为 superAdmin，未登录或不存在返回 false */
export async function isSuperAdmin(userId: string) {
  const row = await getUserBase(userId)
  return row?.role === 'superAdmin'
}

/**
 * 断言用户为 superAdmin，不符合抛出对应错误
 * 401 未登录 / 404 不存在 / 403 角色不足
 */
export async function assertSuperAdmin(userId?: string) {
  if (!userId) {
    throw createError({ statusCode: 401, message: '未登录' })
  }
  const row = await getUserBase(userId)
  if (!row) {
    throw createError({ statusCode: 404, message: '用户不存在' })
  }
  if (row.role !== 'superAdmin') {
    throw createError({ statusCode: 403, message: '无权限' })
  }
  return row
}

/**
 * 通用角色断言（单角色）
 */
export async function assertRole(userId: string | undefined, role: string) {
  if (!userId)
    throw createError({ statusCode: 401, message: '未登录' })
  const row = await getUserBase(userId)
  if (!row)
    throw createError({ statusCode: 404, message: '用户不存在' })
  if (row.role !== role)
    throw createError({ statusCode: 403, message: `需要角色: ${role}` })
  return row
}

/**
 * 支持多角色（满足其一即可）
 */
export async function assertAnyRole(userId: string | undefined, roles: string[]) {
  if (!userId)
    throw createError({ statusCode: 401, message: '未登录' })
  if (!roles.length)
    throw createError({ statusCode: 500, message: '角色列表为空' })
  const rows = await db.select({ id: users.id, role: users.role })
    .from(users)
    .where(and(eq(users.id, userId), inArray(users.role, roles)))
    .limit(1)
  const row = rows[0]
  if (!row)
    throw createError({ statusCode: 403, message: `需要角色之一: ${roles.join(', ')}` })
  return row
}
