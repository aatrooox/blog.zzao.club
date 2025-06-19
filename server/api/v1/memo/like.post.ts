export default defineStandardResponseHandler(async (event) => {
  const body = await readBody(event)
  console.log(`body`, body)
  // const { type, memo_id } = body
  // const db = event.context.db
  // const docname = `likes-memo-${memo_id}`
  // // 获取_id是likes的数据
  // const likes = await db.get(docname).catch( (err:any) => {
  //   console.log(`获取不存在的id`, err)
  // })
  // let count = 1;
  //  if(likes) {
  //   const { _rev, _id} = likes;
  //   await db.insert({_id, count: likes.count + 1, _rev})
  //   const info = await db.get(docname)
  //   count = info.count
  //  } else {
  //   await db.insert({_id: docname, count: 1, ...body})
  //  }

  return 0
})
