/**
 * 通用分页工具
 * 自动导入到所有 server/ 下的文件中
 */

/**
 * 通用分页参数 schema（供 API 端点复用）
 * 用法：z.object({ ...paginationSchema, otherField: z.string() })
 */
export const paginationSchema = {
  page: z.string().optional().default('1').transform(Number),
  size: z.string().optional().default('15').transform(Number),
}

/**
 * 分页响应结构
 */
export interface PaginatedResult<T> {
  list: T[]
  total: number
  page: number
  size: number
  totalPages: number
}

/**
 * 通用分页包装器
 *
 * @param options.page - 当前页码（从1开始）
 * @param options.size - 每页条数
 * @param options.countQuery - 返回总数的 Promise
 * @param options.dataQuery - 返回数据的 Promise（调用方自行 .limit().offset()）
 *
 * @example
 * ```ts
 * const take = query.data.size
 * const skip = (query.data.page - 1) * take
 *
 * return await withPagination({
 *   page: query.data.page,
 *   size: query.data.size,
 *   countQuery: db.select({ count: count() }).from(blogMemos),
 *   dataQuery: db.select().from(blogMemos).limit(take).offset(skip),
 * })
 * ```
 */
export async function withPagination<T>({
  page,
  size,
  countQuery,
  dataQuery,
}: {
  page: number
  size: number
  countQuery: Promise<{ count: number }[]>
  dataQuery: Promise<T[]>
}): Promise<PaginatedResult<T>> {
  const [countResult, data] = await Promise.all([countQuery, dataQuery])

  const total = countResult[0]?.count ?? 0
  const totalPages = Math.ceil(total / size)

  return {
    list: data,
    total,
    page,
    size,
    totalPages,
  }
}
