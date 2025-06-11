<template>
  <div class="memo-detail relative pt-4">
    <div class="memo-detail-header py-2">
      <Button class="" label="返回" @click="$router.back()">
        <Icon name="icon-park-outline:back" slot="icon"></Icon>
      </Button>
    </div>
    <!-- <div class="content" v-if="memo">
      <MemoPanel :memo="memo?.data" @refresh="refreshList" show-all></MemoPanel>
    </div> -->
  </div>
</template>
<script lang="ts" setup>
const route = useRoute()
const { $api } = useNuxtApp()
const uid = computed(() => route.params.slug && route.params.slug[0] || '');
interface Memo {
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
  _count?: {
    comments: number
  }
}
// const { data } = await $.get<any[]>('/api/v1/tag/list', { tag }, { key: 'tags - ' + inputTag.value, server: false })

// const { data: memo } = await $http.post<Memo>('/ap/i/v1/memos/get', { uid: uid.value })
console.log(`memo`)



const refreshList = () => {
  // refresh()
}

</script>
<style lang="less" scoped></style>