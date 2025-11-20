<script lang="ts" setup>
// import anime from 'animejs/lib/anime.es.js'
import type { BlogCommentWithUserInfo } from '~~/types/blog-drizzle'

const props = defineProps<Props>()
const emit = defineEmits(['refresh'])
const toast = useGlobalToast()
const userStore = useUser()
const { $api } = useNuxtApp()
const commentReplyOpen = ref(false)
const subCommentsRef = ref()
const { updateDateFromNow } = useDayjs()
// const likeCount = ref('0')
// const likeIcon = ref(null)
// const Prisma = usePrismaClient();
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
  if (!userStore?.user.value.username) {
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
    user_id: userStore?.user.value.id,
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
  <div class="pixel-card mb-4 transition-all duration-300 hover:shadow-md">
    <div class="flex gap-3 md:gap-4">
      <!-- Avatar -->
      <div class="flex-shrink-0">
        <UserAvatar :user-info="comment.user_info" class="size-10 md:size-12 border border-border-pixel-primary rounded-full" />
      </div>

      <!-- Main Content -->
      <div class="flex-1 min-w-0">
        <!-- Header -->
        <div class="flex items-center gap-2 mb-1">
          <a
            v-if="comment.user_info?.website"
            :href="comment.user_info?.website"
            target="_blank"
            class="pixel-title text-sm md:text-base hover:text-accent-pixel-cyan transition-colors flex items-center gap-1"
          >
            {{ comment?.user_info?.nickname || comment?.user_info?.username }}
            <Icon name="material-symbols:web-traffic-rounded" class="text-text-pixel-muted text-xs" />
          </a>
          <span
            v-else
            class="pixel-title text-sm md:text-base"
            :class="{ 'text-accent-pixel-cyan': comment.user_info?.role === 'superAdmin' }"
          >
            {{ comment?.user_info?.nickname || comment?.user_info?.username }}
          </span>

          <!-- Role Badge -->
          <span v-if="comment.user_info?.role === 'superAdmin'" class="pixel-tag text-[10px] px-1.5 py-0.5 scale-90 origin-left">
            ADMIN
          </span>
        </div>

        <!-- Content -->
        <div class="pixel-text text-sm md:text-base mb-2 break-words leading-relaxed">
          {{ comment.content }}
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center gap-4 select-none">
          <span class="text-xs pixel-text-muted">{{ updateDateFromNow(comment.createTs) }}</span>

          <button
            class="flex items-center gap-1 text-xs pixel-text-muted hover:text-accent-pixel-cyan transition-colors cursor-pointer group"
            @click.stop="commentReply"
          >
            <Icon name="icon-park-outline:comments" class="group-hover:scale-110 transition-transform" :class="{ 'text-text-pixel-primary': comment._count?.sub_comments }" />
            <span v-if="comment._count?.sub_comments">{{ comment._count?.sub_comments }}</span>
            <span v-else>回复</span>
          </button>

          <button
            v-if="comment.userId === userStore?.user.value.id || userStore?.user.value.role === 'superAdmin'"
            class="flex items-center gap-1 text-xs pixel-text-muted hover:text-status-pixel-error transition-colors cursor-pointer group"
            @click.stop="delComment"
          >
            <Icon name="icon-park-outline:delete" class="group-hover:scale-110 transition-transform" />
            <span>删除</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Reply Input -->
    <div v-if="commentReplyOpen" class="mt-4 pl-12 md:pl-16">
      <AppCommentInput
        type="reply"
        :target="comment.user_info?.nickname || comment.user_info?.username"
        @cancel="commentReplyOpen = false"
        @send="createSubComment"
      />
    </div>

    <!-- Sub Comments -->
    <div v-if="comment.sub_comments?.length" class="mt-4 pl-4 md:pl-6 ml-4 md:ml-6 border-l-2 border-border-pixel-secondary space-y-4">
      <template v-for="subComment in comment.sub_comments" :key="subComment.id">
        <SubCommentsViewPanel
          ref="subCommentsRef"
          :comment="subComment"
          :comment-user-map="commentUserMap"
          @refresh="refreshList"
        />
      </template>
    </div>
  </div>
</template>
