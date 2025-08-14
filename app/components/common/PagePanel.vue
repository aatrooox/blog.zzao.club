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
  <div class="pixel-card p-4 w-full box-border">
    <div class="flex flex-col gap-3">
      <div class="flex flex-col gap-2">
        <NuxtLink
          :to="page.path"
          class="pixel-title text-xl font-mono font-bold transition-all duration-200 leading-tight hover:scale-101"
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
        <div class="flex items-center gap-1 pixel-meta">
          <Icon name="material-symbols:nest-clock-farsight-analog-outline-rounded" />
          {{ checkDate(page.date ?? '') ? formatDate(page.date ?? '') : '' }}
        </div>
        <template v-if="checkUpdate(page.lastmod ?? '', page.date ?? '')">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div class="flex items-center gap-1 pixel-meta">
                  <Icon name="material-symbols:update-rounded" />
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
          <Icon name="icon-park-outline:eyes" />
          {{ formatNumberForView(view || 0) }}
        </div>
        <div v-if="like" class="flex items-center gap-1 pixel-meta">
          <Icon name="icon-park-outline:thumbs-up" />
          {{ formatNumberForView(like || 0) }}
        </div>
        <div v-if="comment" class="flex items-center gap-1 pixel-meta">
          <Icon name="icon-park-outline:comments" />
          {{ formatNumberForView(comment || 0) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pixel-card {
  background: var(--pixel-bg-card);
  border: 2px solid var(--pixel-border-primary);
  border-radius: 8px;
  box-shadow:
    2px 2px 0 var(--pixel-border-primary),
    4px 4px 0 var(--pixel-bg-tertiary);
  transition: all 0.2s ease;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

.pixel-card:hover {
  transform: translateY(-2px);
  box-shadow:
    2px 2px 0 var(--pixel-border-primary),
    4px 4px 0 var(--pixel-bg-tertiary),
    6px 6px 0 var(--pixel-bg-secondary);
}

.pixel-title {
  color: var(--pixel-text-primary);
  text-shadow: 1px 1px 0 var(--pixel-shadow-primary);
}

.pixel-title:hover {
  color: var(--pixel-highlight-yellow);
  text-shadow: 2px 2px 0 var(--pixel-shadow-primary);
}

.pixel-text {
  color: var(--pixel-text-primary);
}

.pixel-meta {
  color: var(--pixel-text-muted);
}
</style>
