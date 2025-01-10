<template>
  <div class="w-full flex flex-wrap gap-2">
    <div class="w-full">
      <AppCommentInput @send="sendMessage" type="blog"></AppCommentInput>
    </div>
    <div class="w-full flex flex-col gap-2">
      <div class="btns">
        <Button rounded @click="refreshList" :loading="status === 'pending'">
          <Icon name="icon-park-outline:refresh"></Icon>
        </Button>
      </div>
      <template v-for="msg in msgList?.data" :key="msg.id">
        <CommentViewPanel :comment="msg" @refresh="refreshList"></CommentViewPanel>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
useHead({
  title: '系列｜早早集市',
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
const { user } = useUser()
const toast = useToast()
const { disposeError } = useErrorDispose()
const refreshKey = ref(1)
const type = 'blog'

const sendMessage = async (message: string) => {
  if (!user.value?.id) {
    toast.add({ severity: 'error', summary: '请先登录后再留言', life: 3000 });
    return
  }
  const { data, error } = await $http.post('/api/v1/comment/create', { type, user_id: user.value?.id, content: message })
  if (error.value) {
    disposeError(error)
    return;
  }

  toast.add({ severity: 'contrast', summary: '留言成功', life: 3000 })
  refresh()
}

const refreshList = () => {
  refreshKey.value++
}

const { data: msgList, error, refresh, status } = await $http.get('/api/v1/comment/list', { type }, { key: 'blog-comment-list', server: false, watch: [refreshKey] })

console.log(`msgList`, msgList.value?.data)
if (error.value) {
  disposeError(error.value)
}
</script>
<style lang="less" scoped></style>