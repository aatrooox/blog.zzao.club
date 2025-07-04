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
  description?: string
  versions?: string[]
  lastmod?: string
  meta?: any
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
  <div class="p-4 w-full box-border">
    <div class="flex flex-col gap-3">
      <div class="flex flex-col gap-2">
        <NuxtLink
          :to="page.path"
          class="text-xl font-bold dark:hover:text-primary-400 transition-all duration-200 leading-tight group-hover:text-cyan-600"
        >
          {{ page.title }}
          <Icon
            name="material-symbols:web-traffic-rounded"
            class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out"
          />
        </NuxtLink>
      </div>

      <div v-if="page.description" class="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
        {{ page.description }}
      </div>

      <div class="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
        <div class="flex items-center gap-1">
          <Icon name="material-symbols:nest-clock-farsight-analog-outline-rounded" />
          {{ checkDate(page.date ?? '') ? formatDate(page.date ?? '') : '' }}
        </div>
        <template v-if="checkUpdate(page.lastmod ?? '', page.date ?? '')">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div class="flex items-center gap-1">
                  <Icon name="material-symbols:update-rounded" />
                  {{ updateDateFromNow(page.lastmod ?? page?.meta?.lastmod ?? '') }}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>上次更新时间</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </template>
        <div class="flex flex-wrap gap-1.5">
          <Badge v-for="tag of page.tags" :key="tag" class="text-xs cursor-pointer group-hover:text-cyan-600 transition-all duration-300" @click="showSearchDialog(tag)">
            {{ tag }}
          </Badge>
        </div>
        <div class="flex items-center gap-1">
          <Icon name="icon-park-outline:eyes" />
          {{ formatNumberForView(view || 0) }}
        </div>
        <div v-if="like" class="flex items-center gap-1">
          <Icon name="icon-park-outline:thumbs-up" />
          {{ formatNumberForView(like || 0) }}
        </div>
        <div v-if="comment" class="flex items-center gap-1">
          <Icon name="icon-park-outline:comments" />
          {{ formatNumberForView(comment || 0) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
