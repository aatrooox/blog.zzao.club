<template>
  <div class="card transition-all duration-300 box-border">
    <Fieldset class="!pb-2">
      <template #legend>
        <div class="flex items-center pl-2">
          <UserAvatar :user-info="comment.user_info" size="small"></UserAvatar>
          <span class="font-bold p-2">{{ comment?.user_info?.username }}</span>
        </div>
      </template>
      <p class="m-0">
        {{ comment.content }}
      </p>
      <div class="footer flex items-center gap-4">
        <span class="text-gray-500 text-xs">{{ updateDateFromNow(comment.create_ts) }}</span>
        <Button @click.stop="likeMemo" severity="secondary" text size="small">
          <Icon slot="icon" name="icon-park-outline:thumbs-up" mode="svg" ref="likeIcon" />
          <span slot="badge">{{ likeCount }}</span>
        </Button>
        <Button severity="secondary" text size="small" v-tooltip.top="'回复'" @click.stop="commentReply">
          <Icon name="icon-park-outline:comments" :style="{ color: comment._count?.sub_comments ? 'black' : '' }">
          </Icon>
          <span slot="badge" :class="`${comment._count?.sub_comments ? 'font-bold' : ''}`">{{
            comment._count?.sub_comments ||
            0 }}</span>
        </Button>
        <!-- 管理员 或自己 可删除 -->
        <Button severity="secondary" text size="small" v-tooltip.top="'删除'"
          v-if="comment.user_id === user?.id || user?.role === 'admin'" @click.stop="delComment">
          <Icon name="icon-park-outline:delete"></Icon>
        </Button>
      </div>
    </Fieldset>
    <!-- 回复某条评论 -->
    <div class="reply-box w-full pl-4 mt-2" v-if="commentReplyOpen">
      <AppCommentInput type="reply" :target="comment.user_info.username" @cancel="commentReplyOpen = false"
        @send="createSubComment">
      </AppCommentInput>
    </div>
    <SubCommentsViewPanel ref="subCommentsRef" :comment="comment" v-if="comment._count?.sub_comments">
    </SubCommentsViewPanel>
  </div>
</template>

<script lang="ts" setup>
// import anime from 'animejs/lib/anime.es.js'
const toast = useToast();
const { user } = useUser()
const { disposeError } = useErrorDispose()
const commentReplyOpen = ref(false)
const subCommentsRef = ref()
const { updateDateFromNow, formatFullDate } = useDayjs()
const emit = defineEmits(['refresh'])
const likeCount = ref('0')
const likeIcon = ref(null)
interface Props {
  comment: {
    id: number
    uid: string
    user_id: number
    content: string
    create_ts: string
    user_info?: any
    article_id?: number
    article_info?: any
    memo_id?: number
    memo_info?: any
    _count?: {
      sub_comments: number
    }
  }
  hideBtns?: boolean
}
const props = defineProps<Props>()

// 回复评论
const commentReply = () => {
  if (!user.value?.id) {
    toast.add({ severity: 'error', summary: '登录后就可以评论了', life: 3000 });
    return
  }
  commentReplyOpen.value = !commentReplyOpen.value;
}

// 发送一条评论
const createSubComment = async (message: string) => {
  const { data, error } = await $http.post('/api/v1/comment/sub/create', {
    comment_id: props.comment.id, // 当前评论的 id
    content: message,
    user_id: user.value?.id,
  })

  if (error?.value) {
    disposeError(error)
    return;
  }

  commentReplyOpen.value = false
  // 如果没有二级评论，则无法自己刷新
  if (subCommentsRef.value) {
    subCommentsRef.value?.refreshList()
  } else {
    // 依赖上级再去取一下列表
    emit('refresh')
  }
}
// 删除
const delComment = async () => {
  const { data, error } = await $http.post('/api/v1/comment/del', { id: props.comment.id })
  if (error?.value) {
    disposeError(error)
    return;
  }

  toast.add({ severity: 'success', summary: '删除成功', detail: '评论已删除', life: 3000 });
  emit('refresh')
}

const likeMemo = async () => {
  toast.add({ severity: 'success', summary: '谢谢❤️，但还没做点赞功能', life: 3000 });
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
