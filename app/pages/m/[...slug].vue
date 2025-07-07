<script setup lang="ts">
import type { CommentData } from '@nuxtjs/mdc'
import type { Prisma, User } from '@prisma/client'
import type { Visitor } from '~~/types/blog'
import type { ApiResponse } from '~~/types/fetch'

type BlogCommentWithUserInfo = Prisma.BlogCommentGetPayload<{
  include: { user_info: true, _count: true, sub_comments: { include: { user_info: true } } }
}>

definePageMeta({
  layout: 'memo',
})

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const userStore = useUserStore()
const toast = useGlobalToast()

const memoId = computed(() => (route.params.slug && route.params.slug[0]) ?? '')
const { memo, getMemo, deleteMemo } = useMemo(memoId.value)
// const { $dayjs } = useNuxtApp()
const comments = ref<BlogCommentWithUserInfo[]>([])
const isDefer = ref(true)

// 点赞相关状态
const likeCount = ref(0)
const isLiked = ref(false)

// 获取memo数据
await getMemo()

// 设置SEO
useSeoMeta({
  title: `Memo详情｜早早集市`,
  description: memo.value?.content?.slice(0, 100) || 'Memo详情页面',
})

// 在客户端初始化评论和点赞数据
if (process.client) {
  nextTick(() => {
    if (memo.value?.id) {
      initComment()
      initLikeCount()
    }
  })
}

// 删除memo
async function handleDelete() {
  const success = await deleteMemo()
  if (success) {
    router.push('/memo')
  }
}

// 编辑相关状态
const isEditDrawerOpen = ref(false)

// 编辑memo
function handleEdit() {
  isEditDrawerOpen.value = true
}

// 处理memo更新完成
async function handleMemoUpdated() {
  // 重新获取memo数据
  await getMemo()
}

// 创建评论
async function createComment(data: CommentData) {
  if (!userStore.user?.id) {
    const v = data.visitor as Visitor
    if (v && (v.name || v.email || v.website)) {
      await createVistorIDWithInfo(v)
    }
    else {
      await createVistorIDByFingerprint()
    }
  }
  const res = await $api.post<ApiResponse>('/api/v1/comment/create', {
    type: 'memo',
    memo_id: memoId.value,
    content: data.content,
    user_id: userStore.user.id,
    path: `https://zzao.club${route.fullPath}`,
  })

  if (!res.error) {
    toast.add({ type: 'success', message: '评论成功' })
    initComment()
  }
}

// 有访客信息时注册
async function createVistorIDWithInfo(visitor: Visitor) {
  const res = await $api.post<ApiResponse<{ user: User, token: string }>>('/api/v1/user/visitor/regist', {
    name: visitor.name,
    email: visitor.email,
    website: visitor.website,
  })
  if (!res.error) {
    userStore.setUser(res.data.user)
    const tokenStore = useTokenStore()
    tokenStore.setToken(res.data.token)
  }
}
// 无访客信息时注册
async function createVistorIDByFingerprint() {
  const clientjs = useClientjs()
  const tokenStore = useTokenStore()
  const res = await $api.post<ApiResponse<{ user: User, token: string }>>('/api/v1/user/visitor/regist', { visitorId: clientjs.getVisitorId() })
  if (!res.error) {
    userStore.setUser(res.data.user)
    tokenStore.setToken(res.data.token)
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

// 点赞操作
async function handleLike() {
  // 游客点赞 生成指纹 -> 注册为游客 (随机用户名 + 固定id)
  if (!userStore.user.id) {
    const clientjs = useClientjs()
    const res = await $api.post<ApiResponse<{ user: User, token: string }>>('/api/v1/user/visitor/regist', { visitorId: clientjs.getVisitorId() })
    userStore.setUser(res.data.user)
    const tokenStore = useTokenStore()
    tokenStore.setToken(res.data.token)
  }

  if (isLiked.value) {
    return toast.warn('已经点过赞了')
  }

  const res = await $api.post<ApiResponse>('/api/v1/memo/like', { memo_id: memoId.value, user_id: userStore.user.id })

  if (!res.error) {
    toast.success('感谢支持！')
    initLikeCount()
  }
}

// 初始化点赞数据
async function initLikeCount() {
  const res = await $api.get<ApiResponse>('/api/v1/memo/like', { id: memoId.value, user_id: userStore.user.id })
  if (!res.error) {
    likeCount.value = res.data.count
    isLiked.value = res.data.isLiked
  }
}

// 新增标签点击跳转方法
function handleTagClick(tagName: string) {
  navigateTo({ path: '/memo', query: { tags: tagName } })
}

// 注意：评论初始化已移至客户端逻辑中
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Memo不存在 -->
      <div v-if="!memo" class="text-center py-20">
        <h2 class="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-4">
          Memo 不存在
        </h2>
        <NuxtLink to="/memo" class="text-blue-500 hover:text-blue-600">
          返回 Memo 列表
        </NuxtLink>
      </div>

      <!-- Memo内容 -->
      <div v-else class="">
        <!-- 返回按钮 -->
        <div class="flex items-center mb-4">
          <Button
            variant="ghost"
            size="sm"
            class="flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            @click="router.push('/memo')"
          >
            <Icon name="material-symbols:arrow-back" class="w-4 h-4" />
            返回 Memo 列表
          </Button>
        </div>

        <!-- 交互按钮区域 -->

        <ClientOnly>
          <div class="bg-white dark:bg-zinc-900 rounded-t-lg shadow-md p-4">
            <div class="flex items-center justify-between">
              <!-- 左侧用户信息 -->
              <div class="flex items-center space-x-3">
                <UserAvatar :user-info="memo.user_info" />
                <div>
                  <div class="text-zinc-900 dark:text-gray-100">
                    {{ memo.user_info?.username || '匿名用户' }}
                  </div>
                  <!-- <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ $dayjs(memo.create_ts).format('YYYY-MM-DD HH:mm') }}
                    </div> -->
                </div>
                <NuxtTime :datetime="memo.create_ts" class="text-xs text-gray-500 dark:text-gray-400" />
              </div>

              <!-- 右侧操作按钮 -->
              <div class="flex items-center gap-2">
                <ClientOnly>
                  <Button
                    class="rounded-full transition-all duration-150 flex items-center gap-1" :class="[
                      isLiked
                        ? 'text-red-500 bg-red-100 dark:bg-red-900/40'
                        : 'hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40',
                    ]"
                    variant="ghost"
                    size="sm"
                    @click="handleLike"
                  >
                    <Icon :name="isLiked ? 'material-symbols:favorite' : 'material-symbols:favorite-outline'" class="w-4 h-4" />
                    <span v-if="likeCount > 0" class="text-xs">{{ likeCount }}</span>
                  </Button>
                  <template #fallback>
                    <Button
                      class="rounded-full hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all duration-150"
                      variant="ghost"
                      size="sm"
                    >
                      <Icon name="material-symbols:favorite-outline" class="w-4 h-4" />
                    </Button>
                  </template>
                </ClientOnly>
                <Button
                  class="rounded-full hover:text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all duration-150"
                  variant="ghost"
                  size="sm"
                >
                  <Icon name="material-symbols:share-reviews-outline-rounded" class="w-4 h-4" />
                </Button>
                <Button
                  class="rounded-full hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-all duration-150"
                  variant="ghost"
                  size="sm"
                >
                  <Icon name="material-symbols:imagesmode-outline-rounded" class="w-4 h-4" />
                </Button>
                <template v-if="userStore.isSuperAdmin">
                  <Button
                    class="rounded-full hover:text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-all duration-150"
                    variant="ghost"
                    size="sm"
                    @click="handleEdit"
                  >
                    <Icon name="material-symbols:edit-outline" class="w-4 h-4" />
                  </Button>
                  <Button
                    class="rounded-full hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-900/40 transition-all duration-150"
                    variant="ghost"
                    size="sm"
                    @click="handleDelete"
                  >
                    <Icon name="icon-park-outline:delete" class="w-4 h-4" />
                  </Button>
                </template>
              </div>
            </div>
          </div>
        </ClientOnly>
        <!-- Memo面板 -->
        <div class="bg-white p-4 dark:bg-zinc-900 shadow-md overflow-hidden">
          <MemoPanel :memo="memo" :show-all="true" :hide-btns="true" />
        </div>

        <!-- Tags显示 -->
        <div v-if="memo.tags && memo.tags.length > 0" class="bg-white dark:bg-zinc-900 rounded-b-lg shadow-md p-4">
          <div class="flex flex-wrap gap-2 items-center">
            <Icon name="material-symbols:tag" class="w-4 h-4 text-gray-500" />
            <span
              v-for="tagRelation in memo.tags"
              :key="tagRelation.tag.id"
              class="text-xs cursor-pointer bg-zinc-200 text-zinc-800 dark:bg-cyan-900/40 dark:text-cyan-300 transition-all duration-200 group flex-shrink-0 !rounded-none px-2 py-1"
              @click="handleTagClick(tagRelation.tag.tag_name)"
            >
              {{ tagRelation.tag.tag_name }}
            </span>
          </div>
        </div>
        <!-- 评论区 -->
        <div class="bg-white dark:bg-zinc-900 rounded-lg p-6 mt-6">
          <div class="text-xl font-bold mb-6 flex items-center gap-2">
            <Icon name="icon-park-outline:comments" class="w-5 h-5" />
            评论区
            <ClientOnly>
              <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                ({{ formatCommentCount }})
              </span>
              <template #fallback>
                <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                  (0)
                </span>
              </template>
            </ClientOnly>
          </div>

          <!-- 评论输入框 -->
          <div class="mb-6">
            <AppCommentInput @send="createComment" />
          </div>

          <!-- 评论列表 - 使用ClientOnly包装动态内容 -->
          <ClientOnly>
            <div v-if="!isDefer" class="space-y-4">
              <template v-if="comments.length > 0">
                <transition-group appear>
                  <template v-for="comment in comments" :key="comment.id">
                    <CommentViewPanel :comment="comment" @refresh="initComment" />
                  </template>
                </transition-group>
              </template>
              <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
                暂无评论，快来抢沙发吧！
              </div>
            </div>

            <!-- 评论加载中 -->
            <div v-else class="flex justify-center py-8">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
            </div>

            <template #fallback>
              <div class="flex justify-center py-8">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
              </div>
            </template>
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>

  <!-- 编辑 Drawer -->
  <MemoEditDrawer
    v-model:open="isEditDrawerOpen"
    :memo="memo"
    @update="handleMemoUpdated"
  />
</template>

<style lang="less" scoped></style>
