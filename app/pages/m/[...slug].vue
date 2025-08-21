<script setup lang="ts">
import type { CommentData } from '@nuxtjs/mdc'
import type { Visitor } from '~~/types/blog'
import type { BlogCommentWithUserInfo } from '~~/types/blog-drizzle'
import type { ApiResponse } from '~~/types/fetch'
import type { User } from '~~/types/memo'

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
// const { $dayjs } = useNuxtApp()
const comments = ref<BlogCommentWithUserInfo[]>([])
const isDefer = ref(true)

// 点赞相关状态
const likeCount = ref(0)
const isLiked = ref(false)

// 获取memo数据
await getMemo()

// 等待一定时间确保数据加载完成
if (process.client) {
  // 客户端额外等待，确保数据加载完成
  await new Promise(resolve => setTimeout(resolve, 100))
}

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

// 客户端挂载时确保数据已加载
onMounted(async () => {
  // 如果数据还没有加载成功，重新尝试
  if (!memo.value && !isLoading.value) {
    console.log('Retrying to fetch memo on mount...')
    await getMemo()
  }

  // 确保评论和点赞数据初始化
  if (memo.value?.id) {
    initComment()
    initLikeCount()
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
  if (!userStore.user.value?.id) {
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
    user_id: userStore.user.value.id,
    path: `https://zzao.club${route.fullPath}`,
  })

  if (!res.error) {
    toast.add({ type: 'success', message: '评论成功' })
    initComment()
  }
}

// 有访客信息时注册
async function createVistorIDWithInfo(visitor: Visitor) {
  createVistorID(visitor)
  // const res = await $api.post<ApiResponse<any>>('/api/v1/user/visitor/regist', {
  //   name: visitor.name,
  //   email: visitor.email,
  //   website: visitor.website,
  // })
  // if (!res.error) {
  //   const { user, accessToken, refreshToken, accessExpiresAt, refreshExpiresAt } = res.data

  //   userStore.setUser(user)
  //   userStore.setTokenInfo({
  //     accessToken,
  //     refreshToken,
  //     accessExpiresAt,
  //     refreshExpiresAt,
  //   })
  // }
}
// 无访客信息时注册
async function createVistorIDByFingerprint() {
  await createVistorID()
  // const clientjs = useClientjs()
  // const res = await $api.post<ApiResponse<any>>('/api/v1/user/visitor/regist', { visitorId: clientjs.getVisitorId() })
  // if (!res.error) {
  //   const { user, accessToken, refreshToken, accessExpiresAt, refreshExpiresAt } = res.data

  //   userStore.setUser(user)
  //   userStore.setTokenInfo({
  //     accessToken,
  //     refreshToken,
  //     accessExpiresAt,
  //     refreshExpiresAt,
  //   })
  // }
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
  if (!userStore.user.value.id) {
    await createVistorID()
    // const clientjs = useClientjs()
    // const res = await $api.post<ApiResponse<any>>('/api/v1/user/visitor/regist', { visitorId: clientjs.getVisitorId() })
    // const { user, accessToken, refreshToken, accessExpiresAt, refreshExpiresAt } = res.data

    // userStore.setUser(user)
    // userStore.setTokenInfo({
    //   accessToken,
    //   refreshToken,
    //   accessExpiresAt,
    //   refreshExpiresAt,
    // })
  }

  if (isLiked.value) {
    return toast.warn('已经点过赞了')
  }

  const res = await $api.post<ApiResponse>('/api/v1/memo/like', { memo_id: memoId.value, user_id: userStore.user.value.id })

  if (!res.error) {
    toast.success('感谢支持！')
    initLikeCount()
  }
}

// 初始化点赞数据
async function initLikeCount() {
  const res = await $api.get<ApiResponse>('/api/v1/memo/like', { id: memoId.value, user_id: userStore.user.value.id })
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
  <div class="pixel-layout min-h-screen font-mono">
    <div class="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
      <!-- 加载中状态 -->
      <div v-if="isLoading" class="text-center py-20">
        <div class="border-2 md:border-4 p-6 md:p-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4" />
          <h2 class="text-xl md:text-2xl font-mono font-bold text-bg-base mb-4">
            加载中...
          </h2>
        </div>
      </div>

      <!-- Memo不存在 -->
      <div v-else-if="!memo" class="text-center py-20">
        <div class="border-2 md:border-4 p-6 md:p-8">
          <h2 class="text-2xl md:text-3xl font-mono font-bold text-bg-base mb-4">
            Memo 不存在
          </h2>
          <p class="text-sm text-[var(--pixel-text-secondary)] font-mono mb-4">
            页面ID: {{ memoId }}
          </p>
          <NuxtLink
            to="/memo"
            class="inline-block font-mono font-bold px-4 py-2 transition-all duration-200"
          >
            返回 Memo 列表
          </NuxtLink>
        </div>
      </div>

      <!-- Memo内容 -->
      <div v-else-if="memo && !isLoading" class="space-y-4 md:space-y-6 w-full">
        <!-- 返回按钮 -->
        <div class="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            class="pixel-btn flex items-center gap-2 font-mono font-bold px-4 py-2 hover:scale-105 transition-all duration-200"
            @click="router.push('/memo')"
          >
            <Icon name="material-symbols:arrow-back" class="w-4 h-4" />
            <span class="font-mono">返回 Memo 列表</span>
          </Button>
        </div>

        <!-- 用户信息和操作区域 -->
        <ClientOnly>
          <div class="pixel-card p-4 md:p-6">
            <div class="flex items-center justify-between">
              <!-- 左侧用户信息 -->
              <div class="flex items-center space-x-3">
                <UserAvatar :user-info="memo.user_info" :size="40" />
                <div class="flex flex-col">
                  <div class="text-[var(--pixel-text-primary)] font-mono font-bold text-sm md:text-base">
                    {{ memo.user_info?.nickname || memo.user_info?.username || '匿名用户' }}
                  </div>
                  <NuxtTime :datetime="memo.createTs" class="text-xs text-[var(--pixel-text-secondary)] font-mono" />
                </div>
              </div>

              <!-- 右侧操作按钮 -->
              <div class="flex items-center gap-2">
                <ClientOnly>
                  <Button
                    class="font-mono font-bold px-3 py-2 transition-all duration-200 flex items-center gap-1" :class="[
                      isLiked
                        ? 'text-highlight-pixel-red hover:scale-105'
                        : 'hover:bg-accent-400 hover:text-white hover:scale-105',
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
                      class="rounded-lg border-2 border-bg-base font-mono font-bold px-3 py-2 text-bg-base bg-secondary-500 hover:bg-accent-400 hover:text-white hover:scale-105 transition-all duration-200"
                      variant="ghost"
                      size="sm"
                    >
                      <Icon name="material-symbols:favorite-outline" class="w-4 h-4" />
                    </Button>
                  </template>
                </ClientOnly>
                <Button
                  class="font-mono font-bold px-3 py-2  hover:scale-105 transition-all duration-200"
                  variant="ghost"
                  size="sm"
                >
                  <Icon name="material-symbols:share-reviews-outline-rounded" class="w-4 h-4" />
                </Button>
                <Button
                  class="font-mono font-bold px-3 py-2 hover:scale-105 transition-all duration-200"
                  variant="ghost"
                  size="sm"
                >
                  <Icon name="material-symbols:imagesmode-outline-rounded" class="w-4 h-4" />
                </Button>
                <template v-if="userStore.isSuperAdmin">
                  <Button
                    class="font-mono font-bold px-3 py-2 hover:scale-105 transition-all duration-200"
                    variant="ghost"
                    size="sm"
                    @click="handleEdit"
                  >
                    <Icon name="material-symbols:edit-outline" class="w-4 h-4" />
                  </Button>
                  <Button
                    class="font-mono px-3 py-2 hover:text-red-600 hover:scale-105 transition-all duration-200"
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
        <!-- Memo面板 - 使用小红书布局，配置合适的尺寸 -->
        <div class="pixel-card bg-base p-4 md:p-6 overflow-hidden">
          <MemoPanel :memo="memo" :show-all="true" :hide-btns="true" layout="xiaohongshu" :photo-width="320" :max-width="1000" />
        </div>

        <!-- Tags显示 -->
        <div v-if="memo.tags && memo.tags.length > 0" class="pixel-card p-4 md:p-6">
          <div class="flex flex-wrap gap-3 items-center">
            <div class="flex items-center gap-2 text-[var(--pixel-text-primary)] font-mono font-bold text-sm">
              <Icon name="material-symbols:tag" class="w-4 h-4" />
              <span>标签</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in memo.tags"
                :key="tag.id"
                class="pixel-tag cursor-pointer font-mono text-xs hover:scale-105 transition-all duration-200"
                @click="handleTagClick(tag.tagName)"
              >
                {{ tag.tagName }}
              </span>
            </div>
          </div>
        </div>
        <!-- 评论区 -->
        <div class="pixel-card p-4 md:p-6">
          <div class="pixel-title text-xl md:text-2xl font-mono font-bold mb-4 md:mb-6 flex items-center gap-2">
            <Icon name="icon-park-outline:comments" class="w-5 h-5 text-[var(--pixel-text-primary)]" />
            <span class="text-[var(--pixel-text-primary)] font-mono">评论区</span>
            <ClientOnly>
              <span class="text-sm font-mono font-normal text-[var(--pixel-text-secondary)]">
                ({{ formatCommentCount }})
              </span>
              <template #fallback>
                <span class="text-sm font-mono font-normal text-[var(--pixel-text-secondary)]">
                  (0)
                </span>
              </template>
            </ClientOnly>
          </div>

          <!-- 评论输入框 -->
          <div class="mb-4 md:mb-6">
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
              <div v-else class="text-center py-8">
                <div class="bg-gradient-to-br from-secondary-500/10 to-primary-600/10 border-2 border-dashed border-secondary-500/30 rounded-lg p-8">
                  <Icon name="material-symbols:chat-bubble-outline" class="w-12 h-12 text-secondary-500/60 mx-auto mb-3" />
                  <div class="text-[var(--pixel-text-primary)] font-mono font-bold text-lg mb-2">
                    暂无评论
                  </div>
                  <div class="text-[var(--pixel-text-secondary)] font-mono text-sm">
                    快来抢沙发吧！
                  </div>
                </div>
              </div>
            </div>

            <!-- 评论加载中 -->
            <div v-else class="flex justify-center py-8">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600" />
            </div>

            <template #fallback>
              <div class="flex justify-center py-8">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600" />
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
