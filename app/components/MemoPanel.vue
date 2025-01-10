<template>
  <div class="card rounded-lg transition-all duration-300 box-border">
    <Panel class="box-border" :collapsed="props.memo.floded" @update:collapsed="setPanelCollapsed"
      @click="checkDetail(props.memo)">
      <template #header>
        <div class="flex items-center gap-2">
          <UserAvatar :user-info="props.memo.user_info"></UserAvatar>
          <span class="font-bold">{{ props.memo?.user_info?.username }}</span>
          <Icon v-if="props.memo.defalt_floded" name="icon-park-outline:info" size="1em" class="text-amber-500"
            v-tooltip.top="'该动态默认被折叠'"></Icon>
          <span class="folded-tip text-slate-900 text-xs" v-if="props.memo.defalt_floded">{{ props.memo.flod_tip
            }}</span>
          <span class="folded-tip-time ml-8 text-slate-400 text-xs" v-if="curCollapsed && props.memo.floded">{{
            updateDateFromNow(props.memo.create_ts)
            }}</span>
        </div>
      </template>
      <template #footer>
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <Button @click.stop="likeMemo" severity="secondary" text size="small">
              <Icon slot="icon" name="icon-park-outline:thumbs-up" mode="svg" ref="likeIcon"
                :style="{ color: isLiked ? 'red' : '' }" />
              <span slot="badge">{{ likeCount || props.memo.likes?.length }}</span>
            </Button>
            <Button severity="secondary" text size="small" v-tooltip.top="'回复'" @click.stop="memoReply">
              <Icon name="icon-park-outline:comments" :style="{ color: memo._count?.comments ? 'black' : '' }">
              </Icon>
              <span slot="badge" :class="`${memo._count?.comments ? 'font-bold' : ''}`">{{
                memo._count?.comments ||
                0 }}</span>
            </Button>
            <Button severity="secondary" text size="small" v-tooltip.top="'转发图片'" @click.stop="copyIMG2Clipboard">
              <Icon name="icon-park-outline:collect-picture"></Icon>
            </Button>
            <Button severity="secondary" text size="small" v-tooltip.top="'转发链接'" @click.stop="copyURL2Clipboard">
              <Icon name="icon-park-outline:share-two"></Icon>
            </Button>
          </div>
          <span class="text-surface-500 text-xs">{{ updateDateFromNow(props.memo.create_ts) }}</span>
        </div>
      </template>
      <template #icons v-if="props.memo.user_id === user?.id">
        <Button icon="pi pi-cog" severity="secondary" rounded text @click.stop="toggle" />
        <Menu ref="menu" id="config_menu" :model="items" popup />
      </template>
      <!-- <div class="m-0" v-html="props.memo.content">
      </div> -->
      <!-- <MDCRenderer :body="ast.body" :data="ast.data" /> -->
      <AppOverflowContent :show-all="!!showAll">
        <MDC :value="props.memo.content" tag="section" class="mdc-memo-prose prose w-full max-w-full" />
      </AppOverflowContent>
    </Panel>
    <!-- 评论框 回复某条MEMO -->
    <div class="reply-box w-full pl-4 mt-2" v-if="commentReplyOpen">
      <AppCommentInput type="reply" :target="memo.user_info.username" @cancel="commentReplyOpen = false"
        @send="createComment">
      </AppCommentInput>
    </div>
    <!-- 一级评论 -->
    <div class="comment-level-1-box box-border pl-8 pb-2 relative">
      <!-- 引导线 -->
      <div class="absolute left-2 top-[10px] my-0 bottom-0 h-[96%] w-[1px] bg-gray-300"></div>
      <template v-for="comment in (memo.comments || [])" :key="comment.id">
        <CommentViewPanel :comment="comment" @refresh="refreshList"></CommentViewPanel>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import anime from 'animejs/lib/anime.es.js'
const menu = ref<any>(null);
const toast = useToast();
const { user } = useUser()
const { disposeError } = useErrorDispose()
const { updateDateFromNow, formatFullDate } = useDayjs()
const emit = defineEmits(['refresh'])
const likeCount = ref(0)
const likeIcon = ref(null)
const commentReplyOpen = ref(false)
const isLikedLocal = ref(false);

interface Props {
  memo: {
    id: number
    uid: string
    floded: boolean
    user_id: number
    content: string
    create_ts: string
    defalt_floded: boolean
    user_info?: any
    flod_tip?: string
    comments?: any[]
    likes?: any[]
    _count?: {
      comments: number
    }
  }
  showAll?: boolean
  hideBtns?: boolean
}
const refreshKey = ref(1)
const commentType = 'memo' // 评论类型
const props = defineProps<Props>()
const curCollapsed = ref(props.memo.floded)

const items = ref([
  {
    label: '删除',
    icon: 'pi pi-times',
    command: async () => {
      const { data, error }: any = await $http.post('/api/v1/memos/del', {
        id: props.memo?.id
      })

      if (error?.value) {
        disposeError(error)
        return;
      }

      toast.add({ severity: 'success', summary: '删除成功', detail: `Memo[${data.value.data?.id}]已被删除！`, life: 3000 });
      emit('refresh')
    }
  }
]);

const checkDetail = (memo: any) => {
  navigateTo(`/m/${memo.uid}`)
}

const setPanelCollapsed = (flag) => {
  curCollapsed.value = flag
}

const toggle = (event) => {
  menu.value?.toggle(event);
};

const copyURL2Clipboard = async () => {
  await navigator.clipboard.writeText(`https://blog.zzao.club/m/${props.memo.uid}`);
  toast.add({ severity: 'contrast', summary: '链接已复制！', detail: '快去粘贴分享吧！', life: 3000 });
}

const copyIMG2Clipboard = async () => {
  await navigator.clipboard.writeText(`https://blog.zzao.club/m/${props.memo.uid}`);
  toast.add({ severity: 'contrast', summary: '图片已复制!(假的，还没写呢)', detail: '快去粘贴分享吧！', life: 3000 });
}

const memoReply = () => {
  if (!user.value?.id) {
    toast.add({ severity: 'error', summary: '登录后就可以评论了', life: 3000 });
    return
  }
  commentReplyOpen.value = !commentReplyOpen.value
}
// 评论
const createComment = async (message: string) => {
  if (!user.value?.id) {
    toast.add({ severity: 'error', summary: '请先登录后再留言', life: 3000 });
    return
  }

  const { data, error } = await $http.post('/api/v1/comment/create', { type: commentType, user_id: user.value?.id, memo_id: props.memo.id, content: message }, { server: false })
  if (error.value) {
    disposeError(error)
    return;
  }

  toast.add({ severity: 'contrast', summary: '评论成功', life: 3000 })
  commentReplyOpen.value = false;
  refreshList()
  // emit('refresh')
  // refresh()
}
const isLiked = computed(() => !!props.memo.likes?.find((item) => item.user_id === user?.value?.id))
// 先乐观更新页面，再请求接口
const likeMemo = async () => {
  // console.log(`isLiked`, isLiked.value, isLikedLocal.value)
  return;
  if (isLiked.value) isLikedLocal.value = true;
  // const { data: count } = await $http.get('/api/v1/like/count', { memo_ids: `${props.memo.id}` })

  if (!isLikedLocal.value) {
    // 动画
    anime({
      targets: (likeIcon.value as any)?.$el,
      translateY: [0, -10, 0],
      color: 'red',
      scale: [1, 1.4, 1],
      duration: 200,
      easing: 'easeInOutQuad',
      update: function (anim) {
        // console.log('progress : ' + Math.round(anim.progress) + '%');
      },
      change: function () {
      }
    })
    // const { data, error } = await $http.post('/api/v1/like/add', { target: 'memo', user_id: user?.value?.id, memo_id: props.memo.id }, { server: false })

    // if (error.value) {
    //   disposeError(error)
    //   return;
    // }
    likeCount.value = (props.memo?.likes?.length || 0) as number + 1

    isLikedLocal.value = true;
    // console.log(`点赞 =》`, data.value)

  } else {
    // const id = props.memo.likes?.find((item) => item.user_id === user?.value?.id)?.id
    // const { data, error } = await $http.post('/api/v1/like/cancel', { id }, { server: false })
    likeCount.value = likeCount.value - 1
    isLikedLocal.value = false;
  }


  // refreshList();
}

const refreshList = () => {
  refreshKey.value++
  emit('refresh')
}

// const { data: msgList, error, refresh, status } = await $http.get('/api/v1/comment/list', { type: commentType, memo_id: props.memo.id }, { key: 'memo-comment-list', server: false, watch: [refreshKey] })

// console.log(`msgList`, msgList.value?.data)
// if (error.value) {
//   disposeError(error.value)
// }

onMounted(() => {
  isLikedLocal.value = false;
})
</script>
