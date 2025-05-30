<template>
  <div class="p-4 w-full box-border">
    <div class="flex flex-col gap-3">
      <div class="flex flex-col gap-2">
        <NuxtLink :to="page.path"
          class="text-xl font-bold group-hover:underline underline-offset-4 decoration-dotted dark:hover:text-primary-400 transition-colors line-clamp-2 leading-tight  ">
          {{ page.title }}
          <Icon name="material-symbols:web-traffic-rounded"
            class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out" />
        </NuxtLink>
        <div class="flex flex-wrap gap-1.5">
          <template v-if="page.versions">
            <Badge v-for="v of page.versions.filter((v: any, i: number) => i < 2)" :key="v" class="text-xs">{{ v }}
            </Badge>
          </template>
          <template v-else>
            <Badge v-for="tag of page.tags" :key="tag" class="text-xs">{{ tag }}</Badge>
          </template>
        </div>
      </div>

      <div v-if="page.description" class="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
        {{ page.description }}
      </div>

      <div class="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
        <div class="flex items-center gap-1">
          <Icon name="material-symbols:nest-clock-farsight-analog-outline-rounded"></Icon>
          {{ checkDate(page.date) ? formatDate(page.date) : '' }}
        </div>
        <div v-if="checkUpdate(page.lastmod, page.date)" class="flex items-center gap-1">
          <Icon name="material-symbols:update-rounded"></Icon>
          {{ updateDateFromNow(page.lastmod || page?.meta?.lastmod) + '更新' }}
        </div>
        <Button variant="ghost" text size="sm" v-if="like">
          <Icon slot="icon" name="icon-park-outline:thumbs-up" />
          <span slot="badge" class="!text-zinc-500 !text-sm">{{ like || 0 }}</span>
        </Button>
        <Button variant="ghost" text size="sm" v-if="comment">
          <Icon slot="icon" name="icon-park-outline:comments" />
          <span slot="badge" class="!text-zinc-500 !text-sm">{{ comment || 0 }}</span>
        </Button>
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
defineProps<{ page: Page, like: number, comment: number }>()
</script>
<style lang="less" scoped></style>