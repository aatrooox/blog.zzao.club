<script lang="ts" setup>
import type { ApiResponse } from '~~/types/fetch'
import type { MemoLikeResponse, UserRegistResponse } from '~~/types/memo'
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
  title: 'Memoz｜早早集市',
  description: '基于Api数据实现SSR的页面，一些日常记录、知识碎片、其他平台的摘录',
})

const heightCache = ref<Map<string, number>>(new Map())

const { getMemos, memos, createMemo } = useMemos()
const userStore = useUser()
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
    memo.tags && memo.tags.some(t => selectedTags.value.includes(t.tagName)),
  )
})

const { beforeLeave, leave, afterLeave } = useStaggeredListTransition('memo-fade')

async function handleLike(memoId: string) {
  if (!userStore.user.value.id) {
    const res = await $api.post<ApiResponse<UserRegistResponse>>('/api/v1/user/visitor/regist', { visitorId: clientjs.getVisitorId() })
    userStore.setUser(res.data.user)
    userStore.setToken(res.data.token)
  }
  try {
    const res = await $api.post<ApiResponse<MemoLikeResponse>>('/api/v1/memo/like', {
      memo_id: memoId,
      user_id: userStore.user.value.id,
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

function handleMemoUpdated() {
  // 重新获取数据以确保同步
  getMemos()
  getTags()
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
  <div class="pixel-layout">
    <!-- 编辑器卡片 -->
    <div class="pixel-card pixel-card-inner">
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
          class="pixel-card pixel-card-hover cursor-pointer"
          @click="handleComment(memo)"
        >
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0">
              <UserAvatar :user-info="memo.user_info" size="md" class="pixel-avatar" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-2">
                <span class="pixel-title text-sm md:text-base">{{ memo.user_info?.nickname || memo.user_info?.username || '匿名' }}</span>
                <span class="pixel-text text-xs md:text-sm opacity-70">·</span>
                <NuxtTime :datetime="memo.createTs" class="pixel-text text-xs md:text-sm opacity-70" />
              </div>
              <div v-if="memo.tags && memo.tags.length > 0" class="mb-2 h-8 overflow-x-auto overflow-y-hidden flex items-center gap-1.5 pb-1">
                <span
                  v-for="tag in memo.tags"
                  :key="tag.id"
                  class="pixel-tag cursor-pointer"
                  @click.stop="onMemoTagClick(tag.tagName)"
                >
                  {{ tag.tagName }}
                </span>
              </div>
              <div class="mb-2">
                <MemoPanel :memo="memo" />
              </div>
              <div class="flex items-center gap-4 mt-3 pixel-text text-xs md:text-sm">
                <div class="flex items-center gap-1 md:gap-2 cursor-pointer hover:opacity-80 transition-opacity" @click.stop="handleComment(memo)">
                  <Icon name="icon-park-outline:comments" class="w-4 h-4 md:w-5 md:h-5" />
                  <span>{{ memo._count?.comments || 0 }}</span>
                </div>
                <div class="flex items-center gap-1 md:gap-2 cursor-pointer hover:opacity-80 transition-opacity" @click.stop="handleLike(memo.id)">
                  <Icon name="icon-park-outline:thumbs-up" class="w-4 h-4 md:w-5 md:h-5" />
                  <span>{{ memo._count?.likes || 0 }}</span>
                </div>
                <template v-if="userStore.isSuperAdmin">
                  <span class="mx-1 opacity-50">|</span>
                  <span class="cursor-pointer hover:opacity-80 transition-opacity" @click.stop="handleEdit(memo)">
                    <Icon name="material-symbols:edit-outline" class="w-4 h-4 md:w-5 md:h-5" /> 编辑
                  </span>
                  <span class="cursor-pointer hover:opacity-80 transition-opacity" @click.stop="handleDelete(memo.id)">
                    <Icon name="icon-park-outline:delete" class="w-4 h-4 md:w-5 md:h-5" /> 删除
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
/* Pixel style layout */
.pixel-layout {
  background-color: var(--pixel-bg-primary);
  color: var(--pixel-text-primary);
  font-family: ui-monospace, monospace;
  image-rendering: pixelated;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Pixel style cards */
.pixel-card {
  background: var(--pixel-bg-secondary);
  border: 2px solid var(--pixel-border-primary);
  border-radius: 8px;
  box-shadow:
    2px 2px 0 var(--pixel-border-primary),
    4px 4px 0 var(--pixel-bg-tertiary);
  padding: 1.5rem;
  position: relative;
  transition: all 0.2s ease;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

.pixel-card-inner {
  background: var(--pixel-bg-card);
  border: 2px solid var(--pixel-border-primary);
  border-radius: 8px;
  box-shadow:
    2px 2px 0 var(--pixel-border-primary),
    4px 4px 0 var(--pixel-bg-tertiary);
  padding: 1rem;
}

.pixel-card-hover {
  transition: all 0.2s ease;
}

.pixel-card-hover:hover {
  transform: translateY(-2px);
  box-shadow:
    2px 2px 0 var(--pixel-border-primary),
    4px 4px 0 var(--pixel-bg-tertiary),
    6px 6px 0 var(--pixel-bg-secondary);
}

/* Pixel style text */
.pixel-title {
  color: var(--pixel-text-primary);
  text-shadow: 1px 1px 0 var(--pixel-shadow-primary);
  font-family: ui-monospace, monospace;
  font-weight: bold;
  font-size: 1rem;
  line-height: 1.2;
}

.pixel-title:hover {
  color: var(--pixel-highlight-yellow);
  text-shadow: 2px 2px 0 var(--pixel-shadow-primary);
}

.pixel-text {
  color: var(--pixel-text-primary);
  font-family: ui-monospace, monospace;
  font-size: 0.875rem;
  line-height: 1.4;
}

/* Pixel style avatar */
.pixel-avatar {
  border: 2px solid var(--pixel-border-primary);
  image-rendering: pixelated;
}

/* Pixel style tags */
.pixel-tag {
  background: var(--pixel-bg-card);
  color: var(--pixel-accent-cyan);
  border: 2px solid var(--pixel-accent-cyan-border);
  padding: 2px 8px;
  border-radius: 4px;
  box-shadow: 1px 1px 0 var(--pixel-accent-cyan-border);
  font-family: ui-monospace, monospace;
  font-size: 0.75rem;
  font-weight: bold;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.pixel-tag:hover {
  background: var(--pixel-bg-tertiary);
  color: var(--pixel-accent-cyan-hover);
  transform: translateY(-1px);
  box-shadow: 2px 2px 0 var(--pixel-accent-cyan-border);
}

.pixel-tag:active {
  transform: translateY(1px);
  box-shadow: 0px 0px 0 var(--pixel-accent-cyan-border);
}

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
  background: var(--pixel-border-primary);
  border-radius: 0;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: var(--pixel-bg-primary);
}

@media (min-width: 768px) {
  .pixel-layout {
    padding: 2rem;
    gap: 2rem;
  }

  .pixel-card {
    padding: 2rem;
  }

  .pixel-title {
    font-size: 1.125rem;
  }

  .pixel-text {
    font-size: 1rem;
  }
}
</style>
