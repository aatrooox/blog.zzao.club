<script setup lang="ts">
import type { CommentData } from '@nuxtjs/mdc'
import type { Prisma, User } from '@prisma/client'
import type { Visitor } from '~~/types/blog'
import type { ApiResponse } from '~~/types/fetch'

type BlogCommentWithUserInfo = Prisma.BlogCommentGetPayload<{
  include: { user_info: true, _count: true, sub_comments: { include: { user_info: true } } }
}>

definePageMeta({
  layout: 'default',
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
  <div class="pixel-layout min-h-screen bg-bg-paper font-cartoon">
    <div class="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
      <!-- Memo不存在 -->
      <div v-if="!memo" class="text-center py-20">
        <div class="bg-base border-2 md:border-4 border-bg-base rounded-lg md:rounded-xl shadow-pixel p-6 md:p-8">
          <h2 class="text-2xl md:text-3xl font-pixel font-bold text-bg-base mb-4">
            Memo 不存在
          </h2>
          <NuxtLink
            to="/memo"
            class="inline-block bg-primary-600 text-white font-cartoon font-bold px-4 py-2 border-2 border-bg-base rounded-lg hover:bg-primary-700 hover:scale-105 transition-all duration-200"
          >
            返回 Memo 列表
          </NuxtLink>
        </div>
      </div>

      <!-- Memo内容 -->
      <div v-else class="space-y-4 md:space-y-6">
        <!-- 返回按钮 -->
        <div class="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            class="pixel-btn-nav flex items-center gap-2 bg-secondary-500 text-white font-cartoon font-bold px-4 py-2 border-2 border-bg-base rounded-lg hover:bg-primary-600 hover:scale-105 transition-all duration-200"
            @click="router.push('/memo')"
          >
            <Icon name="material-symbols:arrow-back" class="w-4 h-4" />
            <span class="font-mono font-medium">返回 Memo 列表</span>
          </Button>
        </div>

        <!-- 交互按钮区域 -->
        <ClientOnly>
          <div class="pixel-card bg-base border-2 md:border-4 border-bg-base rounded-t-lg md:rounded-t-xl shadow-pixel p-4 md:p-6">
            <div class="flex items-center justify-between">
              <!-- 左侧用户信息 -->
              <div class="flex items-center space-x-3">
                <UserAvatar :user-info="memo.user_info" />
                <div>
                  <div class="text-bg-base font-cartoon font-bold">
                    {{ memo.user_info?.username || '匿名用户' }}
                  </div>
                </div>
                <NuxtTime :datetime="memo.create_ts" class="text-xs text-bg-base/70 font-cartoon" />
              </div>

              <!-- 右侧操作按钮 -->
              <div class="flex items-center gap-2">
                <ClientOnly>
                  <Button
                    class="rounded-lg border-2 border-bg-base font-cartoon font-bold px-3 py-2 transition-all duration-200 flex items-center gap-1" :class="[
                      isLiked
                        ? 'text-white bg-accent-400 hover:bg-accent-500 hover:scale-105'
                        : 'text-bg-base bg-secondary-500 hover:bg-accent-400 hover:text-white hover:scale-105',
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
                      class="rounded-lg border-2 border-bg-base font-cartoon font-bold px-3 py-2 text-bg-base bg-secondary-500 hover:bg-accent-400 hover:text-white hover:scale-105 transition-all duration-200"
                      variant="ghost"
                      size="sm"
                    >
                      <Icon name="material-symbols:favorite-outline" class="w-4 h-4" />
                    </Button>
                  </template>
                </ClientOnly>
                <Button
                  class="rounded-lg border-2 border-bg-base font-cartoon font-bold px-3 py-2 text-bg-base bg-secondary-500 hover:bg-primary-600 hover:text-white hover:scale-105 transition-all duration-200"
                  variant="ghost"
                  size="sm"
                >
                  <Icon name="material-symbols:share-reviews-outline-rounded" class="w-4 h-4" />
                </Button>
                <Button
                  class="rounded-lg border-2 border-bg-base font-cartoon font-bold px-3 py-2 text-bg-base bg-secondary-500 hover:bg-primary-600 hover:text-white hover:scale-105 transition-all duration-200"
                  variant="ghost"
                  size="sm"
                >
                  <Icon name="material-symbols:imagesmode-outline-rounded" class="w-4 h-4" />
                </Button>
                <template v-if="userStore.isSuperAdmin">
                  <Button
                    class="rounded-lg border-2 border-bg-base font-cartoon font-bold px-3 py-2 text-bg-base bg-secondary-500 hover:bg-accent-400 hover:text-white hover:scale-105 transition-all duration-200"
                    variant="ghost"
                    size="sm"
                    @click="handleEdit"
                  >
                    <Icon name="material-symbols:edit-outline" class="w-4 h-4" />
                  </Button>
                  <Button
                    class="rounded-lg border-2 border-bg-base font-cartoon font-bold px-3 py-2 text-white bg-red-500 hover:bg-red-600 hover:scale-105 transition-all duration-200"
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
        <div class="pixel-content bg-base border-x-2 md:border-x-4 border-bg-base shadow-pixel p-4 md:p-6 overflow-hidden">
          <MemoPanel :memo="memo" :show-all="true" :hide-btns="true" />
        </div>

        <!-- Tags显示 -->
        <div v-if="memo.tags && memo.tags.length > 0" class="pixel-card bg-base border-2 md:border-4 border-bg-base rounded-b-lg md:rounded-b-xl shadow-pixel p-4 md:p-6">
          <div class="flex flex-wrap gap-2 items-center">
            <div class="w-3 h-3 bg-primary-600 rounded-sm mr-2" />
            <Icon name="material-symbols:tag" class="w-4 h-4 text-bg-base" />
            <span
              v-for="tagRelation in memo.tags"
              :key="tagRelation.tag.id"
              class="pixel-tag text-xs cursor-pointer bg-base text-primary-600 font-cartoon font-bold border-2 border-bg-base rounded-lg px-3 py-1 hover:bg-bg-base hover:text-primary-700 hover:scale-105 transition-all duration-200"
              @click="handleTagClick(tagRelation.tag.tag_name)"
            >
              {{ tagRelation.tag.tag_name }}
            </span>
          </div>
        </div>
        <!-- 评论区 -->
        <div class="pixel-card bg-base border-2 md:border-4 border-bg-base rounded-lg md:rounded-xl shadow-pixel p-4 md:p-6">
          <div class="pixel-title text-xl md:text-2xl font-pixel font-bold mb-4 md:mb-6 flex items-center gap-2">
            <div class="w-3 h-3 bg-accent-400 rounded-sm" />
            <Icon name="icon-park-outline:comments" class="w-5 h-5 text-bg-base" />
            <span class="text-bg-base font-mono">💬 评论区</span>
            <ClientOnly>
              <span class="text-sm font-cartoon font-normal text-bg-base/70 font-mono">
                ({{ formatCommentCount }})
              </span>
              <template #fallback>
                <span class="text-sm font-cartoon font-normal text-bg-base/70 font-mono">
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
                <div class="bg-secondary-500/20 border-2 border-bg-base rounded-lg p-6">
                  <div class="text-bg-base font-cartoon font-bold text-lg mb-2">
                    暂无评论
                  </div>
                  <div class="text-bg-base/70 font-cartoon">
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

<style scoped>
/* 像素风格布局 */
.pixel-layout {
  font-family: ui-monospace, monospace;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

/* 像素风格导航栏 */
.pixel-nav {
  background: oklch(30% 0.05 250);
  border-bottom: 2px solid oklch(40% 0.05 250);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 0 oklch(25% 0.05 250);
}

/* 像素风格按钮 */
.pixel-btn-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: oklch(35% 0.05 250);
  color: oklch(85% 0.05 250);
  border: 2px solid oklch(45% 0.05 250);
  border-radius: 6px;
  transition: all 0.2s ease;
  box-shadow: 2px 2px 0 oklch(25% 0.05 250);
}

.pixel-btn-nav:hover {
  background: oklch(40% 0.05 250);
  transform: translateY(-1px);
  box-shadow: 3px 3px 0 oklch(25% 0.05 250);
}

.pixel-btn-icon {
  padding: 8px;
  background: oklch(35% 0.05 250);
  color: oklch(85% 0.05 250);
  border: 2px solid oklch(45% 0.05 250);
  border-radius: 6px;
  transition: all 0.2s ease;
  box-shadow: 2px 2px 0 oklch(25% 0.05 250);
}

.pixel-btn-icon:hover {
  background: oklch(40% 0.05 250);
  transform: translateY(-1px);
  box-shadow: 3px 3px 0 oklch(25% 0.05 250);
}

/* 像素风格卡片 */
.pixel-card {
  background: oklch(30% 0.05 250);
  border: 2px solid oklch(40% 0.05 250);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 4px 4px 0 oklch(25% 0.05 250);
  transition: all 0.2s ease;
}

/* 像素风格标题 */
.pixel-title {
  color: oklch(84% 0.15 85);
  text-shadow: 2px 2px 0 oklch(25% 0.05 250);
}

/* 像素风格文本 */
.pixel-text {
  color: oklch(75% 0.05 250);
}

/* 像素风格元数据 */
.pixel-meta {
  color: oklch(65% 0.05 250);
}

/* 像素风格标签 */
.pixel-tag {
  background: oklch(70% 0.15 195);
  color: oklch(25% 0.05 250);
  border: 1px solid oklch(60% 0.15 195);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  font-family: ui-monospace, monospace;
  box-shadow: 1px 1px 0 oklch(40% 0.05 250);
  transition: all 0.2s ease;
}

.pixel-tag:hover {
  background: oklch(75% 0.15 195);
  transform: translateY(-1px);
  box-shadow: 2px 2px 0 oklch(40% 0.05 250);
}

.pixel-tag:active {
  transform: translateY(0);
  box-shadow: 1px 1px 0 oklch(40% 0.05 250);
}

/* 像素风格内容区域 */
.pixel-content {
  background: oklch(28% 0.05 250);
  border: 2px solid oklch(38% 0.05 250);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 4px 4px 0 oklch(23% 0.05 250);
  color: oklch(85% 0.05 250);
  line-height: 1.7;
}

/* 像素风格底部操作栏 */
.pixel-bottom-bar {
  background: oklch(30% 0.05 250);
  border-top: 2px solid oklch(40% 0.05 250);
  backdrop-filter: blur(8px);
  padding: 16px;
  box-shadow: 0 -2px 0 oklch(25% 0.05 250);
}

.pixel-btn-action {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: oklch(35% 0.05 250);
  color: oklch(85% 0.05 250);
  border: 2px solid oklch(45% 0.05 250);
  border-radius: 8px;
  transition: all 0.2s ease;
  box-shadow: 2px 2px 0 oklch(25% 0.05 250);
}

.pixel-btn-action:hover {
  background: oklch(40% 0.05 250);
  transform: translateY(-1px);
  box-shadow: 3px 3px 0 oklch(25% 0.05 250);
}

.pixel-btn-liked {
  background: oklch(50% 0.2 15) !important;
  border-color: oklch(60% 0.2 15) !important;
  color: oklch(95% 0.1 15) !important;
}

/* 像素风格抽屉 */
.pixel-drawer {
  background: oklch(30% 0.05 250);
  border-left: 2px solid oklch(40% 0.05 250);
  padding: 16px;
  box-shadow: -4px 0 0 oklch(25% 0.05 250);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .pixel-card {
    padding: 12px;
    box-shadow: 2px 2px 0 oklch(25% 0.05 250);
  }

  .pixel-content {
    padding: 16px;
    box-shadow: 2px 2px 0 oklch(23% 0.05 250);
  }

  .pixel-btn-nav {
    padding: 6px 10px;
    box-shadow: 1px 1px 0 oklch(25% 0.05 250);
  }

  .pixel-btn-icon {
    padding: 6px;
    box-shadow: 1px 1px 0 oklch(25% 0.05 250);
  }

  .pixel-btn-action {
    padding: 8px 12px;
    box-shadow: 1px 1px 0 oklch(25% 0.05 250);
  }
}
</style>
