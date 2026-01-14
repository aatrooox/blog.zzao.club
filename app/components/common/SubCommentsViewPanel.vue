<script lang="ts" setup>
// import anime from 'animejs/lib/anime.es.js'

const props = defineProps<Props>()
const emit = defineEmits(['refresh'])
const toast = useGlobalToast()
const userStore = useUser()
// const commentReplyMap = ref<{ [key: string]: boolean }>({})
const { updateDateFromNow } = useDayjs()
const { $api } = useNuxtApp()
const showCommentInput = ref(false)
// const likeCount = ref('0')
// const likeIcon = ref(null)
// type BlogCommentWithUserInfo = Prisma.BlogCommentGetPayload<{
//   include: { user_info: true, _count: true }
// }>
// type BlogSubCommentWithUserInfo = Prisma.BlogSubCommentGetPayload<{
//   include: { _count: true }
// }>
// const subComments = ref<any[]>([])

interface Props {
  comment: any
  hideBtns?: boolean
  commentUserMap: Record<string, string>
}

// 使用一级评论 id 获取二级评论

// 回复评论
function commentReply() {
  showCommentInput.value = true
}

// 发送一条评论
async function createSubComment(message: Record<any, any>, subComment: Props['comment']) {
  console.log(`sub msg `, message)
  console.log('sub comment', subComment)
  const res = await $api.post('/api/v1/comment/sub/create', {
    comment_id: subComment.commentId, // 当前一级评论的 id
    content: message.content,
    reply_sub_comment_id: subComment?.id, // 回复的二级评论的 id
    user_id: userStore?.user.value.id, // 当前用户
  })

  if (!res.error) {
    showCommentInput.value = false
    //  上级刷新
    emit('refresh')
  }
}

// 渲染二级评论时，获取其他二级评论
function getSubCommentUsernameById(subcomment_id: string) {
  return props.commentUserMap[subcomment_id]
}
// function checkDetail(comment: any) {
//   navigateTo(`/m/${comment.uid}`)
// }

// 删除
async function delComment(subComment: Props['comment']) {
  const res = await $api.post('/api/v1/comment/sub/del', { id: subComment.id })
  if (res.error)
    return
  toast.add({ type: 'success', message: '删除成功' })
  // refreshList()
  emit('refresh')
}

async function fetchSubComments() {
  // const { data, error, status, refresh } = await $http.post<any[]>('/api/v1/comment/sub/list', { comment_id: props.comment.id }, { server: false, watch: [userStore] })
  // subComments.value = data.value?.data ?? []
}

async function refreshList() {
  await fetchSubComments()
}

// onMounted(async () => {
//   await fetchSubComments()
// })

defineExpose({ refreshList })
</script>

<template>
  <div class="sub-comments relative pl-4 transition-all duration-300 ease-in-out group">
    <div class="sub-commit-item relative transition-all duration-300 ease-in-out">
      <div class="flex gap-3">
        <div class="flex-shrink-0">
          <UserAvatar :user-info="comment.user_info" class="size-8 md:size-9 border border-zinc-200 dark:border-zinc-700 rounded-full" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <a
              v-if="comment.user_info?.website"
              :href="comment.user_info?.website"
              target="_blank"
              class="font-semibold text-sm text-zinc-900 dark:text-zinc-100 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-1"
            >
              {{ comment?.user_info?.nickname || comment?.user_info?.username }}
              <Icon name="material-symbols:web-traffic-rounded" class="text-zinc-400 dark:text-zinc-500 text-xs" />
            </a>
            <span
              v-else
              class="font-semibold text-sm text-zinc-900 dark:text-zinc-100"
              :class="{ 'text-primary dark:text-primary': comment.user_info?.role === 'superAdmin' }"
            >
              {{ comment?.user_info?.nickname || comment?.user_info?.username }}
            </span>

            <!-- Role Badge -->
            <span v-if="comment.user_info?.role === 'superAdmin'" class="text-[10px] px-2 py-0.5 bg-primary/20 dark:bg-primary/30 text-primary dark:text-primary rounded-md font-medium">
              ADMIN
            </span>
          </div>

          <div class="text-sm text-zinc-600 dark:text-zinc-300 mb-2 break-words leading-relaxed">
            <template v-if="comment.replySubCommentId">
              <span class="text-zinc-400 dark:text-zinc-500 mr-1">回复</span>
              <span class="font-bold text-zinc-900 dark:text-zinc-100 mr-1">@{{ getSubCommentUsernameById(comment.replySubCommentId) }}</span>
            </template>
            {{ comment.content }}
          </div>

          <div class="flex items-center gap-4 select-none">
            <span class="text-xs text-zinc-400 dark:text-zinc-500">{{ updateDateFromNow(comment.createTs) }}</span>

            <button
              class="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500 hover:text-primary dark:hover:text-primary cursor-pointer opacity-0 group-hover:opacity-100 transition-all"
              @click.stop="commentReply"
            >
              <Icon name="icon-park-outline:comments" :class="{ 'text-zinc-900 dark:text-zinc-100': comment._count?.sub_comments }" />
              <span v-if="comment._count?.sub_comments">{{ comment._count?.sub_comments }}</span>
              <span v-else>回复</span>
            </button>

            <button
              v-if="comment.user_id === userStore?.user.value.id || userStore?.user.value.role === 'superAdmin'"
              class="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-all"
              @click.stop="delComment(comment)"
            >
              <Icon name="icon-park-outline:delete" />
              <span>删除</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showCommentInput" class="reply-box w-full pl-11 mt-2">
      <AppCommentInput
        type="reply"
        :target="comment.user_info.nickname || comment.user_info.username"
        @cancel="showCommentInput = false"
        @send="createSubComment($event, comment)"
      />
    </div>
  </div>
</template>
