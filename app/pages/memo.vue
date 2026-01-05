<script lang="ts" setup>
import type { ApiResponse } from '~~/types/fetch'
import type { MemoLikeResponse } from '~~/types/memo'
import useTags from '~/composables/useTags'

const props = defineProps({
  selectedTags: {
    type: Array,
    default: () => [],
  },
  onTagClick: {
    type: Function,
    default: undefined,
  },
})

definePageMeta({
  layout: 'default',
})

useSeoMeta({
  title: '动态｜早早集市',
  description: '基于Api数据实现SSR的页面，一些日常记录、知识碎片、其他平台的摘录',
})

const { getMemos, memos, createMemo } = useMemos()
const userStore = useUser()
// const clientjs = useClientjs()
const toast = useGlobalToast()
// const { $api } = useNuxtApp()
const { getTags } = useTags()
const multipleImages = ref<string[]>([])

const route = useRoute()
const selectedTags = computed(() => {
  const q = route.query.tags
  if (!q)
    return []
  if (typeof q === 'string')
    return q.split(',').filter(Boolean)
  return []
})

const tags = ref<string[]>([])
const commentInputRef = ref<any>(null)

const isEditDrawerOpen = ref(false)
const editingMemo = ref<any>(null)

const filteredMemos = computed(() => {
  if (selectedTags.value.length === 0)
    return memos.value
  return memos.value.filter(memo =>
    memo.tags && memo.tags.some(t => selectedTags.value.includes(t.tagName)),
  )
})

const { beforeLeave, leave, afterLeave } = useStaggeredListTransition('memo-fade')

// async function handleLike(memoId: string) {
//   if (!userStore.user.value.id) {
//     await createVistorID()
//     // const res = await $api.post<ApiResponse<any>>('/api/v1/user/visitor/regist', )
//     // const { user, accessToken, refreshToken, accessExpiresAt, refreshExpiresAt } = res.data

//     // userStore.setUser(user)
//     // userStore.setTokenInfo({
//     //   accessToken,
//     //   refreshToken,
//     //   accessExpiresAt,
//     //   refreshExpiresAt,
//     // })
//   }
//   try {
//     const res = await $api.post<ApiResponse<MemoLikeResponse>>('/api/v1/memo/like', {
//       memo_id: memoId,
//       user_id: userStore.user.value.id,
//     })
//     if (res?.data && res.data.success) {
//       if (res.data.message) {
//         toast.success('您已经点赞过了')
//       }
//       else {
//         toast.success('感谢支持！')
//       }
//       await getMemos()
//     }
//   }
//   catch {
//     toast.error('点赞失败，请重试')
//   }
// }

await getMemos()

async function handleDelete(memoId: string) {
  const index = memos.value.findIndex(memo => memo.id === memoId)
  if (index !== -1) {
    // heightCache.value.delete(memoId)
    const { deleteMemo } = useMemo(memoId)
    await deleteMemo()
    getMemos()
  }
}

function handleEdit(memo: any) {
  editingMemo.value = memo
  isEditDrawerOpen.value = true
}

function handleMemoUpdated() {
  // 重新获取数据以确保同步
  getMemos()
  getTags()
}

async function handleSendMemo(commentData) {
  const success = await createMemo({ ...commentData, tags: tags.value, photos: multipleImages.value })
  if (success) {
    tags.value = []
    multipleImages.value = [] // 清空图片数组
    commentInputRef.value?.clear?.()
    await getTags()
  }
}

// function handleComment(memo: any) {
//   navigateTo(`/m/${memo.id}`)
// }

function handleTagClick(tagName: string) {
  navigateTo({ path: '/memo', query: { tags: tagName } })
}

function onMemoTagClick(tagName: string) {
  if (props.onTagClick)
    props.onTagClick(tagName)
  else
    handleTagClick(tagName)
}

function onMultipleUpload(urls: string[]) {
  toast.success(`多张上传成功: 共 ${urls.length} 张图片`)
}

function onUploadError(error: string) {
  toast.error(`上传失败: ${error}`)
}
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <!-- 编辑器卡片 -->
    <div v-if="userStore.user.value?.role === 'superAdmin'" class="mb-8 p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-zinc-900">
      <AppImageUpload
        v-model="multipleImages"
        :multiple="true"
        :max-files="6"
        :max-size="5"
        :file-path="`memos/${new Date().getFullYear()}-${new Date().getMonth() + 1}`"
        @upload-success="onMultipleUpload"
        @upload-error="onUploadError"
      />
      <AppTagInput v-model="tags" />
      <AppCommentInput
        ref="commentInputRef"
        :show-hello="false"
        :tags="tags"
        input-tip="当前仅博主可发表 Memo"
        @send="handleSendMemo"
      />
    </div>

    <!-- 随想卡片列表 -->
    <div class="flex flex-col">
      <transition-group
        name="memo-fade"
        tag="div"
        appear
        class="flex flex-col"
        :css="true"
        @before-leave="beforeLeave"
        @leave="leave"
        @after-leave="afterLeave"
      >
        <div
          v-for="memo in filteredMemos"
          :key="memo.id"
          class="px-4 py-2 border-primary/5 border-b-2 mb-4 hover:bg-primary/5 last:border-0"
        >
          <div class="flex items-start gap-4">
            <!-- <div class="flex-shrink-0">
              <UserAvatar :user-info="memo.user_info" :size="40" class="rounded-full" />
            </div> -->
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 mb-2">
                <!-- <span class="font-bold text-gray-900 dark:text-gray-100 text-base">{{ memo.user_info?.nickname || memo.user_info?.username || '匿名' }}</span> -->
                <!-- <span class="text-gray-400 text-sm">·</span> -->
                <NuxtTime :datetime="memo.createTs" class="text-gray-400 text-sm" />
                <span class="text-gray-400 text-sm">·</span>
                <AppFromTag :from="memo.from || 'blog'" />
              </div>
              <div v-if="memo.tags && memo.tags.length > 0" class="py-2 overflow-x-auto overflow-y-hidden flex items-center gap-1.5 pb-1">
                <span
                  v-for="tag in memo.tags"
                  :key="tag.id"
                  class="text-xs text-primary cursor-pointer hover:underline"
                  @click.stop="onMemoTagClick(tag.tagName)"
                >
                  #{{ tag.tagName }}
                </span>
              </div>
              <div class="mb-2">
                <MemoPanel :memo="memo" layout="wechat" :show-all="true" :photo-width="200" />
              </div>
              <div class="flex items-center gap-6 mt-3 text-gray-500 text-sm">
                <!-- <div class="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors" @click.stop="handleComment(memo)">
                  <Icon name="icon-park-outline:comments" class="w-4 h-4" />
                  <span>{{ memo._count?.comments || 0 }}</span>
                </div>
                <div class="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors" @click.stop="handleLike(memo.id)">
                  <Icon name="icon-park-outline:thumbs-up" class="w-4 h-4" />
                  <span>{{ memo._count?.likes || 0 }}</span>
                </div> -->
                <template v-if="userStore.isSuperAdmin.value">
                  <!-- <span class="mx-1 opacity-20">|</span> -->
                  <span class="cursor-pointer hover:text-primary transition-colors flex items-center gap-1" @click.stop="handleEdit(memo)">
                    <Icon name="material-symbols:edit-outline" class="w-4 h-4" /> 编辑
                  </span>
                  <span class="cursor-pointer hover:text-red-500 transition-colors flex items-center gap-1" @click.stop="handleDelete(memo.id)">
                    <Icon name="icon-park-outline:delete" class="w-4 h-4" /> 删除
                  </span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>

  <!-- MemoEditDrawer component -->
  <MemoEditDrawer
    v-model:open="isEditDrawerOpen"
    :memo="editingMemo"
    @update="handleMemoUpdated"
  />
</template>

<style scoped>
/* Animation styles */
.memo-fade-enter-active,
.memo-fade-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.memo-fade-enter-from {
  opacity: 0;
  transform: translateY(24px) scale(0.98);
}

.memo-fade-leave-to {
  opacity: 0;
  transform: translateY(-24px) scale(0.98);
}

.memo-fade-move {
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Scrollbar styles */
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 2px;
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb {
  background: #374151;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}
</style>
