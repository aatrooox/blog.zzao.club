<script lang="ts" setup>
import { useSearch } from '~/composables/useSearch'

type ParsedContent = Record<string, any>

defineProps<{ page: Page, like: number, comment: number, view: number }>()
const { checkDate, updateDateFromNow, checkUpdate, formatDate } = useDayjs()
const { openSearchDialog } = useSearch()

export interface Page extends ParsedContent {
  id: string
  path: string
  title: string
  showTitle?: string
  date?: string
  tags?: string[]
  group?: string // 新增:文章分组,格式如 "面试题:前端"
  description?: string
  versions?: string[]
  lastmod?: string
  meta?: any
  author?: string
  seo?: {
    title?: string
    description?: string
  }
  body?: any
}

const showSearchDialog = (tag: string) => {
  openSearchDialog({ tag })
}
</script>

<template>
  <div class="pixel-card p-4 w-full box-border">
    <div class="flex flex-col gap-3">
      <div class="flex flex-col gap-2">
        <NuxtLink
          :to="page.path"
          class="pixel-title hover:text-text-pixel-secondary transition-all duration-200 hover:scale-101"
        >
          {{ page.title }}
          <Icon
            name="material-symbols:web-traffic-rounded"
            class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out"
          />
        </NuxtLink>
      </div>

      <div v-if="page.description" class="pixel-text text-sm line-clamp-2 leading-relaxed font-mono">
        {{ page.description }}
      </div>

      <div class="flex flex-wrap items-center gap-4 text-xs font-mono">
        <div class="flex items-center gap-1 text-text-pixel-secondary">
          <Icon name="pixelarticons:clock" />
          {{ checkDate(page.date ?? '') ? formatDate(page.date ?? '') : '' }}
        </div>
        <template v-if="checkUpdate(page.lastmod ?? '', page.date ?? '')">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div class="flex items-center gap-1 text-text-pixel-secondary">
                  <Icon name="pixelarticons:cloud-upload" />
                  {{ updateDateFromNow(page.lastmod ?? page?.meta?.lastmod ?? '') }}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p class="font-mono">
                  上次更新时间
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </template>
        <div class="flex flex-wrap gap-1.5">
          <span v-for="tag of page.tags" :key="tag" class="pixel-tag text-xs cursor-pointer font-mono font-bold" @click="showSearchDialog(tag)">
            {{ tag }}
          </span>
        </div>
        <div class="flex items-center gap-1 pixel-meta">
          <Icon name="pixelarticons:eye" />
          {{ formatNumberForView(view || 0) }}
        </div>
        <div v-if="like" class="flex items-center gap-1 pixel-meta">
          <Icon name="pixelarticons:heart" />
          {{ formatNumberForView(like || 0) }}
        </div>
        <div v-if="comment" class="flex items-center gap-1 pixel-meta">
          <Icon name="pixelarticons:message-processing" />
          {{ formatNumberForView(comment || 0) }}
        </div>
      </div>
    </div>
  </div>
</template>
