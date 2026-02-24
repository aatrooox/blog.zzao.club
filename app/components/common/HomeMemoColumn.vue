<!-- Memo 横向卡片区块 -->
<script setup lang="ts">
import type { BlogMemoWithUser } from '~~/types/memo'

defineProps<{
  memos: BlogMemoWithUser[]
}>()

const { formatDate } = useDayjs()

function stripMarkdown(text: string | null | undefined): string {
  if (!text) return ''
  return text
    .replace(/!\[.*?\]\(.*?\)/g, '') // 图片
    .replace(/\[.*?\]\(.*?\)/g, '$1') // 链接
    .replace(/#{1,6}\s+/g, '') // 标题
    .replace(/[*_~`]/g, '') // 粗斜体、代码
    .replace(/\n+/g, ' ') // 换行
    .trim()
}

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

    <!-- 横向卡片网格：xl:4列，md:2列，sm:1列 -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      <NuxtLink
        v-for="memo in memos"
        :key="memo.id"
        :to="`/m/${memo.id}`"
        class="group flex flex-col rounded-lg border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-sm transition-all overflow-hidden bg-white dark:bg-zinc-900/40"
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
        <div class="flex flex-col justify-between flex-1 p-3" :class="firstPhoto(memo) ? 'min-h-16' : 'h-24'">
          <p
            class="text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors leading-snug overflow-hidden flex-1"
            :class="firstPhoto(memo) ? 'line-clamp-2' : 'line-clamp-3'"
          >
            {{ stripMarkdown(memo.content) }}
          </p>
        <!-- 底部：时间 + 标签 -->
          <div class="flex items-center gap-2 mt-2 shrink-0">
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
