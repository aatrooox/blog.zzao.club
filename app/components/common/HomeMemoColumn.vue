<!-- Memo 横向卡片区块 -->
<script setup lang="ts">
import type { BlogMemoWithUser } from '~~/types/memo'

defineProps<{
  memos: BlogMemoWithUser[]
}>()

const { formatDate } = useDayjs()

function firstPhoto(memo: BlogMemoWithUser): string | null {
  return memo.photos?.length ? memo.photos[0] : null
}
</script>

<template>
  <div>
    <!-- 栏目标题 -->
    <div class="flex items-center gap-3 mb-5">
      <span class="text-[10px] font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500">Memo</span>
      <div class="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
      <NuxtLink
        to="/memo"
        class="text-[10px] text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors shrink-0 flex items-center gap-0.5"
      >
        全部 <span>→</span>
      </NuxtLink>
    </div>

    <!-- 无内容 -->
    <div v-if="!memos.length" class="text-zinc-400 text-sm py-4 text-center">
      暂无动态
    </div>

    <!-- 单行横向滚动卡片 -->
    <div
      v-else
      class="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      <NuxtLink
        v-for="memo in memos"
        :key="memo.id"
        :to="`/m/${memo.id}`"
        class="group shrink-0 w-64 flex flex-col rounded-lg border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-sm transition-all overflow-hidden bg-white dark:bg-zinc-900/40"
      >
        <!-- 有图：封面图 -->
        <div v-if="firstPhoto(memo)" class="w-full h-32 shrink-0 overflow-hidden">
          <NuxtImg
            :src="firstPhoto(memo)!"
            alt="memo image"
            class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        </div>

        <!-- 文字内容区 -->
        <div class="flex flex-col justify-between flex-1 p-3" :class="firstPhoto(memo) ? 'min-h-16' : 'h-36'">
          <!-- MDC 渲染内容，限制高度 + 禁止内部链接干扰卡片点击 -->
          <div class="flex-1 overflow-hidden" :class="firstPhoto(memo) ? 'max-h-12' : 'max-h-24'">
            <div class="pointer-events-none">
              <MDC
                :value="memo.content ?? ''"
                tag="div"
                class="prose prose-sm dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors leading-snug [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_p]:text-sm [&_li]:text-sm [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm"
              />
            </div>
          </div>

          <!-- 底部：作者 + 时间 + 标签 -->
          <div class="flex items-center gap-2 mt-2 shrink-0">
            <!-- 作者头像 + 名称 -->
            <template v-if="memo.user_info">
              <img
                v-if="memo.user_info.avatarUrl"
                :src="memo.user_info.avatarUrl"
                :alt="memo.user_info.nickname || memo.user_info.username"
                class="w-4 h-4 rounded-full object-cover shrink-0"
              >
              <span
                v-else
                class="w-4 h-4 rounded-full bg-zinc-300 dark:bg-zinc-600 flex items-center justify-center text-[8px] text-zinc-600 dark:text-zinc-300 shrink-0"
              >
                {{ (memo.user_info.nickname || memo.user_info.username || '?')[0].toUpperCase() }}
              </span>
              <span class="text-[11px] text-zinc-400 dark:text-zinc-500 shrink-0 max-w-[60px] truncate">
                {{ memo.user_info.nickname || memo.user_info.username }}
              </span>
            </template>
            <span class="text-[11px] text-zinc-400 dark:text-zinc-500 shrink-0">
              {{ formatDate(memo.createTs) }}
            </span>
            <span
              v-if="memo.tags?.length"
              class="text-[11px] text-zinc-400 dark:text-zinc-500 truncate"
            >
              {{ memo.tags.map(t => `#${t.tagName}`).join(' ') }}
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
