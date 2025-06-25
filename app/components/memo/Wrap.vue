<script setup lang="ts">
import type { User } from '@prisma/client'
import type { ApiResponse } from '~~/types/fetch'
import type { BlogMemoWithUser } from '~~/types/memo.d'

interface propsData {
  memo: BlogMemoWithUser
}

const { memo } = defineProps<propsData>()

const emit = defineEmits(['refresh', 'heightMeasured', 'delete', 'edit'])
const wrapRef = ref<HTMLElement>()

const userStore = useUserStore()
const { $api } = useNuxtApp()
const toast = useGlobalToast()
const router = useRouter()

// 计算评论数量
const commentCount = computed(() => {
  return memo._count?.comments || 0
})

// 点赞相关状态
const likeCount = ref(memo._count?.likes || 0)
const isLiked = ref(false)

// 跳转到详情页
function goToDetail() {
  router.push(`/m/${memo.id}`)
}

// 点赞操作
async function handleLike(event: Event) {
  event.stopPropagation() // 阻止事件冒泡，避免触发跳转
  
  // 游客点赞 生成指纹 -> 注册为游客
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

  const res = await $api.post<ApiResponse>('/api/v1/memo/like', { memo_id: memo.id, user_id: userStore.user.id })

  if (!res.error) {
    toast.success('感谢支持！')
    initLikeCount()
  }
}

// 初始化点赞数据
async function initLikeCount() {
  if (!userStore.user.id) return
  
  const res = await $api.get<ApiResponse>('/api/v1/memo/like', { id: memo.id, user_id: userStore.user.id })
  if (!res.error) {
    likeCount.value = res.data.count
    isLiked.value = res.data.isLiked
  }
}

// 检查用户是否已点赞
function checkUserLiked() {
  if (!userStore.user.id || !memo.likes) return
  
  isLiked.value = memo.likes.some((like: any) => like.user_id === userStore.user.id)
}
// 组件挂载时初始化点赞数据
onMounted(() => {
  checkUserLiked()
  if (userStore.user.id) {
    initLikeCount()
  }
})

async function removeMemo() {
  try {
    // 立即触发删除事件，让卡片先消失
    emit('delete', memo.id)

    const res = await $api.post<ApiResponse>('/api/v1/memo/del', { id: memo.id })

    if (res?.data) {
      toast.success('已删除！')
      // 删除成功后刷新数据
      emit('refresh')
    }
    else {
      console.log('删除失败：res.data为空')
      // 删除失败时恢复数据
      emit('refresh')
    }
  }
  catch {
    toast.error('删除失败，请重试')
    // 删除失败时恢复数据
    emit('refresh')
  }
}

// 移除所有交互动画逻辑
</script>

<template>
  <div ref="wrapRef" class="group relative w-full mb-4 rounded-lg">
    <!-- 阴影层 -->
    <div class="absolute inset-0 bg-white dark:bg-zinc-900 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 z-0" />

    <!-- 内容层 -->
    <div class="relative z-10 bg-white dark:bg-zinc-900 rounded-lg overflow-hidden text-base sm:text-sm selection:bg-blue-500/20 selection:text-inherit">
      <!-- 主要内容区域 -->
      <div class="px-6 py-6">
        <!-- 标签区域 -->
        <div class="mb-4">
          <slot name="tag" />
        </div>
        <!-- 实际内容 -->
        <div class="text-gray-700 dark:text-gray-200 leading-relaxed max-h-80 overflow-y-auto">
          <slot />
        </div>
      </div>

      <!-- 虚线分割线 -->
      <div class="relative">
        <div class="border-t border-dashed border-zinc-800 dark:border-zinc-600" />
        <!-- 左侧圆形缺口 -->
        <div class="absolute -left-3 top-0 w-6 h-6 bg-gray-100 dark:bg-gray-900 rounded-full transform -translate-y-1/2 z-20" />
        <!-- 右侧圆形缺口 -->
        <div class="absolute -right-3 top-0 w-6 h-6 bg-gray-100 dark:bg-gray-900 rounded-full transform -translate-y-1/2 z-20" />
      </div>

      <!-- 底部信息和操作区域 - 固定高度 -->
      <div class="px-4 py-3 rounded-b-lg h-16 flex-shrink-0">
        <!-- 用户信息和操作按钮 -->
        <div class="flex items-center justify-between h-full">
          <!-- 左侧用户头像 -->
          <div class="flex items-center space-x-2">
            <UserAvatar :user-info="memo?.user_info" />
          </div>

          <!-- 右侧操作按钮 -->
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-2 cursor-pointer" @click="goToDetail">
              <Icon name="icon-park-outline:comments" />
              <span class="text-xs" v-if="commentCount">{{ commentCount > 99 ? '99+' : commentCount }}</span>
            </div>
            <!-- 点赞按钮 -->
            <div 
              :class="[
                'flex items-center gap-1 cursor-pointer transition-all duration-150 px-2 py-1 rounded-full',
                isLiked 
                  ? 'text-red-500 bg-red-100 dark:bg-red-900/40' 
                  : 'hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40'
              ]"
              @click="handleLike"
              :title="isLiked ? '已点赞' : '点赞'"
            >
              <Icon :name="isLiked ? 'material-symbols:favorite' : 'material-symbols:favorite-outline'" class="w-4 h-4" />
              <span class="text-xs" v-if="likeCount > 0">{{ likeCount > 99 ? '99+' : likeCount }}</span>
            </div>
            <!-- 评论按钮 -->
            <!-- <Button 
              class="action-btn group rounded-full dark:bg-green-900/20 hover:text-green-500 hover:bg-green-100 dark:hover:bg-green-900/40 transition-all duration-150 w-7 h-7 p-0" 
              variant="ghost" 
              size="sm"
              @click="goToDetail"
              :title="`查看评论 (${commentCount})`"
            >
              <div class="relative">
                <Icon name="icon-park-outline:comments" class="transition-transform" />
                <span v-if="commentCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center text-[8px] leading-none">
                  {{ commentCount > 9 ? '9+' : commentCount }}
                </span>
              </div>
            </Button> -->
            <!-- <Button class="action-btn group rounded-full dark:bg-red-900/20 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all duration-150 w-7 h-7 p-0" variant="ghost" size="sm">
              <Icon name="icon-park-outline:thumbs-up" class="transition-transform" />
            </Button> -->
            <!-- <Button class="action-btn group rounded-full dark:bg-blue-900/20 hover:text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all duration-150 w-7 h-7 p-0" variant="ghost" size="sm">
              <Icon name="material-symbols:share-reviews-outline-rounded" class="w-3 h-3  transition-transform" />
            </Button> -->
            <!-- <Button class="action-btn group rounded-full dark:bg-purple-900/20 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-all duration-150 w-7 h-7 p-0" variant="ghost" size="sm">
              <Icon name="material-symbols:imagesmode-outline-rounded" class="w-3 h-3  transition-transform" />
            </Button> -->
            <template v-if="userStore.isSuperAdmin">
              <Button class="action-btn group rounded-full dark:bg-yellow-900/20 hover:text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-all duration-150 w-7 h-7 p-0" variant="ghost" size="sm" @click="() => emit('edit', memo)">
                <Icon name="material-symbols:edit-outline" class="transition-transform" />
              </Button>
              <Button class="action-btn group rounded-full dark:bg-gray-900/20 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-900/40 transition-all duration-150 w-7 h-7 p-0" variant="ghost" size="sm" @click="() => { console.log('删除按钮被点击了！'); removeMemo(); }">
                <Icon name="icon-park-outline:delete" class="transition-transform" />
              </Button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 为内容区域添加滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
