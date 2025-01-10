/**
 * 统一惰性处理点赞
 * 初始化时，会获取点赞数以及点赞的人，得到当前用户是否点过赞。考虑到用户可能会点赞又取消或是取消又重新点赞，所以封装此组合 api
 * 1. 未点赞，接下来的逻辑走 addHandle，一段时间后，调用 syncLikes，将 likes 新增操作同步到数据库中
 * 2. 已点赞，接下来的逻辑走 deleteHandle，一段时间后，调用 syncLikes，将 unLikes 删除操作同步到数据库中
 * @returns 
 */
export default function useLike() {
  const likes: Ref<string[]> = useState('blog_likes', () => [])
  const unLikes: Ref<string[]> = useState('blog_unlikes', () => [])
  const { user } = useUser();

  const targtMap = {
    'article': 'article_id',
    'memo': 'memo_id',
    'comment': 'comment_id',
    'subcomment': 'sub_comment_id'
  }

  // 新增操作，一段时间内的操作结果
  const addHandle = (target: string, targetId: number) => {
    if (targtMap[target]) {
      // 如果已经存在，则删除
      // 不存在则插入
      const index = likes.value.findIndex(item => item.includes(`${target}:${targtMap[target]}:${targetId}`))
      if (index > -1) {
        likes.value.splice(index, 1)
      } else {
        likes.value.push(`${target}:${targtMap[target]}:${targetId}`)
      }
    }
  }

  // 取消操作 一段时间内的操作结果
  const deleteHandle = (target: string, targetId: number) => { 
    if (targtMap[target]) {
      // 不存在则插入
      const index = unLikes.value.findIndex(item => item.includes(`${target}:${targtMap[target]}:${targetId}`))
      if (index > -1) {
        unLikes.value.splice(index, 1)
      } else {
        unLikes.value.push(`${target}:${targtMap[target]}:${targetId}`)
      }
    }
  }

  // 发起请求。同步到数据库中
  const syncLikes = async () => {
    
    if (likes.value.length) {
      
    //  const { data, error } = await $http.post('/api/v1/like/add', { target: 'memo', user_id: user?.value?.id, memo_id: props.memo.id }, { server: false })
    }
  }

  return {
    likes,
    syncLikes,
    addHandle,
    deleteHandle
  }
}