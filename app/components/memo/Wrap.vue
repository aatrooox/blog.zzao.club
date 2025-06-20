<script setup lang="ts">
import type { ApiResponse } from '~~/types/fetch'
import type { BlogMemoWithUser } from '~~/types/memo.d'
import { animate, utils } from 'animejs'
import { ref } from 'vue'

interface propsData {
  memo: BlogMemoWithUser
}

const { memo } = defineProps<propsData>()

const emit = defineEmits(['refresh'])
const cardEl = ref()
const shadowEl = ref()
const bottomEl = ref()
const metaEl = ref()
const actionsEl = ref()
const userStore = useUserStore()
const { $api } = useNuxtApp()
const toast = useGlobalToast()
async function removeMemo() {
  try {
    const res = await $api.post<ApiResponse>('/api/v1/memo/del', { id: memo.id })

    if (res?.data) {
      toast.success('已删除！')
      emit('refresh')
    }
    else {
      console.log('删除失败：res.data为空')
    }
  }
  catch {
    toast.error('删除失败，请重试')
  }

  console.log('=== removeMemo function end ===')
}

function onMouseEnter() {
  // 停止所有正在进行的动画
  utils.remove([cardEl.value, bottomEl.value, actionsEl.value, metaEl.value])

  // 简化的卡片变换动画
  animate(cardEl.value, {
    transform: 'perspective(1000px) translateZ(5px) rotateX(1deg)',
    duration: 150,
    ease: 'outQuart',
  })

  // 底部区域轻微调整
  animate(bottomEl.value, {
    paddingTop: '18px',
    paddingBottom: '18px',
    duration: 150,
    ease: 'outQuart',
  })

  // 交互按钮快速展开
  animate(actionsEl.value, {
    maxHeight: '50px',
    opacity: 1,
    duration: 150,
    ease: 'outQuart',
  })

  // 元信息快速展开
  animate(metaEl.value, {
    maxHeight: '60px',
    opacity: 1,
    duration: 150,
    ease: 'outQuart',
  })
}

function onMouseLeave() {
  // 停止所有正在进行的动画
  utils.remove([cardEl.value, bottomEl.value, actionsEl.value, metaEl.value])

  // 快速恢复动画
  animate(cardEl.value, {
    transform: 'perspective(1000px) translateZ(0px) rotateX(0deg)',
    duration: 120,
    ease: 'outQuart',
  })

  animate(bottomEl.value, {
    paddingTop: '16px',
    paddingBottom: '16px',
    duration: 120,
    ease: 'outQuart',
  })

  animate(actionsEl.value, {
    maxHeight: '0px',
    opacity: 0,
    duration: 120,
    ease: 'outQuart',
  })

  animate(metaEl.value, {
    maxHeight: '0px',
    opacity: 0,
    duration: 120,
    ease: 'outQuart',
  })
}
</script>

<template>
  <div class="group relative w-full" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <!-- 阴影层 -->
    <div ref="shadowEl" class="absolute inset-0 bg-white dark:bg-zinc-900 rounded-t-lg z-0" />

    <!-- 内容层 -->
    <div ref="cardEl" class="relative z-10 bg-white dark:bg-zinc-900 rounded-t-lg overflow-hidden text-base sm:text-sm selection:bg-blue-500/20 selection:text-inherit" style="transform-style: preserve-3d;">
      <!-- 主要内容区域 -->
      <div class="px-6 py-6">
        <!-- 标签区域 -->
        <div class="mb-4">
          <slot name="tag" />
        </div>
        <!-- 实际内容 -->
        <div class="text-gray-700 dark:text-gray-200 leading-relaxed">
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

      <!-- 票据底部信息区域 -->
      <div ref="bottomEl" class="px-6 rounded-b-lg py-4">
        <!-- 主要内容区域 -->
        <div class="">
          <!-- 标签区域 - 始终显示 -->
          <div class="flex flex-wrap gap-2">
            <slot name="tag">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-200 text-zinc-900 dark:bg-blue-900/30 dark:text-blue-300">#Node</span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-200 text-zinc-900 dark:bg-green-900/30 dark:text-green-300">#Go</span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-200 text-zinc-900 dark:bg-purple-900/30 dark:text-purple-300">#城市</span>
            </slot>
          </div>

          <!-- 悬停时显示的内容区域 -->
          <div ref="actionsEl" class="overflow-hidden transition-all duration-250" style="max-height: 0; opacity: 0;">
            <div class="space-y-3 py-2">
              <!-- 交互按钮行 -->
              <div class="flex items-center justify-between">
                <!-- <span class="text-xs font-medium text-gray-600 dark:text-gray-400">快速操作</span> -->
                <div class="flex items-center gap-2">
                  <Button class="action-btn group rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all duration-150 hover:scale-105" variant="ghost">
                    <Icon name="icon-park-outline:thumbs-up" class="group-hover:scale-110 transition-transform" />
                  </Button>
                  <Button class="action-btn group rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all duration-150 hover:scale-105" variant="ghost" size="sm">
                    <Icon name="material-symbols:share-reviews-outline-rounded" class="group-hover:scale-110 transition-transform" />
                  </Button>
                  <Button class="action-btn group rounded-full bg-green-50 dark:bg-green-900/20 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/40 transition-all duration-150 hover:scale-105" variant="ghost" size="sm">
                    <Icon name="material-symbols:imagesmode-outline-rounded" class="group-hover:scale-110 transition-transform" />
                  </Button>
                  <template v-if="userStore.isSuperAdmin">
                    <Button class="action-btn group rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-all duration-150 hover:scale-105" variant="ghost" size="sm">
                      <Icon name="material-symbols:edit-outline" class="group-hover:scale-110 transition-transform" />
                    </Button>
                    <Button class="action-btn group rounded-full bg-gray-50 dark:bg-gray-900/20 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-900/40 transition-all duration-150 hover:scale-105" variant="ghost" size="sm" @click="() => { console.log('删除按钮被点击了！'); removeMemo(); }">
                      <Icon name="icon-park-outline:delete" class="group-hover:scale-110 transition-transform" />
                    </Button>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- 作者和时间信息 - 悬停时显示 -->
          <div ref="metaEl" class="overflow-hidden transition-all duration-250" style="max-height: 0; opacity: 0;">
            <div class="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
              <!-- 左侧作者信息 -->
              <div class="flex items-center space-x-2">
                <div class="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                  A
                </div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  <slot name="author">{{ memo.user_info?.nickname }}</slot>
                </span>
              </div>

              <!-- 右侧时间信息 -->
              <div class="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <slot name="meta">
                  08/06
                </slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
