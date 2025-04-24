<template>
  <div class="sub-comments relative pl-8 mb-4 transition-all duration-300 ease-in-out">
    <!-- 二级评论的引导线 -->
    <!-- <div class="absolute left-2 top-[10px] my-0 bottom-0 h-full w-[1px] bg-gray-300"></div> -->
    <div class="sub-commit-item relative transition-all duration-300 ease-in-out">
      <div class="comment-wrap w-full flex">
        <div class="avatar-wrap w-12">
          <UserAvatar :user-info="comment.user_info" class="size-10"></UserAvatar>
        </div>
        <div
          class="comment-info flex-1 rounded-md box-border bg-white/90 dark:bg-zinc-900/80 hover:shadow-lg transition-all duration-300 ease-in-out">
          <div class="header px-4 py-1"><span
              :class="`${comment.user_info?.role === 'superAdmin' ? 'text-cyan-700 font-bold' : 'font-bold'}`">{{
                comment?.user_info?.username }}</span>
          </div>
          <div class="content py-4 px-4">
            <template v-if="comment.reply_sub_comment_id">
              <!-- 如果是回复其他评论 -->
              <span>@</span><span class="font-bold pr-1">{{ getSubCommentUsernameById(comment.reply_sub_comment_id)
              }}</span>
            </template>
            {{ comment.content }}
          </div>
          <div class="footer flex items-center gap-4 px-4">
            <span class="text-gray-500 text-xs">{{ updateDateFromNow(comment.create_ts) }}</span>
            <!-- <Button @click.stop="likeMemo" variant="secondary" text size="small">
          <Icon slot="icon" name="icon-park-outline:thumbs-up" mode="svg" ref="likeIcon" />
          <span slot="badge">{{ likeCount }}</span>
        </Button> -->
            <Button variant="ghost" size="sm" @click.stop="commentReply">
              <Icon name="icon-park-outline:comments" :style="{ color: comment._count?.sub_comments ? 'black' : '' }">
              </Icon>
              <span slot="badge" :class="`${comment._count?.sub_comments ? 'font-bold' : ''}`">{{
                comment._count?.sub_comments ||
                0 }}</span>
            </Button>
            <!-- 管理员 或自己 可删除 -->
            <Button variant="ghost" text size="sm"
              v-if="comment.user_id === userStore?.user.id || userStore?.user.role === 'superAdmin'"
              @click.stop="delComment(comment)">
              <Icon name="icon-park-outline:delete"></Icon>
            </Button>
          </div>
        </div>

      </div>
      <!-- <template>
          <div class="flex items-center pl-2">
            <UserAvatar :user-info="subComment.user_info"></UserAvatar>
            <span
              :class="`${subComment.user_info.role === 'superAdmin' ? 'text-cyan-700 font-bold p-2' : 'font-bold p-2'}`">{{
                subComment?.user_info?.username }}</span>
            <template v-if="subComment.reply_sub_comment_id">
              <span> 回复 </span>
              <span class="font-bold p-2">{{
                getSubCommentById(subComment.reply_sub_comment_id)?.user_info?.username }}</span>
            </template>
          </div>
        </template>
        <p class="m-0">
          {{ subComment.content }}
        </p>
        <div class="footer flex items-center gap-4">
          <span class="text-gray-500 text-xs">{{ updateDateFromNow(subComment.create_ts) }}</span>
          <Button variant="secondary" text size="sm" @click.stop="commentReply(subComment)">
            <Icon name="icon-park-outline:comments"></Icon>
          </Button>
          <Button variant="secondary" text size="sm"
            v-if="comment.user_id === userStore?.user.id || userStore?.user.id === 'admin'"
            @click.stop="delComment(subComment)">
            <Icon name="icon-park-outline:delete"></Icon>
          </Button>
        </div> -->


    </div>
    <div class="reply-box w-full pl-4 mt-2" v-if="showCommentInput">
      <AppCommentInput type="reply" :target="comment.user_info.username" @cancel="showCommentInput = false"
        @send="createSubComment($event, comment)">
      </AppCommentInput>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import anime from 'animejs/lib/anime.es.js'
import { Prisma } from '@prisma/client'
const toast = useGlobalToast();
const userStore = useUserStore()
const commentReplyMap = ref<{ [key: string]: boolean }>({})
const { updateDateFromNow, formatFullDate } = useDayjs()
const { $api } = useNuxtApp()
const showCommentInput = ref(false)
const emit = defineEmits(['refresh'])
const likeCount = ref('0')
const likeIcon = ref(null)
type BlogCommentWithUserInfo = Prisma.BlogCommentGetPayload<{
  include: { user_info: true, _count: true }
}>
type BlogSubCommentWithUserInfo = Prisma.BlogSubCommentGetPayload<{
  include: { _count: true }
}>
const subComments = ref<any[]>([])

interface Props {
  comment: any,
  hideBtns?: boolean,
  commentUserMap: Record<string, string>
}

const props = defineProps<Props>()
// 使用一级评论 id 获取二级评论



// 回复评论
const commentReply = () => {
  showCommentInput.value = true
}

// 发送一条评论
const createSubComment = async (message: Record<any, any>, subComment: Props['comment']) => {
  console.log(`sub msg `, message)
  console.log('sub comment', subComment)
  const res = await $api.post('/api/v1/comment/sub/create', {
    comment_id: subComment.comment_id, // 当前一级评论的 id
    content: message.content,
    reply_sub_comment_id: subComment?.id, // 回复的二级评论的 id
    user_id: userStore?.user.id, // 当前用户
  })

  if (!res.error) {
    showCommentInput.value = false;
    //  上级刷新
    emit('refresh')
  }
}

// 渲染二级评论时，获取其他二级评论
const getSubCommentUsernameById = (subcomment_id: string) => {
  return props.commentUserMap[subcomment_id]
}
const checkDetail = (comment: any) => {
  navigateTo(`/m/${comment.uid}`)
}

// 删除
const delComment = async (subComment: Props['comment']) => {
  const res = await $api.post('/api/v1/comment/sub/del', { id: subComment.id })
  if (res.error) return;
  toast.add({ type: 'success', message: '删除成功' });
  // refreshList()
  emit('refresh')
}

const fetchSubComments = async () => {
  const { data, error, status, refresh } = await $http.post<any[]>('/api/v1/comment/sub/list', { comment_id: props.comment.id }, { server: false, watch: [userStore] })
  subComments.value = data.value?.data ?? []
}
const likeMemo = async (className: string) => {
  console.log(`classNaem`, className)
  let changes = 0
  // anime({
  //   targets: `.${className}`,
  //   translateY: [0, -10, 0],
  //   color: 'red',
  //   scale: [1, 1.4, 1],
  //   duration: 200,
  //   easing: 'easeInOutQuad',
  //   update: function (anim) {
  //     // console.log('progress : ' + Math.round(anim.progress) + '%');
  //   },
  //   change: function () {
  //     changes++;
  //     console.log('changes : ' + changes)
  //   }
  // })
}

const refreshList = async () => {
  await fetchSubComments()
}

// onMounted(async () => {
//   await fetchSubComments()
// })

defineExpose({ refreshList })

</script>
