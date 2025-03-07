<template>
  <div class="sub-comments relative pl-8">
    <!-- 二级评论的引导线 -->
    <div class="absolute left-2 top-[10px] my-0 bottom-0 h-full w-[1px] bg-gray-300"></div>
    <div class="sub-commit-item relative transition-all duration-300 ease-in-out">
      <template v-for="subComment in subComments?.data" :key="subComment.id">
        <Fieldset class="!pb-2">
          <template #legend>
            <div class="flex items-center pl-2">
              <UserAvatar :user-info="subComment.user_info"></UserAvatar>
              <span :class="`${subComment.user_info.role === 'superAdmin' ? 'text-cyan-700 font-bold p-2' : 'font-bold p-2'}`">{{ subComment?.user_info?.username }}</span>
              <template v-if="subComment.reply_sub_comment_id">
                <span> 回复 </span>
                <!-- 如果是回复其他评论 -->
                <span class="font-bold p-2">{{
                  getSubCommentById(subComment.reply_sub_comment_id)?.user_info?.username }}</span>
                <!-- 回复一级评论 -->
                <!-- <span class="font-bold p-2">{{ comment?.user_info?.username }}</span> -->
              </template>
            </div>
          </template>
          <p class="m-0">
            {{ subComment.content }}
          </p>
          <div class="footer flex items-center gap-4">
            <span class="text-gray-500 text-xs">{{ updateDateFromNow(subComment.create_ts) }}</span>
            <Button @click.stop="likeMemo(`like-icon-sub-${subComment.uid}`)" severity="secondary" text size="small">
              <Icon slot="icon" name="icon-park-outline:thumbs-up" mode="svg"
                :class="`like-icon-sub-${subComment.uid}`" />
              <span slot="badge">{{ likeCount }}</span>
            </Button>
            <Button severity="secondary" text size="small" v-tooltip.top="'回复'" @click.stop="commentReply(subComment)">
              <Icon name="icon-park-outline:comments"></Icon>
            </Button>
            <!-- 管理员 或自己 可删除 -->
            <Button severity="secondary" text size="small" v-tooltip.top="'删除'"
              v-if="comment.user_id === userStore?.user.id || userStore?.user.id === 'admin'"
              @click.stop="delComment(subComment)">
              <Icon name="icon-park-outline:delete"></Icon>
            </Button>
          </div>
        </Fieldset>
        <div class="reply-box w-full pl-4 mt-2" v-if="commentReplyMap[subComment.id]">
          <AppCommentInput type="reply" :target="subComment.user_info.username"
            @cancel="commentReplyMap[subComment.id] = false" @send="createSubComment($event, subComment)">
          </AppCommentInput>
        </div>
        <!-- 回复某条评论 -->

      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import anime from 'animejs/lib/anime.es.js'
import { Prisma } from '@prisma/client'
const toast = useGlobalToast();
const userStore = useUserStore()
const { disposeError } = useErrorDispose()
const commentReplyMap = ref<{ [key: string]: boolean }>({})
const { updateDateFromNow, formatFullDate } = useDayjs()
const { $api } = useNuxtApp()
const emit = defineEmits(['refresh'])
const likeCount = ref('0')
const likeIcon = ref(null)
type BlogCommentWithUserInfo = Prisma.BlogCommentGetPayload<{ 
  include: { user_info: true , _count: true } }>
type BlogSubCommentWithUserInfo = Prisma.BlogSubCommentGetPayload<{ 
  include: { user_info: true , _count: true } }>

interface Props {
  comment: BlogCommentWithUserInfo,
  hideBtns?: boolean,
}
const props = defineProps<Props>()
// 使用一级评论 id 获取二级评论
const { data: subComments, error, status, refresh } = await $http.post<any[]>('/api/v1/comment/sub/list', { comment_id: props.comment.id }, { server: false, watch: [userStore] })

if (error?.value) {
  disposeError(error)
}

// 回复评论
const commentReply = (subComment: Props['comment']) => {
  commentReplyMap.value[subComment.id] = !commentReplyMap.value[subComment.id];
}

// 发送一条评论
const createSubComment = async (message: Record<any, any>, subComment: Props['comment']) => {
  console.log(`sub msg `, message)
  console.log('sub comment', subComment)
  const res = await $api.post('/api/v1/comment/sub/create', {
    comment_id: props.comment.id, // 当前一级评论的 id
    content: message.content,
    reply_sub_comment_id: subComment?.id, // 回复的二级评论的 id
    user_id: userStore?.user.id, // 当前用户
  })

  if (!res.error) {
    commentReplyMap.value[subComment.id] = false;
    //  上级刷新
    refreshList();
  }
}

// 渲染二级评论时，获取其他二级评论
const getSubCommentById = (id: number) => {
  return subComments.value?.data?.find((item) => item.id === id)
}
const checkDetail = (comment: any) => {
  navigateTo(`/m/${comment.uid}`)
}

// 删除
const delComment = async (subComment: Props['comment']) => {
  const res = await $api.post('/api/v1/comment/sub/del', { id: subComment.id })
  if (res.error) return;
  toast.add({ severity: 'success', summary: '删除成功', detail: '评论已删除', life: 3000 });
  refreshList()
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

const refreshList = () => {
  refresh()
}

defineExpose({ refreshList })

</script>
