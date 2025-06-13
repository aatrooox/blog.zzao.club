// 查询用户数量 - 缓存 1 小时
export default defineEventHandler(async () => {
  const count = await prisma.user.count()
  return {
    data: count,
    msg: 'ok',
  }
})
