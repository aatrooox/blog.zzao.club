<template>
  <div class="card transition-all duration-300 box-border mb-4">
    <div class="comment-wrap w-full flex mb-4">
      <div class="avatar-wrap w-12">
        <UserAvatar :user-info="comment.user_info" class="size-10"></UserAvatar>
      </div>
      <div
        class="comment-info flex-1 rounded-md box-border transition-all py-2 duration-300 bg-white/90 dark:bg-zinc-900/80 hover:shadow-lg">
        <div class="header px-4 py-1"><span
            :class="`${comment.user_info.role === 'superAdmin' ? 'text-cyan-700 font-bold' : 'font-bold'}`">{{
              comment?.user_info?.username }}</span>
        </div>
        <div class="content py-4 px-4 ">
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
            @click.stop="delComment">
            <Icon name="icon-park-outline:delete"></Icon>
          </Button>
        </div>
      </div>
    </div>
    <!-- 回复某条评论 -->
    <div class="reply-box w-full pl-4 mt-2 mb-4" v-if="commentReplyOpen">
      <AppCommentInput type="reply" :target="comment.user_info.username" @cancel="commentReplyOpen = false"
        @send="createSubComment">
      </AppCommentInput>
    </div>
    <template v-for="subComment in comment.sub_comments">
      <SubCommentsViewPanel ref="subCommentsRef" :comment="subComment" @refresh="refreshList"
        :comment-user-map="commentUserMap">
      </SubCommentsViewPanel>
    </template>
  </div>
</template>

<script lang="ts" setup>
// import anime from 'animejs/lib/anime.es.js'
import type { BlogComment } from '@prisma/client'
import type { Prisma } from '@prisma/client'
const toast = useGlobalToast();
const userStore = useUserStore()
const { $api } = useNuxtApp();
const commentReplyOpen = ref(false)
const subCommentsRef = ref()
const { updateDateFromNow, formatFullDate } = useDayjs()
const emit = defineEmits(['refresh'])
const likeCount = ref('0')
const likeIcon = ref(null)
// const Prisma = usePrismaClient();
type BlogCommentWithUserInfo = Prisma.BlogCommentGetPayload<{
  include: { user_info: true, _count: true, sub_comments: { include: { user_info: true } } }
}>
interface Props {
  comment: BlogCommentWithUserInfo
  hideBtns?: boolean
}
const props = defineProps<Props>()
const commentUserMap = computed(() => {
  const map: Record<string, string> = {}
  for (const subComment of props.comment.sub_comments) {
    map[subComment.id] = subComment.user_info.username
  }
  return map
})
// 回复评论
const commentReply = () => {
  if (!userStore?.user.username) {
    toast.add({ message: '请先登录' })
    return
  }
  commentReplyOpen.value = !commentReplyOpen.value;
}

// 发送一条评论的评论
const createSubComment = async (message) => {
  const res = await $api.post('/api/v1/comment/sub/create', {
    comment_id: props.comment.id, // 当前评论的 id
    content: message.content,
    user_id: userStore?.user.id,
  })
  if (!res.error) {
    commentReplyOpen.value = false
    // 如果没有二级评论，则无法自己刷新
    emit('refresh')
  }
}
// 删除
const delComment = async () => {
  const res = await $api.post('/api/v1/comment/del', { id: props.comment.id })
  if (!res.error) {
    toast.add({ message: '已删除' });
    emit('refresh')
  }
}

const refreshList = () => {
  emit('refresh')
}
const likeMemo = async () => {
  toast.add({ type: 'success', message: '谢谢❤️，但还没做点赞功能' });
  let changes = 0
  // anime({
  //   targets: (likeIcon.value as any)?.$el,
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
  //     // console.log('changes : ' + changes)
  //   }
  // })
}


</script>
