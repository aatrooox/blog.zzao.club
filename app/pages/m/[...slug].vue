<script setup lang="ts">
import type { CommentData } from '@nuxtjs/mdc'
import type { Visitor } from '~~/types/blog'
import type { BlogCommentWithUserInfo } from '~~/types/blog-drizzle'
import type { ApiResponse } from '~~/types/fetch'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const userStore = useUser()
const toast = useGlobalToast()

const memoId = computed(() => (route.params.slug && route.params.slug[0]) ?? '')
const { memo, getMemo, deleteMemo, isLoading } = useMemo(memoId.value)
const comments = ref<BlogCommentWithUserInfo[]>([])
const isDefer = ref(true)

// 设置SEO
useSeoMeta({
  title: `Memo详情｜早早集市`,
  description: memo.value?.content?.slice(0, 100) || 'Memo详情页面',
})

// 在客户端初始化评论
if (process.client) {
  nextTick(() => {
    if (memo.value?.id) {
      initComment()
    }
  })
}

// 客户端挂载时确保数据已加载
onMounted(async () => {
  if (!memo.value && !isLoading.value) {
    await getMemo()
  }

  if (memo.value?.id) {
    initComment()
  }
})

// 删除memo
async function handleDelete() {
  const success = await deleteMemo()
  if (success) {
    router.push('/memo')
  }
}

// 编辑相关状态
const isEditDrawerOpen = ref(false)

function handleEdit() {
  isEditDrawerOpen.value = true
}

async function handleMemoUpdated() {
  await getMemo()
}

// 创建评论
async function createComment(data: CommentData) {
  if (!userStore.user.value?.id) {
    const v = data.visitor as Visitor
    if (v && (v.name || v.email || v.website)) {
      await createVistorID(v)
    }
    else {
      await createVistorID()
    }
  }
  const res = await $api.post<ApiResponse>('/api/v1/comment/create', {
    type: 'memo',
    memo_id: memoId.value,
    content: data.content,
    user_id: userStore.user.value.id,
    path: `https://zzao.club${route.fullPath}`,
  })

  if (!res.error) {
    toast.add({ type: 'success', message: '评论成功' })
    initComment()
  }
}

// 初始化评论
async function initComment() {
  const res = await $api.get<ApiResponse>('/api/v1/comment/list', {
    type: 'memo',
    memo_id: memoId.value,
  })
  if (!res.error) {
    comments.value = res.data
  }
  isDefer.value = false
}

// 格式化评论数量
const formatCommentCount = computed(() => {
  let count = comments.value.length
  comments.value.forEach((item) => {
    count += (item._count?.sub_comments ?? 0)
  })
  if (count > 99)
    return '99+'
  return count
})

// 标签点击跳转
function handleTagClick(tagName: string) {
  navigateTo({ path: '/memo', query: { tags: tagName } })
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-zinc-950">
    <div class="max-w-3xl mx-auto px-4 md:px-8 py-4 md:py-6">
      <ClientOnly>
        <template #fallback>
          <div class="text-center py-20">
            <div class="border border-zinc-100 dark:border-zinc-800 p-10 max-w-md mx-auto">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
              <p class="text-zinc-600 dark:text-zinc-300">
                加载中...
              </p>
            </div>
          </div>
        </template>

        <div v-if="isLoading" class="text-center py-20">
          <div class="border border-zinc-100 dark:border-zinc-800 p-10 max-w-md mx-auto">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p class="text-zinc-600 dark:text-zinc-300">
              加载中...
            </p>
          </div>
        </div>

        <div v-else-if="!memo" class="text-center py-20">
          <div class="border border-zinc-100 dark:border-zinc-800 p-10 max-w-md mx-auto">
            <h2 class="text-2xl font-bold text-zinc-800 dark:text-zinc-200 mb-4">
              Memo 不存在
            </h2>
            <p class="text-zinc-500 mb-6">
              页面ID: {{ memoId }}
            </p>
            <NuxtLink to="/memo" class="text-primary hover:underline">
              返回 Memo 列表
            </NuxtLink>
          </div>
        </div>

        <div v-else-if="memo && !isLoading" class="space-y-4 w-full">
          <div class="border border-zinc-100 dark:border-zinc-800 p-6 transition-all duration-300">
            <div class="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                class="-ml-2 flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 hover:text-primary transition-colors"
                @click="router.push('/memo')"
              >
                <Icon name="material-symbols:arrow-back" class="w-4 h-4" />
                <span>返回</span>
              </Button>
              <div class="flex items-center gap-2 text-xs text-zinc-400">
                <Icon name="pixelarticons:radio-signal" class="text-primary" />
                <span>动态</span>
                <NuxtTime :datetime="memo.createTs" />
                <AppFromTag :from="memo.from || 'blog'" />
              </div>
            </div>
            <!-- 作者信息 -->
            <div v-if="memo.user_info" class="flex items-center gap-2 mb-4">
              <img
                v-if="memo.user_info.avatarUrl"
                :src="memo.user_info.avatarUrl"
                :alt="memo.user_info.nickname || memo.user_info.username"
                class="w-8 h-8 rounded-full object-cover"
              >
              <span v-else class="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-sm font-medium text-zinc-600 dark:text-zinc-300">
                {{ (memo.user_info.nickname || memo.user_info.username || '?')[0].toUpperCase() }}
              </span>
              <span class="font-semibold text-gray-900 dark:text-gray-100 text-sm">{{ memo.user_info.nickname || memo.user_info.username }}</span>
            </div>

            <div v-if="memo.tags && memo.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="tag in memo.tags"
                :key="tag.id"
                class="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-md cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                @click="handleTagClick(tag.tagName)"
              >
                #{{ tag.tagName }}
              </span>
            </div>

            <div class="memo-content">
              <MemoPanel
                :memo="memo"
                :show-all="true"
                layout="wechat"
              />
            </div>

            <ClientOnly>
              <div v-if="userStore.isSuperAdmin" class="flex items-center gap-4 mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-sm text-zinc-500">
                <button
                  class="flex items-center gap-1 hover:text-primary transition-colors"
                  @click="handleEdit"
                >
                  <Icon name="material-symbols:edit-outline" class="w-4 h-4" />
                  <span>编辑</span>
                </button>
                <button
                  class="flex items-center gap-1 hover:text-red-600 transition-colors"
                  @click="handleDelete"
                >
                  <Icon name="icon-park-outline:delete" class="w-4 h-4" />
                  <span>删除</span>
                </button>
              </div>
            </ClientOnly>
          </div>

          <div class="border border-zinc-100 dark:border-zinc-800 p-6 mt-4">
            <div class="flex items-center gap-2 mb-6">
              <Icon name="icon-park-outline:comments" class="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
              <h2 class="text-xl font-bold text-zinc-800 dark:text-zinc-200">
                评论
              </h2>
              <ClientOnly>
                <span class="text-sm text-zinc-400">({{ formatCommentCount }})</span>
                <template #fallback>
                  <span class="text-sm text-zinc-400">(0)</span>
                </template>
              </ClientOnly>
            </div>

            <div class="mb-6">
              <AppCommentInput @send="createComment" />
            </div>

            <ClientOnly>
              <div v-if="!isDefer" class="space-y-4">
                <template v-if="comments.length > 0">
                  <transition-group appear>
                    <CommentViewPanel
                      v-for="comment in comments"
                      :key="comment.id"
                      :comment="comment"
                      @refresh="initComment"
                    />
                  </transition-group>
                </template>
                <div v-else class="text-center py-12">
                  <Icon name="material-symbols:chat-bubble-outline" class="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
                  <p class="text-zinc-500 text-sm">
                    暂无评论，快来抢沙发吧！
                  </p>
                </div>
              </div>
              <div v-else class="flex justify-center py-8">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              </div>

              <template #fallback>
                <div class="flex justify-center py-8">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                </div>
              </template>
            </ClientOnly>
          </div>
        </div>
      </ClientOnly>
    </div>
  </div>

  <MemoEditDrawer
    v-model:open="isEditDrawerOpen"
    :memo="memo"
    @update="handleMemoUpdated"
  />
</template>
