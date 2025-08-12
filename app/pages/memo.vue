<script lang="ts" setup>
import type { User } from '@prisma/client'
import type { ApiResponse } from '~~/types/fetch'
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
  layout: 'memo',
})

useSeoMeta({
  title: 'Memoz｜早早集市',
  description: '基于Api数据实现SSR的页面，一些日常记录、知识碎片、其他平台的摘录',
})

const heightCache = ref<Map<string, number>>(new Map())

const { getMemos, memos, createMemo } = useMemos()
const userStore = useUserStore()
const tokenStore = useTokenStore()
const clientjs = useClientjs()
const toast = useGlobalToast()
const { $api } = useNuxtApp()
const { getTags } = useTags()

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
    memo.tags && memo.tags.some(t => selectedTags.value.includes(t.tag.tag_name)),
  )
})

const { beforeLeave, leave, afterLeave } = useStaggeredListTransition('memo-fade')

async function handleLike(memoId: string) {
  if (!userStore.user.id) {
    const res = await $api.post<ApiResponse<{ user: User, token: string }>>('/api/v1/user/visitor/regist', { visitorId: clientjs.getVisitorId() })
    userStore.setUser(res.data.user)
    tokenStore.setToken(res.data.token)
  }
  try {
    const res = await $api.post<ApiResponse<{ success: boolean, message?: string, data?: any }>>('/api/v1/memo/like', {
      memo_id: memoId,
      user_id: userStore.user.id,
    })
    if (res?.data && res.data.success) {
      if (res.data.message) {
        toast.success('您已经点赞过了')
      }
      else {
        toast.success('感谢支持！')
      }
      await getMemos()
    }
  }
  catch {
    toast.error('点赞失败，请重试')
  }
}

await getMemos()

function handleDelete(memoId: string) {
  const index = memos.value.findIndex(memo => memo.id === memoId)
  if (index !== -1) {
    memos.value.splice(index, 1)
    heightCache.value.delete(memoId)
  }
}

function handleEdit(memo: any) {
  editingMemo.value = memo
  isEditDrawerOpen.value = true
}

async function handleMemoUpdated() {
  editingMemo.value = null
  await getMemos()
  await getTags()
}

async function handleSendMemo(commentData) {
  const success = await createMemo({ ...commentData, tags: tags.value })
  if (success) {
    tags.value = []
    commentInputRef.value?.clear?.()
    await getTags()
  }
}

function handleComment(memo: any) {
  navigateTo(`/m/${memo.id}`)
}

function handleTagClick(tagName: string) {
  navigateTo({ path: '/memo', query: { tags: tagName } })
}

function onMemoTagClick(tagName: string) {
  if (props.onTagClick)
    props.onTagClick(tagName)
  else
    handleTagClick(tagName)
}
</script>

<template>
  <div class="flex flex-col gap-4 md:gap-8 max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-8 font-cartoon">
    <!-- 编辑器卡片 -->
    <div class="bg-base rounded-lg shadow-pixel border-2 border-bg-base p-4 md:p-6">
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
    <div class="flex flex-col gap-4 md:gap-6">
      <transition-group
        name="memo-fade"
        tag="div"
        appear
        class="flex flex-col gap-4 md:gap-6"
        :css="true"
        @before-leave="beforeLeave"
        @leave="leave"
        @after-leave="afterLeave"
      >
        <div
          v-for="memo in filteredMemos"
          :key="memo.id"
          class="flex items-start bg-base rounded-lg shadow-pixel border-2 border-bg-base p-4 md:p-6 gap-4 relative group cursor-pointer hover:shadow-[6px_6px_0_0_#000000] hover:scale-105 transition-all duration-300"
          @click="handleComment(memo)"
        >
          <div class="flex-shrink-0">
            <UserAvatar :user-info="memo.user_info" size="md" class="border-2 border-bg-base rounded-lg" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2">
              <span class="font-pixel text-sm md:text-base text-bg-base font-bold">{{ memo.user_info?.nickname || memo.user_info?.username || '匿名' }}</span>
              <span class="text-xs md:text-sm text-bg-base/70 font-cartoon">·</span>
              <NuxtTime :datetime="memo.create_ts" class="text-xs md:text-sm text-bg-base/70 font-cartoon" />
            </div>
            <div v-if="memo.tags && memo.tags.length > 0" class="mb-2 h-8 overflow-x-auto overflow-y-hidden flex items-center gap-1.5 pb-1">
              <Badge
                v-for="tagRelation in memo.tags"
                :key="tagRelation.tag.id"
                variant="secondary"
                class="text-xs md:text-sm cursor-pointer bg-secondary-500 text-bg-base border-2 border-bg-base font-cartoon font-bold hover:bg-primary-600 hover:scale-105 transition-all duration-200 group flex-shrink-0 rounded-lg"
                @click.stop="onMemoTagClick(tagRelation.tag.tag_name)"
              >
                {{ tagRelation.tag.tag_name }}
              </Badge>
            </div>
            <div class="mb-2">
              <MemoPanel :memo="memo" />
            </div>
            <div class="flex items-center gap-4 mt-3 text-xs md:text-sm text-bg-base">
              <div class="flex items-center gap-1 md:gap-2 cursor-pointer hover:text-primary-600 transition-colors font-cartoon font-bold" @click.stop="handleComment(memo)">
                <Icon name="icon-park-outline:comments" class="w-4 h-4 md:w-5 md:h-5" />
                <span>{{ memo._count?.comments || 0 }}</span>
              </div>
              <div class="flex items-center gap-1 md:gap-2 cursor-pointer hover:text-accent-400 transition-colors font-cartoon font-bold" @click.stop="handleLike(memo.id)">
                <Icon name="icon-park-outline:thumbs-up" class="w-4 h-4 md:w-5 md:h-5" />
                <span>{{ memo._count?.likes || 0 }}</span>
              </div>
              <template v-if="userStore.isSuperAdmin">
                <span class="mx-1 text-bg-base/50">|</span>
                <span class="cursor-pointer hover:text-primary-600 transition-colors font-cartoon font-bold" @click.stop="handleEdit(memo)">
                  <Icon name="material-symbols:edit-outline" class="w-4 h-4 md:w-5 md:h-5" /> 编辑
                </span>
                <span class="cursor-pointer hover:text-red-500 transition-colors font-cartoon font-bold" @click.stop="handleDelete(memo.id)">
                  <Icon name="icon-park-outline:delete" class="w-4 h-4 md:w-5 md:h-5" /> 删除
                </span>
              </template>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>

  <MemoEditDrawer
    v-model:open="isEditDrawerOpen"
    :memo="editingMemo"
    @update="handleMemoUpdated"
  />
</template>

<style scoped>
.memos-waterfall-container {
  position: relative;
  width: 100%;
  min-height: 200px;
}

.memo-item {
  box-sizing: border-box;
  overflow: hidden;
}

.memo-item:hover {
  z-index: 50 !important;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 2px;
}
.dark .overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
}

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

.memo-card-hover {
  transition:
    box-shadow 0.2s,
    background 0.2s;
}
.memo-card-hover:hover {
  box-shadow:
    0 2px 8px 0 rgba(24, 182, 255, 0.04),
    0 1px 3px 0 rgba(0, 0, 0, 0.02);
  background: rgba(237, 243, 245, 0.969);
}
</style>
