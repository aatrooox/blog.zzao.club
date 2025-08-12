<script lang="ts" setup>
// import anime from 'animejs/lib/anime.es.js'
import type { Prisma } from '~~/prisma/generated/prisma/client'

const props = defineProps<Props>()
const emit = defineEmits(['refresh'])
const toast = useGlobalToast()
const userStore = useUserStore()
const { $api } = useNuxtApp()
const commentReplyOpen = ref(false)
const subCommentsRef = ref()
const { updateDateFromNow } = useDayjs()
// const likeCount = ref('0')
// const likeIcon = ref(null)
// const Prisma = usePrismaClient();
type BlogCommentWithUserInfo = Prisma.BlogCommentGetPayload<{
  include: { user_info: true, _count: true, sub_comments: { include: { user_info: true } } }
}>
interface Props {
  comment: BlogCommentWithUserInfo
  hideBtns?: boolean
}
const commentUserMap = computed(() => {
  const map: Record<string, string> = {}
  for (const subComment of props.comment.sub_comments) {
    map[subComment.id] = subComment.user_info!.nickname || subComment.user_info!.username
  }
  return map
})
// 回复评论
function commentReply() {
  if (!userStore?.user.username) {
    toast.add({ message: '请先登录' })
    return
  }
  commentReplyOpen.value = !commentReplyOpen.value
}

// 发送一条评论的评论
async function createSubComment(message) {
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
async function delComment() {
  const res = await $api.post('/api/v1/comment/del', { id: props.comment.id })
  if (!res.error) {
    toast.add({ message: '已删除' })
    emit('refresh')
  }
}

function refreshList() {
  emit('refresh')
}
// async function likeMemo() {
//   toast.add({ type: 'success', message: '谢谢❤️，但还没做点赞功能' })
//   const changes = 0
//   // anime({
//   //   targets: (likeIcon.value as any)?.$el,
//   //   translateY: [0, -10, 0],
//   //   color: 'red',
//   //   scale: [1, 1.4, 1],
//   //   duration: 200,
//   //   easing: 'easeInOutQuad',
//   //   update: function (anim) {
//   //     // console.log('progress : ' + Math.round(anim.progress) + '%');
//   //   },
//   //   change: function () {
//   //     changes++;
//   //     // console.log('changes : ' + changes)
//   //   }
//   // })
// }
</script>

<template>
  <div class="card transition-all duration-300 box-border mb-4">
    <div class="comment-wrap w-full flex mb-4">
      <div class="avatar-wrap w-12">
        <UserAvatar :user-info="comment.user_info" class="size-10" />
      </div>
      <div
        class="comment-info flex-1 rounded-md box-border transition-all pb-2 duration-300 bg-white/90 dark:bg-zinc-900/80 hover:shadow-lg"
      >
        <div class="header px-4 py-1">
          <a
            v-if="comment.user_info?.website" :href="comment.user_info?.website" target="_blank"
            class="flex items-center hover:!underline"
          > {{
            comment?.user_info?.nickname
              || comment?.user_info?.username }} <Icon name="material-symbols:web-traffic-rounded" /></a>
          <span v-else :class="`${comment.user_info?.role === 'superAdmin' ? 'text-cyan-700 font-bold' : 'font-bold'}`">
            {{ comment?.user_info?.nickname || comment?.user_info?.username }}</span>
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
            <Icon name="icon-park-outline:comments" :style="{ color: comment._count?.sub_comments ? 'black' : '' }" />
            <template #badge>
              <span :class="`${comment._count?.sub_comments ? 'font-bold' : ''}`">{{
                comment._count?.sub_comments
                  || 0 }}</span>
            </template>
          </Button>
          <!-- 管理员 或自己 可删除 -->
          <Button
            v-if="comment.user_id === userStore?.user.id || userStore?.user.role === 'superAdmin'" variant="ghost" text
            size="sm"
            @click.stop="delComment"
          >
            <Icon name="icon-park-outline:delete" />
          </Button>
        </div>
      </div>
    </div>
    <!-- 回复某条评论 -->
    <div v-if="commentReplyOpen" class="reply-box w-full pl-4 mt-2 mb-4">
      <AppCommentInput
        type="reply" :target="comment.user_info?.nickname || comment.user_info?.username"
        @cancel="commentReplyOpen = false" @send="createSubComment"
      />
    </div>
    <template v-for="subComment in comment.sub_comments" :key="subComment.id">
      <SubCommentsViewPanel
        ref="subCommentsRef" :comment="subComment" :comment-user-map="commentUserMap"
        @refresh="refreshList"
      />
    </template>
  </div>
</template>
