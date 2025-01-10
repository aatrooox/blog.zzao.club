<template>
  <div class="memos">
    <div class="memo-editor mb-4" v-if="isLogin">
      <AppCommentInput ref="commentRef" @send="createMemo"></AppCommentInput>
    </div>
    <div class="flex flex-col gap-2">
      <div class="btns">
        <Button rounded @click="refreshList" :loading="status === 'pending'">
          <Icon name="icon-park-outline:refresh"></Icon>
        </Button>
      </div>
      <template v-for="memo in memoList?.data" :key="memo.id">
        <MemoPanel :memo="memo" @refresh="refreshList"></MemoPanel>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { hash } from 'ohash'
useHead({
  title: '动态｜早早集市',
  meta: [
    {
      name: 'description',
      content: '早早集市｜博客站｜前端｜全栈｜前端架构｜Node｜Nuxt｜Hono｜Bun| 副业',
    },
    {
      name: 'keywords',
      content: '早早集市,博客站,前端,前端工程化,前端架构,Node,Nuxt,Hono,副业',
    },
  ],
})
const toast = useToast()
const { disposeError } = useErrorDispose()
const { isLogin, user } = useUser();
const refreshKey = ref(0)

const refreshList = () => {
  refreshKey.value++
}

// 默认查询评论信息111
const { data: memoList, error, status } = await $http.get('/api/v1/memos/list', { page: 1, size: 100, qc: 1 }, { key: 'memo-list-search', server: false, watch: [user, refreshKey] })

watch(error, () => {
  disposeError(error)
})

const createMemo = async (content: string) => {
  if (content) {
    // const content = memoContent.value.replaceAll('`', '\\`')
    const { data, error } = await $http.post('/api/v1/memos/create', {
      content: content,
      user_id: user.value?.id
    })

    if (error && error.value) {
      disposeError(error)
      return;
    }

    toast.add({ severity: 'success', summary: '已发送一条Memo', life: 3000 })
    refreshKey.value++
  }
}



</script>
