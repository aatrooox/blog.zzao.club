export default defineCachedEventHandler(async (_) => {
  const memoCount = await prisma.blogMemo.count()

  return {
    data: memoCount,
    msg: 'ok',
  }
}, { maxAge: 60 * 60 * 12 }) // 缓存 12 小时
