<template>
  <Card unstyled class="card-box !py-2">
    <template #title>
      <div class="text-xl cursor-pointer font-bold hover:underline hover:underline-offset-4 mb-2">
        <NuxtLink :to="page.path">{{ page.title }}</NuxtLink>
      </div>
    </template>
    <!-- <template #subtitle>
      <div class="text-sm text-zinc-600 mb-2">{{ page.description }}</div>
    </template> -->
    <template #footer>
      <div class="flex gap-4 mt-1 mb-2 text-xs text-zinc-500">
        {{ checkDate(page.date) ? formatDate(page.date) : '' }}
        <Divider layout="vertical" v-if="checkUpdate(page.lastmod, page.date)" />
        {{ checkUpdate(page.lastmod || page?.meta?.lastmod, page.date) ? updateDateFromNow(page.lastmod ||
          page?.meta?.lastmod) + '更新' : '' }}
      </div>
      <!-- <div class="btns flex gap-1">
        <template v-if="page.versions">
          <Tag v-for="v of page.versions.filter((v: any, i: number) => i < 2)" :key="v" :value="v"></Tag>
        </template>
<template v-else>
          <Tag v-for="tag of page.tags" :key="tag" :value="tag"></Tag>
        </template>
</div> -->
    </template>
  </Card>
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