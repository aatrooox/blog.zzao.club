<template>
  <div class="p-4">
    <div class="flex flex-col gap-3">
      <div class="flex flex-col gap-2">
        <NuxtLink :to="page.path" class="text-xl font-bold hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2 leading-tight">
          {{ page.title }}
        </NuxtLink>
        <div class="flex flex-wrap gap-1.5">
          <template v-if="page.versions">
            <Tag v-for="v of page.versions.filter((v: any, i: number) => i < 2)" :key="v" :value="v" severity="secondary" size="small" class="text-xs"></Tag>
          </template>
          <template v-else>
            <Tag v-for="tag of page.tags" :key="tag" :value="tag" severity="secondary" size="small" class="text-xs"></Tag>
          </template>
        </div>
      </div>
      
      <div v-if="page.description" class="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
        {{ page.description }}
      </div>
      
      <div class="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
        <div class="flex items-center gap-1">
          <i class="i-carbon-time"></i>
          {{ checkDate(page.date) ? formatDate(page.date) : '' }}
        </div>
        <div v-if="checkUpdate(page.lastmod, page.date)" class="flex items-center gap-1">
          <i class="i-carbon-update"></i>
          {{ updateDateFromNow(page.lastmod || page?.meta?.lastmod) + '更新' }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const { checkDate, updateDateFromNow, checkUpdate, formatDate } = useDayjs();
interface Page {
  id: string;
  title?: string | undefined;
  path: string;
  description: string;
  date: string;
  lastmod: string;
  meta: {
    lastmod: string;
  }
  tags?: string[];
  showTitle?: string;
  versions?: string[];
}
defineProps<{ page: Page }>()
</script>
<style lang="less" scoped></style>